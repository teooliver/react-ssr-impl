import { build } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function buildClientBundle() {
  console.log('Building client bundle...');
  
  // Ensure the output directory exists
  const outputDir = path.resolve(__dirname, 'server/static');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  try {
    await build({
      configFile: false,
      build: {
        outDir: outputDir,
        rollupOptions: {
          input: path.resolve(__dirname, 'src/main.jsx'),
          output: {
            entryFileNames: 'main.js',
            format: 'esm',
          },
          external: [], // Bundle everything
          preserveEntrySignatures: false,
        },
        minify: true,
        write: true,
        emptyOutDir: false,
      },
      plugins: [
        await (await import('@vitejs/plugin-react')).default(),
      ],
      mode: 'production',
      logLevel: 'info',
    });
    
    console.log('Client bundle built successfully!');
  } catch (error) {
    console.error('Error building client bundle:', error);
  }
}

buildClientBundle();