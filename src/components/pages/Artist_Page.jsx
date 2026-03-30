import React from 'react'
import Header_Image_Card from '../Header_Image_Card'
import Name_Card from '../Name_Card'
import Info_Segment from '../Artist_Page/info_segment'
import Album_Card from '../Artist_Page/album_card'
import { useArtistData } from '../../hooks/useArtistData'
import '../../css/Artist_Page/Artist_Page.css'

const Artist_Page = () => {
  const artistName = "Black Sabbath"
  // const artistName = "Led Zeppelin"
  // const artistName = "The Clash"

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

        <Album_Card artistName={artist.name}/>
      </div>

      
    </div>
  )
}

export default Artist_Page