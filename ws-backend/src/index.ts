import express from "express";
import { WebSocketServer, WebSocket } from "ws";
import cors from "cors";

const app = express();
const port = 8080;

app.use(cors());

const server = app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

const wss = new WebSocketServer({ server });

interface User {
  id: string;
  ws: WebSocket;
  email: string;
  name: string;
}

const Users: { [key: string]: User } = {};

wss.on("connection", (socket) => {
  let currentUser: User | null = null;

  socket.on("message", (data: string) => {
    const parsedMessage = JSON.parse(data);

    if (parsedMessage.type === "USER_INFO") {
      const existingUser = Object.values(Users).find(
        (user) => user.email === parsedMessage.email
      );

      if (existingUser) {
        currentUser = existingUser;
        currentUser.ws = socket;
      } else {
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
        receiver.ws.send(
          JSON.stringify({
            type: "PING",
            message,
            from: { userId: currentUser!.id , name: currentUser!.name, email: currentUser!.email},
          })
        );
      } else {
        socket.send(
          JSON.stringify({
            type: "ERROR",
            message: `User ${receiverId} not found`,
          })
        );
      }
    }

    if(parsedMessage.type === "BROADCAST"){
      const broadcastMsg = {
        type: "BROADCAST",
        message: parsedMessage.message,
        from: { userId: currentUser!.id , name: currentUser!.name, email: currentUser!.email},
      }
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

function broadcastMessage(message: object) {
  Object.values(Users).forEach((user) => {
    user.ws.send(JSON.stringify(message));
  });
}

function sendConnectedUsersList(socket: WebSocket, currentUserId: string) {
  const connectedUsers = Object.values(Users)
    .filter((user) => user.id !== currentUserId)
    .map((user) => ({
      userId: user.id,
      email: user.email,
      name: user.name,
    }));
  socket.send(
    JSON.stringify({ type: "CONNECTED_USERS", users: connectedUsers })
  );
}
