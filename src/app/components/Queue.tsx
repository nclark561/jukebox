"use client";
import styles from '../queue.module.css'
import Link from "next/link";
import Remote from "../remote";
import Image from "next/image";
import Vote from "../socket/Vote";
import { signOut, useSession } from "next-auth/react";

interface QueueProps {
  queue: QueueTrack[]
  setSearchToggle: any
  setQueue: React.Dispatch<React.SetStateAction<QueueTrack[]>>
  socket: any
}

export default function Queue(props: QueueProps) {
  const session: any = useSession()

  const { socket, setQueue, queue } = props 

  socket.on("queue-sent", ({ queue, currPlaying }: {queue: QueueTrack[], currPlaying: QueueTrack}) => {
    setQueue(queue)
  })

  socket.on("queue-ended", ({ message }: { message: string }) => {
    const room = localStorage.getItem("room")
    socket.emit("leave-room", room)
    localStorage.removeItem("room")
    setQueue([])
  })

  return (
    <div className={styles.queue}>
      <div className={styles.linkContainer}>
        <div className={styles.flex}>
          <Image src={'/home.png'} alt={''} height={25} width={25} />
          <Link href={'/'}>
            <div onClick={() => {
              props.setSearchToggle(false)
            }} className={styles.link}>Home</div>
          </Link>
        </div>
        <div className={styles.flex}>
          <Image src={'/search1.png'} alt={''} height={25} width={25} />
          <div onClick={() => {
            props?.setSearchToggle(true)
          }} className={styles.link}>Search</div>
        </div>
      </div>
      <input className={styles.input} type="text" name="" id="" />
      <div style={{ width: "100%" }}>
        <Vote socket={props.socket} setQueue={props.setQueue} queue={props.queue} />
      </div>
      {session?.status === 'authenticated' && <Remote session={session} socket={props.socket} setQueue={props.setQueue} />}

    </div>
  );
}
