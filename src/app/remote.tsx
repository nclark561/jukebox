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
  const [current, setCurrent] = useState<any>();
  // useEffect(() => {
  //   const room = localStorage.getItem("room")
  //   if (room) {
  //     socket.emit("get-status", room, (response: any) => {
  //       setPlay(!response.isPlaying)
  //     })
  //   }
  // }, []);

  socket.on("queue-sent", ({ queue, currPlaying }: {queue: QueueTrack[], currPlaying: QueueTrack}) => {
    setCurrent(currPlaying)
  })

  return (
    <div className={styles.playContainer}>
      <div style={{ display: "flex", width: "18%", justifyContent: "space-evenly" }}>
        {current && (
          <>
            <div>
              <Image src={`${current?.album?.images[0]?.url}`} alt="current-song" width={50} height={50}></Image>
            </div>
            <div>
              <div className={styles.songTitleSmall}>{current?.name}</div>
              <div className={styles.miniTitle}>{current?.album.name}</div>
            </div>
          </>
        )}
      </div>
      <div className={styles.column}>
        <div style={{ display: "flex" }}>
          <Image src={"/leftArrow.png"} alt={"left arrow"} height={50} width={50} />
          {play ? (
            <Image
              onClick={() => {
                console.log('successs mother fucker')
                const room = localStorage.getItem("room");
                socket.emit("play-queue", room, (response: any) => {
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
        <div style={{marginTop:"10px"}} className="w-80 bg-gray-200 rounded-full h-1 mb-4 dark:bg-gray-700">
          <div className="bg-blue-600 h-1 rounded-full dark:bg-blue-500" style={{ width: `${10}%` }}></div>
        </div>
      </div>
      <div style={{ width: "200px" }}></div>
    </div>
  );
}
