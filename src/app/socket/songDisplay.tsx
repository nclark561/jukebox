"use client";
import { useState, useEffect } from "react";
import { Track } from "@spotify/web-api-ts-sdk";

import Image from "next/image";
import styles from '../page.module.css'

import { useSession } from "next-auth/react";

interface Vote {
  voted: string;
  user: string;
}
// >>>>>>> 1db5abe712bd56557a620f57cc39ceb4803f0617

interface QueueTrack extends Partial<Track> {
  votes: Vote[];
}

interface DispSongProps {
  song: QueueTrack;
  socket: any
  setQueue: any
}

export default function SongDisplay(props: DispSongProps) {
  const [userVote, setUserVote] = useState("neutral");

  const session = useSession()
  const { socket, setQueue } = props

  console.log(userVote)

  const handleClick = (vote: string) => {
    if (userVote === 'upvoted' && vote === 'upvoted') vote = 'neutral'
    if (userVote === 'downvoted' && vote === 'downvoted') vote = 'neutral'
    socket.emit('vote', 'queue-room-1979', props.song.name, vote, session?.data?.user?.email, (response: any) => {
      setUserVote(response.vote)
      setQueue(response.currQueue.queue)
    })
  };

  return (

    <div className={styles.flex}>
      <p style={{ textAlign: "center", width: "200px" }}>{props.song.name}</p>

      <Image onClick={() => { handleClick('upvoted') }} alt={'up arrow'} src={'/up.png'} width={30} height={30}></Image>
      {/* <p>{props.song.votes}</p> */}
      <Image onClick={() => handleClick('downvoted')} alt={'up arrow'} src={'/down.png'} width={30} height={30}></Image>
      <div className="flex justify-between">
        
        
      </div>
    </div>
  )
}
