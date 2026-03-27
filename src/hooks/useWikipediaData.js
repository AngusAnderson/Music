import { useState, useEffect } from 'react'

export const useWikipediaData = (artistName) => {
  const [data, setData] = useState({
    name: '',
    genres: [],
    origin: '',
    founded: '',
    members: [],
    image: '',
    loading: true,
    error: null
  })

  useEffect(() => {
    const fetchWikipediaData = async () => {
      try {
        const [pageResponse, imageResponse] = await Promise.all([
          fetch(
            `https://en.wikipedia.org/w/api.php?action=parse&page=${encodeURIComponent(
              artistName
            )}&prop=wikitext&format=json&origin=*`
          ),
          fetch(
            `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(
              artistName
            )}&prop=pageimages&pithumbsize=500&format=json&origin=*`
          )
        ])

        const pageData = await pageResponse.json()
        const imageData = await imageResponse.json()

        if (pageData.error) {
          setData(prev => ({
            ...prev,
            error: 'Page not found',
            loading: false
          }))
          return
        }

        const wikitext = pageData.parse.wikitext['*']

        // Extract infobox
        const infoboxMatch = wikitext.match(
          /\{\{Infobox musical artist([\s\S]*?)\n\}\}/
        )

        if (!infoboxMatch) {
          setData(prev => ({
            ...prev,
            error: 'No infobox found',
            loading: false
          }))
          return
        }

        const infobox =
          '{{Infobox musical artist' + infoboxMatch[1] + '\n}}'

        // --- HELPERS ---

        const extractFieldRaw = (text, fieldName) => {
          const startRegex = new RegExp(`\\|\\s*${fieldName}\\s*=`, 'i')
          const startMatch = text.match(startRegex)
          if (!startMatch) return ''

          let index = startMatch.index + startMatch[0].length
          let braceDepth = 0
          let result = ''

          while (index < text.length) {
            // Handle nested templates {{ }}
            if (text.slice(index, index + 2) === '{{') {
              braceDepth++
              result += '{{'
              index += 2
              continue
            }

            if (text.slice(index, index + 2) === '}}') {
              braceDepth--
              result += '}}'
              index += 2
              continue
            }

            // Stop at next field if NOT inside template
            if (braceDepth === 0 && text[index] === '|') {
              break
            }

            result += text[index]
            index++
          }

          return result.trim()
        }

        const cleanText = (text) => {
          return text
            .replace(/\{\{[^}]*\}\}/g, '')
            .replace(/\[\[/g, '')
            .replace(/\]\]/g, '')
            .replace(/<[^>]*>/g, '')
            .replace(/\n/g, ' ')
            .replace(/\|/g, '')
            .trim()
        }

        // --- NAME ---
        const name =
          cleanText(extractFieldRaw(infobox, 'name')) || artistName

        // --- GENRES ---
        let genres = []
        const rawGenre = extractFieldRaw(infobox, 'genre')

        if (rawGenre) {
          const matches = rawGenre.match(
            /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g
          )

          if (matches) {
            genres = matches.map(g =>
              g.replace(/\[\[|\]\]/g, '').split('|')[0].trim()
            )
          }
        }

        genres = genres.slice(0, 3)

        // --- ORIGIN ---
        const origin = cleanText(extractFieldRaw(infobox, 'origin'))

        // --- FOUNDED ---
        let founded = ''
        const yearsActive = extractFieldRaw(infobox, 'years_active')
        if (yearsActive) {
          const yearMatch = yearsActive.match(/\d{4}/)
          founded = yearMatch ? yearMatch[0] : ''
        }

        // --- MEMBERS ---
        let members = []
        const memberFields = ['members', 'past_members', 'current_members']

        for (const field of memberFields) {
          const raw = extractFieldRaw(infobox, field)

          if (raw) {
            const matches = raw.match(
              /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g
            )

            if (matches) {
              members = matches.map(m => ({
                name: m
                  .replace(/\[\[|\]\]/g, '')
                  .split('|')[0]
                  .replace(/\(.*?\)/g, '')
                  .trim(),
                role: ''
              }))
              break
            }
          }
        }

        // --- IMAGE ---
        let image = ''
        const pages = imageData.query.pages
        const pageId = Object.keys(pages)[0]
        const page = pages[pageId]

        if (page.pageimage) {
          try {
            const fileResponse = await fetch(
              `https://en.wikipedia.org/w/api.php?action=query&titles=File:${encodeURIComponent(
                page.pageimage
              )}&prop=imageinfo&iiprop=url&format=json&origin=*`
            )

            const fileData = await fileResponse.json()
            const filePages = fileData.query.pages
            const filePageId = Object.keys(filePages)[0]
            const filePage = filePages[filePageId]

            if (filePage.imageinfo && filePage.imageinfo[0]) {
              image = filePage.imageinfo[0].url
            }
          } catch (err) {
            console.error('Image fetch error:', err)
          }
        }

        // --- FINAL STATE ---
        setData({
          name,
          genres,
          origin,
          founded,
          members,
          image,
          loading: false,
          error: null
        })

      } catch (error) {
        console.error('Error fetching Wikipedia data:', error)
        setData(prev => ({
          ...prev,
          error: error.message,
          loading: false
        }))
      }
    }

    fetchWikipediaData()
  }, [artistName])

  return data
}