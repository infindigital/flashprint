#!/usr/bin/env node
/**
 * Local preview server for the Flash Print Solution website.
 *
 *   Double-click  "Preview Website.cmd"   (Windows)
 *   or run        node preview.js
 *
 * WHY THIS IS NEEDED
 * ------------------
 * Every link, stylesheet and image in website/ uses a root-absolute path ("/assets/css/main.css",
 * "/corporate-gifts-dubai/"). That is what a real web server needs, and what Google expects.
 * If you open website/index.html by double-clicking it, the browser uses the "file://" protocol,
 * where "/assets/..." means the root of your hard disk — so the page loads with no styling,
 * no images, and none of the links work.
 *
 * This script starts a tiny web server on your computer so the site behaves exactly as it will
 * live: clean URLs, folder index pages, the 404 page and the 301 redirects.
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const ROOT = path.join(__dirname, 'website');
const START_PORT = +process.env.PORT || 8080;

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png',
  '.svg': 'image/svg+xml', '.gif': 'image/gif', '.woff2': 'font/woff2', '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8', '.ico': 'image/x-icon', '.webmanifest': 'application/manifest+json', '.pdf': 'application/pdf',
};

if (!fs.existsSync(path.join(ROOT, 'index.html'))) {
  console.error('\n  Could not find website\index.html next to this script.');
  console.error('  Run this file from inside the "Flashprint Website" folder.\n');
  process.exit(1);
}

/* ---- 301 / 410 rules from website/_redirects (same file the live host uses) ---- */
const redirects = new Map();
try {
  for (const line of fs.readFileSync(path.join(ROOT, '_redirects'), 'utf8').split('\n')) {
    const [from, to, code] = line.trim().split(/\s+/);
    if (from && !from.startsWith('#') && to) redirects.set(from, { to, code: +code || 301 });
  }
} catch { /* no redirects file yet */ }

const send404 = res => {
  res.writeHead(404, { 'Content-Type': TYPES['.html'] });
  res.end(fs.readFileSync(path.join(ROOT, '404.html')));
};

const server = http.createServer((req, res) => {
  let url;
  try { url = decodeURIComponent(req.url.split('?')[0].split('#')[0]); }
  catch { return send404(res); }

  const rule = redirects.get(url) || redirects.get(url.replace(/\/$/, ''));
  if (rule && rule.code === 301) { res.writeHead(301, { Location: rule.to }); return res.end(); }
  if (rule && rule.code === 410) { res.writeHead(410, { 'Content-Type': TYPES['.html'] }); return res.end(fs.readFileSync(path.join(ROOT, '404.html'))); }

  let file = path.join(ROOT, url);
  if (path.relative(ROOT, file).startsWith('..')) { res.writeHead(403); return res.end('Forbidden'); }

  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) {
    if (!url.endsWith('/')) { res.writeHead(301, { Location: url + '/' }); return res.end(); }
    file = path.join(file, 'index.html');
  }
  if (!fs.existsSync(file) || !fs.statSync(file).isFile()) return send404(res);

  res.writeHead(200, { 'Content-Type': TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
  fs.createReadStream(file).pipe(res);
});

/* ---- Start on the first free port, then open the browser ---- */
let port = START_PORT;
server.on('error', err => {
  if (err.code === 'EADDRINUSE' && port < START_PORT + 20) { server.listen(++port); return; }
  console.error('\n  Could not start the preview server:', err.message, '\n');
  process.exit(1);
});
server.listen(port, () => {
  const url = `http://localhost:${port}/`;
  const pages = [
    ['Home — Corporate Gifts', '/'],
    ['Exhibition Booth Building', '/exhibition-booth-building-dubai/'],
    ['Printing Services', '/printing-services-dubai/'],
  ];
  console.log('\n  Flash Print Solution — local preview is running.\n');
  console.log(`  ${url}\n`);
  for (const [name, p] of pages) console.log(`    ${name.padEnd(28)} ${url.replace(/\/$/, '')}${p}`);
  console.log('\n  Leave this window open while you browse. Press Ctrl+C (or close it) to stop.\n');
  const opener = process.platform === 'win32' ? ['cmd', ['/c', 'start', '', url]]
    : process.platform === 'darwin' ? ['open', [url]] : ['xdg-open', [url]];
  try { spawn(opener[0], opener[1], { stdio: 'ignore', detached: true }).unref(); } catch { /* open it yourself */ }
});
