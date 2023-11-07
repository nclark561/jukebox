'use client'
import { signOut, useSession } from "next-auth/react";
import { Track, Playlist } from "@spotify/web-api-ts-sdk";
import Queue from "./components/Queue";
import styles from './page.module.css'
import Image from "next/image";
// import Search from "./search";
import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { debug } from "console";
import { useGetPlaylistImages } from "./useGetPlaylistImages";

export default function Home() {
  const [search, setSearch] = useState<string | undefined>();
  const [queue, setQueue] = useState<Track[]>([]);
  const [txt, setTxt] = useState<string>();
  const [userPlaylists, setUserPlaylists] = useState<Playlist[]>([]);
  const [counter, setCounter] = useState<number>(1);
  const [results, setResults] = useState<Track[]>();
  const [images, setImages] = useState<string[]>();
  const [loading, setLoading] = useState<boolean>(false);
  const [idArray, setIdArray] = useState<string[]>([]);
  // const { images, loading } = useGetPlaylistImages(userPlaylists.map((item) => item.id))

  const session = useSession()

  const playlistImages = useMemo(() => {
    if (idArray?.length > 0) {
      const result: string[] = []
      idArray.forEach((item, index) => {
        new Promise(async (resolve) => {
          const response = await fetch(`https://api.spotify.com/v1/playlists/${idArray[index]}/images`, {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: `Bearer ${session?.data?.user?.accessToken}`,
            },
            method: "GET",
          })
          const test = await response.json()
            .catch(err => console.error(err))
          result.push(test[0]?.url)
        })
      })
      // console.log(result, "")
      // localStorage.setItem("images", `${JSON.stringify(result)}`)
      return result
    }
    return []
  }, [idArray])


  async function handleClick() {
    setTxt('')
    const result = search?.replace(/\s+/g, "+")
    const response = await fetch(`https://api.spotify.com/v1/search?q=${result}&type=track`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.data?.user?.accessToken}`,
      },
      method: "GET",
    })
    const test = await response.json()
      .catch(err => console.error(err))
    setResults(test.tracks.items)
    // console.log(test.tracks.items)
  }

  useEffect(() => {
    const playlists = async () => {
      const response = await fetch(`https://api.spotify.com/v1/me `, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.data?.user?.accessToken}`,
        },
        method: "GET",
      })
      const test = await response.json()
        .catch(err => console.error(err))
      playlistFunction(test.id)
    }
    playlists()
  }, [])


  const playlistFunction = async (id: string) => {
    const response = await fetch(`https://api.spotify.com/v1/users/${id}/playlists`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.data?.user?.accessToken}`,
      },
      method: "GET",
    })
    const test = await response.json()
      .catch(err => console.error(err))
    //   console.log(test, "good info")
    // console.log(test, "should be playlists`")
    setUserPlaylists(test.items)
    if (test.items) {
      let result: Array = []
      test.items.map((item: Array) => {
        // console.log(item, "these are the items")      
        result.push(item.id)
      })
      setIdArray(result)
    }
  }

  function millisToMinutesAndSeconds(millis: number) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    // Math.round(seconds)
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
  }
  console.log(playlistImages[0], "this is a good test ")
  console.log(playlistImages, "this is a good test ")

  return (
    <main className={styles.main}>
      <Queue queue={queue} />
      <div className={styles.content}>
        <div>
          {session && (
            <div>
              <img src={session?.data?.user?.picture}></img>

              {session?.status === "authenticated" ? <button onClick={() => signOut()} style={{ width: "100%", textAlign: "end" }}>logout</button> : <Link href='/login'>Login</Link>}
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
            }} src={'/search.png'} style={{ position: "absolute", marginTop: "16px", marginLeft: "10px" }} height={18} width={18}></Image>
            <input onClick={() => {

            }} placeholder="What do you want to listen to?" value={txt} className={styles.input} onChange={(event) => {
              setTxt(event.target.value)
              setSearch(event?.target.value)
            }} type="text" />
          </div>
        </form>
        <div className={styles.topRow}>
          <div>Title</div>
          <div></div>
          <div>Album</div>
          <div></div>
          <div></div>
        </div>
        <div className={styles.line}></div>


        {results ? <>{results.slice(0, 5).map((item, index) => {
          return (
            // {item.album.images[1].url? <><> : null}
            <div key={index} className={styles.rowSong}>
              <div>{index + 1}</div>
              <div className={styles.rowGap}>
                <Image alt={"something"} src={item.album.images[1].url} height={30} width={70}></Image>
                <div style={{ padding: "10px" }} className={styles.column}>
                  <div style={{ width: "175px" }}>{item.name}</div>
                  <div className={styles.miniTitle}>{item.artists[0].name}</div>
                </div>
              </div>
              <div style={{ width: "175px" }}>{item.album.name}</div>
              <div style={{ width: "175px" }}>{millisToMinutesAndSeconds(item.duration_ms)}</div>
              <Image onClick={() => setQueue(prev => [...prev, item])} alt={"plus sign"} height={15} width={15} src={'/plus.png'}></Image>

            </div>
          )
        })}</> : <div className={styles.grid}>
          {userPlaylists?.map((playlist, index) => {
            return (
              <Album name={playlist.name} id={playlist.id} imageUrl={playlistImages[index]} />
            )
          })}
        </div>}


      </div>
    </main>
  );
}

const Album = ({ id, imageUrl, name }: { id: string; imageUrl?: string; name: string }) => {
  console.log(imageUrl, "this is imsage url")
  return (
    <Link key={id} href={`/playlist?id=${id}`}>
      <div>kale</div>
      {imageUrl ? <Image width={650} height={650} alt={'playlist image'} src={imageUrl}></Image> : <div style={{ color: "white" }}>klae</div>}
      <div className={styles.box}>
        <div>{name}</div>
      </div>
    </Link>
  )
}
