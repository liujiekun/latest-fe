import axios from './api'
const listurl = 'ap/purInvoice/'
const url = 'ap/apVerifaction/'

function getById (id) {
  return axios.post(url + 'getPrePayInfo/', {
    prePayId: id
  }).then(response => {
    return response
  })
}

function saveVerify (params) {
  return axios.post(url + 'saveVerify/', params).then(response => {
    return response
  })
}

function list (params) {
  if (params.clinicID) {
    return axios.post(listurl + 'getInvoiceList/', params).then((response) => {
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
  saveVerify,
  list
}
