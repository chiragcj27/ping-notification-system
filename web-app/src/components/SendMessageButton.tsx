"use client"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { FiMessageSquare } from "react-icons/fi";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "./ui/button";
import { FiSend } from "react-icons/fi"; 
import { useState } from "react";

interface SendMessageButtonProps {
  onSend: (message: string) => void;
}

export default function SendMessageButton({onSend}: SendMessageButtonProps) {
  const [message, setMessage] = useState<string>("");

  const handleSend = () => {
    onSend(message);
    setMessage("");
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline"><FiMessageSquare/></Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Ping custom message</DialogTitle>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Label className="sr-only">
              Message
            </Label>
            <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter Your Message"
            />
          </div>
          <Button onClick= {handleSend} type="submit" className="px-3">
            <FiSend/>
          </Button>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
