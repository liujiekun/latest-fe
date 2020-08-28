import axios from './api'
const url = 'ar/receivable/'
const createUrl = 'ar/insuranceRcv/'

var receivableTypeStr = [
  {id: 1, name: '商业保险应收单'},
  {id: 2, name: '医疗保险应收单'}
]
var itemType = [
  {id: 0, name: '药品'},
  {id: 1, name: '服务'}
]

function getById (id) {
  return axios.post(url + 'get', {
    id: id
  }).then(result => {
    return result.data
  })
}
function create (obj) {
  let params = {}
  Object.assign(params, obj)
  delete params.status
  return axios.post(createUrl + 'createByReceiavbleIds/', params)
}

function del (id) {
  return axios.post(url + 'delete/', {
    id: id,
    isDelete: 1
  })
}

function list (params) {
  if (params.insuranceorg) {
    return axios.post(url + 'getListForRcv/', params).then((response) => {
      if (response.data && response.data.length > 0) {
        response.data.forEach(function (item) {
          item.receivabledetailid = item.id1
        })
      }
      return response
    }, (response) => {
      return response
    })
  } else {
    return Promise.resolve([])
  }
}
export default {
  getById,
  create,
  del,
  list,
  receivableTypeStr,
  itemType
}
