import React from 'react'
import Genre_carousel from '../Genre_Carousel';
import Location_And_Year_Card from './Location_And_Year_Card';
import Credit_Card from './Credit_Card';
import { useWikipediaData } from '../../hooks/useWikipediaData'
import '../../css/Artist_Page/info_segment.css'
import '../../css/info_card.css'


const Info_Segment = ({ artistName }) => {
  const { genres, origin, founded, members, name, loading, error } = useWikipediaData(artistName)

  if (loading) return <div className="wrapper loading">Loading...</div>
  if (error) return <div className="wrapper error">Error: {error}</div>

  return (
    <div className='wrapper'>
        
        <div className="LHS">
            <Genre_carousel genres={genres} />
            <Location_And_Year_Card location={origin} year={founded} />
        </div>
        <div className="RHS">
            <Credit_Card members={members} />
        </div>
        
    </div>
  )
}

export default Info_Segment
