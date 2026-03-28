import React from 'react'
import Header_Image_Card from '../Header_Image_Card'
import Name_Card from '../Name_Card'
import Info_Segment from './info_segment'
import { useArtistData } from '../../hooks/useArtistData'
import '../../css/Artist_Page/Artist_Page.css'

const Artist_Page = () => {
  const artistName = "Sex Pistols" // You can replace this with dynamic input later

  const artist = useArtistData(artistName)

  if (artist.loading) {
    return <div className="artist-page">Loading...</div>
  }

  if (artist.error) {
    return <div className="artist-page">Error: {artist.error}</div>
  }

  return (
    <div className='artist-page'>
      <Header_Image_Card image={artist.image} name={artist.name} />

      <div className="container">
        <Name_Card name={artist.name} />

        <Info_Segment 
          genres={artist.genres}
          origin={artist.origin}
          founded={artist.founded}
          members={artist.members}
          popularity={artist.popularity}
          followers={artist.followers}
        />
      </div>
    </div>
  )
}

export default Artist_Page