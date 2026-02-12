# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install Chromium for Puppeteer
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont

# Tell Puppeteer to use installed Chromium
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Generate screenshots
RUN mkdir -p public/screenshots && \
    node scripts/generate-screenshots.js || echo "Screenshot generation failed, continuing build..."

# Build the React app (this will include the screenshots in public/)
RUN npm run build:app

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy server and then place built app into `server/dist`
# Copying server first avoids accidentally overwriting any files we just added.
COPY server ./server
COPY --from=builder /app/dist ./server/dist

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the server
CMD ["node", "server/index.js"]
