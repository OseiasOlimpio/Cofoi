// Importa a biblioteca WebSocket
const WebSocket = require('ws');

// Cria um servidor WebSocket na porta 5000
const server = new WebSocket.Server({ port: 5000 });

server.on('connection', (socket) => {
  console.log('Um usuário se conectou');

  socket.on('message', (message) => {
    console.log(`Recebido: ${message}`);

    // Envia a mensagem para todos os clientes conectados
    server.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  socket.on('close', () => {
    console.log('Um usuário se desconectou');
  });
});

// Mensagem no console indicando que o servidor está rodando
console.log('Servidor WebSocket está rodando em ws://localhost:5000');
