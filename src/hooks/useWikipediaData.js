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
          // 🔥 SWITCHED TO HTML INSTEAD OF WIKITEXT
          fetch(
            `https://en.wikipedia.org/w/api.php?action=parse&page=${encodeURIComponent(
              artistName
            )}&prop=text&format=json&origin=*`
          ),
          fetch(
            `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(
              artistName
            )}&prop=pageimages&pithumbsize=1000&format=json&origin=*`
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

        const html = pageData.parse.text['*']

        // 🔥 PARSE HTML
        const parser = new DOMParser()
        const doc = parser.parseFromString(html, 'text/html')

        const infobox = doc.querySelector('.infobox')

        if (!infobox) {
          setData(prev => ({
            ...prev,
            error: 'No infobox found',
            loading: false
          }))
          return
        }

        const rows = infobox.querySelectorAll('tr')

        let name = artistName
        let genres = []
        let origin = ''
        let founded = ''
        let members = []

        rows.forEach(row => {
          const header = row.querySelector('th')
          const value = row.querySelector('td')

          if (!header || !value) return

          const headerText = header.textContent.toLowerCase()

          // --- NAME ---
          if (headerText.includes('name')) {
            name = value.textContent.trim()
          }

          // --- GENRES ---
          if (headerText.includes('genre')) {
            const links = value.querySelectorAll('a')
            genres = Array.from(links)
              .map(link => link.textContent.trim())
              .slice(0, 3)
          }

          // --- ORIGIN ---
          if (headerText.includes('origin')) {
            origin = value.textContent.trim()
          }

          // --- YEARS ACTIVE ---
          if (headerText.includes('years active')) {
            const match = value.textContent.match(/\d{4}/)
            founded = match ? match[0] : ''
          }

          // --- MEMBERS (FIXED) ---
          if (
            headerText.includes('members') ||
            headerText.includes('past members')
          ) {
            const links = value.querySelectorAll('a')

            members = Array.from(links).map(link => ({
              name: link.textContent.trim(),
              role: ''
            }))
          }
        })

        // --- IMAGE (FULL RES) ---
        let image = ''

        const pages = imageData.query.pages
        const pageId = Object.keys(pages)[0]
        const page = pages[pageId]

        if (page.pageimage) {
          const fileName = page.pageimage

          try {
            const fileResponse = await fetch(
              `https://en.wikipedia.org/w/api.php?action=query&titles=File:${encodeURIComponent(
                fileName
              )}&prop=imageinfo&iiprop=url&format=json&origin=*`
            )

            const fileData = await fileResponse.json()
            const filePages = fileData.query.pages
            const filePageId = Object.keys(filePages)[0]
            const filePage = filePages[filePageId]

            if (filePage.imageinfo && filePage.imageinfo[0]) {
              image = filePage.imageinfo[0].url
            }
          } catch (error) {
            console.error('Image fetch error:', error)
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