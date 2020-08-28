import { warehouse as axios } from '@/warehouse/store/api'
const url = '/goods/'

async function list (params) {
  return await axios.post(url + 'getModifyRecordList/', params)
}

export default {
  list
}
