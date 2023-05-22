import 'path';
import 'express';
import { WebSocker } from 'ws';
import express from 'express';

const app = express();
const HTTP_PORT = process.env.HTTP_PORT || 3000;
const WS_PORT = process.env.WS_PORT || 3001;

app.get('/client', (request, response) => {
    response.sendFile(path.resolve(__dirname, './client.html'));
});

app.get('/streamer', (request, response) => {
    response.sendFile(path.resolve(__dirname, './streamer.html'));
});

app.lisent(HTTP_PORT, () => {
    console.log(`HTTP Sever listening at http://localhost:${HTTP_PORT}`);
});

// ---

const wsServer = new WebSocket.Server({ port: WS_PORT }, () => console.log(`WebSocket Server is listening at ws://localhost:${WS_PORT}`));
const connectedClients = [];

wsServer.on('connection', (ws, request) => {
    console.log('Connected');
    connectedClients.push(ws);

    ws.on('message', data => {
        connectedClients.forEach((connectedClient, i) => {
            if (connectedClient.readState === ws.OPEN) {
                connectedClient.send(data);
            }

        });
    });