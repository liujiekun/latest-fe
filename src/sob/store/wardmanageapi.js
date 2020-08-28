import {sob} from './api'
const url = 'hospitalizedWard/'

function createOrUpdate (struct) {
  let action = struct.id ? 'updateHospitalizedWard' : 'createHospitalizedWard'
  let params = Object.assign({}, struct)
  params.providerId = params.dptIds
  delete params.struct
  return sob.post(url + action, params)
}
function list (params) {
  return sob.post(url + 'getHospitalizedWards', params).then((response) => {
    return response
  })
}

function getAvailableWard (params) {
  return sob.post(url + 'getAvailableWard', params).then((response) => {
    return response
  })
}

function del (id) {
  return sob.post(url + 'deleteHospitalizedWard/', {
    id: id
  })
}
function getById (id) {
  return sob.post(url + 'getHospitalizedWard/', {
    id
  }).then(result => {
    return result.data
  })
}

export default {
  list,
  del,
  getById,
  createOrUpdate,
  getAvailableWard
}
