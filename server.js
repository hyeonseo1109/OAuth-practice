require('dotenv').config();
const express = require('express')
const cors = require('cors')
const axios = require('axios')

const kakaoClientId = process.env.KAKAO_CLIENT_ID;
const redirectURI = process.env.KAKAO_REDIRECT_URI;


const app = express()

app.use(cors({
  origin: ['http://127.0.0.1:5500', 'http://localhost:5500'],
  methods: ['OPTIONS', 'POST', 'DELETE', 'GET'],
  allowedHeaders: ['Content-Type', 'Authorization'], 
}))

app.use(express.json())

app.post('/kakao/login', (req, res) => {
  const authorizationCode = req.body.authorizationCode
  const data = `grant_type=authorization_code&client_id=${kakaoClientId}&redirect_uri=${redirectURI}&code=${authorizationCode}`

  axios.post('https://kauth.kakao.com/oauth/token', data, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' }
  })
  .then(response => {
    console.log(response.data.access_token)
    res.send(response.data.access_token)
  })
  .catch(error => {
    console.error(error.response ? error.response.data : error.message)
    res.status(500).send('토큰 요청 실패')
  })
})


app.post('/kakao/userinfo', (req, res) => {
  const {kakaoAccessToken} = req.body
  axios.get('https://kapi.kakao.com/v2/user/me', {
    headers: {
      Authorization: `Bearer ${kakaoAccessToken}`,
      'Content-Type' : 'application/x-www-form-urlencoded;charset=utf-8'
    }
  })
  .then(response => res.json(response.data.properties))
})

app.delete('/kakao/logout', (req, res) => {
  const { kakaoAccessToken } = req.body;
  axios.post('https://kapi.kakao.com/v1/user/logout', {}, {
    headers: {Authorization: `Bearer ${kakaoAccessToken}`}
  })
  .then(response => res.send('로그아웃 성공'))
})

app.listen(3000, () => console.log('서버 열림'))