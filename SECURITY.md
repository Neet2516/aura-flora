# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## Reporting a Vulnerability

The AuraFlora team takes security and privacy seriously, particularly because this application captures microphone audio data.

If you discover a security vulnerability or security bug, please report it privately:

1. **Do not open a public GitHub issue.**
2. Report the vulnerability via GitHub's private vulnerability reporting feature on the repository.
3. Include detailed steps to reproduce, the environment details, and the potential impact.

We will acknowledge receipt within 48 hours and work on a fix as quickly as possible.

## Audio & Privacy Architecture

- **Microphone Data**: Raw audio recordings are processed in memory and are never persistently retained or stored in long-term databases.
- **Temporary Files**: Any generated TTS audio files in the temp directory are short-lived session files and sanitized against directory traversal attacks.
- **API Keys**: All external AI provider credentials (`GEMMA_API_KEY`, `ELEVENLABS_API_KEY`, `TABPFN_API_KEY`) must remain on the backend server and never be leaked into client-side Vite bundles.
