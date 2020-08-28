import {arrange} from './arrangeapi'
// const url = 'timetrunk/'
const url = 'timetrunk/'

function getById (id) {
  return arrange.post(url + 'getTimeTrunkInfoById/', {
    id
  }).then(result => {
    return result.data
  })
}

function createOrUpdate (obj) {
  let path = obj.id ? 'updateTimeTrunk' : 'createTimeTrunk'
  return arrange.post(url + path + '/', obj)
}

function del (id) {
  return arrange.post(url + 'deleteTimeTrunk/', {
    id: id
  })
}

function list (params) {
  return arrange.post(url + 'listByProviderId/', params).then((response) => {
    return response
  })
}

export default {
  getById,
  createOrUpdate,
  del,
  list
}
