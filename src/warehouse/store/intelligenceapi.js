import { warehouse as axios } from './api'
const url = 'intelligence/'

async function list (params) {
  return await axios.post(url + 'getIntelligenceList/', params)
}
function createOrUpdate (obj) {
  var path = obj.id ? 'updateIntelligence' : 'createIntelligence'
  return axios.post(url + path + '/', obj)
}
function getById (id) {
  return axios.post(url + 'getIntelligenceInfo/', {
    id
  }).then(result => {
    return result
  })
}
export default {
  list,
  getById,
  createOrUpdate
}
