//Importar módulos
const { WebSocketServer } = require("ws"); 
const dotenv = require("dotenv");

//Configuração dp servidor
dotenv.config();
const wss = new WebSocketServer({ port: process.env.PORT || 5000 });

//Tratamento da conexão
wss.on("connection", ws => {
  ws.on("error", console.error);
  ws.on("message", (data) => {
    wss.clients.forEach((client) => client.send(data.toString()));
  });
  console.log("client connected")
});

node server.js
