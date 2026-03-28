import { useState, useEffect } from 'react'
import { getSpotifyToken } from '../../spotifyAuth'

export const useSpotifyArtist = (artistName) => {
  const [data, setData] = useState({
    name: '',
    genres: [],
    image: '',
    popularity: 0,
    followers: 0,
    loading: true,
    error: null
  })

  useEffect(() => {
    const fetchSpotifyData = async () => {
      try {
        const token = await getSpotifyToken()

        const searchRes = await fetch(
          `https://api.spotify.com/v1/search?q=${encodeURIComponent(artistName)}&type=artist&limit=1`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

        const searchData = await searchRes.json()
        const artist = searchData.artists.items[0]

        if (!artist) {
          setData(prev => ({
            ...prev,
            error: 'Artist not found',
            loading: false
          }))
          return
        }

        setData({
          name: artist.name,
          genres: artist.genres,
          image: artist.images?.[0]?.url || '',
          popularity: artist.popularity,
          followers: artist.followers?.total || 0,
          loading: false,
          error: null
        })

      } catch (error) {
        console.error('Spotify error:', error)
        setData(prev => ({
          ...prev,
          error: error.message,
          loading: false
        }))
      }
    }

    fetchSpotifyData()
  }, [artistName])

  return data
}