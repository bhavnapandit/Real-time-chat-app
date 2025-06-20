const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const usersList = document.getElementById('users');
//get username
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
})
// Establish a connection to the socket.io server
const socket = io();

socket.emit('joinRoom', { username, room })

socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
})


// Listen for incoming messages from the server
socket.on("message", (message) => {
  console.log(message);
  outputMessage(message);

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Handle form submission event
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const msg = e.target.elements.msg.value;
  console.log(msg);
  socket.emit("chatMessage", msg);

  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});

// Function to output a message to the chat window
// @param {string} message - The message to be displayed
function outputMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = ` <p class="meta">${message.username} <span>${message.time}</span></p>
          <p class="text">
            ${message.text}
          </p> `;
  chatMessages.appendChild(div);

  // Scroll down after adding a new message
  chatMessages.scrollTop = chatMessages.scrollHeight; // Ensure scrolling works
}

function outputRoomName(room) {
  roomName.innerText = room;
}

function outputUsers(users) {
  if (users.length === 0) {
    usersList.innerHTML = '<li></li>';
  } else {
    usersList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}
    `
  }
}