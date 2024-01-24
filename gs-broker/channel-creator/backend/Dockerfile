FROM golang:1.19 as builder
WORKDIR /go/src

COPY go.mod go.mod
COPY go.sum go.sum
RUN go mod download

COPY . .
COPY .env .

RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -a -ldflags '-s' -o main .

USER root
ENTRYPOINT ["/go/src/main"]