import subprocess
import sys
import os
import time
import signal
import atexit
import urllib.request
import json
import threading

backend_dir = os.path.dirname(os.path.abspath(__file__))

def start_node():
    subprocess.run(["npm", "install", "--omit=dev"], cwd=backend_dir, capture_output=True)
    subprocess.Popen(
        ["node", "src/server.js"],
        cwd=backend_dir,
        stdout=sys.stdout,
        stderr=sys.stderr,
        env=os.environ.copy(),
    )

node_thread = threading.Thread(target=start_node, daemon=True)
node_thread.start()

import gradio as gr
import spaces
from fastapi import FastAPI, Request
from fastapi.responses import Response
import httpx

app = FastAPI()

@app.on_event("startup")
async def startup():
    for _ in range(60):
        try:
            urllib.request.urlopen("http://localhost:5000/api/health", timeout=2)
            return
        except Exception:
            await asyncio.sleep(1)

import asyncio

@app.api_route("/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"])
async def proxy(path: str, request: Request):
    if path.startswith("gradio") or path.startswith("static") or path.startswith("_app") or path == "":
        return None

    try:
        body = await request.body()
        headers = {k: v for k, v in request.headers.items() if k.lower() not in ("host", "content-length")}

        async with httpx.AsyncClient(timeout=30.0) as client:
            resp = await client.request(
                method=request.method,
                url=f"http://localhost:5000/{path}",
                headers=headers,
                content=body if body else None,
            )

        excluded = {"content-encoding", "content-length", "transfer-encoding", "connection"}
        response_headers = {k: v for k, v in resp.headers.items() if k.lower() not in excluded}

        return Response(
            content=resp.content,
            status_code=resp.status_code,
            headers=response_headers,
        )
    except Exception as e:
        return Response(
            content=json.dumps({"error": str(e)}),
            status_code=502,
            media_type="application/json",
        )

@spaces.GPU(cpu=True)
def check_status():
    try:
        req = urllib.request.Request("http://localhost:5000/api/health")
        with urllib.request.urlopen(req, timeout=10) as resp:
            return resp.read().decode()
    except Exception as e:
        return json.dumps({"status": "error", "message": str(e)})

demo = gr.Interface(
    fn=check_status,
    inputs=[],
    outputs=gr.Text(label="API Status"),
    title="HMITLC Backend API",
    description="Backend running. API at /api/*, Gradio at /gradio",
)

app = gr.mount_gradio_app(app, demo, path="/gradio")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=7860)
