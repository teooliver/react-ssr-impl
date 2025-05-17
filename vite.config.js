import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { transform } from "esbuild";
import fs from "fs";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Copy built files to server/static as well
    {
      name: "transform-app-and-children",
      apply: "build",
      async generateBundle() {
        // Process App.jsx and index.js
        const appPath = path.resolve("./src/App.jsx");
        const indexPath = path.resolve("./src/App.jsx");
        const outputDir = path.resolve("./build");

        const transformFile = async (filePath) => {
          const code = fs.readFileSync(filePath, "utf-8");
          const updatedCode = code.replace(
            /(import\s+.*?['"])(.*?)(['"])/g,
            (match, p1, p2, p3) => {
              if (p2.startsWith(".") || p2.startsWith("/")) {
                if (
                  fs.existsSync(
                    path.resolve(path.dirname(filePath), p2 + ".jsx"),
                  )
                ) {
                  return `${p1}${p2}.js${p3}`;
                } else if (
                  fs.existsSync(
                    path.resolve(path.dirname(filePath), p2 + ".js"),
                  )
                ) {
                  return `${p1}${p2}.js${p3}`;
                }
              }
              return match;
            },
          );

          const { code: transformedCode } = await transform(updatedCode, {
            loader: "jsx",
            format: "esm",
          });
          const relativePath = path.relative(path.resolve("./src"), filePath);
          const outputPath = path
            .join(outputDir, relativePath)
            .replace(/\.jsx$/, ".js");

          // Write to build directory
          fs.mkdirSync(path.dirname(outputPath), { recursive: true });
          fs.writeFileSync(outputPath, transformedCode);
          
          // Also write to server/static directory
          const serverStaticDir = path.resolve("./server/static");
          const serverOutputPath = path.join(serverStaticDir, path.basename(outputPath));
          fs.mkdirSync(serverStaticDir, { recursive: true });
          fs.writeFileSync(serverOutputPath, transformedCode);
        };

        const processDependencies = (filePath, visited = new Set()) => {
          if (visited.has(filePath)) return;
          visited.add(filePath);

          transformFile(filePath);

          const code = fs.readFileSync(filePath, "utf-8");
          const importRegex = /import\s+.*?['"](.*?)['"]/g;
          let match;

          while ((match = importRegex.exec(code)) !== null) {
            const importedPath = match[1];
            if (!importedPath.startsWith(".") && !importedPath.startsWith("/"))
              continue;

            const resolvedPath = path.resolve(
              path.dirname(filePath),
              importedPath,
            );
            if (fs.existsSync(resolvedPath + ".jsx")) {
              processDependencies(resolvedPath + ".jsx", visited);
            } else if (fs.existsSync(resolvedPath + ".js")) {
              processDependencies(resolvedPath + ".js", visited);
            }
          }
        };

        processDependencies(appPath);
        processDependencies(indexPath);
      },
    },
  ],
  build: {
    outDir: "build",
    rollupOptions: {
      input: {
        main: "./src/App.jsx",
        Header: "./src/Header.jsx",
        Card: "./src/Card.jsx",
        Count: "./src/Count.jsx"
      },
      output: {
        format: "esm",
        entryFileNames: "[name].js",
      },
    },
    minify: false,
  },
});
