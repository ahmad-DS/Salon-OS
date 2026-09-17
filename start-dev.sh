#!/usr/bin/env bash
# Starts the backend (FastAPI/uvicorn) and frontend (Expo) each in their own bash window.
# Run this from Git Bash: ./start-dev.sh

set -e

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

cmd.exe /c start "salon-os backend" bash -c "cd '$ROOT_DIR/backend' && source .venv/Scripts/activate && uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload; exec bash"
cmd.exe /c start "salon-os frontend" bash -c "cd '$ROOT_DIR/mobile' && npm start; exec bash"
