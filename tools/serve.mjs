import http from 'node:http';
import { createReadStream } from 'node:fs';
import { realpath, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = await realpath(fileURLToPath(new URL('../site/', import.meta.url)));
const host = '127.0.0.1';
const port = 4173;
const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.ics': 'text/calendar; charset=utf-8',
};

function insideRoot(file) {
  const relative = path.relative(root, file);
  return relative !== '..' && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative);
}

function sendError(request, response, status, message) {
  response.writeHead(status, { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' });
  response.end(request.method === 'HEAD' ? undefined : message);
}

const server = http.createServer(async (request, response) => {
  if (!['GET', 'HEAD'].includes(request.method)) {
    response.setHeader('Allow', 'GET, HEAD');
    sendError(request, response, 405, 'Method not allowed');
    return;
  }
  try {
    const url = new URL(request.url || '/', `http://${host}:${port}`);
    const decoded = decodeURIComponent(url.pathname);
    if (decoded.includes('\0') || decoded.includes('\\')) {
      sendError(request, response, 400, 'Invalid path');
      return;
    }
    const candidate = path.resolve(root, `.${decoded === '/' ? '/index.html' : decoded}`);
    if (!insideRoot(candidate)) {
      sendError(request, response, 403, 'Forbidden');
      return;
    }
    const file = await realpath(candidate);
    if (!insideRoot(file)) {
      sendError(request, response, 403, 'Forbidden');
      return;
    }
    const info = await stat(file);
    if (!info.isFile()) {
      sendError(request, response, 404, 'Not found');
      return;
    }
    response.writeHead(200, {
      'Content-Type': types[path.extname(file).toLowerCase()] || 'application/octet-stream',
      'Content-Length': info.size,
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
    });
    if (request.method === 'HEAD') response.end();
    else createReadStream(file).on('error', () => response.destroy()).pipe(response);
  } catch (error) {
    if (error instanceof URIError || error.code === 'ERR_INVALID_URL') sendError(request, response, 400, 'Invalid path');
    else if (error.code === 'ENOENT' || error.code === 'ENOTDIR') sendError(request, response, 404, 'Not found');
    else sendError(request, response, 500, 'Server error');
  }
});

server.on('error', (error) => {
  console.error(error.code === 'EADDRINUSE' ? `Le port ${port} est déjà utilisé.` : error.message);
  process.exitCode = 1;
});
server.listen(port, host, () => console.log(`MACOIN — http://${host}:${port}`));
