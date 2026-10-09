# Workflow: Rust Backend — Test & Build Verification

## Prerequisites
- Rust toolchain installed (`rustup` ≥ 1.75)
- `cargo clippy` component: `rustup component add clippy`

## Steps

### 1. Format Check
```bash
cd backend
cargo fmt --check
```
Expected: no output (exit 0).

### 2. Clippy Lint (zero warnings policy)
```bash
cargo clippy -- -D warnings
```
Expected: `Finished` with no warnings or errors.

### 3. Unit Tests
```bash
cargo test
```
Expected: All tests pass. Focus areas:
- `dsp::acoustic_features` — FFT spectral centroid & entropy calculations
- `services::tabpfn_service` — mock classification correctness
- `handlers::ground` — HTTP handler integration tests

### 4. Build (Release)
```bash
cargo build --release
```
Expected: `target/release/aura-flora-backend` binary produced.

### 5. Docker Build Verification
```bash
docker build -t aura-flora-backend:dev .
```
Expected: Final image ≤ 50MB using distroless base.

## Checklist
- [ ] `cargo fmt --check` passes
- [ ] `cargo clippy -- -D warnings` passes
- [ ] `cargo test` all green
- [ ] `cargo build --release` succeeds
- [ ] Docker image builds cleanly
