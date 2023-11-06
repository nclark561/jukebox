"use client";
import { useState, useEffect } from "react";
import { Track } from "@spotify/web-api-ts-sdk";
import Image from "next/image";
import styles from '../page.module.css'

interface QueueTrack extends Partial<Track> {
  votes: number;
}

interface DispSongProps {
  song: QueueTrack;
}

export default function SongDisplay(props: DispSongProps) {
  const [userVote, setUserVote] = useState("neutral");
  

  const handleClick = (vote: string) => {
    switch (userVote) {
      case 'neutral':
        setUserVote(vote)
        if (vote === 'upvoted') props.song.votes++
        if (vote === 'downvoted') props.song.votes--
        break
      case 'upvoted':
        if (vote === 'upvoted') {
          props.song.votes--
          setUserVote('neutral')
        } else {
          props.song.votes -= 2
          setUserVote(vote)
        }
        break
      case 'downvoted':
        if (vote === 'downvoted') {
          props.song.votes++
          setUserVote('neutral')
        } else {
          props.song.votes += 2
          setUserVote(vote)
        }
        break
    }
  };

  return (
    <div className={styles.flex}>
      <p style={{textAlign:"center", width:"200px"}}>{props.song.name}</p>
      <div className={styles.songContainer}>
        <Image  onClick={() => {handleClick('upvoted') }} alt={'up arrow'} src={'/up.png'} width={30} height={30}></Image>
        {/* <p>{props.song.votes}</p> */}
        <Image onClick={() => handleClick('downvoted')} alt={'up arrow'} src={'/down.png'} width={30} height={30}></Image>
      </div>
    </div>
  );
}
