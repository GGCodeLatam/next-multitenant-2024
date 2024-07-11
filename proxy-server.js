import httpProxy from 'http-proxy';
import http from 'http';

const proxy = httpProxy.createProxyServer({
  ws: true,
  xfwd: true
});

const NEXT_SERVER_PORT = 3000;
const PROXY_PORT = 8080;

const server = http.createServer((req, res) => {
  const host = req.headers.host;
  console.log(`Proxy: Incoming request for host: ${host}, path: ${req.url}`);

  // Redirige todas las solicitudes a tu app Next.js
  proxy.web(req, res, { 
    target: `http://localhost:${NEXT_SERVER_PORT}`,
    changeOrigin: false,
    headers: {
      'Host': host,
    }
  });
});

server.on('upgrade', (req, socket, head) => {
  proxy.ws(req, socket, head, {
    target: `ws://localhost:${NEXT_SERVER_PORT}`,
    changeOrigin: false,
  });
});

server.listen(PROXY_PORT, () => {
  console.log(`Proxy server running on http://localhost:${PROXY_PORT}`);
  console.log(`You can now access your app using subdomains like: http://tenant1.localhost:${PROXY_PORT}`);
});

proxy.on('error', (err, req, res) => {
  console.error('Proxy error:', err);
  if (res.writeHead) {
    res.writeHead(500, {
      'Content-Type': 'text/plain'
    });
    res.end('Something went wrong with the proxy server.');
  }
});

proxy.on('proxyReq', (proxyReq, req, res, options) => {
  console.log(`Proxy: Forwarding request to: ${proxyReq.path}`);
});

proxy.on('proxyRes', (proxyRes, req, res) => {
  console.log(`Proxy: Received response with status: ${proxyRes.statusCode}`);
});