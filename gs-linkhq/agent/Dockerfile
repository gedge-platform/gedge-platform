FROM nvidia/cuda:11.7.0-devel-ubuntu22.04

RUN apt update && \
    apt install --no-install-recommends -y build-essential gcc python3 python3-pip && \
    apt clean && rm -rf /var/lib/apt/lists/*

RUN pip install --no-cache-dir --user torch --extra-index-url https://download.pytorch.org/whl/cu113
COPY requirements.txt /requirements.txt
RUN pip install --no-cache-dir --user -r /requirements.txt
COPY ./src /src
WORKDIR /src

ENV FLASK_APP=api.py
ENV FLASK_RUN_HOST=0.0.0.0
ENV FLASK_RUN_PORT=80

ENTRYPOINT ["python3", "-m", "flask", "run"]
