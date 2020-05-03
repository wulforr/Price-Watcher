import axios from 'axios'
const baseUrl = 'http://localhost:5000/api/user'

let token = null

const setToken = newToken => {
  token = `bearer ${newToken}`
  // console.log(token)
}

const getWatchers = async () => {
  const config = {
    headers: { Authorization: token}
  }
  // console.log(token,config)
  const res = await axios.get(baseUrl, config)
  // console.log(res.data)
  return res.data
}

export default {setToken, getWatchers}