FROM ubuntu:20.04
LABEL maintainer="imxsuu@gmail.com"

## Set the timezone
ARG DEBIAN_FRONTEND=noninteractive
ENV TZ=Asia/Seoul

RUN apt-get update -y
RUN apt-get install -y wget gnupg2 inotify-tools tzdata python-is-python3 git unzip curl xmlto xsltproc make rsync locales && \
  locale-gen en_US.UTF-8

RUN wget https://packages.erlang-solutions.com/erlang-solutions_2.0_all.deb && dpkg -i erlang-solutions_2.0_all.deb

RUN apt-get update -y
RUN apt-get install -y esl-erlang 
RUN apt-get install -y elixir

RUN mkdir -p /message-broker

## Set working directory
WORKDIR /message-broker

## Copy source code
COPY . .
RUN mv config /etc/rabbitmq

WORKDIR /message-broker/broker-server

RUN make run-broker

WORKDIR /message-broker/broker-server/sbin

RUN ./rabbitmq-plugins enable --offline rabbitmq_management rabbitmq_mqtt rabbitmq_stomp rabbitmq_web_stomp rabbitmq_web_mqtt

EXPOSE 5672 15672 1883 61613 12345 9001

CMD ["./rabbitmq-server"]
