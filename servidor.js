/**
 * ═══════════════════════════════════════════════════════
 *   MERCADO CENTRAL BH — Servidor Local (HTTPS + Porta 8501)
 *   Desenvolvido por Artur Gabriel Oliveira da Silva
 * ═══════════════════════════════════════════════════════
 *
 *  Acesso local:   https://localhost:8501
 *  Acesso externo: https://186.248.128.211:8501
 *
 *  NOTA: O navegador vai exibir aviso de "site não seguro"
 *  por ser certificado autoassinado — clique em "Avançado"
 *  e depois "Continuar assim mesmo". Isso é normal e seguro
 *  para uso interno.
 */

const https  = require('https');
const http   = require('http');
const fs     = require('fs');
const path   = require('path');
const os     = require('os');

const PORT      = 8501;
const PORT_HTTP = 8500; // redireciona para HTTPS
const DB_FILE   = path.join(__dirname, 'dados', 'db.json');
const HTML_FILE = path.join(__dirname, 'Mercado_central_bh_v3.html');
const CERT_FILE = path.join(__dirname, 'cert.pem');
const KEY_FILE  = path.join(__dirname, 'key.pem');

// ── Garantir pasta de dados ──────────────────────────────────────
if (!fs.existsSync(path.join(__dirname, 'dados'))) {
  fs.mkdirSync(path.join(__dirname, 'dados'));
}

// ── Ler / Escrever banco JSON ────────────────────────────────────
function readDB() {
  try {
    if (fs.existsSync(DB_FILE)) return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  } catch (e) { console.error('Erro ao ler db.json:', e.message); }
  return null;
}

function writeDB(data) {
  try { fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8'); return true; }
  catch (e) { console.error('Erro ao salvar db.json:', e.message); return false; }
}

// ── Obter IPs da máquina ─────────────────────────────────────────
function getLocalIPs() {
  const interfaces = os.networkInterfaces();
  const ips = [];
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) ips.push({ name, address: iface.address });
    }
  }
  return ips;
}

// ── Handler principal ────────────────────────────────────────────
function handler(req, res) {
  const url    = req.url;
  const method = req.method;

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (method === 'OPTIONS') { res.writeHead(204); res.end(); return; }

  if (url === '/api/db' && method === 'GET') {
    const db = readDB();
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(db));
    return;
  }

  if (url === '/api/db' && method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        const ok = writeDB(data);
        res.writeHead(ok ? 200 : 500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok }));
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: false, error: e.message }));
      }
    });
    return;
  }

  if (url === '/api/backup' && method === 'GET') {
    const db = readDB();
    if (!db) { res.writeHead(404); res.end('Sem dados'); return; }
    const nome = `backup_mcbh_${new Date().toISOString().slice(0,10)}.json`;
    res.writeHead(200, {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Disposition': `attachment; filename="${nome}"`
    });
    res.end(JSON.stringify({ ...db, backup_date: new Date().toISOString(), version: 'MCBH-v4' }, null, 2));
    return;
  }

  if (url === '/' || url === '/index.html') {
    if (!fs.existsSync(HTML_FILE)) {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end('<h2>❌ Arquivo Mercado_central_bh_v3.html não encontrado.</h2>');
      return;
    }
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(fs.readFileSync(HTML_FILE));
    return;
  }

  if (url === '/favicon.ico') { res.writeHead(204); res.end(); return; }
  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Não encontrado');
}

// ── Servidor HTTPS (principal) ───────────────────────────────────
let sslOptions;
try {
  sslOptions = {
    key:  fs.readFileSync(KEY_FILE),
    cert: fs.readFileSync(CERT_FILE)
  };
} catch(e) {
  console.error('\n❌ Certificado SSL não encontrado! Verifique se cert.pem e key.pem estão na pasta.\n');
  process.exit(1);
}

const serverHTTPS = https.createServer(sslOptions, handler);

// ── Servidor HTTP → redireciona para HTTPS ───────────────────────
const serverHTTP = http.createServer((req, res) => {
  const host = req.headers.host ? req.headers.host.split(':')[0] : 'localhost';
  res.writeHead(301, { Location: `https://${host}:${PORT}${req.url}` });
  res.end();
});

// ── Iniciar ambos ────────────────────────────────────────────────
serverHTTPS.listen(PORT, '0.0.0.0', () => {
  serverHTTP.listen(PORT_HTTP, '0.0.0.0', () => {
    const ips = getLocalIPs();
    console.log('\n════════════════════════════════════════════════════════════');
    console.log('  MERCADO CENTRAL BH — Servidor HTTPS Iniciado ✅');
    console.log('════════════════════════════════════════════════════════════');
    console.log(`\n  📍 Nesta máquina:     https://localhost:${PORT}`);
    if (ips.length > 0) {
      console.log('\n  🌐 Rede local (celulares e outros PCs):');
      ips.forEach(ip => console.log(`     https://${ip.address}:${PORT}   (${ip.name})`));
    }
    console.log(`\n  🌍 Acesso externo:    https://186.248.128.211:${PORT}`);
    console.log('\n  ⚠️  AVISO DE SEGURANÇA NO NAVEGADOR:');
    console.log('     Clique em "Avançado" → "Continuar assim mesmo"');
    console.log('     Isso é normal para uso interno com certificado próprio.');
    console.log('\n  📁 Dados salvos em:   ./dados/db.json');
    console.log('\n  Para encerrar: pressione Ctrl+C');
    console.log('════════════════════════════════════════════════════════════\n');
  });
});

serverHTTPS.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n❌ Porta ${PORT} já está em uso. Feche o outro programa e tente novamente.\n`);
  } else {
    console.error('Erro HTTPS:', err.message);
  }
  process.exit(1);
});
