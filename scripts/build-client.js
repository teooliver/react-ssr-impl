import { build } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Define all component files to build
const componentFiles = [
  { input: '../src/App.jsx', output: 'main.js' },
  { input: '../src/Header.jsx', output: 'Header.js' },
  { input: '../src/Card.jsx', output: 'Card.js' },
  { input: '../src/Count.jsx', output: 'Count.js' },
];

async function buildClientBundle() {
  console.log('Building client bundle...');
  
  // Ensure the output directory exists
  const outputDir = path.resolve(__dirname, '../server/static');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  try {
    // Build main bundle
    await build({
      configFile: false,
      build: {
        outDir: outputDir,
        rollupOptions: {
          input: path.resolve(__dirname, '../src/App.jsx'),
          output: {
            entryFileNames: 'main.js',
            format: 'esm',
            manualChunks: () => 'main', // Force everything into one bundle
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
      resolve: {
        dedupe: ['react', 'react-dom']
      },
    });
    
    // Build individual component files
    for (const component of componentFiles) {
      if (component.output === 'main.js') continue; // Skip main bundle as it's already built
      
      console.log(`Building component: ${component.output}`);
      await build({
        configFile: false,
        build: {
          outDir: outputDir,
          rollupOptions: {
            input: path.resolve(__dirname, component.input),
            output: {
              entryFileNames: component.output,
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
    }
    
    console.log('Client bundle built successfully!');
  } catch (error) {
    console.error('Error building client bundle:', error);
  }
}

buildClientBundle();