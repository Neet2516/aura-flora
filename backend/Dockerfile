# =============================================================================
# Stage 1: Builder — compile the Rust binary
# =============================================================================
FROM rust:1-slim-bookworm AS builder

WORKDIR /app

# Copy Cargo manifests for dependency layer caching
COPY Cargo.toml Cargo.lock ./

# Create dummy main.rs to cache dependency compilation
RUN mkdir -p src && echo "fn main() {}" > src/main.rs

# Pre-build dependencies
RUN cargo build --release

# Clean up dummy files and binary artifacts to ensure fresh build of application
RUN rm -rf src target/release/aura-flora-backend* target/release/deps/aura_flora_backend*

# Copy actual source code
COPY src ./src

# Build production binary
RUN cargo build --release

# =============================================================================
# Stage 2: Runtime — minimal distroless image
# =============================================================================
FROM gcr.io/distroless/cc-debian12 AS runtime

# Copy CA certificates for HTTPS calls to ElevenLabs/Gemma/TabPFN
COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/

# Copy compiled binary
COPY --from=builder /app/target/release/aura-flora-backend /app/aura-flora-backend

# Audio temp directory and runtime environment defaults
ENV AUDIO_TEMP_DIR=/tmp/aura-flora-audio \
    RUST_LOG=info \
    PORT=8080

EXPOSE 8080

CMD ["/app/aura-flora-backend"]
