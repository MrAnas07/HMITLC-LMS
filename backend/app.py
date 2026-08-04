import subprocess
import sys
import os
import time
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

@spaces.GPU(cpu=True)
def check_status():
    import urllib.request, json
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
    title="HMITLC Backend Engine",
    description="Backend running. Use /api/* endpoints.",
)

demo.launch(server_port=7860)

while True:
    time.sleep(3600)
