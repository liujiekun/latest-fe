import {sob} from './api'
const url = 'providerdepartmentr/'

function getById (id) {
  return sob.post(url + 'getServStationInfo/', {
    id
  }).then(result => {
    return result.data
  })
}

function createOrUpdate (obj) {
  var path = obj.id ? 'update' : 'create'
  return sob.post(url + path + '/', obj)
}

function del (id) {
  return sob.post(url + 'updateServStation/', {
    id: id,
    isDelete: 1
  })
}

function list (params) {
  return sob.post(url + 'getById/', params).then((response) => {
    return response
  })
}

function datalist (params) {
  return sob.post(url + 'getServStationList/', params).then((response) => {
    return response.data
  })
}

function unRelated () {
  return sob.post(url + 'getById/').then((response) => {
    return response
  })
}

function related (providerId) {
  return sob.post(url + 'getByProviderId/', {
    providerId
  }).then((response) => {
    return response
  })
}

function rel (providerId, id) {
  return sob.post(url + 'create/', {
    providerId,
    deptId: id
  }).then((response) => {
    console.log(response, 90909)
    return response
  })
}

function unRel (providerId, ids) {
  return sob.post(url + 'delete/', {
    providerId,
    id: ids
  }).then((response) => {
    return response
  })
}

export default {
  getById,
  createOrUpdate,
  del,
  list,
  unRelated,
  related,
  rel,
  unRel,
  datalist
}
