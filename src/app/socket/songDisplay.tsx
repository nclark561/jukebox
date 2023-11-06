"use client";
import { useState, useEffect } from "react";
import { Track } from "@spotify/web-api-ts-sdk";
import { useSession } from "next-auth/react";

interface Vote {
  voted: string;
  user: string;
}

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
  const {socket, setQueue} = props

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
      </div>
    </div>
  );
}
