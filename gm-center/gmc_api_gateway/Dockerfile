# docker build -t gm-center:[version] .
FROM golang:1.16-alpine

ENV CGO_ENABLED=0

WORKDIR /app

COPY go.mod ./
COPY go.sum ./
RUN go mod download

COPY . .
RUN go build main.go

EXPOSE 8010
CMD ["./main"]
