#!/bin/bash

echo " Starting Brew & Bloom Project..."

echo " Checking Database..."
if ! systemctl is-active --quiet postgresql; then
  echo " Starting PostgreSQL service (may require password)..."
  sudo systemctl start postgresql
fi

echo " Starting Backend (Port 3000)..."
cd backend
node server.js &
BACKEND_PID=$!

echo " Starting Frontend (Port 8080)..."
cd ../frontend
# Use 'npx serve' if available, otherwise use Python's built-in server
if npx --version &>/dev/null; then
  npx serve -l 8080 . &
else
  python3 -m http.server 8080 &
fi
FRONTEND_PID=$!

echo "------------------------------------------------"
echo " Everything is running!"
echo " Frontend: http://localhost:8080"
echo " Backend:  http://localhost:3000"
echo "------------------------------------------------"
echo "Press Ctrl+C to stop everything."

trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
