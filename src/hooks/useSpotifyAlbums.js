import { useState, useEffect } from 'react'
import { getSpotifyToken } from '../../spotifyAuth'

export const useSpotifyAlbums = (artistName) => {
  const [albums, setAlbums] = useState([])

  useEffect(() => {
    const fetchAlbums = async () => {
      const token = await getSpotifyToken()

      const searchRes = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(artistName)}&type=artist&limit=1`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )

      const searchData = await searchRes.json()
      const artist = searchData.artists.items[0]

      if (!artist) return

      const albumRes = await fetch(
        `https://api.spotify.com/v1/artists/${artist.id}/albums?include_groups=album&limit=10`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )

      const albumData = await albumRes.json()

      setAlbums(albumData.items)
    }

    fetchAlbums()
  }, [artistName])

  return albums
}