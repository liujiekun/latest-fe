import axios from './api'
const url = 'pub/control/'

function getById (id) {
  return axios.post(url + 'get', {
    id: id
  }).then(result => {
    return result.data
  })
}
function createOrUpdate (obj) {
  return axios.post(url + 'createControl/', obj)
}

function del (id) {
  return axios.post(url + 'delete/', {
    id: id,
    isDelete: 1
  })
}

function list (params) {
  for (let key in params) {
    if (key === 'clinicid') {
      delete params[key]
    }
  }
  return axios.post(url + 'getControl/', params).then((response) => {
    return response.date
  }, (response) => {
    return response
  })
}
export default {
  getById,
  createOrUpdate,
  del,
  list
}
