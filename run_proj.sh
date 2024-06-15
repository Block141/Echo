#!/bin/bash

check_venv() {
  if [[ "$VIRTUAL_ENV" == "" ]]; then
    echo "No virtual environment found. Please create and activate one."
    exit 1
  fi
}

start_servers() {
  cd /Users/dylan/Documents/Code\ Platoon/Assignments/Personal\ Proj/Echo/backend

  if [ -d "venv/bin" ]; then
    echo "Activating virtual environment..."
    source venv/bin/activate
    echo "Virtual environment activated."
  else
    echo "Virtual environment not found in backend directory. Please set it up."
    exit 1
  fi

  echo "Applying Django migrations and starting the backend server..."
  python -m pip show django
  python manage.py migrate
  python manage.py runserver &
  DJANGO_PID=$!

  cd ../frontend
  echo "Starting React frontend..."
  npm start &
  REACT_PID=$!

  echo $DJANGO_PID > ../django_pid.txt
  echo $REACT_PID > ../react_pid.txt

  trap stop_servers EXIT

  wait $DJANGO_PID $REACT_PID
}

stop_servers() {
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
