import { warehouse as axios } from './api'
const url = 'salary/'
function getById (id) {
  return axios.post(url + 'getSalaryInfo/', {
    id
  }).then(result => {
    return result
  })
}

function createOrUpdate (salary) {
  var path = salary.id ? 'updateSalary' : 'createSalary'
  return axios.post(url + path + '/', salary)
}

function del (id) {
  return axios.post(url + 'updateSalary/', {
    id: id,
    isDelete: 1
  })
}

async function list (params) {
  return await axios.post(url + 'getSalaryList/', params)
}

export default {
  getById,
  createOrUpdate,
  del,
  list
}
