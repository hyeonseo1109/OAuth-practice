const kakaoLoginButton = document.querySelector('#kakao')
const naverLoginButton = document.querySelector('#naver')
const userImage = document.querySelector('img')
const userName = document.querySelector('#user_name')
const logoutButton = document.querySelector('#logout_button')

let currentOAuthService = '';

function renderUserInfo(imgUrl, name) {
  userImage.src = imgUrl
  userName.textContent = name
}

const kakaoClientId = '4210aaee52831dbcb7127d51bce131d2'
const redirectURI = 'http://127.0.0.1:5500/제출과제/OAuth/index.html'
let kakaoAccessToken = '';

const naverClientId = 'BaxbedIZXwNZ558DUREN' 
const naverClientSecret = '_FlyC_25bI'
const naverSecret = 'it_is_me'
let naverAccessToken = '';


kakaoLoginButton.onclick = () => {
  location.href = `https://kauth.kakao.com/oauth/authorize?client_id=${kakaoClientId}&redirect_uri=${redirectURI}&response_type=code`
}

naverLoginButton.onclick = () => {
  location.href = `https://nid.naver.com/oauth2.0/authorize?client_id=${naverClientId}&response_type=code&redirect_uri=${redirectURI}&state=${naverSecret}`
}

window.onload = () => {
  const url = new URL(location.href)
  const urlParams = url.searchParams
  const authorizationCode = urlParams.get('code')
  const naverState = urlParams.get('state')

  if (authorizationCode) {
    if (naverState) {
      axios.post('http://localhost:3000/naver/login', {
        authorizationCode
      })
      .then( res => {
        naverAccessToken = res.data
        return axios.post('http://localhost:3000/naver/userinfo', {naverAccessToken})
      })
      .then (res => {
        renderUserInfo(res.data.profile_image, res.data.name)
        currentOAuthService = 'naver'
      })
    
    } else {  // code가 있을 때만 실행
      axios.post('http://localhost:3000/kakao/login', {
        authorizationCode
      })
      .then(res => {
        kakaoAccessToken = res.data
        return axios.post('http://localhost:3000/kakao/userinfo', {kakaoAccessToken})
      })
      .then(res => {
        renderUserInfo(res.data.profile_image, res.data.nickname)
        currentOAuthService = 'kakao'
      })
  }}}

logoutButton.onclick = () => {
  if (currentOAuthService === 'kakao') {
    axios.delete('http://localhost:3000/kakao/logout', {
      data: { kakaoAccessToken }
    })
      .then(res => {
        console.log(res.data)
        renderUserInfo('', '')
      })
  } else if (currentOAuthService === 'naver') {
    axios.delete('http://localhost:3000/naver/logout', {
      data: { naverAccessToken }
    })
      .then(res => {
        console.log(res.data)
        renderUserInfo('', '')
      })
  }
}

