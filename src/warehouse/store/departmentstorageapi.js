import { warehouse as axios } from './api'
const url = 'departmentStorageRoom/'
function getById (id) {
  return axios.post(url + 'getStorageRoomInfo/', {
    id
  }).then(result => {
    return result
  })
}

function createOrUpdate (obj) {
  var path = obj.id ? 'updateDepartmentStorageRoom' : 'createDepartmentStorageRoom'
  return axios.post(url + path + '/', obj)
}

function del (id) {
  return axios.post(url + 'updateDepartmentStorageRoom/', {
    id: id,
    isDelete: 1
  })
}

async function list (params) {
  return await axios.post(url + 'getDepartmentStorageRoomList/', params)
}

export default {
  getById,
  createOrUpdate,
  del,
  list
}
