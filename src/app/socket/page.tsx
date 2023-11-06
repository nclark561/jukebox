"use client";
import { useState } from "react";
import { io } from "socket.io-client";
import { Track } from "@spotify/web-api-ts-sdk";
import SongDisplay from "./songDisplay";

const socket = io("http://localhost:5678");

interface Vote {
  voted: string;
  user: string;
}

interface QueueTrack extends Partial<Track> {
  votes: Vote[];
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
    { name: "Even if she falls", votes: [{voted: 'upvoted', user: 'noah'}, {voted: 'upvoted', user: 'kale'}] },
    { name: "Old pine", votes: [{voted: 'downvoted', user: 'noah'}, {voted: 'upvoted', user: 'kale'}] },
    { name: "Landmines", votes: [{voted: 'downvoted', user: 'noah'}, {voted: 'downvoted', user: 'kale'}] },
    { name: "All apologies", votes: [{voted: 'upvoted', user: 'noah'}] },
    { name: "Tremors", votes: [{voted: 'downvoted', user: 'noah'}] },
  ]);

  socket.on("connect", () => {
    console.log(socket.id);
  });
  return (
    <div>
      {queue
        .map((song) => (
          <SongDisplay key={song.name} song={song} socket={socket} setQueue={setQueue}/>
        ))}
      <div className="flex flex-col">
        <button
          onClick={() => {
            socket.emit("create-queue", "queue-room-1979", queue, (response: SuccessfulResponse | ErrorResponse) => {
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
