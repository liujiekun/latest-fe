import axios from '@/util/http'
// import { Notification } from 'element-ui'

let baseapi = axios.create({
  baseURL: '/',
  responseType: 'document' // 默认值是json
})

baseapi.interceptors.request.use(function (config) {
  if (!config.data) {
    config.data = {}
  }
  return config
}, function (error) {
  return Promise.reject(error)
})

baseapi.interceptors.response.use(function (response) {
  // console.log(response.data.body, 22222222222222)
  // if (response.config.method === 'post') {
  //   if (response.data.head.errCode === 0) {
  //     Notification.success('操作成功')
  //   }
  // }
  return response
})

baseapi.jsonToFormEncoded = function (obj) {
  var data = new URLSearchParams()
  for (var o in obj) {
    data.append(o, obj[o])
  }
  return data
}
export { baseapi }
