import {warehouse as axios} from './api'
const url = 'applyItem/'

function add (params) {
  return axios.post(url + 'createApplyItem/', params)
    .then((response) => {
      return response
    })
}

function update (obj) {
  return axios.post(url + 'updateApplyItemList/', obj)
}

function list (materialType) {
  return axios.post(url + 'getApplyItemList/', {materialType})
    .then((response) => {
      return response
    })
}

function del (id) {
  return axios.post(url + 'updateApplyItem/', {
    id: id,
    isDelete: 1
  })
}

function purchase (id) {
  return axios.post(url + 'updatePurchaseApplyItem/', {id}).then(result => {
    return result
  })
}

function end (id) {
  return axios.post(url + 'updateEndApply/', {id}).then(result => {
    return result
  })
}

function notify (id) {
  return axios.post(url + 'updateNoticApplyItem/', {id}).then(result => {
    return result
  })
}

function completed (id) {
  return axios.post(url + 'updateOkApplyItem/', {id}).then(result => {
    return result
  })
}

export default {
  add,
  list,
  del,
  completed,
  notify,
  purchase,
  end,
  update
}
