"use client";
import { useEffect, useState } from "react";

export default function Search({ session }: { session: any }) {
  const [search, setSearch] = useState();
  const [song, setSong] = useState();

  const handleClick = (action: string) => {
    fetch(`https://api.spotify.com/v1/search?q=${song}&type=track%2Calbum%2Cartist/`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.data.user.accessToken}`,
      },
      method: "GET",
    })
    .catch(err => console.error(err))
  } 
  useEffect(() => {
    let test = search?.split(' ')
    let result = test?.map((word) => {
        return `${word}`
    })
    result = result?.join(' ').replace(/\s+/g, "+")
    console.log(result, "this is the end")
    // setSearch(test)
  }, [search])
  


  return (
    <div className="flex-col">
    <input onChange={(event) => {
        setSearch(event?.target.value)
    }} type="text" />
    </div>
  );
}
