#!/bin/bash

# Start Ollama serve
echo "Starting Ollama serve..."
ollama serve &
OLLAMA_PID=$!
echo "Ollama serve started with PID $OLLAMA_PID"

# Start MongoDB with specified config
echo "Starting MongoDB..."
mongod --config /opt/homebrew/etc/mongod.conf --fork
echo "MongoDB started"

# Start Redis using Homebrew
echo "Starting Redis..."
brew services start redis
echo "Redis started"

# Start the embedding microservice
echo "Starting the embedding microservice..."
cd ~/Development/self/image-tagging/embedding-microservice
python app.py &
EMBEDDING_PID=$!
echo "Embedding microservice started with PID $EMBEDDING_PID"

# Start the frontend
echo "Starting the frontend..."
cd ~/Development/self/image-tagging/frontend
yarn start &
FRONTEND_PID=$!
echo "Frontend started with PID $FRONTEND_PID"

# Start the backend
echo "Starting the backend..."
cd ~/Development/self/image-tagging/backend
yarn dev &
BACKEND_PID=$!
echo "Backend started with PID $BACKEND_PID"

# Function to handle cleanup on exit
cleanup() {
    echo "Stopping all services..."
    kill $OLLAMA_PID $EMBEDDING_PID $FRONTEND_PID $BACKEND_PID
    brew services stop redis
    mongod --shutdown
    echo "All services stopped"
}

# Trap the EXIT signal to ensure cleanup happens
trap cleanup EXIT

# Wait for all background processes to finish
wait
