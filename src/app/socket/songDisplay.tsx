"use client";
import { useState, useEffect } from "react";
import { Track } from "@spotify/web-api-ts-sdk";
<<<<<<< HEAD
import Image from "next/image";
import styles from '../page.module.css'
=======
import { useSession } from "next-auth/react";

interface Vote {
  voted: string;
  user: string;
}
>>>>>>> 1db5abe712bd56557a620f57cc39ceb4803f0617

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
<<<<<<< HEAD
  
=======
  const session = useSession()
  const {socket, setQueue} = props

  console.log(userVote)
>>>>>>> 1db5abe712bd56557a620f57cc39ceb4803f0617

  const handleClick = (vote: string) => {
    if (userVote === 'upvoted' && vote === 'upvoted') vote = 'neutral'
    if (userVote === 'downvoted' && vote === 'downvoted') vote = 'neutral'
    socket.emit('vote', 'queue-room-1979', props.song.name, vote, session?.data?.user?.email, (response: any) => {
      setUserVote(response.vote)
      setQueue(response.currQueue.queue)
    })
  };

  return (
<<<<<<< HEAD
    <div className={styles.flex}>
      <p style={{textAlign:"center", width:"200px"}}>{props.song.name}</p>
      <div className={styles.songContainer}>
        <Image  onClick={() => {handleClick('upvoted') }} alt={'up arrow'} src={'/up.png'} width={30} height={30}></Image>
        {/* <p>{props.song.votes}</p> */}
        <Image onClick={() => handleClick('downvoted')} alt={'up arrow'} src={'/down.png'} width={30} height={30}></Image>
=======
    <div className="flex justify-between">
      <p>{props.song.name}</p>
      <div>
        <button
          className={
            userVote === "upvoted" ? "text-orange-600" : "text-gray-600"
          }
          onClick={() => handleClick('upvoted')}
        >
          upvote
        </button>
        <button
          className={
            userVote === "downvoted" ? "text-orange-600" : "text-gray-600"
          }
          onClick={() => handleClick('downvoted')}
        >
          downvote
        </button>
>>>>>>> 1db5abe712bd56557a620f57cc39ceb4803f0617
      </div>
    </div>
  );
}
