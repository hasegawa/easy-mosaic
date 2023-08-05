FROM python:3.11
WORKDIR /usr/src/app

RUN apt-get update
RUN apt-get upgrade -y
RUN apt-get install -y libgl1-mesa-dev
RUN pip install opencv-python fastapi uvicorn[standard]

RUN uvicorn route:app --host 0.0.0.0 --reload --port 8000