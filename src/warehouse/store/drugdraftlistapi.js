import { warehouse as axios } from './api'
const url = 'drugAudit/'

async function list (params) {
  return await axios.post(url + 'getDraftList/', params)
}

export default {
  list
}
