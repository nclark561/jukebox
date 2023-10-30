"use client";
import { useState, useEffect } from "react";
import { Track } from "@spotify/web-api-ts-sdk";

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
        <p>{props.song.votes}</p>
        <button
          className={
            userVote === "downvoted" ? "text-orange-600" : "text-gray-600"
          }
          onClick={() => handleClick('downvoted')}
        >
          downvote
        </button>
      </div>
    </div>
  );
}
