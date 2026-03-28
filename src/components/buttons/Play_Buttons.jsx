import React, { useRef } from 'react'
import '../../css/buttons/Play_Button.css'
import clickSound from '../../assets/sounds/clickSound.wav'

const Play_Button = () => {
    const audioRef = useRef(null)
  
    const handleClick = () => {
      if (audioRef.current) {
        audioRef.current.currentTime = 0
        audioRef.current.play()
      }
    }
  
    return (
      <div className="button-container">
        <audio ref={audioRef} src={clickSound} />
        <button className='btn-3d' onClick={handleClick}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-play-fill play-svg" viewBox="0 0 16 16">
                <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393"/>
            </svg>
        </button>
      </div>
    )
  }
  
  export default Play_Button