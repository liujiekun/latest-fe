import axios from '@/insurance/store/api'
const url = 'insurance/medicare/'
// 药品导出
function getPersonInfoExRx (id) {
  return axios.post(url + 'getPersonInfoExRx', {
    insuranceOrgId: id
  }).then(result => {
    return result
  })
}
function getPersonInfo (id) {
  return axios.post(url + 'getPersonInfo', {
    insuranceOrgId: id
  }).then(result => {
    return result
  })
}

export default {
  getPersonInfo,
  getPersonInfoExRx
}
