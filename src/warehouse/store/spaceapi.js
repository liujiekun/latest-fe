import { warehouse as axios } from './api'
const url = 'space/'
function getById (id) {
  return axios.post(url + 'getSpaceInfo/', {
    id
  }).then(result => {
    return result
  })
}

function createOrUpdate (space) {
  var path = space.id ? 'updateSpace' : 'createSpace'
  return axios.post(url + path + '/', space)
}

function del (id) {
  return axios.post(url + 'updateSpace/', {
    id: id,
    isDelete: 1
  })
}

async function list (params) {
  var postParam = {}
  for (var key in params) {
    if (params[key]) {
      postParam[key] = params[key]
    }
  }
  return await axios.post(url + 'getSpaceTreeList/', postParam)
}

function floors () {
  return axios.post('/warehouse/floor/getFloorList/').then(response => {
    return response
  })
}

export default {
  getById,
  createOrUpdate,
  del,
  list,
  floors
}
