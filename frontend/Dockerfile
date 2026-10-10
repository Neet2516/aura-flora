# =============================================================================
# AuraFlora Frontend — React Native / Expo Multi-Stage Dockerfile
# =============================================================================

# Stage 1: Build dependencies & static export
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies needed for node-gyp if necessary
RUN apk add --no-cache python3 make g++

# Layer cache: copy package manifests first
COPY package.json ./

# Install npm dependencies inside Docker (leaving host machine untouched)
RUN npm install

# Copy source code and config
COPY . .

# Export production React Native Web bundle
ENV NODE_ENV=production
RUN npx expo export --platform web

# -----------------------------------------------------------------------------
# Stage 2: Production Web Server (Ultra-lightweight Nginx)
# -----------------------------------------------------------------------------
FROM nginx:alpine AS production

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy compiled React Native Web bundle from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
