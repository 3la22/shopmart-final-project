import axios from 'axios'
import Cookies from 'js-cookie'

const api = axios.create({
  baseURL: 'https://ecommerce.routemisr.com/api/v1',
  timeout: 10000,
})

api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token')
    if (token) {
      config.headers.token = token
    }
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove('token')
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api
