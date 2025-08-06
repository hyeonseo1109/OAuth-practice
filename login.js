const kakaoLoginButton = document.querySelector('#kakao')
const naverLoginButton = document.querySelector('#naver')
const userImage = document.querySelector('img')
const userName = document.querySelector('#user_name')
const logoutButton = document.querySelector('#logout_button')

function renderUserInfo(imgUrl, name) {
  userImage.src = imgUrl
  userName.textContent = name
}

const kakaoClientId = '4210aaee52831dbcb7127d51bce131d2'
const redirectURI = 'http://127.0.0.1:5500/제출과제/OAuth/index.html'
let kakaoAccessToken = '';

kakaoLoginButton.onclick = () => {
  location.href = `https://kauth.kakao.com/oauth/authorize?client_id=${kakaoClientId}&redirect_uri=${redirectURI}&response_type=code`
}

window.onload = () => {
  const url = new URL(location.href)
  const urlParams = url.searchParams
  const authorizationCode = urlParams.get('code')

  if (authorizationCode) {  // code가 있을 때만 실행
    axios.post('http://localhost:3000/kakao/login', {
      authorizationCode
    })
    .then(res => {
      kakaoAccessToken = res.data
      return axios.post('http://localhost:3000/kakao/userinfo', {kakaoAccessToken})
    })
    .then(res => renderUserInfo(res.data.profile_image, res.data.nickname))
}}

logoutButton.onclick = () => {axios.delete('http://localhost:3000/kakao/logout', {
    data: {kakaoAccessToken}
  })
  .then(res => {
    console.log(res.data)
    renderUserInfo('','')
  })
}
