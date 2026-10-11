## Description
Briefly describe the change, the problem solved, and why it is necessary.

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Refactoring / Code quality upgrade
- [ ] Documentation update
- [ ] CI / Tooling improvement

## Verification Checklist
- [ ] Backend: `cargo fmt --check` ran and passed
- [ ] Backend: `cargo clippy --all-targets --all-features -- -D warnings` ran and passed
- [ ] Backend: `cargo test` ran and passed
- [ ] Frontend: `npm run lint` ran and passed
- [ ] Frontend: `npm run typecheck` ran and passed
- [ ] Frontend: `npm test` ran and passed
- [ ] Frontend: `npm run build` ran and passed
- [ ] No private keys or secrets committed
- [ ] Acoustic contracts and simulator responsiveness preserved
