#!/usr/bin/env bash

cd backend
source .venv/bin/activate
fastapi dev main.py &
cd ..

cd frontend
npm run dev &
cd ..

wait