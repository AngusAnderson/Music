import React from 'react'
import { useWikipediaData } from '../hooks/useWikipediaData'

const Name_Card = ({ artistName }) => {
  const { name, loading, error } = useWikipediaData(artistName)

  if (loading) return <div className="name-card loading">Loading...</div>
  if (error) return <div className="name-card error">Error: {error}</div>

  return (
    <div className='info'>
      <h1>{name}</h1>
    </div>
  )
}

export default Name_Card