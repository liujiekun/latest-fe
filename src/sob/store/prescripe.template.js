import {workspace as axios} from '@/workspace/store/api'
let url = 'phr/doctor/templateDpt/'
function list (params) {
  if (params.type) {
    params.type = Array.isArray(params.type) ? params.type : [params.type]
  }
  return axios.post(url + 'search', params).then(result => {
    return result.data
  })
}

function del (id) {
  return axios.post(url + 'delete', axios.jsonToFormEncoded({id}))
}

function createOrUpdate (obj) {
  let action = obj.id ? 'modify' : 'create'
  return axios.post(url + action, obj)
}

function getById (id) {
  return axios.get(url + 'getById', {
    params: {
      id
    }
  })
}

export default {
  list,
  del,
  getById,
  createOrUpdate
}
