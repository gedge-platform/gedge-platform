FROM python:3.8.13-slim-buster

ENV PROFILE=kube
COPY requirements.txt requirements.txt
RUN pip install -r ./requirements.txt
COPY . .
CMD ["python", "./run.py"]
