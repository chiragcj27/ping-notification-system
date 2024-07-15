import { WebSocketProvider } from "@/context/WebSocketProvider";
import UserList from "@/components/UserList";
import BroadcastButton from "@/components/BroadcastButton";

const WebSocketComponent = () => {
  return (
    <WebSocketProvider>
      <div>
        <UserList />
        <BroadcastButton />
      </div>
    </WebSocketProvider>
  );
};

export default WebSocketComponent;
