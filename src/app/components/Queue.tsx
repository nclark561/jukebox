"use client";
import { useEffect, useState } from "react";
import styles from '../queue.module.css'
import Remote from "../remote";
import { signOut, useSession } from "next-auth/react";
export default function Queue() {
  const session: any = useSession()
  return (
    <div className={styles.queue}>
        <div className={styles.linkContainer}>
          <div className={styles.link}>Search</div>
          <div className={styles.link}>My playlists</div>
        </div>
        <div>
          <div>Queue of songs</div>
          <div>Queue of songs</div>
          <div>Queue of songs</div>
          <div>Queue of songs</div>
        </div>
        {session?.status === 'authenticated' && <Remote session={session} />}
    </div>
  );
}
