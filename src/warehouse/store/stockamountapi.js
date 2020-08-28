import { warehouse as axios } from './api'
const url = 'stockAmount/'
var percent = [
  { id: 75, name: '现货量小于75%合理库存值' },
  { id: 50, name: '现货量小于50%合理库存值' },
  { id: 25, name: '现货量小于25%合理库存值' }
]

function getById (id) {
  return axios.post(url + 'getStockAmountInfo/', {
    id
  }).then(result => {
    return result
  })
}

function createOrUpdate (obj) {
  var path = obj.id ? 'updateStockAmount' : 'createStockAmount'
  return axios.post(url + path + '/', obj)
}

function del (id) {
  return axios.post(url + 'updateStockAmount/', {
    id: id,
    isDelete: 1
  })
}

async function list (params) {
  return await axios.post(url + 'getStockAmountList/', params)
}

export default {
  getById,
  createOrUpdate,
  del,
  list,
  percent
}
