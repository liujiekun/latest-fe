import {sob as axios} from './api'
// import arrange from './arrangeapi'
const url = 'inpatientarea/'
// const url1 = 'arrange/'

// warehouse 院内供应关系也在引用用， 如有修改，请知会warehouse组
function getAreas (params) {
  return axios.post(url + 'getListNoPage', params)
    .then((response) => {
      return response
    })
}

export default {
  getAreas
  // getArrangeList
}
