import { Track } from "@spotify/web-api-ts-sdk";

declare global {
  type Vote = {
    voted: string;
    user: string;
  };
  
  type QueueTrack = Track & { votes: Vote[] };
}

