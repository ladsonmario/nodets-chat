import dotenv from 'dotenv';
import { io } from "socket.io-client";

dotenv.config();

const socket = io(process.env.BASE as string);

let userList: string[] = [];
let userName: string = '';

const loginPage = document.querySelector('#login-page') as HTMLElement;
const chatPage = document.querySelector('#chat-page') as HTMLElement;

const loginInput = document.querySelector('#login-name-input') as HTMLInputElement;
const textInput = document.querySelector('#chat-text-input') as HTMLInputElement;

loginPage.style.display = 'flex';
chatPage.style.display = 'none';

loginInput.addEventListener('keyup', (event) => {
    if(event.keyCode === 13) {
        let name = loginInput.value.trim();
        
        if(name != '') {
            userName = name;            
            document.title = `Chat (${userName})`;

            socket.emit('join-request', userName);
        }
    }
});

textInput.addEventListener('keyup', (event) => {
    if(event.keyCode === 13) {
        let text = textInput.value.trim();

        if(text != '') {
            addMessage('msg', userName, text);
            socket.emit('send-msg', text);
        }
    }
});

socket.on('user-ok', (list) => {
    loginPage.style.display = 'none';
    chatPage.style.display = 'flex';
    textInput.focus();

    addMessage('status', null, 'Connected!');   

    userList = list;
    renderUserList();
});

socket.on('list-update', (data) => {
    if(data.joined) {
        addMessage('status', null, `${data.joined} came into the room.`);
    }
    if(data.left) {
        addMessage('status', null, `${data.left} went out in the room.`);
    }

    userList = data.list;
    renderUserList();
});

socket.on('show-msg', (data) => {
    addMessage('msg', data.username, data.message);
});

const renderUserList = () => {    
    let ul = document.querySelector('.user-list') as HTMLElement;
    
    ul.innerHTML = '';
    userList.forEach(i => {
        ul.innerHTML += `<li>${i}</li>`;
    });
}

const addMessage = (type: string | null, user: string | null, msg: string | null) => {
    let ul = document.querySelector('.chat-list') as HTMLElement;

    switch(type) {
        case 'status':
            ul.innerHTML += `<li class="m-status">${msg}</li>`;
            break;
        case 'msg':
            if(userName == user)
                ul.innerHTML += `<li class="m-text"><span class="me">${user}</span> ${msg}</li>`;
            else {
                ul.innerHTML += `<li class="m-text"><span>${user}</span> ${msg}</li>`;
            }
            break;
    }

    ul.scrollTop = ul.scrollHeight; // a message scroll down
}

// connection problem
socket.on('disconnect', () => {
    addMessage('status', null, 'You have been disconnected!');
    userList = [];
    renderUserList();
});

socket.on('reconnect_error', () => {
    addMessage('status', null, 'Reconnection attempt...');
});

socket.on('reconnect', () => {
    addMessage('status', null, 'Reconnected!');

    if(loginInput.value != '') {
        socket.emit('join-request', loginInput.value);
    }
});