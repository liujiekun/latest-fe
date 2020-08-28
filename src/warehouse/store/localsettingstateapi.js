import { warehouse as axios } from './api'
const url = 'updateLocalSettingState/'

function updateState (params) {
  return axios.post(url + 'updateLocalSettingState/', params).then(result => {
    return result
  })
}

export default {
  updateState
}
