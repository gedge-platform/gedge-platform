FROM python:3.9-slim-bullseye

RUN apt update && \
    apt install --no-install-recommends -y build-essential gcc && \
    apt clean && rm -rf /var/lib/apt/lists/*

COPY requirements.txt /requirements.txt
RUN pip install --no-cache-dir --user -r /requirements.txt
COPY ./src /src
WORKDIR /src

ENTRYPOINT ["python3", "run.py"]
CMD ["-l", "1.0"]
