import { useWikipediaData } from './useWikipediaData'
import { useSpotifyArtist } from './useSpotifyArtist'

export const useArtistData = (artistName) => {
  const wiki = useWikipediaData(artistName)
  const spotify = useSpotifyArtist(artistName)

  const loading = wiki.loading || spotify.loading

  const data = {
    name: spotify.name || wiki.name,

    genres: (spotify.genres && spotify.genres.length)
      ? spotify.genres.slice(0, 3)
      : wiki.genres,

    image: wiki.image || spotify.image,

    origin: wiki.origin,
    founded: wiki.founded,
    members: wiki.members,

    popularity: spotify.popularity,
    followers: spotify.followers,

    loading,
    error: wiki.error || spotify.error
  }

  return data
}