
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import RandomAvatar from "./randomAvatar"; 
import SendMessageButton from "./SendMessageButton";
import { Button } from "./ui/button";

export const HoverCard = ({
  items,
  className,
  handlePing,
  handleCustomMessage
}: {
  items: {
    name: string;
    email: string;
    userId: string;
  }[];
  className?: string;
  handlePing: (userId: string) => void;
  handleCustomMessage : (userId: string, message: string) => void;
  
}) => {
  let [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [message, setMessage] = useState<string>("");

  const handleValueChange = (newValue : string) => {
    setMessage(newValue);
  }

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 py-10",
        className
      )}
    >
      {items.map((item, idx) => (
        <div
          key={idx}
          className="relative group block p-2 h-full w-full"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                className="absolute inset-0 h-full w-full bg-neutral-200 dark:bg-slate-800/[0.8] block rounded-3xl"
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.15 },
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.15, delay: 0.2 },
                }}
              />
            )}
          </AnimatePresence>
          <Card>
            <div className="flex justify-between">
              <div className="mt-2">
                <p className="font-bold text-2xl text-zinc-100">{item.name}</p>
                <p className="text-sm text-zinc-400">Email: {item.email}</p>
                <p className="text-sm text-zinc-400">User ID: {item.userId}</p>
              </div>
              <RandomAvatar userId={item.userId} />
            </div>
            <div className="mt-4 flex justify-between">
              <Button onClick={() => handlePing(item.userId)} className="px-4 py-2">
                Ping
              </Button>
              <SendMessageButton onSend={(message: string) => handleCustomMessage(item.userId, message)}/>
            </div>
          </Card>
        </div>
      ))}
    </div>
  );
};

export const Card = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "rounded-2xl h-full w-full p-4 overflow-hidden bg-black border border-transparent dark:border-white/[0.2] group-hover:border-slate-700 relative z-20",
        className
      )}
    >
      <div className="relative z-50">
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};
