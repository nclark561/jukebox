"use client";
import { useState } from "react";
import { io } from "socket.io-client";
import { Track } from "@spotify/web-api-ts-sdk";
import SongDisplay from "./songDisplay";

const socket = io("http://localhost:5678");

interface QueueTrack extends Partial<Track> {
  votes: number;
}

interface SuccessfulResponse {
  message: string;
  queue: QueueTrack[];
}

interface ErrorResponse {
  errorMsg: string;
}

export default function page() {
  const [queue, setQueue] = useState<QueueTrack[]>([
    { name: "Even if she falls", votes: 0 },
    { name: "Old pine", votes: 0 },
    { name: "Landmines", votes: 0 },
    { name: "All apologies", votes: 0 },
    { name: "Tremors", votes: 0 },
  ]);

  socket.on("connect", () => {
    console.log(socket.id);
  });
  return (
    <div>
      {queue
        .sort((a, b) => b.votes - a.votes)
        .map((song, index) => (
          <SongDisplay key={index} song={song} />
        ))}
      <div className="flex space-ev">
        <button
          onClick={() => {
            socket.emit("create-queue", "queue-room-1979", (response: SuccessfulResponse | ErrorResponse) => {
              console.log(response);
              if ("errorMsg" in response) alert(response.errorMsg)
            });
          }}
        >
          Create Queue
        </button>
        <button onClick={() => {
          socket.emit("join-queue", "queue-room-1979", (response: SuccessfulResponse) => {
            console.log(response.message)
          })
        }}>Join Queue</button>
        <button onClick={() => {
          socket.emit("delete-queue", "queue-room-1979", (response: Partial<SuccessfulResponse>) => {
            console.log(response)
          })
        }}>End Queue</button>
      </div>
    </div>
  );
}
