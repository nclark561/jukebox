import { Track } from "@spotify/web-api-ts-sdk";

require("dotenv").config();
const { PORT } = process.env;

const io = require("socket.io")(PORT, {
  cors: { origin: "http://localhost:3000" },
});

interface Vote {
  voted: string;
  user: string;
}

interface QueueTrack extends Track {
  votes: Vote[];
  voteCount: number
}

interface Queue {
  id: string;
  accessToken: string
  queue: QueueTrack[];
}

const queues: Queue[] = [];

const sortQueue = (queueId: string) => {
  const sortingQueue = queues.find((e) => e.id === queueId);
  if (!sortingQueue?.queue) return
  if (sortingQueue?.queue.length > 1) {
    sortingQueue?.queue.sort((a, b) => {
      let aCount = 0;
      let bCount = 0;
      b.votes.forEach((curr) => {
        if (curr.voted === "upvoted") {
          bCount++;
          return;
        } else if (curr.voted === "downvoted") {
          bCount--;
          return
        }
      });
      b.voteCount = bCount
      a.votes.forEach((curr) => {
        if (curr.voted === "upvoted") {
          aCount++;
          return;
        } else if (curr.voted === "downvoted") {
          aCount--;
          return
        }
      });
      a.voteCount = aCount
      console.log(bCount, aCount)
      return bCount - aCount
    });
    console.log(sortingQueue)
  } else {
    let currVoteCount = 0
    sortingQueue.queue[0].votes.forEach((curr: Vote) => {
      if (curr.voted === "upvoted") currVoteCount++
      if (curr.voted === "downvoted") currVoteCount--
    })
    sortingQueue.queue[0].voteCount = currVoteCount
  }
};

const playNextSong =  async (song: QueueTrack, accessToken: string) => {
  try {
    await fetch(`https://api.spotify.com/v1/me/player/play`, {
      method: "Put",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        uris: [song.uri]
      })
    })
    console.log('queue playing successfully')
    return () => new Promise(resolve => setTimeout(resolve, song.duration_ms));
  } catch (err) {
    console.error(err)
  }
}

io.on("connection", (socket: any) => {
  console.log(socket.id);
  socket.on("create-queue", (room: string, queue: QueueTrack[], accessToken: string, cb: any) => {
    if (queues.filter((q: any) => q.id === room).length > 0) {
      cb({ errorMsg: "room name already taken" });
    } else {
      socket.join(room);

      queues.push({ id: room, accessToken, queue });
      console.log(queues);

      cb({
        message: `Created ${room}`,
        room: queues.filter((q: any) => q.id === room)[0].id,
      });
    }
  });
  socket.on("join-queue", (room: string, cb: any) => {
    socket.join(room);
    const queue = queues.filter((q: any) => q.id === room)[0].queue
    cb({
      message: `Joined ${room}`,
      queue,
      room: room
    });
  });
  socket.on("delete-queue", (room: string, cb: any) => {
    const delQueue = queues.map((e: any) => e.id).indexOf(room);
    queues.splice(delQueue, 1);
    socket.to(room).emit("queue-ended", { message: `${room} queue ended`})
    socket.leave(room)
    cb({ message: `Ended ${room}`, queues });
  });
  socket.on("vote", (room: string, song: QueueTrack, vote: string, user: string, cb: any) => {
    const currQueue = queues.find(e => e.id === room)
    const currSong = currQueue?.queue.find(e => e.id === song.id)
    let currVote = currSong?.votes.find(e => e.user === user)
    if (currVote) {
      currVote.voted = vote
    } else {
      currSong?.votes.push({user: user, voted: vote})
      currVote = currSong?.votes.find(e => e.user === user)
    }
    sortQueue(room)
    console.log(currQueue?.queue)
    socket.to(room).emit("queue-sent", { queue: currQueue?.queue })
    cb({vote: currVote?.voted, message: 'Successfully voted', currQueue})
  })
  socket.on("add-song", (room: string, song: Track, cb: any) => {
    if (!room) {
      cb({ errorMsg: 'room doesnt exist '})
      return
    }
    const currQueue = queues.find(e => e.id === room)
    if (!currQueue) {
      cb({ errorMsg: 'queue does not exist' })
      return
    }
    if (currQueue?.queue.filter(e => e.id === song.id).length > 0) {
      cb({ errorMsg: 'song already in queue' })
      return
    }
    const currSong = { ...song, votes: [], voteCount: 0}
    currQueue?.queue.push(currSong)
    sortQueue(room)
    socket.to(room).emit("queue-sent", { queue: currQueue.queue })
    cb({ message: 'Song Added', queue: currQueue?.queue })
  })
  socket.on("get-queue", (room: string, cb: any) => {
    const currQueue = queues.filter((e: Queue) => e.id === room)[0]
    if (!currQueue) {
      cb({ errorMsg: 'queue does not exist'})
      return
    }
    socket.join(room)
    cb({ message: 'queue recieved', queue: currQueue.queue})
  })
  socket.on("play-queue", async (room: string, cb: any) => {
    const currQueue = queues.filter((e: Queue) => e.id === room)[0]
    while (currQueue.queue.length > 0) {
      const nextSong = currQueue.queue[0]
      const playingQueue = await playNextSong(nextSong, currQueue.accessToken)
      if (playingQueue) {
        const currPlaying = currQueue.queue.shift()
        console.log(currQueue.queue)
        socket.to(room).emit("queue-sent", { queue: currQueue.queue, currPlaying })
        cb({ message: 'successfully played', queue: currQueue.queue, currPlaying })
        await playingQueue()
      }
    }
  })
  socket.on("get-vote", (room: string, song: QueueTrack, user:string, cb: any) => {
    const currQueue = queues.filter((e: Queue) => e.id === room)[0]
    const currSong = currQueue?.queue.find(e => e.id === song.id)
    let currVote = currSong?.votes.find(e => e.user === user)
    if (currVote) {
      cb({ voted: currVote.voted, voteCount: currSong?.voteCount })
    } else {
      cb({ voted: 'neutral', voteCount: currSong?.voteCount })
    }
  })
  socket.on("leave-room", (room: string) => {
    socket.leave(room)
  })
  socket.on("disconnecting", () => {
    console.log(socket.rooms);
  });
});