// server.js
const WebSocket = require('ws');
const dotenv = require('dotenv');

// Carregar variáveis de ambiente do arquivo .env
dotenv.config();

// Definir a porta do servidor
const PORT = process.env.PORT || 5000;

// Criar um servidor WebSocket
const wss = new WebSocket.Server({ port: PORT });

console.log(`Servidor WebSocket está ouvindo na porta ${PORT}`);

// Gerenciar conexões de clientes
wss.on('connection', (ws) => {
  console.log('Novo cliente conectado');

  // Enviar uma mensagem de boas-vindas ao cliente
  ws.send(JSON.stringify({ content: 'Bem-vindo ao chat!' }));

  // Gerenciar mensagens recebidas dos clientes
  ws.on('message', (message) => {
    console.log(`Mensagem recebida: ${message}`);

    // Reenviar a mensagem para todos os clientes conectados
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  // Gerenciar fechamento da conexão
  ws.on('close', () => {
    console.log('Cliente desconectado');
  });

  // Gerenciar erros
  ws.on('error', (error) => {
    console.error('Erro no WebSocket:', error);
  });
});
