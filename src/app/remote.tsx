"use client";
import { useEffect, useState } from "react";

export default function Remote({ session }: { session: any }) {
  const [device, setDevice] = useState();
  console.log(device)

  const handleClick = (action: string) => {
    fetch(`https://api.spotify.com/v1/me/player/${action}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.data.user.accessToken}`,
      },
      method: "PUT",
    })
    .catch(err => console.error(err))
  } 

  useEffect(() => {
    fetch("https://api.spotify.com/v1/me/player/devices", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.data.user.accessToken}`,
      },
      method: "GET",
    })
      .then(async (res) => {
        const resp = await res.json();
        setDevice(resp.devices.filter((d: any) => d.name === "iPhone")[0])
      })
      .catch((err) => console.error(err));
  }, []);
  return (
    <div className="flex-col">
      <button onClick={() => handleClick('play')}>Play</button>
      <button onClick={() => handleClick('pause')}>Pause</button>
    </div>
  );
}
