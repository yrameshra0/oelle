import * as path from 'path';
import 'express';
import { WebSocketServer } from 'ws';
import express from 'express';

const app = express();
const HTTP_PORT = process.env.HTTP_PORT || 3000;
const WS_PORT = process.env.WS_PORT || 3001;
const __dirname = path.resolve(path.dirname(''));

app.get('/client', (request, response) => {
    console.log("SENDING CLIENT HTML");
    response.sendFile(path.resolve(__dirname, './client.html'));
});

app.get('/streamer', (request, response) => {
    console.log("SENDING STREAMER HTML");
    response.sendFile(path.resolve(__dirname, './streamer.html'));
});

app.listen(HTTP_PORT, () => {
    console.log(`HTTP Sever listening at http://localhost:${HTTP_PORT}`);
});

// ---

const wsServer = new WebSocketServer({ port: WS_PORT }, () => console.log(`WebSocket Server is listening at ws://localhost:${WS_PORT}`));
const connectedClients = [];

wsServer.on('connection', (ws, request) => {
    console.log('Connected');
    connectedClients.push(ws);

    ws.on('message', data => {
        console.log('DATA MESSAGE RECIEVED');
        connectedClients.forEach((connectedClient, i) => {
            if (connectedClient.readyState === ws.OPEN) {
                connectedClient.send(data);
            } else {
                connectedClients.splice(i, 1);
            }
        });
    });
});