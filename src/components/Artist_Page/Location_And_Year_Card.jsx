import React from 'react'
import '../../css/Artist_Page/Location_And_Year_Card.css'

const Location_And_Year_Card = ({ location = "", year = "" }) => {
  return (
    <div className='Location_And_Year_Card-Wrapper'>
        <div className='location'>
            {location || 'Location unknown'}
        </div>
        <div className='year'>
            {year || 'Year unknown'}
        </div>
    </div>
  )
}

export default Location_And_Year_Card