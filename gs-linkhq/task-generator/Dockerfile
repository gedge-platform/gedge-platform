FROM python:3.11.3-slim-bullseye

RUN pip install --upgrade pip
COPY requirements.txt /requirements.txt
RUN pip install --no-cache-dir -r /requirements.txt

COPY ./src /srv
WORKDIR /srv

ENTRYPOINT ["python3", "run.py"]
CMD ["-l", "1.0"]
