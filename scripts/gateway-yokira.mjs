import { createServer, request as httpRequest } from 'node:http';
import { connect } from 'node:net';
import { selecionarAplicacao } from './roteamento-yokira.mjs';
const listenPort = Number(process.env.YOKIRA_GATEWAY_PORT || 4117);
const sitePort = Number(process.env.YOKIRA_SITE_PORT || 5125);
const universoPort = Number(process.env.YOKIRA_UNIVERSO_PORT || 4118);
const port = (rota) => (rota === 'site' ? sitePort : universoPort);
function cabecalhos(req, destino) {
  const original = req.headers.host || 'localhost';
  return {
    ...req.headers,
    host: destino === 'site' ? '127.0.0.1:' + sitePort : original,
    'x-forwarded-host': original,
    'x-forwarded-proto': 'http',
    'x-forwarded-for': (req.socket.remoteAddress || '').replace(/[^\d:.a-f]/gi, '')
  };
}
const server = createServer((req, res) => {
  const destino = selecionarAplicacao(req.url || '/');
  const upstream = httpRequest(
    {
      hostname: '127.0.0.1',
      port: port(destino),
      path: req.url,
      method: req.method,
      headers: cabecalhos(req, destino)
    },
    (resposta) => {
      res.writeHead(resposta.statusCode || 502, resposta.headers);
      resposta.pipe(res);
    }
  );
  upstream.on('error', (e) => {
    if (!res.headersSent) {
      res.writeHead(502, {
        'content-type': 'text/plain; charset=utf-8',
        'cache-control': 'no-store'
      });
    }
    res.end('Serviço Yokira ' + destino + ' indisponível: ' + e.code);
  });
  req.pipe(upstream);
});
server.on('upgrade', (req, socket, head) => {
  const destino = selecionarAplicacao(req.url || '/');
  const upstream = connect(port(destino), '127.0.0.1');
  upstream.once('connect', () => {
    const headers = cabecalhos(req, destino);
    upstream.write(
      req.method +
        ' ' +
        req.url +
        ' HTTP/1.1\r\n' +
        Object.entries(headers)
          .map(([k, v]) => k + ': ' + v)
          .join('\r\n') +
        '\r\n\r\n'
    );
    if (head?.length) upstream.write(head);
    socket.pipe(upstream);
    upstream.pipe(socket);
  });
  const falhou = () => {
    socket.destroy();
    upstream.destroy();
  };
  upstream.on('error', falhou);
  socket.on('error', falhou);
});
server.on('error', (error) => {
  console.error('Gateway Yokira:', error.message);
  process.exitCode = 1;
});
server.listen(listenPort, '0.0.0.0', () => {
  console.log(
    'Yokira original + universo em http://0.0.0.0:' +
      listenPort +
      ' (site:' +
      sitePort +
      ', SvelteKit:' +
      universoPort +
      ')'
  );
});
