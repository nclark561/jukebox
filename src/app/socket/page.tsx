'use client'
import { useState } from "react"
import { io } from "socket.io-client"

const socket = io('http://localhost:5678')

interface song {
    name: string,
    votes: number
}

export default function page() {
    const [queue, setQueue] = useState<song[]>([
        { name: 'Even if she falls', votes: 0},
        { name: 'Old pine', votes: 0},
        { name: 'Landmines', votes: 0},
        { name: 'All apologies', votes: 0},
        { name: 'Tremors', votes: 0}
    ])
  return (
    <div>page</div>
  )
}
