import subprocess
import sys
import os
import time
import signal
import atexit
import urllib.request
import json

backend_dir = os.path.dirname(os.path.abspath(__file__))

node_proc = subprocess.Popen(
    ["node", "src/server.js"],
    cwd=backend_dir,
    stdout=sys.stdout,
    stderr=sys.stderr,
    env=os.environ.copy(),
)

def cleanup():
    if node_proc.poll() is None:
        node_proc.terminate()
        try:
            node_proc.wait(timeout=5)
        except subprocess.TimeoutExpired:
            node_proc.kill()

atexit.register(cleanup)
signal.signal(signal.SIGTERM, lambda s, f: (cleanup(), sys.exit(0)))

for i in range(30):
    try:
        urllib.request.urlopen("http://localhost:5000/api/health", timeout=2)
        break
    except Exception:
        time.sleep(1)

from fastapi import FastAPI, Request
from fastapi.responses import Response
import gradio as gr
import httpx

app = FastAPI()

@app.api_route("/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"])
async def proxy(path: str, request: Request):
    body = await request.body()
    headers = {k: v for k, v in request.headers.items() if k.lower() != "host"}

    async with httpx.AsyncClient(timeout=60.0, follow_redirects=True) as client:
        resp = await client.request(
            method=request.method,
            url=f"http://localhost:5000/{path}",
            headers=headers,
            content=body if body else None,
            params=dict(request.query_params),
        )
        return Response(
            content=resp.content,
            status_code=resp.status_code,
            headers={k: v for k, v in resp.headers.items() if k.lower() not in ("transfer-encoding", "content-encoding")},
        )

demo = gr.Interface(
    fn=lambda: json.dumps({"status": "ok", "service": "it-lms-api"}),
    inputs=[],
    outputs="text",
    title="HMITLC API",
    description="Backend API running on Hugging Face Spaces",
)

app = gr.mount_gradio_app(app, demo, path="/gradio")
