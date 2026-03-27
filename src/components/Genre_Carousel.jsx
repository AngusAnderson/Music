import React from 'react'
import '../css/Genre_Carousel.css'

const Genre_carousel = ({ genres = [] }) => {
  return (
    <div className='genre-wrapper'>
        {genres.length > 0 ? genres.join(' • ') : 'No genres available'}
    </div>
  )
}

export default Genre_carousel