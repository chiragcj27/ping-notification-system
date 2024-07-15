"use client"
import { useWebSocket } from "@/context/WebSocketProvider";
import { HoverCard } from "@/components/HoverCard";

const UserList = () => {
  const { connectedUsers, ws, session } = useWebSocket();

  const handlePingClick = (receiverId: string) => {
    const pingData = {
      type: "PING",
      receiverId,
      message: `You got Pinged by ${session?.user?.name}!`,
    };
    ws.current?.send(JSON.stringify(pingData));
  };

  const handleCustomPing = (receiverId: string, message: string) => {
    const pingData = {
      type: "PING",
      receiverId,
      message: message,
    };
    ws.current?.send(JSON.stringify(pingData));
  };

  return (
    <div>
      <HoverCard items={connectedUsers} handlePing={handlePingClick} handleCustomMessage={handleCustomPing}/>
    </div>
  );
};

export default UserList;
