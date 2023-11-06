"use client";
import { useEffect, useState } from "react";
import { Track } from "@spotify/web-api-ts-sdk";
import styles from '../queue.module.css'
import Remote from "../remote";
import Vote from "../socket/page";
import { signOut, useSession } from "next-auth/react";

interface QueueProps {
  queue: Track[]
}

export default function Queue(props: QueueProps) {
  const session: any = useSession()
  return (
    <div className={styles.queue}>
      <div className={styles.linkContainer}>
        <div className={styles.link}>Search</div>
        <div className={styles.link}>My playlists</div>
      </div>
      <ul>
        {props.queue.map((song, index) => (
          <li key={index}>{song.name}</li>
        ))}
      </ul>
      <div style={{width:"100%"}}>
        <Vote />
      </div>
      {session?.status === 'authenticated' && <Remote session={session} />}

    </div>
  );
}
