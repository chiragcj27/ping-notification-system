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
    console.log(`Server is running on http://localhost:${port}`);
});
const wss = new ws_1.WebSocketServer({ server });
const Users = {};
wss.on("connection", (socket) => {
    let currentUser = null;
    socket.on("message", (data) => {
        const parsedMessage = JSON.parse(data);
        if (parsedMessage.type === "USER_INFO") {
            const existingUser = Object.values(Users).find((user) => user.email === parsedMessage.email);
            if (existingUser) {
                currentUser = existingUser;
                currentUser.ws = socket;
            }
            else {
                const userId = generateUniqueId();
                currentUser = {
                    id: userId,
                    ws: socket,
                    email: parsedMessage.email,
                    name: parsedMessage.name,
                };
                Users[userId] = currentUser;
                broadcastMessage({
                    type: "USER_JOINED",
                    userId,
                    email: parsedMessage.email,
                    name: parsedMessage.name,
                });
            }
            sendConnectedUsersList(socket, currentUser.id);
        }
        if (parsedMessage.type === "PING") {
            const receiverId = parsedMessage.receiverId;
            const message = parsedMessage.message;
            const receiver = Users[receiverId];
            if (receiver) {
                receiver.ws.send(JSON.stringify({
                    type: "PING",
                    message,
                    from: { userId: currentUser.id, name: currentUser.name, email: currentUser.email },
                }));
            }
            else {
                socket.send(JSON.stringify({
                    type: "ERROR",
                    message: `User ${receiverId} not found`,
                }));
            }
        }
        if (parsedMessage.type === "BROADCAST") {
            const broadcastMsg = {
                type: "BROADCAST",
                message: parsedMessage.message,
                from: { userId: currentUser.id, name: currentUser.name, email: currentUser.email },
            };
            broadcastMessage(broadcastMsg);
        }
    });
    socket.on("close", () => {
        if (currentUser) {
            broadcastMessage({
                type: "USER_LEFT",
                userId: currentUser.id,
            });
            delete Users[currentUser.id];
        }
    });
});
function generateUniqueId() {
    return Math.random().toString(36).substr(2, 9);
}
function broadcastMessage(message) {
    Object.values(Users).forEach((user) => {
        user.ws.send(JSON.stringify(message));
    });
}
function sendConnectedUsersList(socket, currentUserId) {
    const connectedUsers = Object.values(Users)
        .filter((user) => user.id !== currentUserId)
        .map((user) => ({
        userId: user.id,
        email: user.email,
        name: user.name,
    }));
    socket.send(JSON.stringify({ type: "CONNECTED_USERS", users: connectedUsers }));
}
