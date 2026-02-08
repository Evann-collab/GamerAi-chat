import { ChatLogicJS } from './chatLogic.js';

const username = localStorage.getItem("username");
const language = localStorage.getItem("language");

if (!username || !language) {
  window.location.href = "index.html";
}

const ai = new ChatLogicJS(username, language);

function addMessage(text, type) {
  const chat = document.getElementById("chat");

  const msg = document.createElement("div");
  msg.className = `message ${type}`;
  msg.textContent = text;

  chat.appendChild(msg);
  chat.scrollTop = chat.scrollHeight;
}

window.send = function () {
  const input = document.getElementById("msg");
  const text = input.value.trim();
  if (!text) return;

  addMessage(text, "user");

  const reply = ai.reply(text);

  setTimeout(() => {
    addMessage(reply, "bot");
  }, 300);

  input.value = "";
};