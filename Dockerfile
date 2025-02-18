FROM golang:1.24 AS builder
WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download
COPY . .

WORKDIR /app/cmd
RUN CGO_ENABLED=0 go build -a -o auth-service .

FROM alpine:latest
WORKDIR /root/
COPY --from=builder /app/cmd/auth-service .
RUN chmod +x auth-service
CMD ["/root/auth-service"]
