import {arrange} from './arrangeapi'
const url = 'timetrunk/'

function createOrUpdate (struct) {
  let action = struct.id ? 'update' : 'create'
  let params = Object.assign({}, struct)
  params.providerId = params.dptIds
  delete params.struct
  return arrange.post(url + action, params)
}

function list (params) {
  return arrange.post(url + 'query', params).then((response) => {
    return response
  })
}

function del (id) {
  return arrange.post(url + 'delete/', {
    id: id
  })
}

function getById (id) {
  return arrange.post(url + 'getbyid/', {
    id
  }).then(result => {
    return result.data
  })
}
function getTimes (providerId) {
  return arrange.post(url + 'listByProviderId/', {
    providerId
  }).then(result => {
    return result.data
  })
}
function getQuery (providerId, timeTrunkType) {
  return arrange.post(url + 'querySimple/', {
    providerId,
    timeTrunkType: timeTrunkType
  }).then(result => {
    return result.data
  })
}

function getQuerynurse (areaId, timeTrunkType) {
  return arrange.post(url + 'querySimple/', {
    areaId,
    timeTrunkType: timeTrunkType
  }).then(result => {
    return result.data
  })
}

export default {
  list,
  del,
  getById,
  createOrUpdate,
  getTimes,
  getQuery,
  getQuerynurse
}
