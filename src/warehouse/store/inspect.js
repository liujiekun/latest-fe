import {workspace as axios} from '@/workspace/store/api'
const url = 'phr/doctor/inspectUnit/'

function getById (id) {
  return axios.get(url + 'getById/', {params: {id: id}}).then(result => {
    result.data.type += ''
    return result.data
  })
}

function createOrUpdate (obj) {
  var path = obj.id ? 'modify' : 'create'
  return axios.post(url + path + '/', obj)
}

function del (id) {
  return axios.post(url + 'delete/', {
    id: id
  })
}

async function list (params) {
  params.name = params.name || ''
  return axios.get(url + 'searchByName/', {params: params}).then((response) => {
    return response
  })
}

export default {
  getById,
  createOrUpdate,
  del,
  list
}
