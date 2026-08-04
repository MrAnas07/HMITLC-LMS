import subprocess
import sys
import os
import time
import signal
import atexit
import urllib.request
import json

backend_dir = os.path.dirname(os.path.abspath(__file__))

subprocess.run(["npm", "install"], cwd=backend_dir, stdout=sys.stdout, stderr=sys.stderr)

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

import gradio as gr
import spaces

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
    description="Node.js API running. Access endpoints at /api/*",
)
