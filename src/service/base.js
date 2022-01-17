import axios from 'axios'

const ERR_OK = 0
axios.defaults.baseURL = process.env.NODE_ENV === 'production' ? 'http://47.241.56.206:9000/music' : '/'

export function get (url, params) {
  return axios.get(url, {
    params
  }).then((res) => {
    const data = res.data
    if (data.code === ERR_OK) {
      return data.result
    }
  }).catch((err) => {
    console.info(err)
  })
}
