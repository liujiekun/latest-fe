import { warehouse as axios } from './api'
const url = 'supplierLocal/'

function add (params) {
  return axios.post(url + 'createApplyItem/', params)
    .then((response) => {
      return response
    })
}

async function list (params) {
  return await axios.post(url + 'getSupplierLocalList/', params)
}
export default {
  add,
  list
}
