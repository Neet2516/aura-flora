# =============================================================================
# AuraFlora Mobile — Multi-Stage Flutter Dockerfile
#
# Stages:
#   1. builder  : Compiles dependencies, runs tests, and builds Android release APK
#   2. export   : Minimal scratch image for extracting APK using BuildKit (--output)
#   3. runtime  : Production Nginx image serving APK downloads and sideload portal
# =============================================================================

ARG FLUTTER_VERSION=3.19.6

# -----------------------------------------------------------------------------
# Stage 1: Build Environment (Flutter + Android SDK)
# -----------------------------------------------------------------------------
FROM ghcr.io/cirruslabs/flutter:${FLUTTER_VERSION} AS builder

WORKDIR /app

# Disable analytics and verify environment
RUN flutter config --no-analytics && \
    flutter doctor -v

# 1. Dependency layer caching: Copy pubspec manifests first
COPY pubspec.yaml pubspec.lock* ./

# Fetch Dart / Flutter dependencies
RUN flutter pub get

# 2. Copy the full mobile application codebase
COPY . .

# Run static analysis and widget/unit tests
RUN flutter analyze --no-fatal-infos && \
    flutter test

# Ensure platform scaffolding is synchronized
RUN (flutter create . --platforms=android 2>/dev/null || true)

# Build the release Android APK (standalone universal APK)
RUN flutter build apk --release

# Generate SHA256 checksum for artifact verification
RUN cd /app/build/app/outputs/flutter-apk && \
    sha256sum app-release.apk > sha256.txt

# -----------------------------------------------------------------------------
# Stage 2: Artifact Exporter (Direct host extraction)
# Usage: docker build --target export --output type=local,dest=./dist ./mobile
# -----------------------------------------------------------------------------
FROM scratch AS export
COPY --from=builder /app/build/app/outputs/flutter-apk/app-release.apk /aura-flora-release.apk
COPY --from=builder /app/build/app/outputs/flutter-apk/sha256.txt /sha256.txt

# -----------------------------------------------------------------------------
# Stage 3: Runtime APK Distribution Server (Nginx)
# Serves the compiled APK and AMOLED-themed download portal on port 80
# -----------------------------------------------------------------------------
FROM nginx:alpine AS runtime

# Copy compiled APK and checksum to Nginx public root
COPY --from=builder /app/build/app/outputs/flutter-apk/app-release.apk /usr/share/nginx/html/aura-flora-release.apk
COPY --from=builder /app/build/app/outputs/flutter-apk/sha256.txt /usr/share/nginx/html/sha256.txt

