const express = require("express")
const cors = require("cors")

const SpotifyWebApi = require("spotify-web-api-node")

const app =express()
 app.use(cors())
app.use(express.json())

app.post('/refreh',(req,res)=>{
    const refreshToken = req.body.refreshToken
    console.log(refreshToken);
    const spotifyApi = new SpotifyWebApi({
        redirectUri : 'http://localhost:3000',
        clientId: 'b8ee9c6e1a96452887be6037f89f4edb',
        clientSecret: '943327aa9f3a493685e6aed9e3c0a6df',
        refreshToken, 
        
    })
    spotifyApi.refreshAccessToken().then(
        (data)=> {
        res.json({
            accessToken: data.body.accessToken,
            expiresIn: data.body.expiresIn
        })
      
          
          spotifyApi.setAccessToken(data.body['access_token']);
        }).catch(()=>{
            console.log(err)
            res.sendStatus(400)
        })
})

app.post('/login',(req,res)=>{
     const code = req.body.code
     const spotifyApi = new SpotifyWebApi({
        redirectUri : 'http://localhost:3000',
        clientId: 'b8ee9c6e1a96452887be6037f89f4edb',
        clientSecret: '943327aa9f3a493685e6aed9e3c0a6df'
        
    })
    spotifyApi
    .authorizationCodeGrant(code)
    .then(data => {
        res.json({
            accessToken: data.body.access_token,
            refreshToken: data.body.refresh_token,
            expiresIn: data.body.expires_in,
        })
    })
    .catch(()=>{
        res.sendStatus(400)
    })
})
app.listen(3001)