console.log("chatbot.js loaded"); // VERY IMPORTANT

const input = document.getElementById("messageInput");
const chat = document.getElementById("chat");
const sendBtn = document.getElementById("sendBtn");

sendBtn.addEventListener("click", sendMessage);
input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") sendMessage();
});

function sendMessage() {
    const msg = input.value.trim();
    if (!msg) return;

    chat.innerHTML += `<div class="msg user">${msg}</div>`;
    input.value = "";

    fetch(" http://127.0.0.1:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg })
    })
    .then(res => res.json())
    .then(data => {
        chat.innerHTML += `<div class="msg doctor">${data.reply}</div>`;
        chat.scrollTop = chat.scrollHeight;
    })
    .catch(() => {
        chat.innerHTML += `<div class="msg doctor">Server error</div>`;
    });
}
