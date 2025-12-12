#!/bin/bash

# Start script for Smart Analyzer platform

echo "Starting Smart Analyzer Platform..."
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found!"
    echo "Please create a .env file with your OPENAI_API_KEY"
    echo "Example: OPENAI_API_KEY=your_key_here"
    exit 1
fi

# Start Django backend
echo "Starting Django backend on http://localhost:8000"
cd "$(dirname "$0")"
source venv/bin/activate
python manage.py runserver &
DJANGO_PID=$!

# Wait a bit for Django to start
sleep 3

# Start Next.js frontend
echo "Starting Next.js frontend on http://localhost:3000"
cd frontend
npm run dev &
NEXT_PID=$!

echo ""
echo "✅ Both servers are starting..."
echo "Backend: http://localhost:8000"
echo "Frontend: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for user interrupt
trap "kill $DJANGO_PID $NEXT_PID" EXIT
wait