# Create AMOLED-themed APK distribution portal
RUN echo '<!DOCTYPE html>' > /usr/share/nginx/html/index.html && \
    echo '<html lang="en">' >> /usr/share/nginx/html/index.html && \
    echo '<head>' >> /usr/share/nginx/html/index.html && \
    echo '  <meta charset="UTF-8">' >> /usr/share/nginx/html/index.html && \
    echo '  <meta name="viewport" content="width=device-width, initial-scale=1.0">' >> /usr/share/nginx/html/index.html && \
    echo '  <title>AuraFlora — Android App Download</title>' >> /usr/share/nginx/html/index.html && \
    echo '  <style>' >> /usr/share/nginx/html/index.html && \
    echo '    :root {' >> /usr/share/nginx/html/index.html && \
    echo '      --forest-deep: #0A0F0D;' >> /usr/share/nginx/html/index.html && \
    echo '      --moss-muted: #1F2E23;' >> /usr/share/nginx/html/index.html && \
    echo '      --herbal: #4E8752;' >> /usr/share/nginx/html/index.html && \
    echo '      --herbal-light: #72B077;' >> /usr/share/nginx/html/index.html && \
    echo '      --sand: #E8DFD8;' >> /usr/share/nginx/html/index.html && \
    echo '      --sand-muted: #8E998F;' >> /usr/share/nginx/html/index.html && \
    echo '    }' >> /usr/share/nginx/html/index.html && \
    echo '    * { box-sizing: border-box; margin: 0; padding: 0; }' >> /usr/share/nginx/html/index.html && \
    echo '    body {' >> /usr/share/nginx/html/index.html && \
    echo '      background-color: var(--forest-deep);' >> /usr/share/nginx/html/index.html && \
    echo '      color: var(--sand);' >> /usr/share/nginx/html/index.html && \
    echo '      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;' >> /usr/share/nginx/html/index.html && \
    echo '      min-height: 100vh;' >> /usr/share/nginx/html/index.html && \
    echo '      display: flex;' >> /usr/share/nginx/html/index.html && \
    echo '      flex-direction: column;' >> /usr/share/nginx/html/index.html && \
    echo '      align-items: center;' >> /usr/share/nginx/html/index.html && \
    echo '      justify-content: center;' >> /usr/share/nginx/html/index.html && \
    echo '      padding: 24px;' >> /usr/share/nginx/html/index.html && \
    echo '    }' >> /usr/share/nginx/html/index.html && \
    echo '    .card {' >> /usr/share/nginx/html/index.html && \
    echo '      background: var(--moss-muted);' >> /usr/share/nginx/html/index.html && \
    echo '      border: 1px solid rgba(78, 135, 82, 0.25);' >> /usr/share/nginx/html/index.html && \
    echo '      border-radius: 24px;' >> /usr/share/nginx/html/index.html && \
    echo '      padding: 40px 32px;' >> /usr/share/nginx/html/index.html && \
    echo '      max-width: 440px;' >> /usr/share/nginx/html/index.html && \
    echo '      width: 100%;' >> /usr/share/nginx/html/index.html && \
    echo '      text-align: center;' >> /usr/share/nginx/html/index.html && \
    echo '      box-shadow: 0 20px 40px rgba(0,0,0,0.6);' >> /usr/share/nginx/html/index.html && \
    echo '    }' >> /usr/share/nginx/html/index.html && \
    echo '    .icon {' >> /usr/share/nginx/html/index.html && \
    echo '      font-size: 54px;' >> /usr/share/nginx/html/index.html && \
    echo '      margin-bottom: 12px;' >> /usr/share/nginx/html/index.html && \
    echo '      display: inline-block;' >> /usr/share/nginx/html/index.html && \
    echo '    }' >> /usr/share/nginx/html/index.html && \
    echo '    h1 {' >> /usr/share/nginx/html/index.html && \
    echo '      font-size: 26px;' >> /usr/share/nginx/html/index.html && \
    echo '      font-weight: 700;' >> /usr/share/nginx/html/index.html && \
    echo '      letter-spacing: -0.5px;' >> /usr/share/nginx/html/index.html && \
    echo '      margin-bottom: 6px;' >> /usr/share/nginx/html/index.html && \
    echo '    }' >> /usr/share/nginx/html/index.html && \
    echo '    p.sub {' >> /usr/share/nginx/html/index.html && \
    echo '      color: var(--sand-muted);' >> /usr/share/nginx/html/index.html && \
    echo '      font-size: 14px;' >> /usr/share/nginx/html/index.html && \
    echo '      margin-bottom: 28px;' >> /usr/share/nginx/html/index.html && \
    echo '    }' >> /usr/share/nginx/html/index.html && \
    echo '    .btn {' >> /usr/share/nginx/html/index.html && \
    echo '      display: inline-flex;' >> /usr/share/nginx/html/index.html && \
    echo '      align-items: center;' >> /usr/share/nginx/html/index.html && \
    echo '      justify-content: center;' >> /usr/share/nginx/html/index.html && \
    echo '      gap: 10px;' >> /usr/share/nginx/html/index.html && \
    echo '      width: 100%;' >> /usr/share/nginx/html/index.html && \
    echo '      padding: 16px 24px;' >> /usr/share/nginx/html/index.html && \
    echo '      background-color: var(--herbal);' >> /usr/share/nginx/html/index.html && \
    echo '      color: var(--sand);' >> /usr/share/nginx/html/index.html && \
    echo '      font-size: 16px;' >> /usr/share/nginx/html/index.html && \
    echo '      font-weight: 600;' >> /usr/share/nginx/html/index.html && \
    echo '      text-decoration: none;' >> /usr/share/nginx/html/index.html && \
    echo '      border-radius: 999px;' >> /usr/share/nginx/html/index.html && \
    echo '      transition: all 0.2s ease;' >> /usr/share/nginx/html/index.html && \
    echo '      box-shadow: 0 8px 24px rgba(78, 135, 82, 0.35);' >> /usr/share/nginx/html/index.html && \
    echo '    }' >> /usr/share/nginx/html/index.html && \
    echo '    .btn:hover {' >> /usr/share/nginx/html/index.html && \
    echo '      background-color: var(--herbal-light);' >> /usr/share/nginx/html/index.html && \
    echo '      transform: translateY(-2px);' >> /usr/share/nginx/html/index.html && \
    echo '    }' >> /usr/share/nginx/html/index.html && \
    echo '    .meta {' >> /usr/share/nginx/html/index.html && \
    echo '      margin-top: 24px;' >> /usr/share/nginx/html/index.html && \
    echo '      font-size: 12px;' >> /usr/share/nginx/html/index.html && \
    echo '      color: var(--sand-muted);' >> /usr/share/nginx/html/index.html && \
    echo '      border-top: 1px solid rgba(232, 223, 216, 0.1);' >> /usr/share/nginx/html/index.html && \
    echo '      padding-top: 20px;' >> /usr/share/nginx/html/index.html && \
    echo '      line-height: 1.6;' >> /usr/share/nginx/html/index.html && \
    echo '    }' >> /usr/share/nginx/html/index.html && \
    echo '    .meta a {' >> /usr/share/nginx/html/index.html && \
    echo '      color: var(--herbal-light);' >> /usr/share/nginx/html/index.html && \
    echo '      text-decoration: none;' >> /usr/share/nginx/html/index.html && \
    echo '    }' >> /usr/share/nginx/html/index.html && \
    echo '    .meta a:hover {' >> /usr/share/nginx/html/index.html && \
    echo '      text-decoration: underline;' >> /usr/share/nginx/html/index.html && \
    echo '    }' >> /usr/share/nginx/html/index.html && \
    echo '  </style>' >> /usr/share/nginx/html/index.html && \
    echo '</head>' >> /usr/share/nginx/html/index.html && \
    echo '<body>' >> /usr/share/nginx/html/index.html && \
    echo '  <div class="card">' >> /usr/share/nginx/html/index.html && \
    echo '    <div class="icon">🌿</div>' >> /usr/share/nginx/html/index.html && \
    echo '    <h1>AuraFlora</h1>' >> /usr/share/nginx/html/index.html && \
    echo '    <p class="sub">BioAcoustic Grounding Companion (v1.0.0)</p>' >> /usr/share/nginx/html/index.html && \
    echo '    <a href="aura-flora-release.apk" class="btn" download>' >> /usr/share/nginx/html/index.html && \
    echo '      <span>⬇️</span> Download Android APK' >> /usr/share/nginx/html/index.html && \
    echo '    </a>' >> /usr/share/nginx/html/index.html && \
    echo '    <div class="meta">' >> /usr/share/nginx/html/index.html && \
    echo '      <p>Target: Android 6.0+ (ARM64 / x86_64)</p>' >> /usr/share/nginx/html/index.html && \
    echo '      <p><a href="sha256.txt">View SHA256 Checksum</a></p>' >> /usr/share/nginx/html/index.html && \
    echo '      <p style="margin-top: 8px;">Anti-screen mobile companion · Hacktoberfest 2026</p>' >> /usr/share/nginx/html/index.html && \
    echo '    </div>' >> /usr/share/nginx/html/index.html && \
    echo '  </div>' >> /usr/share/nginx/html/index.html && \
    echo '</body>' >> /usr/share/nginx/html/index.html && \
    echo '</html>' >> /usr/share/nginx/html/index.html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
