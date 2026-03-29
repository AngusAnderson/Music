import React from 'react'
import { useSpotifyAlbums } from '../../hooks/useSpotifyAlbums'
import '../../css/Artist_Page/album_card.css'

const Album_Card = ({ artistName }) => {
    const albums = useSpotifyAlbums(artistName)
  
    if (!albums || albums.length === 0) {
      return <div className='album-wrapper'>No albums found</div>
    }
  
    const sortedAlbums = [...albums].sort((a, b) => 
      new Date(a.release_date) - new Date(b.release_date)
    )
  
    return (
      <div className='album-wrapper'>
        {sortedAlbums.map((album, index) => (
          <div key={album.id} className={`card card-${index + 1}`}>
            <div className="album-image">
              {album.images[0] && (
                <img src={album.images[0].url} alt={album.name} />
              )}
            </div>
            <div className="album-info">
              <h3 className="album-name">{album.name}</h3>
              <p className="album-year">
                {new Date(album.release_date).getFullYear()}
              </p>
              <p className="album-tracks">
                {album.total_tracks} tracks
              </p>
            </div>
          </div>
        ))}
      </div>
    )
  }
  
  export default Album_Card