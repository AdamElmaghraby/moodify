# Build stage
FROM golang:1.24-alpine AS builder

WORKDIR /app

# Copy go mod files
COPY Backend/go.mod Backend/go.sum ./
RUN go mod download

# Copy backend source
COPY Backend/ ./

# Build the application
RUN CGO_ENABLED=0 GOOS=linux go build -o /app/server .

# Run stage
FROM alpine:latest

WORKDIR /app

# Copy the binary from builder
COPY --from=builder /app/server .

# Expose port (Fly.io will set PORT env var)
EXPOSE 8080

# Run the application
CMD ["./server"]
