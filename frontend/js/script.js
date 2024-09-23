// login elements
const login = document.querySelector(".login");
const loginForm = login.querySelector(".login__form");
const loginInput = login.querySelector(".login__input");

// chat elements
const chat = document.querySelector(".chat");
const chatForm = chat.querySelector(".chat__form");
const chatInput = chat.querySelector(".chat__input");
const chatMessages = chat.querySelector(".chat__messages");

// objeto de cores
const colors = [
  "cadetblue",
  "darkgoldenrod",
  "blue",
  "cornflowerblue",
  "darkkhaki",
  "hotpink",
  "gold"
];

// variavel de dados do usuario
const user = { id: "", name: "", color: "" };

let websocket;

// função para criar elementos de mensagem do usuário
const createMessageSelfElement = (content) => {
  const div = document.createElement("div");
  div.classList.add("message--self");
  div.innerHTML = content;
  return div;
};

// função para criar elementos de mensagem de outros usuários
const createMessageOtherElement = (content, sender, senderColor) => {
  const div = document.createElement("div");
  const span = document.createElement("span");

  div.classList.add("message--other");
  span.classList.add("message--sender");
  span.style.color = senderColor;

  span.innerHTML = sender;
  div.innerHTML += content;
  div.appendChild(span);

  return div;
};

// função para rolar a tela para baixo
const scrollScreen = () => {
  window.scrollTo({
    top: document.body.scrollHeight,
    behavior: "smooth"
  });
};

// pega cor aleatória do objeto acima
const getRandomColor = () => {
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
};

// processa as mensagens recebidas do servidor
const processMessage = ({ data }) => {
  const { userId, userName, userColor, content } = JSON.parse(data);
  const message = userId === user.id
    ? createMessageSelfElement(content)
    : createMessageOtherElement(content, userName, userColor);

  chatMessages.appendChild(message);
  scrollScreen();
};

// Lida com o login do usuário
const handleLogin = (event) => {
  event.preventDefault();

  user.id = crypto.randomUUID();
  user.name = loginInput.value;
  user.color = getRandomColor();

  login.style.display = "none";
  chat.style.display = "flex";

  // Conecta ao WebSocket do servidor
  websocket = new WebSocket("ws://localhost:5000");

  websocket.onmessage = processMessage;
};

// Envia mensagens para o servidor
const sendMessage = (event) => {
  event.preventDefault();
  const message = {
    userId: user.id,
    userName: user.name,
    userColor: user.color,
    content: chatInput.value
  };

  websocket.send(JSON.stringify(message));
  chatInput.value = ""; // Limpa o campo de entrada
};

// Adiciona ouvintes de eventos
loginForm.addEventListener("submit", handleLogin);
chatForm.addEventListener("submit", sendMessage);
