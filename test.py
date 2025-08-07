# test.py
import os
import subprocess

# Run Next.js build
result = subprocess.run(["npm", "run", "build"], capture_output=True, text=True)

if result.returncode != 0:
    print("Build failed!")
    print(result.stderr)
    exit(1)

print("Build passed.")
