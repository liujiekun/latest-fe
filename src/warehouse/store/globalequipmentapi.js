import { warehouse as axios } from './api'
const url = 'equipment/'

async function list (params) {
  return await axios.post(url + 'getEquipmentList/', params)
}

export default {
  list
}
