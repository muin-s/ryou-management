
echo "Running Backend"
(cd backend && source .venv/bin/activate && python app.py) &

echo "Running Frontend"
(cd frontend && npm run dev)
