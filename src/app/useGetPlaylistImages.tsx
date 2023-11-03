
const getPlaylistImage = (playlistId: string) => {
    return new Promise(async (resolve) => {
        const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/images`, {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${session.data.user.accessToken}`,
            },
            method: "GET",
        })
        const test = await response.json()
            .catch(err => console.error(err))
        resolve(test.url[1].url)
    })
}

export const useGetPlaylistImages = (ids: string[]) => {
    return {
        images: [],
        loading: true
    }
} 