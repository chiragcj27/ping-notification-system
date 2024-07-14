import express from 'express';
import { WebSocketServer, WebSocket } from 'ws';
import cors from 'cors';

const app = express();
const port = 8080;

app.use(cors());

const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

const wss = new WebSocketServer({ server });

interface Client {
    id: string;
    ws: WebSocket;
}

const clients: Client[] = [];

wss.on('connection', (ws: WebSocket) => {
    const id = `${Date.now()}${Math.random()}`;
    console.log(ws);
    const client: Client = { id, ws };
    clients.push(client);

    ws.on('message', (message: string) => {
        const parsedMessage = JSON.parse(message);
        if (parsedMessage.type === 'ping') {
            const targetClient = clients.find(c => c.id === parsedMessage.targetId);
            if (targetClient) {
                targetClient.ws.send(JSON.stringify({ type: 'ping', from: id }));
            }
        } else if (parsedMessage.type === 'broadcast') {
            clients.forEach(c => {
                if (c.id !== id) {
                    c.ws.send(JSON.stringify({ type: 'ping', from: id }));
                }
            });
        }
    });

    ws.on('close', () => {
        clients.splice(clients.indexOf(client), 1);
    });

    ws.send(JSON.stringify({ type: 'welcome', id }));
});
