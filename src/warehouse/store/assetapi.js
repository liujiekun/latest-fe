import { warehouse as axios } from './api'
const url = 'asset/'

async function list (params) {
  return await axios.post(url + 'getAssetList/', params)
}

function getById (params) {
  return axios.post(url + 'getAssetInfo/', params)
    .then((response) => {
      return response
    })
}

function createOrUpdate (obj) {
  return axios.post(url + 'updateAsset/', obj)
}

export default {
  list,
  getById,
  createOrUpdate
}
