"use client";
import { useState, useEffect } from "react";

import Image from "next/image";
import styles from '../page.module.css'

import { useSession } from "next-auth/react";

// >>>>>>> 1db5abe712bd56557a620f57cc39ceb4803f0617

interface DispSongProps {
  song: QueueTrack;
  socket: any
  setQueue: any
  queueRoom: string
}

export default function SongDisplay(props: DispSongProps) {
  const [userVote, setUserVote] = useState("neutral");
  const [animationToggle, setAnimation] = useState<boolean>(false)
  const session = useSession()
  const { socket, setQueue, queueRoom } = props

  const handleClick = (vote: string) => {
    if (userVote === 'upvoted' && vote === 'upvoted') vote = 'neutral'
    if (userVote === 'downvoted' && vote === 'downvoted') vote = 'neutral'
    socket.emit('vote', queueRoom, props.song, vote, session?.data?.user?.email, (response: any) => {
      console.log(response)
      setQueue(response.queue)
      setUserVote(response.voted)
    })
  };
  useEffect(() => {    
    setAnimation(!animationToggle)
  }, [setQueue])

  useEffect(() => {
    const room = localStorage.getItem("room")
    socket.emit("get-vote", room, props.song, session.data?.user?.email, (response: any) => {
      setUserVote(response.voted)
    })
  }, [])

  return (
    <div className={animationToggle? styles.flex : styles.flexClear}>
      {props.song.album?.images[1].url && <Image style={{ borderRadius: "1px" }} src={props.song.album.images[1].url} alt={"album cover"} width={50} height={50} />}
      <div>
        <p style={{ width: "200px", fontSize: "13px" }}>{props.song.name}</p>
        <p style={{ width: "200px", fontSize: "13px" }}>{props.song.artists && props.song.artists[0].name}</p>
      </div>
      <Image onClick={() => { handleClick('upvoted') }} alt={'up arrow'} src={userVote === "upvoted" ? '/upW.png' : '/upB.png'} width={20} height={20}></Image>
      <p>{props.song.voteCount}</p>
      <Image onClick={() => handleClick('downvoted')} alt={'up arrow'} src={userVote === "downvoted" ? '/downW.png' : '/downB.png'} width={20} height={20}></Image>
      <div className="flex justify-between">
      </div>
    </div>
  )
}
