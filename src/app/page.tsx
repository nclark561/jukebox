'use client'
import { signOut, useSession } from "next-auth/react";
import Remote from "./remote";
import styles from './page.module.css'
import Image from "next/image";
// import Search from "./search";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Home() {
  const [search, setSearch] = useState();
  const [song, setSong] = useState();
  const [results, setResults] = useState();

  async function handleClick(action: string) {
    const result = search?.replace(/\s+/g, "+")
    const response = await fetch(`https://api.spotify.com/v1/search?q=${result}&type=track`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.data.user.accessToken}`,
      },
      method: "GET",
    })
    const test = await response.json()
      .catch(err => console.error(err))
    setResults(test.tracks.items)
    console.log(test.tracks.items)
  }

  const session: any = useSession()


  return (
    <main className={styles.main}>
      <div className={styles.content}>
        <div>
          {session && (
            <div>
              <img src={session?.data?.user?.picture}></img>
              {session.status === 'authenticated' && <Remote session={session} />}
              {session?.status === "authenticated" ? <button onClick={() => signOut()}>logout</button> : <Link href='/login'>Login</Link>}
            </div>
          )}
        </div>
        <div className={styles.row}>
          <input className={styles.input} onChange={(event) => {
            setSearch(event?.target.value)
          }} type="text" />
          <Image onClick={() => {
            handleClick()
          }} src={'/search.png'} height={50} width={50}></Image>
        </div>
        <div className={styles.topRow}>
          <div>Title</div>
          <div></div>
          <div>Album</div>
          <div></div>
          <div></div>
        </div>
        <div className={styles.line}></div>

        {results ? <>{results.slice(0, 5).map((item) => {
          return (
            <div className={styles.rowSong}>
              <div className={styles.rowGap}>
                <Image src={item.album.images[1].url} height={90} width={100}></Image>
                <div style={{padding:"10px"}} className={styles.column}>
                  <div>{item.name}</div>
                  <div>{item.artists[0].name}</div>
                </div>
              </div>
              <div>{item.album.name}</div>
              <div>{item.duration_ms}</div>
              <button className={styles.button}>Add to Queue</button>
            </div>
          )
        })}</> : <></>}


      </div>
    </main>
  );
}
