# =============================================================================
# Stage 1: Builder — compile the Rust binary
# =============================================================================
FROM rust:1.75-slim-bookworm AS builder

# Install system dependencies for OpenSSL and TLS
RUN apt-get update && apt-get install -y \
    ca-certificates \
    pkg-config \
    libssl-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy manifests first for layer caching of dependencies
COPY Cargo.toml Cargo.lock* ./

# Create a dummy main.rs to allow dependency compilation
RUN mkdir src && echo "fn main() {}" > src/main.rs

# Build dependencies (cached layer)
RUN cargo build --release && rm -rf src

# Now copy actual source code
COPY src ./src

# Touch main.rs to force recompilation of our code
RUN touch src/main.rs

# Build the production binary
RUN cargo build --release

# =============================================================================
# Stage 2: Runtime — minimal distroless image
# =============================================================================
FROM gcr.io/distroless/cc-debian12 AS runtime

# Copy CA certificates for HTTPS calls to ElevenLabs/Gemma/TabPFN
COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/

# Copy the compiled binary
COPY --from=builder /app/target/release/aura-flora-backend /app/aura-flora-backend

# Audio temp directory (bind-mounted in production or created at runtime)
ENV AUDIO_TEMP_DIR=/tmp/aura-flora-audio
ENV RUST_LOG=info
ENV PORT=8080

EXPOSE 8080

CMD ["/app/aura-flora-backend"]
