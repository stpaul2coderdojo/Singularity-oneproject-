# ==============================================================================
# Singularity-1: AI Alignment, Mechanistic Interpretability & SOTA RLHF Platform
# Principal Investigator: Dr. Bheemaiah Anil K., Director, Synergy Robotics
# Affiliation: Synergy Robotics • IIT Madras Alumni (bheemaiah@alumni.iitm.ac.in)
# ==============================================================================

# Stage 1: Build Phase
FROM node:22-slim AS builder

WORKDIR /app

# Copy dependency manifests
COPY package.json ./

# Install all dependencies (including devDependencies required for build)
RUN npm install

# Copy source repository
COPY . .

# Compile Vite client assets and bundle server into dist/server.cjs
RUN npm run build

# Stage 2: Production Execution Runtime
FROM node:22-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy node_modules and built distribution artifacts
COPY package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/.env.example ./.env.example

# Expose the application port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1); }).on('error', () => process.exit(1));"

# Launch CommonJS server
CMD ["node", "dist/server.cjs"]
