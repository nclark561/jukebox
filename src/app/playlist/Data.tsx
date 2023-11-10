'use client'
import { signOut, useSession } from "next-auth/react";
import { Track, Playlist } from "@spotify/web-api-ts-sdk";
import Queue from "../components/Queue";
import styles from '../page.module.css'
import Image from "next/image";
import { BreadCrumbs } from "../components/BreadCrumbs";
// import Search from "./search";
import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { debug } from "console";
import { useSearchParams } from "next/navigation";
import { useGetPlaylistImages } from "../useGetPlaylistImages";

export default function Home() {
    const searchParams = useSearchParams();
    const playlistId = searchParams.get("id");
    const [search, setSearch] = useState<string | undefined>();
    const [queue, setQueue] = useState<Track[]>([]);
    const [txt, setTxt] = useState<string>();
    const [songs, setSongs] = useState<string[]>()

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
        // setResults(test.tracks.items)
        console.log(test.tracks.items)
    }

    useEffect(() => {
        const songs = async () => {
            const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session.data.user.accessToken}`,
                },
                method: "GET",
            })
            const test = await response.json()
                .catch(err => console.error(err))
            console.log(test.tracks.items, "this is a test of songs")
            setSongs(test)

        }
        songs()

    }, [])

    const session: any = useSession()
    function millisToMinutesAndSeconds(millis: number) {
        var minutes = Math.floor(millis / 60000);
        var seconds = ((millis % 60000) / 1000).toFixed(0);
        // Math.round(seconds)
        return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
    }

    const breadCrumbs = [
        { name: "Home", url: "/" },
    ]

    return (
        <main className={styles.main}>
            {/* <BreadCrumbs breadCrumbs={breadCrumbs} /> */}
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
                <div style={{overflowY:"auto", height:"100vh"}}>

                    {songs?.tracks.items?.map((item, index) => {
                        return (
                            // {item.album.images[1].url? <><> : null}
                            <div key={index} className={styles.rowSong}>
                                <div>{index + 1}</div>
                                <div className={styles.rowGap}>
                                    <Image alt={"something"} src={item.track.album.images[1].url} height={30} width={70}></Image>
                                    <div style={{ padding: "10px" }} className={styles.column}>
                                        <div style={{ width: "175px" }}>{item.track.name}</div>
                                        <div className={styles.miniTitle}>{item.track.artists[0].name}</div>
                                    </div>
                                </div>
                                <div style={{ width: "175px" }}>{item.track.album.name}</div>
                                <div style={{ width: "175px" }}>{millisToMinutesAndSeconds(item.track.duration_ms)}</div>
                                <Image onClick={() => setQueue(prev => [...prev, item])} alt={"plus sign"} height={15} width={15} src={'/plus.png'}></Image>

                            </div>
                        )
                    })}
                </div>

            </div>
        </main>
    );
}
