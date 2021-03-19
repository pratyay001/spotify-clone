
import {useState,useEffect}from 'react'
import {Container, Form} from 'react-bootstrap' 
import useAuth from "./useAuth"; 
import SpotifyWebApi from 'spotify-web-api-node'
import TrackSearchResult from './TrackSearchResult'
import Player from './Player'


const spotifyApi = new SpotifyWebApi({
    clientId: "b8ee9c6e1a96452887be6037f89f4edb",
}) 

export default function Dashboard({code}) {
    const accessToken= useAuth(code)
    const [search, setSearch] = useState("")
    const [searchResults, setSearchResults] = useState([])
    const [playingTrack, setPlayingTrack] = useState()
    console.log(searchResults)

    function chooseTrack(track){
        setPlayingTrack(track)
        setSearch('')
    }

    useEffect(() => {
        if(!accessToken) return
        spotifyApi.setAccessToken(accessToken)
    }, [accessToken])

    useEffect(()=>{
        if (!search) return setSearchResults([])
        if(!accessToken) return

        let cancel = false
        spotifyApi.searchTracks(search).then(res=>{
           setSearchResults( res.body.tracks.items.map(track =>{
               if(cancel) return
                const smallestAlbumImage = track.album.images.reduce((smallest,image)=>{
                    if(image.heigth < smallest.height) return image
                    return smallest
                },track.album.images[0])
                return {
                    artist: track.artists[0].name,
                    title: track.name,
                    uri: track.uri,
                    albumUrl: smallestAlbumImage.url
                }
            }))
        })
      return ()=> cancel = true  
    },[search,accessToken])

    return (
        <Container
        className="d-flex flex-column py-2" style={{ heigth: "100vh"}}>
            <Form.Control 
                type='search'
                placeholder="Search Songs/Artists"
                value={search}
                onChange={e => setSearch(e.target.value)}/>
            <div className='flex-grow-1 my-2' style={{ overflowY: "auto"}}>
                {searchResults.map(track => (
                    <TrackSearchResult track={track} key={track.uri} chooseTrack={chooseTrack} />
                ))}
            </div>
            <div><Player accessToken={accessToken} trackUri={playingTrack?.uri} /></div>
        </Container>
    );
}
