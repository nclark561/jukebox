"use client";
import { useEffect, useState } from "react";
import styles from "./queue.module.css";
import Image from "next/image";
import { count } from "console";

interface RemoteProps {
  session: any;
  socket: any;
  setQueue: React.Dispatch<React.SetStateAction<QueueTrack[]>>;
}

export default function Remote({ session, socket, setQueue }: RemoteProps) {
  const [device, setDevice] = useState();
  const [play, setPlay] = useState(true);
  const [queueT, setQueueT] = useState(false);
  const [percent, setPercent] = useState<number>(0);
  const [current, setCurrent] = useState<any>();
  const [counter, setCounter] = useState<number>(0);
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

  useEffect(() => {
    var data = localStorage.getItem("song")
    if (data !== null) {
      setCurrent(JSON.parse(data))
    }
  }, [])

  function loader() {
    let number = 0

    setInterval(() => {
      if (percent === 100) {
        clearInterval()
      }
      number = number + 1
      setCounter(number * 1000)
      console.log('working')
      // adder()        
    }, 1000)
    // return clearInterval()
  }
  useEffect(() => {
    let info = counter / current?.duration_ms
    console.log(info, "this is the decimal percent")
    console.log(info * 100, "this is the Full Percent")
    setPercent(info * 100)
  }, [counter])
  return (
    <div className={styles.playContainer}>
      <div style={{ display: "flex", width: "25%", justifyContent: "space-evenly" }}>
        {current && (
          <>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
              <Image src={`${current?.album?.images[0]?.url}`} alt="current-song" width={50} height={50}></Image>
            </div>
            <div className={styles.center}>
              <div style={{ width: "250px" }} className={styles.songTitleSmall}>{current?.name}</div>
              <div className={styles.miniTitle}>{current?.album?.name}</div>
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
        <button onClick={() => { loader() }} style={{ padding: "5px", backgroundColor: "white" }}>kale</button>
        <div style={{ marginTop: "10px" }} className="w-80 bg-gray-200 rounded-full h-1 mb-4 dark:bg-gray-700">
          <div className="bg-blue-600 h-1 rounded-full dark:bg-blue-500" style={{ width: `${percent}%` }}></div>
        </div>
      </div>
      <div style={{ width: "200px" }}></div>
    </div>
  );
}
