import express from "express";
import http from 'http';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import { Server as socketIO  } from 'socket.io';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new socketIO(server);

server.listen(process.env.PORT, () => {
    console.log(`Running Address: ${process.env.BASE}`);
});

app.use(express.static(path.join(__dirname, '../public')));
app.use(cors());

let connectedUsers: string[] = [];

io.on('connection', (socket: any) => {
    console.log('Detected connection...');
    
    socket.on('join-request', (username: any)=> {
        username.socket = username;
        connectedUsers.push(username);
        console.log(`Connected Users: ${connectedUsers}`);

        socket.emit('user-ok', connectedUsers);

        socket.broadcast.emit('list-update', {
            joined: username,
            list: connectedUsers        
        });
    });

    socket.on('disconnect', () => {
        connectedUsers = connectedUsers.filter(u => u != socket.username);

        socket.broadcast.emit('list-update', {
            left: socket.username,
            list: connectedUsers
        });
    });

    socket.on('show-msg', (text: string) => {
        let obj = {
            username: socket.username,
            message: text
        };

        socket.broadcast.emit('show-msg', obj);
    });

});