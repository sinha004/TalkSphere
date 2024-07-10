const socket = io('http://localhost:8000');

const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector(".container");

const append = (message, position)=>{
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
}

const name = prompt("Enter you name");
socket.emit('new-user-joined', name);

form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const message = messageInput.ariaValueMax;
    append(`You: ${message}`, 'right');
    socket.emit('send', message);
})
 
socket.on('user-joined', name=>{
    append(`${name} joined the chat`, 'right');
})

socket.on('receive', data=>{
    append('${data.name}: ${data.message}', 'left')
})