import React from 'react'
import Genre_carousel from '../Genre_carousel';
import Location_And_Year_Card from './Location_And_Year_Card';
import Credit_Card from './Credit_Card';
import '../../css/Artist_Page/info_segment.css'


const Info_Segment = () => {
  return (
    <div className='wrapper'>
        
        <div className="LHS">
            <Genre_carousel />
            <Location_And_Year_Card />
        </div>
        <div className="RHS">
            <Credit_Card />
        </div>
        
    </div>
  )
}

export default Info_Segment