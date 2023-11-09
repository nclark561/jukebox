"use client";
import { useEffect, useState } from "react";
import { Track } from "@spotify/web-api-ts-sdk";
import styles from '../queue.module.css'
import Link from "next/link";
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
          <div onClick={() => {
            window.location.reload()
          }} className={styles.link}>Home</div>        
        <div className={styles.link}>Search</div>
      </div>
      <input className={styles.input} type="text" name="" id="" />
      <div style={{ width: "100%" }}>
        <Vote />
      </div>
      {session?.status === 'authenticated' && <Remote session={session} />}

    </div>
  );
}
