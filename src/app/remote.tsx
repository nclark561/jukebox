"use client";
import { useEffect, useState } from "react";
import styles from "./queue.module.css";
import Image from "next/image";
import { count, debug } from "console";

interface RemoteProps {
  session: any;
  socket: any;
  setQueue: React.Dispatch<React.SetStateAction<QueueTrack[]>>;
}

export default function Remote({ session, socket, setQueue }: RemoteProps) {
  const [play, setPlay] = useState(true);
  const [percent, setPercent] = useState<number>(0);
  const [current, setCurrent] = useState<any>();
  const [progress, setProgress] = useState<any>();
  const [intervalState, setIntervalState] = useState<any>();
  const [counter, setCounter] = useState<number>(0);
  // useEffect(() => {
  //   const room = localStorage.getItem("room")
  //   if (room) {
  //     socket.emit("get-status", room, (response: any) => {
  //       setPlay(!response.isPlaying)
  //     })
  //   }
  // }, []);

  socket.on("queue-sent", ({ currPlaying }: { currPlaying: QueueTrack }) => {
    if (currPlaying) {
      setCurrent(currPlaying)
      localStorage.setItem("song", JSON.stringify(currPlaying))
      setProgress(0)
    } else {
      localStorage.removeItem("song")
    }
  })

  socket.on("curr-sent", ({ current }: { current: any }) => {
    if (current) {
      setCurrent(current.item)
      localStorage.setItem("song", JSON.stringify(current.item))
      setProgress(current.progress_ms)      
    } else {
      localStorage.removeItem("song")
    }
  })

  useEffect(() => {
    var data = localStorage.getItem("song")
    if (data && data !== "undefined") {
      setCurrent(JSON.parse(data))
    }
  }, [])

  useEffect(() => {
    function loader() {
      clearInterval(intervalState)
      setCounter(0)
      let number = 0
      let interval = setInterval(logic, 1000)
      setIntervalState(interval)
      function logic() {        
        if (play === false) {          
          number = number + 1
          setCounter(number * 1000)          
          // adder()     
        } 
      }
    }
    loader()
  }, [play, current])
  



  useEffect(() => {
    let addition = counter + progress
    let info =  addition / current?.duration_ms
    setPercent(info * 100)        
  }, [counter, progress])


  // useEffect(() => {
  //   setCounter(0)
  //   loader()
  // }, [current])

  // const percent = (counter / current?.duration_ms) * 100


  return (
    <div className={styles.playContainer}>
      <div style={{ display: "flex", width: "35%", justifyContent: "flex-start" }}>
        {current && (
          <>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "20%" }}>
              <Image src={`${current?.album?.images[0]?.url}`} alt="current-song" width={50} height={50}></Image>
            </div>
            <div className={styles.center}>
              <div className={styles.songTitleSmall}>{current?.name}</div>
              <div className={styles.miniTitle}>{current?.album?.name}</div>
            </div>
          </>
        )}
      </div>
      <div className={styles.column}>
        <div style={{ display: "flex", justifyContent:"space-evenly", width:"250px" }}>
          <Image src={"/leftArrow.png"} style={{opacity:".3"}} alt={"left arrow"} height={50} width={50} />
          {play ? (
            <Image
              onClick={() => {
                setPlay(false)
                const room = localStorage.getItem("room");
                if (room) {
                  socket.emit("play-queue", room, (response: any) => {
                    if ("queue" in response) setQueue(response.queue);
                  });
                }
              }}
              src={"/play.png"}
              alt={"play button"}
              height={50}
              width={50}
            />
          ) : (
            <Image
              src={"/pause.png"}
              alt={"pause button"}
              onClick={() => {                
                setPlay(true)
                const room = localStorage.getItem("room");
                if (room) {
                  socket.emit("pause-queue", room, (response: any) => {
                    console.log(response)
                  })
                }
              }}
              height={50}
              width={50}
            ></Image>
          )}
          <Image
            src={"/rightArrow.png"}
            alt={"right arrow"}
            onClick={() => {
              const room = localStorage.getItem("room")
              if (room) {
                socket.emit("skip-song", room, (response: any) => {
                  console.log(response.message)
                })
              }
            }}
            height={50}
            width={50}
          />
        </div>
        <div style={{ marginTop: "10px" }} className="w-80 bg-gray-200 rounded-full h-1 mb-4 dark:bg-gray-700">
          <div className="bg-blue-600 h-1 rounded-full dark:bg-blue-500" style={{ width: `${percent}%` }}></div>
        </div>
      </div>
      <div style={{ width: "450px" }}></div>
    </div>
  );
}
