import subprocess
import sys
import os
import time
import threading
import json
import urllib.request

backend_dir = os.path.dirname(os.path.abspath(__file__))

def start_node():
    subprocess.run(
        ["npm", "install", "--omit=dev"],
        cwd=backend_dir,
        capture_output=True,
    )
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

@spaces.GPU(cpu=True)
def check_health():
    try:
        req = urllib.request.Request("http://localhost:5000/api/health")
        with urllib.request.urlopen(req, timeout=10) as resp:
            return resp.read().decode()
    except Exception as e:
        return json.dumps({"status": "error", "message": str(e)})

demo = gr.Interface(
    fn=check_health,
    inputs=[],
    outputs=gr.Text(label="Health"),
    title="HMITLC Backend Engine",
    description="Backend running. Use /api/* endpoints.",
)

from starlette.requests import Request
from starlette.responses import Response

async def proxy_api(full_path: str, request: Request):
    try:
        body = await request.body()
        url = f"http://localhost:5000/api/{full_path}"
        if request.url.query:
            url += f"?{request.url.query}"

        headers = {}
        for k, v in request.headers.items():
            if k.lower() not in ("host", "content-length", "transfer-encoding"):
                headers[k] = v

        req = urllib.request.Request(
            url, data=body if body else None, method=request.method
        )
        for k, v in headers.items():
            req.add_header(k, v)

        with urllib.request.urlopen(req, timeout=60) as resp:
            resp_body = resp.read()
            excluded = {"transfer-encoding", "content-encoding", "connection"}
            resp_headers = {k: v for k, v in resp.headers.items() if k.lower() not in excluded}

        return Response(content=resp_body, status_code=resp.status_code, headers=dict(resp_headers))

    except urllib.error.HTTPError as e:
        return Response(content=e.read(), status_code=e.code, media_type="application/json")
    except Exception as e:
        return Response(
            content=json.dumps({"error": str(e)}),
            status_code=502,
            media_type="application/json",
        )

demo.app.add_api_route(
    "/api/{full_path:path}",
    endpoint=proxy_api,
    methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
)

demo.launch(server_port=7860)
