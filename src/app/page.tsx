'use client'
import { signOut, useSession } from "next-auth/react";
import { Track } from "@spotify/web-api-ts-sdk";
import Queue from "./components/Queue";
import styles from './page.module.css'
import Image from "next/image";
// import Search from "./search";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Home() {
  const [search, setSearch] = useState<string | undefined>();
  const [queue, setQueue] = useState<Track[]>([]);
  const [txt, setTxt] = useState<string>();
  const [results, setResults] = useState<Track[]>();

  async function handleClick() {
    setTxt('')
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
      <Queue queue={queue} />
      <div className={styles.content}>
        <div>
          {session && (
            <div>
              <img src={session?.data?.user?.picture}></img>

              {session?.status === "authenticated" ? <button onClick={() => signOut()}>logout</button> : <Link href='/login'>Login</Link>}
            </div>
          )}
        </div>
        <form className={styles.row} onSubmit={(evt) => {
          evt.preventDefault()
          handleClick()
        }}>
          <div className={styles.searchInput}>
            <Image alt={"something"} onClick={() => {
              handleClick()
            }} src={'/search.png'} style={{position:"absolute", marginTop:"6px", marginLeft:"10px"}} height={18} width={18}></Image>
            <input placeholder="What do you want to listen to?" value={txt} className={styles.input} onChange={(event) => {
              setTxt(event.target.value)
              setSearch(event?.target.value)
            }} type="text" />
          </div>
        </form>
        <div className={styles.topRow}>
          <div>Titl</div>
          <div></div>
          <div>Album</div>
          <div></div>
          <div></div>
        </div>
        <div className={styles.line}></div>

        {results ? <>{results.slice(0, 5).map((item, index) => {
          return (
            <div key={index} className={styles.rowSong}>
              <div className={styles.rowGap}>
                <Image alt={"something"} src={item.album.images[1].url} height={90} width={100}></Image>
                <div style={{ padding: "10px" }} className={styles.column}>
                  <div>{item.name}</div>
                  <div>{item.artists[0].name}</div>
                </div>
              </div>
              <div>{item.album.name}</div>
              <div>{item.duration_ms}</div>
              <button className={styles.button} onClick={() => setQueue(prev => [...prev, item])}>Add to Queue</button>
            </div>
          )
        })}</> : <></>}


      </div>
    </main>
  );
}
