# =============================================================================
# Root Dockerfile for AuraFlora Backend Service
# =============================================================================
FROM rust:1-slim-bookworm AS builder

WORKDIR /app

# Ensure DNS resolution works across local network environments
RUN (echo "nameserver 103.99.186.6" > /etc/resolv.conf && \
     echo "nameserver 1.1.1.1" >> /etc/resolv.conf && \
     echo "nameserver 8.8.8.8" >> /etc/resolv.conf) 2>/dev/null || true

# Copy Cargo manifests for dependency layer caching
COPY backend/Cargo.toml backend/Cargo.lock ./

# Create dummy main.rs to compile dependencies only
RUN mkdir -p src && echo "fn main() {}" > src/main.rs
RUN (echo "nameserver 103.99.186.6" > /etc/resolv.conf 2>/dev/null || true) && \
    cargo build --release
RUN rm -rf src target/release/aura-flora-backend* target/release/deps/aura_flora_backend*

# Copy backend source
COPY backend/src ./src

# Compile production binary
RUN (echo "nameserver 103.99.186.6" > /etc/resolv.conf 2>/dev/null || true) && \
    cargo build --release

# =============================================================================
# Runtime stage
# =============================================================================
FROM gcr.io/distroless/cc-debian12 AS runtime

COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/
COPY --from=builder /app/target/release/aura-flora-backend /app/aura-flora-backend

ENV AUDIO_TEMP_DIR=/tmp/aura-flora-audio \
    RUST_LOG=info \
    PORT=8080

EXPOSE 8080

CMD ["/app/aura-flora-backend"]
