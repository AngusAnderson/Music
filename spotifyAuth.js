let accessToken = null
let tokenExpiry = 0

export const getSpotifyToken = async () => {
  if (accessToken && Date.now() < tokenExpiry) {
    return accessToken
  }

  const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID
  const clientSecret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + btoa(`${clientId}:${clientSecret}`)
    },
    body: 'grant_type=client_credentials'
  })

  const data = await response.json()

  accessToken = data.access_token
  tokenExpiry = Date.now() + data.expires_in * 1000

  return accessToken
}