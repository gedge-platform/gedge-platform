FROM python:3.7

RUN mkdir /app
WORKDIR /app
ADD . /app/
RUN python -m pip install --upgrade pip
RUN pip install -r requirements.txt

EXPOSE 5000
CMD ["python", "/app/get-hostname.py"]