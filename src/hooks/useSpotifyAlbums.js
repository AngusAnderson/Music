import { useState, useEffect } from 'react'
import { getSpotifyToken } from '../../spotifyAuth'

export const useSpotifyAlbums = (artistName) => {
  const [albums, setAlbums] = useState([])

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const token = await getSpotifyToken()

        // --- SEARCH ARTIST ---
        const searchRes = await fetch(
          `https://api.spotify.com/v1/search?q=${encodeURIComponent(artistName)}&type=artist&limit=1`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        )

        const searchData = await searchRes.json()
        console.log('SEARCH DATA:', searchData)

        const artist = searchData?.artists?.items?.[0]

        if (!artist || !artist.id) {
          console.error('❌ Artist not found:', artistName)
          setAlbums([])
          return
        }

        console.log('✅ Artist ID:', artist.id)

        // --- FETCH ALBUMS (FIXED REQUEST) ---
        let allAlbums = []
        let url = `https://api.spotify.com/v1/artists/${artist.id}/albums?include_groups=album`

        while (url) {
          const res = await fetch(url, {
            headers: { Authorization: `Bearer ${token}` }
          })

          if (!res.ok) {
            const errorText = await res.text()
            console.error('❌ Album fetch failed:', errorText)
            setAlbums([])
            return
          }

          const data = await res.json()
          console.log('ALBUM PAGE:', data)

          allAlbums = [...allAlbums, ...(data.items || [])]
          url = data.next
        }

        // --- REMOVE DUPLICATES (clean names) ---
        const uniqueAlbums = allAlbums.filter(
          (album, index, self) =>
            index === self.findIndex(a =>
              a.name.toLowerCase().replace(/\(.*?\)/g, '') ===
              album.name.toLowerCase().replace(/\(.*?\)/g, '')
            )
        )

        // --- SORT OLDEST → NEWEST ---
        const sortedAlbums = uniqueAlbums.sort(
          (a, b) => new Date(a.release_date) - new Date(b.release_date)
        )

        setAlbums(sortedAlbums)

      } catch (error) {
        console.error('🔥 Spotify Albums Error:', error)
        setAlbums([])
      }
    }

    fetchAlbums()
  }, [artistName])

  return albums
}