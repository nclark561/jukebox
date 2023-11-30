"use client";
import styles from "../queue.module.css";
import SongDisplay from "./songDisplay";
import { useSession } from "next-auth/react";
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { useEffect, useState } from "react";

interface SuccessfulResponse {
  message: string;
  room: string;
  queue: QueueTrack[]
}

interface ErrorResponse {
  errorMsg: string;
}

interface VoteProps {
  socket: any;
  queue: QueueTrack[];
  setQueue: React.Dispatch<React.SetStateAction<QueueTrack[]>>;
}

export default function Vote(props: VoteProps) {
  const { socket, queue, setQueue } = props;
  const session = useSession();
  const [animationParent] = useAutoAnimate()
  const [animationToggle, setAnimation] = useState<boolean>(false)
  const [queueRoom, setQueueRoom] = useState("")
  const [isHost, setIsHost] = useState(false)

  useEffect(() => {
    let room = localStorage.getItem("room")
    if (room && room !== "undefined") setQueueRoom(room)
  }, [])

  useEffect(() => {
    let host = localStorage.getItem("host")
    if (host === "true") setIsHost(true)
  }, [queueRoom])

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        flexDirection: "column",
        height: "100%",
        alignItems: "center",
      }}
    >

      <div className={styles.queueContainer}>
        {queueRoom ? queue.map((song) => (
          <SongDisplay
            key={song.id}
            song={song}
            socket={socket}
            setQueue={setQueue}
          />
        )) : (
          <h2 style={{fontSize:"30px"}} className="text-center">Not Currently in a queue!</h2>
        )}
      </div>
      <div style={{ display: "flex", justifyContent: "space-evenly" }}>
        <button
          disabled={queueRoom}
          className={!queueRoom ? styles.queueButton : styles.queueButtonO}
          onClick={() => {
            if (session.data?.user) {
              if ("accessToken" in session.data?.user) {
                socket.emit(
                  "create-queue",
                  "queue-room-1979",
                  queue,
                  session.data?.user?.accessToken,
                  (response: SuccessfulResponse | ErrorResponse) => {
                    console.log(response);
                    if ("errorMsg" in response) alert(response.errorMsg);
                    if ("room" in response) {
                      localStorage.setItem("room", response.room);
                      localStorage.setItem("host", "true")
                      setQueueRoom(response.room)
                    }
                  }
                );
              }
            }
          }}
        >
          Create Queue
        </button>
        <button
         disabled={queueRoom}
         className={!queueRoom ? styles.queueButton : styles.queueButtonO}
          onClick={() => {
            socket.emit(
              "join-queue",
              "queue-room-1979",
              (response: SuccessfulResponse) => {
                console.log(response.message);
                setQueue(response.queue)
                localStorage.setItem("room", response.room);
                setQueueRoom(response.room)
              }
            );
          }}
        >
          Join Queue
        </button>
        <button
          disabled={!isHost}
          className={isHost ? styles.queueButton : styles.queueButtonO}
          onClick={() => {
            socket.emit(
              "delete-queue",
              "queue-room-1979",
              (response: Partial<SuccessfulResponse>) => {
                console.log(response);
                setQueue([])
                localStorage.removeItem("room")
                localStorage.removeItem("host")
                setIsHost(false)
                setQueueRoom("")
              }
            );
            localStorage.removeItem("room")
          }}
        >
          End Queue
        </button>
      </div>
    </div>
  );
}
