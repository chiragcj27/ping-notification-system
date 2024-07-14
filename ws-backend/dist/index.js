"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ws_1 = require("ws");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const port = 8080;
app.use((0, cors_1.default)());
const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
const wss = new ws_1.WebSocketServer({ server });
const clients = [];
wss.on('connection', (ws) => {
    const id = `${Date.now()}${Math.random()}`;
    console.log(ws);
    const client = { id, ws };
    clients.push(client);
    ws.on('message', (message) => {
        const parsedMessage = JSON.parse(message);
        if (parsedMessage.type === 'ping') {
            const targetClient = clients.find(c => c.id === parsedMessage.targetId);
            if (targetClient) {
                targetClient.ws.send(JSON.stringify({ type: 'ping', from: id }));
            }
        }
        else if (parsedMessage.type === 'broadcast') {
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
