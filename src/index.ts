// Imports
import express from 'express';
import http from 'http';
import socketio from 'socket.io';
import dotenv from 'dotenv';
import Session from './classes/Session';

dotenv.config();

// Server
const app = express();
const server = http.createServer(app);
const io = new socketio.Server(server);

let activeSessions: Session[] = [];

// Listening for incoming connections on the socket
io.on('connection', (socket) => {
    activeSessions.push(new Session(socket.id, socket));

    socket.on('disconnect', (id) => {
        console.log(`[${id}] Client disconnected`);
        activeSessions = activeSessions.filter(s => s.id !== socket.id)
    })
});

// Start webserver
server.listen(process.env.PORT, () => {
    console.log(`Webserver started on port ${process.env.PORT}`);
});

export function getSocketsWithServerId(id: number) {
    return activeSessions.filter(s => s.server === id);
}