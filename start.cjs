/**
 * Singularity-1 Production Startup & Auto-Healer Script
 * Ensures production artifacts (dist/server.cjs & dist/index.html) exist before starting.
 * Handles Render (Free Tier 512MB RAM), Docker, HPC Singularity, Node.js, and Bun runtime environments.
 */
const fs = require('fs');
const path = require('path');
const { spawn, execSync } = require('child_process');

const distDir = path.join(__dirname, 'dist');
const serverFile = path.join(distDir, 'server.cjs');
const indexFile = path.join(distDir, 'index.html');

const isCheckOnly = process.argv.includes('--check-only');

function bootDirectly() {
  console.log('[Singularity-1] Starting application directly using tsx runtime...');
  const child = spawn('npx', ['tsx', 'server.ts'], {
    stdio: 'inherit',
    cwd: __dirname,
    env: {
      ...process.env,
      PORT: process.env.PORT || '3000'
    }
  });

  child.on('error', (err) => {
    console.error('[Singularity-1] tsx boot error:', err);
    process.exit(1);
  });

  child.on('exit', (code) => {
    process.exit(code || 0);
  });
}

function ensureBuild() {
  const hasServer = fs.existsSync(serverFile);
  const hasIndex = fs.existsSync(indexFile);

  if (hasServer && hasIndex) {
    console.log('[Singularity-1] Verified pre-compiled production artifacts in dist/.');
    return true;
  }

  console.log('[Singularity-1] Production build artifacts not found in dist/.');
  console.log('[Singularity-1] Attempting low-memory compilation...');

  try {
    execSync('npm run build', {
      stdio: 'inherit',
      cwd: __dirname,
      env: {
        ...process.env,
        NODE_OPTIONS: '--max-old-space-size=400',
        NODE_ENV: 'production'
      }
    });
    return true;
  } catch (err) {
    console.warn('[Singularity-1] Memory-safe build failed or was aborted by container kernel.');
    console.warn('[Singularity-1] Activating live dynamic runtime engine (tsx)...');
    return false;
  }
}

// 1. Check or compile artifacts
const buildSuccess = ensureBuild();

// 2. If check-only flag is set
if (isCheckOnly) {
  process.exit(0);
}

// 3. Boot server
if (buildSuccess && fs.existsSync(serverFile)) {
  console.log('[Singularity-1] Booting production server from:', serverFile);
  require(serverFile);
} else {
  bootDirectly();
}
