#!/usr/bin/env node
// Create a 404.html in the dist folder that redirects to index.html for SPA routing on GH Pages
import fs from "fs";
import path from "path";

const distDir = path.resolve(process.cwd(), "dist");
const indexPath = path.join(distDir, "index.html");
const outPath = path.join(distDir, "404.html");

if (!fs.existsSync(distDir)) {
  console.error("dist directory not found. Run the build first.");
  process.exit(1);
}

if (!fs.existsSync(indexPath)) {
  console.error("index.html not found inside dist. Build may have failed.");
  process.exit(1);
}

const indexHtml = fs.readFileSync(indexPath, "utf8");

// Write the same index as 404 so GitHub Pages serves the SPA on unknown routes
fs.writeFileSync(outPath, indexHtml, "utf8");
console.log("Created dist/404.html");
