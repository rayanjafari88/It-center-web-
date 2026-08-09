# IT Command Center. No build step and no runtime dependencies, so this stays tiny.
FROM node:20-alpine

# Run as a non-root user: a compromised process should not own the container.
RUN addgroup -S itcc && adduser -S itcc -G itcc

WORKDIR /app
COPY package.json ./
COPY server.js ./
COPY lib ./lib
COPY public ./public
COPY qa ./qa
COPY docs ./docs

# Records, uploaded files and snapshots all live here. Mount it as a volume so
# they survive redeploys - without this, every container rebuild loses the data.
RUN mkdir -p /app/data && chown -R itcc:itcc /app
VOLUME ["/app/data"]

USER itcc
ENV PORT=4173
EXPOSE 4173

# Liveness: this route answers without a session; everything else returns 401.
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1:4173/api/auth/config >/dev/null 2>&1 || exit 1

CMD ["node", "server.js"]
