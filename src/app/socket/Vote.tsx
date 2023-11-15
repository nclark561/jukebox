"use client";
import styles from "../queue.module.css";
import SongDisplay from "./songDisplay";
import { useSession } from "next-auth/react";

interface SuccessfulResponse {
  message: string;
  room: string;
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
        {queue.map((song) => (
          <SongDisplay
            key={song.id}
            song={song}
            socket={socket}
            setQueue={setQueue}
          />
        ))}
      </div>
      <div className="flex space-ev">
        <button
          className={styles.queueButton}
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
                    if ("room" in response)
                      localStorage.setItem("room", response.room);
                  }                  
                );
              }
            }
          }}
        >
          Create Queue
        </button>
        <button
          className={styles.queueButton}
          onClick={() => {
            socket.emit(
              "join-queue",
              "queue-room-1979",
              (response: SuccessfulResponse) => {
                console.log(response.message);
              }
            );
          }}
        >
          Join Queue
        </button>
        <button
          className={styles.queueButton}
          onClick={() => {
            socket.emit(
              "delete-queue",
              "queue-room-1979",
              (response: Partial<SuccessfulResponse>) => {
                console.log(response);
              }
            );
            localStorage.clear();
          }}
        >
          End Queue
        </button>
      </div>
    </div>
  );
}
