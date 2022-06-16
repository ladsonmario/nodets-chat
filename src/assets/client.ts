const socket = io("http://localhost:5000");

let userList: string[] = [];
let username: string = '';

let loginPage = document.querySelector('#login-page') as HTMLElement;
let chatPage = document.querySelector('#chat-page') as HTMLElement;

let loginInput = document.querySelector('#login-name-input') as HTMLInputElement;
let textInput = document.querySelector('#chat-text-input') as HTMLInputElement;

loginPage.style.display = 'flex';
chatPage.style.display = 'none';

const renderUserList = () => {    
    let ul = document.querySelector('.user-list') as HTMLElement;
    
    ul.innerHTML = '';
    userList.forEach((i: string) => {
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
            if(username == user) {
                ul.innerHTML += `<li class="m-text"><span class="me">${user}</span> ${msg}</li>`;
            } else {
                ul.innerHTML += `<li class="m-text"><span>${user}</span> ${msg}</li>`;
            }
            break;
    }

    ul.scrollTop = ul.scrollHeight; // a message scroll down
}

loginInput.addEventListener('keyup', (event: KeyboardEvent) => {
    if(event.keyCode === 13) {
        let name = loginInput.value.trim();
        
        if(name != '') {
            username = name;            
            document.title = `Chat (${username})`;

            socket.emit('join-request', username);

            loginInput.value = '';
        }
    }
});

textInput.addEventListener('keyup', (event: KeyboardEvent) => {
    if(event.keyCode === 13) {
        let text = textInput.value.trim();

        if(text != '') {
            addMessage('msg', username, text);
            socket.emit('send-msg', text);            

            textInput.value = '';
        }        
    }
});

socket.on('user-ok', (list: string[]) => {
    loginPage.style.display = 'none';
    chatPage.style.display = 'flex';
    textInput.focus();

    // addMessage('status', null, 'Connected!');

    userList = list;
    renderUserList();    
});

socket.on('user-error', (username: string) => {
    window.alert(`The name ${username} already exists`);
});

socket.on('list-update', (data: any) => {
    if(data.joined) {
        addMessage('status', null, `${data.joined} came into the room.`);
    }
    if(data.left) {
        addMessage('status', null, `${data.left} went out in the room.`);
    }

    userList = data.list;
    renderUserList();
});

socket.on('show-msg', (data: any) => {
    addMessage('msg', data.username, data.message);
});

// connection problem
socket.on('disconnect', () => {
    addMessage('status', null, 'You have been disconnected!');
    userList = [];
    renderUserList();
});

socket.on('connect_error', () => {
    addMessage('status', null, 'Reconnection attempt...');
});

socket.on('connect', () => {
    addMessage('status', null, 'Connected!');
    
    if(username != '') {
        socket.emit('join-request', username);
    }
});