import NextAuth from "next-auth/next";
import SpotifyProvider from "next-auth/providers/spotify";

const clientId = process.env.CLIENT_ID as string
const clientSecret = process.env.CLIENT_SECRET as string
const secret = process.env.SECRET as string

const scopes = [
    "user-read-email",
    "playlist-read-private",
    "playlist-read-collaborative",
    "user-read-email",
    "streaming",
    "user-read-private",
    "user-library-read",
    "user-top-read",
    "app-remote-control",
    "streaming",
    "user-read-playback-position",
    "user-top-read",
    "user-read-recently-played",
    "user-read-playback-state",
    "user-modify-playback-state",
    "user-read-currently-playing",
].join(",")

const params = {
    scope: scopes
}

const queryParamString = new URLSearchParams(params);
const LOGIN_URL = `https://accounts.spotify.com/authorize?` + queryParamString.toString();

export const authOptions = {
    providers: [
        SpotifyProvider({
            clientId,
            clientSecret,
            authorization: LOGIN_URL,
            profile(profile) {
                return {
                    id: profile.id,
                    image: profile.images?.[0]?.url
                }
            }
        })
    ],
    secret
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST}