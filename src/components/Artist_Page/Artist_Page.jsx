import React from 'react'
import Header_Image_Card from '../Header_Image_Card'
import Name_Card from '../Name_Card'
import Info_Segment from './info_segment'
import '../../css/Artist_Page/Artist_Page.css'

const Artist_Page = () => {
  const artistName = "The Clash" // You can replace this with dynamic data later

  return (
    <div className='artist-page'>
      <Header_Image_Card artistName={artistName} />
      <div className="container">
        <Name_Card artistName={artistName} />
        <Info_Segment artistName={artistName} />
      </div>
    </div>
  )
}

export default Artist_Page