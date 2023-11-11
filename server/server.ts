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
}

interface Queue {
  id: string;
  queue: QueueTrack[];
}

const queues: Queue[] = [];

const sortQueue = (queueId: string) => {
  const sortingQueue = queues.find((e) => e.id === queueId);
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
    a.votes.forEach((curr) => {
      if (curr.voted === "upvoted") {
        aCount++;
        return;
      } else if (curr.voted === "downvoted") {
        aCount--;
        return
      }
    });
    console.log(bCount, aCount)
    return bCount - aCount
  });
  console.log(sortingQueue)
};

io.on("connection", (socket: any) => {
  console.log(socket.id);
  socket.on("create-queue", (room: string, queue: QueueTrack[], cb: any) => {
    if (queues.filter((q: any) => q.id === room).length > 0) {
      cb({ errorMsg: "room name already taken" });
    } else {
      socket.join(room);

      queues.push({ id: room, queue });
      console.log(queues);

      cb({
        message: `Created ${room}`,
        room: queues.filter((q: any) => q.id === room)[0].id,
      });
    }
  });
  socket.on("join-queue", (room: string, cb: any) => {
    socket.join(room);
    cb({
      message: `Joined ${room}`,
      queue: queues.filter((q: any) => q.id === room),
    });
  });
  socket.on("delete-queue", (room: string, cb: any) => {
    const delQueue = queues.map((e: any) => e.id).indexOf(room);
    queues.splice(delQueue, 1);
    cb({ message: `Ended ${room}`, queues });
  });
  socket.on("vote", (room: string, song: string, vote: string, user: string, cb: any) => {
    const currQueue = queues.find(e => e.id === room)
    const currSong = currQueue?.queue.find(e => e.name === song)
    let currVote = currSong?.votes.find(e => e.user === user)
    if (currVote) {
      currVote.voted = vote
    } else {
      currSong?.votes.push({user: user, voted: vote})
      currVote = currSong?.votes.find(e => e.user === user)
    }
    sortQueue(room)
    cb({vote: currVote?.voted, message: 'Successfully voted', currQueue})
  })
  socket.on("add-song", (room: string, song: Track, user: string, cb: any) => {
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
    const currSong = { ...song, votes: []}
    currQueue?.queue.push(currSong)
    sortQueue(room)
    cb({ message: 'Song Added', queue: currQueue?.queue })
  })
  socket.on("get-queue", (room: string, cb: any) => {
    const currQueue = queues.filter((e: Queue) => e.id === room)[0]
    if (!currQueue) {
      cb({ errorMsg: 'queue does not exist'})
      return
    }
    cb({ message: 'queue recieved', queue: currQueue.queue})
  })
  socket.on("disconnecting", () => {
    console.log(socket.rooms);
  });
});