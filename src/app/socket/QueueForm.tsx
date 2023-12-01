"use client";
import { useState } from "react";

interface SuccessfulResponse {
  message: string;
  room: string;
  queue: QueueTrack[];
}

interface ErrorResponse {
  errorMsg: string;
}

interface QueueFormProps {
  socket: any;
  queue: QueueTrack[];
  setQueue: React.Dispatch<React.SetStateAction<QueueTrack[]>>;
  setQueueRoom: React.Dispatch<React.SetStateAction<string>>;
  queueForm: string;
  setQueueForm: React.Dispatch<React.SetStateAction<string>>;
  session: any;
}

export default function QueueForm({
  socket,
  queue,
  setQueue,
  setQueueRoom,
  queueForm,
  setQueueForm,
  session,
}: QueueFormProps) {
  const [roomInput, setRoomInput] = useState("");

  const handleSumbit = (queueForm: string) => {
    if (queueForm === "Create") {
      if (session.data?.user) {
        if ("accessToken" in session.data?.user) {
          socket.emit(
            "create-queue",
            roomInput,
            queue,
            session.data?.user?.accessToken,
            (response: SuccessfulResponse | ErrorResponse) => {
              console.log(response);
              if ("errorMsg" in response) alert(response.errorMsg);
              if ("room" in response) {
                localStorage.setItem("room", response.room);
                localStorage.setItem("host", "true");
                setQueueRoom(response.room);
                setQueueForm("");
              }
            }
          );
        }
      }
    } else if (queueForm === "Join") {
      socket.emit("join-queue", roomInput, (response: SuccessfulResponse) => {
        console.log(response.message);
        setQueue(response.queue);
        localStorage.setItem("room", response.room);
        setQueueRoom(response.room);
        setQueueForm("");
      });
    } else {
      alert("issue with queue");
      setQueueForm("");
    }
  };

  return (
    <div className="fixed top-0 left-0 w-[100vw] h-[100vh] flex justify-center items-center backdrop-blur-md">
      <form
        className="flex flex-col relative p-4 bg-gray-600"
        onSubmit={(e) => {
          e.preventDefault();
          handleSumbit(queueForm);
        }}
      >
        <input
          className="mt-[15px] text-black"
          name="room-name"
          placeholder="Queue Name"
          onChange={(e) => setRoomInput(e.target.value)}
          value={roomInput}
        ></input>
        <button type="submit">{`${queueForm} Queue`}</button>
        <p
          className="absolute top-[7px] right-[15px] text-lg cursor-pointer"
          onClick={() => setQueueForm("")}
        >
          X
        </p>
      </form>
    </div>
  );
}
