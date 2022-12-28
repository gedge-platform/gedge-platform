FROM python:3.9-slim-bullseye

RUN apt update && \
    apt install --no-install-recommends -y build-essential gcc && \
    apt clean && rm -rf /var/lib/apt/lists/*

COPY requirements.txt /requirements.txt
RUN pip install --no-cache-dir --user -r /requirements.txt
COPY ./src /src
COPY ./config.yaml /src
WORKDIR /src

ENV FLASK_APP=api.py
ENV FLASK_RUN_HOST=0.0.0.0
ENV FLASK_RUN_PORT=80

ENTRYPOINT ["python3", "-m", "flask", "run"]
