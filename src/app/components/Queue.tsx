"use client";
import { useEffect, useState } from "react";
import { Track } from "@spotify/web-api-ts-sdk";
import styles from '../queue.module.css'
import Link from "next/link";
import Remote from "../remote";
import Vote from "../socket/Vote";
import { signOut, useSession } from "next-auth/react";

interface QueueProps {
  queue: QueueTrack[]
  setQueue: React.Dispatch<React.SetStateAction<QueueTrack[]>>
  socket: any
}

export default function Queue(props: QueueProps) {
  const session: any = useSession()
  return (
    <div className={styles.queue}>
      <div className={styles.linkContainer}>
        <Link href={'/'}>
          <div className={styles.link}>Home</div>
        </Link>
        <div className={styles.link}>Search</div>
      </div>
      <input className={styles.input} type="text" name="" id="" />
      <div style={{ width: "100%" }}>
        <Vote socket={props.socket} setQueue={props.setQueue} queue={props.queue}/>
      </div>
      {session?.status === 'authenticated' && <Remote session={session} />}

    </div>
  );
}
