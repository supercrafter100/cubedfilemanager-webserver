// Imports
import express from 'express';
import http from 'http';
import socketio from 'socket.io';
import dotenv from 'dotenv';
import Session from './classes/Session';
import Logger from './classes/Logger';

dotenv.config();

// Server
const app = express();
const server = http.createServer(app);
const io = new socketio.Server(server);

let activeSessions: Session[] = [];

// Listening for incoming connections on the socket
io.on('connection', (socket) => {
    activeSessions.push(new Session(socket.id, socket));

    socket.on('disconnect', (reason) => {
        Logger.socket_error(socket.id, `Client disconnected with reason: ${reason}`)
        activeSessions = activeSessions.filter(s => s.id !== socket.id)
    })
});

// Start webserver
server.listen(process.env.PORT, () => {
    Logger.success(`Webserver started on port ${process.env.PORT}`);
});

export function getSocketsWithServerId(id: number) {
    return activeSessions.filter(s => s.server === id);
}