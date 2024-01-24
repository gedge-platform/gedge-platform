FROM golang:1.19 as builder
WORKDIR /go/src

COPY . .
RUN go mod download

RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -a -ldflags '-s' -o main .

USER root
ENTRYPOINT ["/go/src/main"]
