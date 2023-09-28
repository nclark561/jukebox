'use client'
import { useEffect, useState } from "react";

export default function Home() {
  const [song, setSong] = useState<any>()

  useEffect(() => {
    fetch('https://api.spotify.com/v1/tracks/5VEnzMXc8ocZko4M4TqnR2', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`
      }
    }).then(async (res: any) => {
      const resp = await res.json()
      setSong(resp)
    }).catch(err => console.error(err))
  }, [])
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">{song?.name}</main>
  );
}
