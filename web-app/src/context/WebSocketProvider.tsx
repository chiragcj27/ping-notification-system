/* eslint-disable react-hooks/exhaustive-deps */
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { useToast } from "@/components/ui/use-toast";

const WebSocketContext = createContext<any>(null);

export const useWebSocket = () => useContext(WebSocketContext);

export const WebSocketProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session } = useSession();
  const ws = useRef<WebSocket | null>(null);
  const [connectedUsers, setConnectedUsers] = useState<
    { userId: string; email: string; name: string }[]
  >([]);
  const { toast } = useToast();
  const [isConnecting, setIsConnecting] = useState<boolean>(true);

  useEffect(() => {
    if (session) {
      const connectWebSocket = () => {
        ws.current = new WebSocket("wss://ping-notification-system-aixu.onrender.com");

        ws.current.onopen = () => {
          toast({
            title: `Welcome to PingAlert!`
          })
          const userInfo = {
            type: "USER_INFO",
            email: session.user?.email,
            name: session.user?.name,
          };
         if (ws.current?.readyState === WebSocket.OPEN) {
          ws.current.send(JSON.stringify(userInfo));
        }
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
        setIsConnecting(false);
      };
      setIsConnecting(true);
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

  const handleBroadcast = (message: any) => {
    toast({
        title: `From : ${message.from.email}`,
        description: `${message.message}`,
      });
    };

  return (
    <WebSocketContext.Provider value={{ connectedUsers, ws, session }}>
      {isConnecting ? <div className="relative h-screen w-full inset-0 flex items-center justify-center text-4xl  ">Loading WebSocket connection...</div> : null}
      {children}
    </WebSocketContext.Provider>
  );
};
