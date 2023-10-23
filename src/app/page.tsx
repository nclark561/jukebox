'use client'
import { signOut, useSession } from "next-auth/react";
import Remote from "./remote";
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
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        {session && (
          <div>
            <img src={session?.data?.user?.picture}></img>
            {session.status === 'authenticated' && <Remote session={session} />}
          </div>
        )}
      </div>
      <input onChange={(event) => {
        setSearch(event?.target.value)
      }} type="text" />
      <button onClick={() => {
        handleClick()
      }}>press me</button>
      {results ? <>{results.slice(0, 5).map((item) => {
        return (
          <div>
            
            <Image src={item.album.images[1].url} height={100} width={100}></Image>
            <div>{item.album.name}</div>
          </div>
        )
      })}</> : <></>}

      {session?.status === "authenticated" ? <button onClick={() => signOut()}>logout</button> : <Link href='/login'>Login</Link>}
    </main>
  );
}
