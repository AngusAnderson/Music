import React from 'react'
import Play_Button from './buttons/Play_Buttons'

const Name_Card = ({ name }) => {
  return (
    <div className='info'>
      <h1>{name}</h1>
      <Play_Button />
    </div>
  )
}

export default Name_Card