import {sob as axios} from './api'
const url = 'mergeInfo/'

function list (params) {
  return axios.post(url + 'getMergeInfos', params)
    .then((response) => {
      return response
    })
}

function createOrUpdate (obj) {
  let path = obj.id ? 'updateMergeDetailInfo' : 'updateMergeDetailInfo'
  return axios.post(url + path + '/', obj)
}

function getById (id) {
  return axios.post(url + 'getMergeDetailDtoById', {id})
    .then(result => {
      if (result && result.data) {
        result.data.isValid = '' + result.data.isValid
        result.data.isMerge = '' + result.data.isMerge
        return result.data
      } else {
        return {}
      }
    })
}

function del (id) {
  return axios.post(url + 'deleteMergeInfo/', {id})
}

export default {
  list,
  createOrUpdate,
  getById,
  del
}
