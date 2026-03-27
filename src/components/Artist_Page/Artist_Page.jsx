import React from 'react'
import Header_Image_Card from '../Header_Image_Card'
import Name_Card from '../Name_Card'
import Info_Segment from './info_segment'
import '../../css/Artist_Page/Artist_Page.css'

const Artist_Page = () => {
  return (
    <div className='artist-page'>
        <Header_Image_Card />
        <div className="container">
            <Name_Card />
            <Info_Segment />
        </div>
    </div>
   
  )
}

export default Artist_Page
