/**
 * Singularity-1 Production Startup & Auto-Healer Script
 * Ensures production artifacts (dist/server.cjs & dist/index.html) exist before starting.
 * Handles Render, Docker, HPC Singularity, Node.js, and Bun runtime environments.
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const distDir = path.join(__dirname, 'dist');
const serverFile = path.join(distDir, 'server.cjs');
const indexFile = path.join(distDir, 'index.html');

const isCheckOnly = process.argv.includes('--check-only');

function ensureBuild() {
  const needsBuild = !fs.existsSync(serverFile) || !fs.existsSync(indexFile);
  
  if (needsBuild) {
    console.log('[Singularity-1] Production build artifacts not found in dist/.');
    console.log('[Singularity-1] Initiating automated build (vite build + esbuild)...');
    
    const startTime = Date.now();
    try {
      // Determine package manager (bun or npm)
      let buildCmd = 'npm run build';
      try {
        if (process.versions.bun) {
          buildCmd = 'bun run build';
        }
      } catch (e) {
        buildCmd = 'npm run build';
      }

      console.log(`[Singularity-1] Executing: ${buildCmd}`);
      execSync(buildCmd, {
        stdio: 'inherit',
        cwd: __dirname,
        env: {
          ...process.env,
          NODE_ENV: 'production'
        }
      });
      console.log(`[Singularity-1] Build completed successfully in ${Date.now() - startTime}ms.`);
    } catch (buildErr) {
      console.warn('[Singularity-1] Primary build command failed, trying direct npx compilation...');
      try {
        execSync('npx vite build && npx esbuild server.ts --bundle --platform=node --format=cjs --packages=external --sourcemap --outfile=dist/server.cjs', {
          stdio: 'inherit',
          cwd: __dirname,
          env: {
            ...process.env,
            NODE_ENV: 'production'
          }
        });
        console.log(`[Singularity-1] Fallback build completed in ${Date.now() - startTime}ms.`);
      } catch (fallbackErr) {
        console.error('[Singularity-1] Fatal: Unable to build application bundle.', fallbackErr);
        process.exit(1);
      }
    }
  }

  if (!fs.existsSync(serverFile)) {
    console.error('[Singularity-1] Critical error: dist/server.cjs still missing after build attempt.');
    process.exit(1);
  }
}

// 1. Verify/Compile build artifacts
ensureBuild();

// 2. If called as prestart check, exit cleanly
if (isCheckOnly) {
  process.exit(0);
}

// 3. Start production server
console.log('[Singularity-1] Booting production server from:', serverFile);
require(serverFile);
