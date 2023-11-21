"use client";
import { useEffect, useState } from "react";
import styles from "./queue.module.css";
import Image from "next/image";

interface RemoteProps {
  session: any;
  socket: any;
  setQueue: React.Dispatch<React.SetStateAction<QueueTrack[]>>;
}

export default function Remote({ session, socket, setQueue }: RemoteProps) {
  const [device, setDevice] = useState();
  const [play, setPlay] = useState(true);

  useEffect(() => {
    const room = localStorage.getItem("room")
    if (room) {
      socket.emit("get-status", room, (response: any) => {
        setPlay(!response.isPlaying)
      })
    }
  }, []);

  return (
    <div className={styles.playContainer}>
      <Image src={"/leftArrow.png"} alt={"left arrow"} height={50} width={50} />
      {play ? (
        <Image
          onClick={() => {
            const room = localStorage.getItem("room");
            socket.emit("play-queue", room, (response: any) => {
              console.log(response);
              if ("queue" in response) setQueue(response.queue);
              if ("currPlaying" in response) console.log(response.currPlaying);
            });
            setPlay(!play);
          }}
          src={"/play.png"}
          alt={"left arrow"}
          height={50}
          width={50}
        />
      ) : (
        <Image
          src={"/pause.png"}
          alt={"pause button"}
          onClick={() => {
            const room = localStorage.getItem("room");
            socket.emit("pause-queue", room, (response: any) => {
              console.log(response)
            })
            setPlay(!play);
          }}
          height={50}
          width={50}
        ></Image>
      )}
      <Image
        src={"/rightArrow.png"}
        alt={"right arrow"}
        height={50}
        width={50}
      />
    </div>
  );
}
