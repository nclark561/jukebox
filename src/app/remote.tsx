"use client";
import { useEffect, useState } from "react";
import styles from './queue.module.css'
import Image from "next/image";

interface RemoteProps { session: any, socket: any, setQueue:React.Dispatch<React.SetStateAction<QueueTrack[]>> }

export default function Remote({ session, socket, setQueue }: RemoteProps) {
  const [device, setDevice] = useState();
  const [play, setPlay] = useState(true);

  const handleClick = (action: string) => {
    fetch(`https://api.spotify.com/v1/me/player/${action}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.data.user.accessToken}`,
      },
      method: "PUT",
    })
      .catch(err => console.error(err))
  }

  useEffect(() => {
    fetch("https://api.spotify.com/v1/me/player/devices", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.data.user.accessToken}`,
      },
      method: "GET",
    })
      .then(async (res) => {
        const resp = await res.json();
        setDevice(resp.devices.filter((d: any) => d.name === "iPhone")[0])
      })
      .catch((err) => console.error(err));
  }, []);
  return (
    <div className={styles.playContainer}>
      <Image src={'/leftArrow.png'} alt={'left arrow'} height={50} width={50} />
      {play ? <Image onClick={() => {handleClick('play'); setPlay(!play)}} src={'/play.png'} alt={'left arrow'} height={50} width={50} /> : <Image src={'/pause.png'} alt={'pause button'} onClick={() =>{handleClick('pause'); setPlay(!play)} } height={50} width={50}></Image>}
      <Image onClick={() => {
        const room = localStorage.getItem("room")
        socket.emit("play-queue", room, (response: any) => {
          console.log(response)
          if ("queue" in response) setQueue(response.queue)
        })
      }} src={'/rightArrow.png'} alt={'right arrow'} height={50} width={50} />
    </div>
  );
}
