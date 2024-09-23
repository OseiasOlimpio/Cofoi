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
  "darkhakki",
  "hotpink",
  "gold"
];

//variavel de dados do usuario
const user = { id: "", name: "", color: "" };

let websocket;

const createMessageSelfElement = (content) => {
  const div = document.createElement("div")

  div.classList.add("message--self")
  div.innerHTML = content

  return div
}

const createMessageOtherElement = (content, sender, senderColor) => {
  const div = document.createElement("div")
  const span = document.createElement("span")

  div.classList.add("message--other")
  span.classList.add("message--sender")
  span.style.color = senderColor


  div.appendChild(span)

  span.innerHTML = sender
  div.innerHTML += content

  return div
}

const scrollScreen = () => {
  window.scrollTo({
    top: document.body.scrollHeight,
    behavior: "smooth"}
  )
}

// pega cor aleatória do objeto acima
const getRandomColor = () => {
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
};

const processMessage = ({ data }) => {
  const { userId, userName, userColor, content } = JSON.parse(data)
  const message = userId == user.id ? createMessageSelfElement(content) : createMessageOtherElement(content, userName, userColor)

  chatMessages.appendChild(message)

  scrollScreen()
};

// altera os dados do usuario conforme inserido no input
const handleLogin = (event) => {
  event.preventDefault();

  user.id = crypto.randomUUID();
  user.name = loginInput.value;
  user.color = getRandomColor();

  login.style.display = "none";
  chat.style.display = "flex";

  websocket = new WebSocket("ws://localhost:5000");
  websocket.onerror = (error) => {
  console.error("WebSocket error:", error);
};
  websocket.onmessage = processMessage

};



const sendMessage = (event) => {
  event.preventDefault()
  const message = {
    userId: user.id,
    userName: user.name,
    userColor: user.color,
    content: chatInput.value
  }

  websocket.send(JSON.stringify(message))

  chatInput.value = " "
}



loginForm.addEventListener("submit", handleLogin);
chatForm.addEventListener("submit", sendMessage);
