// Get the chat form element from the DOM
const chatForm = document.getElementById("chat-form");

// Establish a connection to the socket.io server
const socket = io(); // Ensure 'io' is defined after loading socket.io.js

// Listen for incoming messages from the server
socket.on("message", (message) => {
  console.log(message);
  outputMessage(message);
});

// Handle form submission event
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const msg = e.target.elements.msg.value;
  console.log(msg);
  socket.emit("chatMessage", msg);
});

// Function to output a message to the chat window
// @param {string} message - The message to be displayed
function outputMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = ` <p class="meta">Mary <span>9:15pm</span></p>
          <p class="text">
            ${message}
          </p> `;
  document.querySelector(".chat-messages").appendChild(div);
}
