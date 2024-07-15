"use client"
import { useWebSocket } from "@/context/WebSocketProvider";
import { HoverCard } from "@/components/HoverCard";
import Image from "next/image";
import alone from "../../public/alone.svg"

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

  const onlineUsers = connectedUsers.length

  if(onlineUsers == 0) {
    return (
      <div className="relative h-screen w-full inset-0 flex flex-col items-center justify-center ">
        <Image className="h-72 w-72" src={alone} alt="All alone" />
        <p>No Other Users, You are all alone !</p>
      </div>
    );
  }

  return (
    <div>
      <HoverCard items={connectedUsers} handlePing={handlePingClick} handleCustomMessage={handleCustomPing}/>
    </div>
  );
};

export default UserList;
