import React from 'react'
import '../css/Header_Image_Card.css'
import { useWikipediaData } from '../hooks/useWikipediaData'
import fallbackImage from '../assets/Sabs.jpg'

const Header_Image_Card = ({ artistName }) => {
  const { image, loading, error } = useWikipediaData(artistName)

  return (
    <div className="header-image-container">
      <img 
        src={image || fallbackImage} 
        alt={artistName} 
        className='header-image'
        onError={(e) => { e.target.src = fallbackImage }}
      />
      <div className="header-overlay"></div>
    </div>
  )
}

export default Header_Image_Card