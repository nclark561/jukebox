"use client"
import { useEffect, useState, useMemo } from "react";
import { signOut, useSession } from "next-auth/react";
import { Caramel } from "next/font/google";

export default function Test() {

    const [spotifyUserId, setSpotifyUserId] = useState<string>()
    const [images, setImages] = useState<string[]>([])
    const [playlistsInfo, setPlaylistsInfo] = useState<{ id: string; name: string }[]>([])
    const session = useSession()
    useEffect(() => {
        if (session?.data) {
            const playlists = async () => {
                const response = await fetch(`https://api.spotify.com/v1/me `, {
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${session?.data?.user?.accessToken}`,
                    },
                    method: "GET",
                })
                const spotifyInformation = await response.json()
                    .catch(err => console.error(err))
                setSpotifyUserId(spotifyInformation.id)
            }

            playlists()
        }
    }, [session])

    useEffect(() => {
        if (spotifyUserId) {
            const getPlaylists = async () => {
                try {
                    const response = await fetch(`https://api.spotify.com/v1/users/${spotifyUserId}/playlists`, {
                        headers: {
                            Accept: "application/json",
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${session.data?.user?.accessToken}`,
                        },
                        method: "GET",
                    })
                    const playlists = await response.json()
                    if (playlists.items) {
                        let playlistsInfo = playlists.items.map((item) => {
                            return { id: item.id, name: item.name }
                        })
                        setPlaylistsInfo(playlistsInfo)
                    }
                } catch (err) {
                    console.error(err)
                }
            }
            getPlaylists()
        }

    }, [spotifyUserId])

    const playlistImages = useMemo(async () => {
        if (playlistsInfo.length > 0) {
            const imageUrls = await Promise.all(playlistsInfo.map((item, index) => {
                return new Promise<string>(async (resolve, reject) => {
                    try {
                        const response = await fetch(`https://api.spotify.com/v1/playlists/${item.id}/images`, {
                            headers: {
                                Accept: "application/json",
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${session?.data?.user?.accessToken}`,
                            },
                            method: "GET",
                        })
                        const images = await response.json()                    
                        resolve(images[0].url)
                    }catch(err) {
                        reject(err)
                    }
                    
                })
            }))
            setImages(imageUrls)
        }
    }, [playlistsInfo])


    return <div>{images.map((image) => {
        return <div>{image}</div>
    })}</div>
}