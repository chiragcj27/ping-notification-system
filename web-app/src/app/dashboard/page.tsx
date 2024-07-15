"use client";
import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { HoverCard } from "@/components/HoverCard";
import { useToast } from "@/components/ui/use-toast";

const WebSocketComponent = () => {
  const { data: session } = useSession();
  const ws = useRef<WebSocket | null>(null);
  const [connectedUsers, setConnectedUsers] = useState<
    { userId: string; email: string; name: string }[]
  >([]);
  const { toast } = useToast();

  useEffect(() => {
    if (session) {
      const connectWebSocket = () => {
        ws.current = new WebSocket("ws://localhost:8080");

        ws.current.onopen = () => {
          console.log("Connected to WebSocket server");
          const userInfo = {
            type: "USER_INFO",
            email: session.user?.email,
            name: session.user?.name,
          };
          ws.current?.send(JSON.stringify(userInfo));
        };

        ws.current.onmessage = (event) => {
          const message = JSON.parse(event.data);
          switch (message.type) {
            case "USER_JOINED":
              handleUserJoined(message);
              break;
            case "USER_LEFT":
              handleUserLeft(message);
              break;
            case "CONNECTED_USERS":
              handleConnectedUsers(message);
              break;
            case "PING":
              handlePing(message);
              break;
            case "BROADCAST":
              handleBroadcast(message);
              break;
            case "ERROR":
              console.error("Error:", message.message);
              break;
            default:
              console.log("Unknown message type:", message.type);
              break;
          }
        };

        ws.current.onclose = () => {
          console.log("Disconnected from WebSocket server");
          setTimeout(connectWebSocket, 1000);
        };
      };

      connectWebSocket();

      return () => {
        ws.current?.close();
      };
    }
  }, [session]);

  const handleUserJoined = (message: any) => {
    setConnectedUsers((prevUsers) => {
      const userExists = prevUsers.some(
        (user) => user.userId === message.userId
      );
      if (!userExists) {
        return [
          ...prevUsers,
          {
            userId: message.userId,
            email: message.email,
            name: message.name,
          },
        ];
      }
      return prevUsers;
    });
  };

  const handleUserLeft = (message: any) => {
    setConnectedUsers((prevUsers) =>
      prevUsers.filter((user) => user.userId !== message.userId)
    );
  };

  const handleConnectedUsers = (message: any) => {
    setConnectedUsers(message.users);
  };

  const handlePing = (message: any) => {
    toast({
      title: `From : ${message.from.email}`,
      description: `${message.message}`,
    });
  };

  const handlePingClick = (receiverId: string) => {
    const pingData = {
      type: "PING",
      receiverId,
      message: `You got Pinged by ${session?.user?.name} !`,
    };
    ws.current?.send(JSON.stringify(pingData));
  };

  const handleCustomPing = (receiverId: string, message: string) => {
    const pingData = {
      type: "PING",
      receiverId,
      message: message
    }
    ws.current?.send(JSON.stringify(pingData));
  }

  const handleBroadcast = (message: any) => {
    toast({
      title: `From : ${message.from.email}`,
      description: `${message.message}`,
    });
  };

  const handleBroadcastClick = () => {
    const broadcastMsg = {
      type: "BROADCAST",
      message: `Ping Broadcasted to all by ${session?.user?.name}`,
    };
    ws.current?.send(JSON.stringify(broadcastMsg));
  };

  return (
    <div>
      <div>
        <HoverCard items={connectedUsers} handlePing={handlePingClick} handleCustomMessage={handleCustomPing}/>
      </div>
      <div className="flex justify-center mb-20 z-10 absolute inset-x-0 bottom-0">
        <button onClick={handleBroadcastClick} className="p-[3px] relative">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
          <div className="px-8 py-2  bg-black rounded-[6px]  relative group transition duration-200 text-white hover:bg-transparent">
            Ping To All
          </div>
        </button>
      </div>
    </div>
  );
};

export default WebSocketComponent;
