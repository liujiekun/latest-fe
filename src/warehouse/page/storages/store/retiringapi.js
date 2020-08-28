// 业务退库api
import { warehouse as axios } from '@/warehouse/store/api'
const url = 'cancelStock/'

function createOrUpdate (params) {
  let path = params.id ? 'rollBackCancelStock' : 'createCalcelStock'
  return axios.post(url + path + '/', params)
}

function getById (id) {
  return axios.post(url + 'getCalcelStockInfo/', id).then((result) => {
    return result
  })
}

async function list (params) {
  return await axios.post(url + 'getCancelStockList/', params)
}

export default {
  list,
  getById,
  createOrUpdate
}
