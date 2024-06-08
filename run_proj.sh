#!/bin/bash

# Function to check if the virtual environment is activated
check_venv() {
  if [[ "$VIRTUAL_ENV" == "" ]]; then
    echo "No virtual environment found. Please create and activate one."
    exit 1
  fi
}

start_servers() {
  # Navigate to the backend directory
  cd /Users/dylan/Documents/Code\ Platoon/Assignments/Personal\ Proj/Echo/backend

  # Check if virtual environment exists and activate it
  if [ -d "venv/bin" ]; then
    echo "Activating virtual environment..."
    source venv/bin/activate
    echo "Virtual environment activated."
  else
    echo "Virtual environment not found in backend directory. Please set it up."
    exit 1
  fi

  # Apply Django migrations and start the backend server
  echo "Applying Django migrations and starting the backend server..."
  python -m pip show django
  python manage.py migrate
  python manage.py runserver &
  DJANGO_PID=$!

  # Navigate to the frontend directory and start the React development server
  cd ../frontend
  echo "Starting React frontend..."
  npm start &
  REACT_PID=$!

  # Save PIDs to a file
  echo $DJANGO_PID > ../django_pid.txt
  echo $REACT_PID > ../react_pid.txt

  # Trap the exit signal to ensure the servers are stopped when the script exits
  trap stop_servers EXIT

  # Wait for both processes to complete
  wait $DJANGO_PID $REACT_PID
}

stop_servers() {
  # Kill the processes
  if [ -f "../django_pid.txt" ]; then
    DJANGO_PID=$(cat ../django_pid.txt)
    kill $DJANGO_PID
    rm ../django_pid.txt
    echo "Stopped Django server."
  fi

  if [ -f "../react_pid.txt" ]; then
    REACT_PID=$(cat ../react_pid.txt)
    kill $REACT_PID
    rm ../react_pid.txt
    echo "Stopped React server."
  fi
}

if [ "$1" == "stop" ]; then
  stop_servers
else
  start_servers
fi
