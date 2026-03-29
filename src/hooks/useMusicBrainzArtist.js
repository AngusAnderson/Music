import { useState, useEffect } from 'react'

export const useMusicBrainzArtist = (artistName) => {
  const [data, setData] = useState({
    members: [],
    loading: true,
    error: null
  })

  useEffect(() => {
    const fetchMusicBrainz = async () => {
      try {
        // --- STEP 1: SEARCH ARTIST ---
        const searchRes = await fetch(
          `https://musicbrainz.org/ws/2/artist/?query=${encodeURIComponent(artistName)}&fmt=json`
        )

        const searchData = await searchRes.json()
        const artist = searchData.artists?.[0]

        if (!artist) {
          setData({ members: [], loading: false, error: 'Artist not found' })
          return
        }

        // --- STEP 2: GET DETAILS ---
        const detailRes = await fetch(
          `https://musicbrainz.org/ws/2/artist/${artist.id}?inc=artist-rels&fmt=json`
        )

        const detailData = await detailRes.json()

        // --- STEP 3: EXTRACT MEMBERS + ROLE ---
        const membersRaw = (detailData.relations || [])
          .filter(rel => rel.type === 'member of band')
          .map(rel => ({
            name: rel.artist.name,
            begin: rel.begin || null,
            end: rel.end || null,
            role: rel.attributes?.[0] || '' // first role only
          }))

        // --- STEP 4: REMOVE DUPLICATES ---
        const uniqueMap = new Map()
        membersRaw.forEach(m => {
          if (!uniqueMap.has(m.name)) {
            uniqueMap.set(m.name, m)
          }
        })
        const members = Array.from(uniqueMap.values())

        // --- STEP 5: FIND ORIGINAL MEMBERS ---
        let originalMembers = []

        const years = members
          .map(m => m.begin)
          .filter(Boolean)
          .map(y => y.slice(0, 4))

        const earliestYear = years.sort()[0]

        if (earliestYear) {
          originalMembers = members.filter(m =>
            m.begin && m.begin.startsWith(earliestYear)
          )
        }

        // fallback: no end date
        if (!originalMembers.length) {
          originalMembers = members.filter(m => !m.end)
        }

        // fallback: all
        if (!originalMembers.length) {
          originalMembers = members
        }

        // --- STEP 6: WIKIPEDIA ROLE FALLBACK ---
        const fetchWikipediaRole = async (name) => {
          try {
            const res = await fetch(
              `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(name)}`
            )
            const data = await res.json()

            if (data.extract) {
              const text = data.extract.toLowerCase()

              if (text.includes('guitar')) return 'Guitar'
              if (text.includes('drum')) return 'Drums'
              if (text.includes('bass')) return 'Bass'
              if (text.includes('vocal')) return 'Vocals'
              if (text.includes('keyboard')) return 'Keys'
            }
          } catch (e) {
            console.error('Wiki role fetch failed:', e)
          }

          return ''
        }

        const enrichedMembers = await Promise.all(
          originalMembers.map(async (m) => {
            if (!m.role) {
              const wikiRole = await fetchWikipediaRole(m.name)
              return { ...m, role: wikiRole }
            }
            return m
          })
        )

        // --- FINAL ---
        setData({
          members: enrichedMembers.map(m => ({
            name: m.name,
            role: m.role || ''
          })),
          loading: false,
          error: null
        })

      } catch (error) {
        console.error('MusicBrainz error:', error)
        setData({
          members: [],
          loading: false,
          error: error.message
        })
      }
    }

    fetchMusicBrainz()
  }, [artistName])

  return data
}