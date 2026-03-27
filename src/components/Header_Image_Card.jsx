import React from 'react'
import '../css/Header_Image_Card.css'
import header_image from '../assets/Sabs.jpg'

const Header_Image_Card = () => {
  return (
    <div className="header-image-container">
      <img src={header_image} alt="Header Image" className='header-image' />
      <div className="header-overlay"></div>
    </div>
  )
}

export default Header_Image_Card