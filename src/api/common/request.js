import axios from 'axios'
import { Notification } from 'element-ui'

const service = axios.create({
  baseURL: '/api/v1',
  timeout: 15000
})

service.interceptors.request.use(config => {
  return config
}, error => {
  // Do something with request error
  console.log(error)
})

service.interceptors.response.use(
  response => {
    if (response.status === 200) {
      if (response.data.code === 0) {
        return response.data.data
      } else {
        Notification({
          title: '请求出错',
          type: 'error',
          message: response.data.message
        })
        return null
      }
    } else {
      Notification({
        title: '请求出错',
        type: 'error',
        message: '请求超时，请稍后再试'
      })
    }
  },
  error => {
    console.log(error)
  }
)

export default service
