"use client";
import styles from "../queue.module.css";
import SongDisplay from "./songDisplay";
import { useSession } from "next-auth/react";
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { useEffect, useState } from "react";
import QueueForm from "./QueueForm";

interface SuccessfulResponse {
  message: string;
  room: string;
  queue: QueueTrack[]
}

interface VoteProps {
  socket: any;
  queue: QueueTrack[];
  setQueue: React.Dispatch<React.SetStateAction<QueueTrack[]>>;
  queueRoom: string
  setQueueRoom: React.Dispatch<React.SetStateAction<string>>
}

export default function Vote(props: VoteProps) {
  const { socket, queue, setQueue, queueRoom, setQueueRoom } = props;
  const session = useSession();
  const [animationParent] = useAutoAnimate()
  const [animationToggle, setAnimation] = useState<boolean>(false)
  const [isHost, setIsHost] = useState(false)
  const [queueForm, setQueueForm] = useState("")

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
            queueRoom={queueRoom}
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
            setQueueForm('Create')
          }}
        >
          Create Queue
        </button>
        <button
         disabled={queueRoom}
         className={!queueRoom ? styles.queueButton : styles.queueButtonO}
          onClick={() => {
            setQueueForm('Join')
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
              queueRoom,
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
      {queueForm && <QueueForm session={session} queueForm={queueForm} setQueueForm={setQueueForm} queue={queue} setQueue={setQueue} socket={socket} setQueueRoom={setQueueRoom}></QueueForm>}
    </div>
  );
}
