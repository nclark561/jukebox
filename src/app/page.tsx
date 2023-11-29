"use client";
import { signOut, useSession, signIn } from "next-auth/react";
import { Track, Playlist } from "@spotify/web-api-ts-sdk";
import Queue from "./components/Queue";
import styles from "./page.module.css";
import Image from "next/image";
import Remote from "./remote";
// import Search from "./search";
import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { io } from "socket.io-client";


const socket = io("http://localhost:5678");

export default function Home() {
  const [search, setSearch] = useState<string | undefined>();
  const [searchToggle, setSearchToggle] = useState<any>(false);
  const [queue, setQueue] = useState<QueueTrack[]>([]);
  const [txt, setTxt] = useState<string>();
  const [results, setResults] = useState<Track[]>();
  const [displayName, setDisplayName] = useState<string>();
  const [loading, setLoading] = useState<boolean>(true);
  const [imageLoader, setImageLoader] = useState<boolean>(true);
  const [spotifyUserId, setSpotifyUserId] = useState<string>();
  const [images, setImages] = useState<string[]>([]);
  const [playlistsInfo, setPlaylistsInfo] = useState<
    { id: string; name: string }[]
  >([]);
  // const { images, loading } = useGetPlaylistImages(userPlaylists.map((item) => item.id))

  useEffect(() => {
    const room = localStorage.getItem("room");
    if (room) {
      socket.emit(
        "get-queue",
        room,
        (
          response:
            | { message: string; queue: QueueTrack[] }
            | { errorMsg: string }
        ) => {
          console.log(response);
          if ("queue" in response) setQueue(response.queue);
        }
      );
    }
  }, []);
  socket.on("connect", () => {
    console.log(socket.id);
  });

  const addSong = (song: Track) => {
    const room = localStorage.getItem("room");

    socket.emit(
      "add-song",
      room,
      song,
      (
        response:
          | { message: string; queue: QueueTrack[] }
          | { errorMsg: string }
      ) => {
        console.log(response);
        if ("queue" in response) setQueue(response.queue);
        if ("errorMsg" in response) alert(response.errorMsg);
      }
    );
  };

  console.log(queue);

  const session = useSession();
  let profilePic: string | undefined;
  if (session.data?.user) {
    if ("picture" in session.data.user) {
      const { picture }: any = session.data.user;
      profilePic = picture;
    }
  }

  const playlistImages = useMemo(async () => {
    if (playlistsInfo.length > 0) {
      const imageUrls = await Promise.all(
        playlistsInfo.map((item, index) => {
          return new Promise<string>(async (resolve, reject) => {
            if (!session.data?.user) return;
            if ("accessToken" in session.data.user) {
              try {
                const response = await fetch(
                  `https://api.spotify.com/v1/playlists/${item.id}/images`,
                  {
                    headers: {
                      Accept: "application/json",
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${session?.data?.user?.accessToken}`,
                    },
                    method: "GET",
                  }
                );
                const images = await response.json();
                resolve(images[0].url);
              } catch (err) {
                reject(err);
              }
            }
          });
        })
      );
      setImageLoader(!imageLoader)
      setImages(imageUrls);
    }
  }, [playlistsInfo]);

  async function songSearch() {
    setTxt("");
    const result = search?.replace(/\s+/g, "+");
    if (!session.data?.user) return;
    if ("accessToken" in session.data.user) {
      const response = await fetch(
        `https://api.spotify.com/v1/search?q=${result}&type=track`,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.data?.user?.accessToken}`,
          },
          method: "GET",
        }
      );
      const test = await response.json().catch((err) => console.error(err));
      setResults(test.tracks.items);
      // console.log(test.tracks.items)
    }
  }

  useEffect(() => {
    if (session?.data) {
      const playlists = async () => {
        if (!session.data?.user) return;
        if ("accessToken" in session.data.user) {
          const response = await fetch(`https://api.spotify.com/v1/me `, {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: `Bearer ${session?.data?.user?.accessToken}`,
            },
            method: "GET",
          });
          const spotifyInformation = await response
            .json()
            .catch((err) => console.error(err));
          setSpotifyUserId(spotifyInformation.id);
          setDisplayName(spotifyInformation.display_name)
        }
      };

      playlists();
    }
  }, [session]);

  useEffect(() => {
    if (spotifyUserId) {
      const getPlaylists = async () => {
        if (!session.data?.user) return;
        if ("accessToken" in session.data.user) {
          try {
            const response = await fetch(
              `https://api.spotify.com/v1/users/${spotifyUserId}/playlists`,
              {
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${session.data?.user?.accessToken}`,
                },
                method: "GET",
              }
            );
            const playlists = await response.json();
            if (playlists.items) {
              let playlistsInfo = playlists.items.map((item: any) => {
                return { id: item.id, name: item.name };
              });
              setPlaylistsInfo(playlistsInfo);
              setLoading(!loading);
            }
          } catch (err) {
            console.error(err);
          }
        }
      };
      getPlaylists();
    }
  }, [spotifyUserId]);

  function millisToMinutesAndSeconds(millis: number) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    // Math.round(seconds)
    return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
  }
  // console.log(playlistImages[0], "this is a good test ")

  return (
    <main className={styles.main}>
      <div style={{ display: "flex", width: "100vw", height: "88vh" }}>
        <Queue icon={true} setSearchToggle={setSearchToggle} queue={queue} setQueue={setQueue} socket={socket} />
        <div className={styles.content}>
          <div className={styles.logoutContainer}>
            <div>
              {session && (
                <div>
                  {/* <img src={session?.data?.user?.picture}></img> */}

                  {session?.status === "authenticated" ? <button onClick={() => signOut()} className={styles.logout}>Logout</button> : <button onClick={() => signIn("spotify", { callbackUrl: "/" })}>Login</button>}
                </div>
              )}
            </div>
            <form className={styles.row} onSubmit={(evt) => {
              evt.preventDefault()
              songSearch()
            }}>

              {searchToggle ? <> <div className={styles.searchInput}>
                <Image alt={"something"} onClick={() => {
                  songSearch()
                }} src={'/search.png'} style={{ position: "absolute", marginTop: "16px", marginLeft: "10px" }} height={18} width={18}></Image>
                <input onClick={() => {

                }} placeholder="What do you want to listen to?" value={txt} className={styles.input} onChange={(event) => {
                  setTxt(event.target.value)
                  setSearch(event?.target.value)
                }} type="text" />
              </div>
              </> : <div className={styles.title}>Welcome to <div style={{ paddingLeft: "10px", color: "green", fontWeight: "700" }}>Jukify</div><div style={{ paddingLeft: "10px" }}>{displayName}</div></div>}

            </form>
          </div>
          <div className={styles.line}></div>

          {results ? (
            <>
              {results.slice(0, 5).map((item, index) => {
                return (
                  // {item.album.images[1].url? <><> : null}
                  <div key={index} className={styles.rowSong}>
                    <div>{index + 1}</div>
                    <div className={styles.rowGap}>
                      <Image alt={"something"} src={item.album.images[1].url} height={30} width={70}></Image>
                      <div style={{ padding: "10px" }} className={styles.column}>
                        <div className={styles.songTitleSmall}>{item.name}</div>
                        <div className={styles.miniTitle}>
                          {item.artists[0].name}
                        </div>
                      </div>
                    </div>
                    <div className={styles.album}>{item.album.name}</div>
                    <div style={{ width: "175px", textAlign: "center" }}>
                      {millisToMinutesAndSeconds(item.duration_ms)}
                    </div>
                    <Image
                      onClick={() => addSong(item)}
                      alt={"plus sign"}
                      height={15}
                      width={15}
                      src={"/plus.png"}
                    ></Image>
                  </div>
                );
              })}
            </>
          ) : (
            <div className={styles.grid}>
              {session.status === "authenticated" && imageLoader ? (
                <div className={styles.center}>
                  <div style={{ color: "white", fontSize: "60px" }}>Loading...</div>
                </div>
              ) : (
                <>
                  {
                    playlistsInfo?.map((playlist, index) => {
                      return (
                        <Album
                          key={playlist.id}
                          name={playlist.name}
                          id={playlist.id}
                          imageUrl={images[index]}
                        />
                      );
                    })
                  }
                </>
              )}
            </div>
          )}
        </div>

      </div>
      <div>
        {session?.status === 'authenticated' && <Remote session={session} socket={socket} setQueue={setQueue} />}
      </div>
    </main>
  );
}
const Album = ({
  id,
  imageUrl,
  name,
}: {
  id: string;
  imageUrl?: string;
  name: string;
}) => {
  return (
    <Link key={id} href={`/playlist?id=${id}`}>
      {imageUrl ? (
        <Image
          priority
          width={300}
          height={300}
          alt={"playlist image"}
          src={imageUrl}
        ></Image>
      ) : (
        <div style={{ color: "white" }}></div>
      )}
      <div className={styles.container}>
        <div className={styles.box}>
          <div>{name}</div>
        </div>
      </div>
    </Link>
  );
};
