import { useWebSocket } from "@/context/WebSocketProvider";

const BroadcastButton = () => {
  const { ws, session } = useWebSocket();

  const handleBroadcastClick = () => {
    const broadcastMsg = {
      type: "BROADCAST",
      message: `Ping Broadcasted to all by ${session?.user?.name}`,
    };
    ws.current?.send(JSON.stringify(broadcastMsg));
  };

  return (
    <div className="flex justify-center mb-20 z-10 absolute inset-x-0 bottom-0">
      <button onClick={handleBroadcastClick} className="p-[3px] relative">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
        <div className="px-8 py-2 bg-black rounded-[6px] relative group transition duration-200 text-white hover:bg-transparent">
          Ping To All
        </div>
      </button>
    </div>
  );
};

export default BroadcastButton;
