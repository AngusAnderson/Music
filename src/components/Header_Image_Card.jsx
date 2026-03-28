import React from 'react'
import '../css/Header_Image_Card.css'
import fallbackImage from '../assets/Sabs.jpg'

const Header_Image_Card = ({ image, name }) => {
  return (
    <div className="header-image-container">
      <img 
        src={image || fallbackImage} 
        alt={name} 
        className='header-image'
        onError={(e) => { e.target.src = fallbackImage }}
      />
      <div className="header-overlay"></div>
    </div>
  )
}

export default Header_Image_Card