import { useWikipediaData } from './useWikipediaData'
import { useSpotifyArtist } from './useSpotifyArtist'
import { useMusicBrainzArtist } from './useMusicBrainzArtist'

export const useArtistData = (artistName) => {
  const wiki = useWikipediaData(artistName)
  const spotify = useSpotifyArtist(artistName)
  const mb = useMusicBrainzArtist(artistName)

  const loading = wiki.loading || spotify.loading || mb.loading

  const data = {
    name: spotify.name || wiki.name,

    genres: spotify.genres?.length
      ? spotify.genres.slice(0, 3)
      : wiki.genres,

    image: wiki.image || spotify.image,

    origin: wiki.origin,
    founded: wiki.founded,

    members: mb.members.length ? mb.members : wiki.members,

    popularity: spotify.popularity || 0,
    followers: spotify.followers || 0,

    loading,
    error: wiki.error || spotify.error || mb.error
  }

  return data
}