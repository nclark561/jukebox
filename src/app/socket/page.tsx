'use client'
import { useState } from "react"
import { io } from "socket.io-client"
import { Track } from "@spotify/web-api-ts-sdk"
import SongDisplay from "./songDisplay"

const socket = io('http://localhost:5678')

interface QueueTrack extends Partial<Track> {
  votes: number
}

export default function page() {
    const [queue, setQueue] = useState<QueueTrack[]>([
        { name: 'Even if she falls', votes: 0},
        { name: 'Old pine', votes: 0},
        { name: 'Landmines', votes: 0},
        { name: 'All apologies', votes: 0},
        { name: 'Tremors', votes: 0}
    ])
  return (
    <div>
      {
        queue.sort((a, b) => b.votes - a.votes).map((song, index) => <SongDisplay key={index} song={song}/>)
      }
    </div>
  )
}
