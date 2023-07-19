FROM python:3.11.3-slim-bullseye

COPY requirements.txt /requirements.txt
RUN pip install --no-cache-dir --user -r /requirements.txt
COPY ./src /srv
COPY ./config.yaml /srv
WORKDIR /srv

ENV FLASK_APP=api.py
ENV FLASK_RUN_HOST=0.0.0.0
ENV FLASK_RUN_PORT=80

ENTRYPOINT ["python3", "-m", "flask", "run"]
