'use client'
import { useEffect, useState } from "react";

export default function Home() {
  const [song, setSong] = useState<any>()
  const { API_KEY } = process.env

  useEffect(() => {
    fetch('https://api.spotify.com/v1/tracks/4s7qEhuFacYJMJjTISwTSo', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${API_KEY}`
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
