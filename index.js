// Servidor HTTP básico en Node.js
const http = require('http');

const PORT = 3000;

function getResponseText() {
  return 'Hola Mundo desde Node.js';
}

// Solo levanta el servidor si el archivo se ejecuta directamente
if (require.main === module) {
  const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end(getResponseText());
  });

  server.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
}

module.exports = { getResponseText };

