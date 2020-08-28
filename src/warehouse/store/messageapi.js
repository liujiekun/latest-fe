import {warehouse as axios} from './api'

const url = 'message/'

function sendMessage (params) {
  return axios.post(url + 'createApplyMessage/', params)
}

export default {
  sendMessage
}
