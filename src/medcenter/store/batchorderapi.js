import {medcenter as axios} from './api'
import {diction} from '@/store/common'
let url = '/phr/'
// let downUrl = diction.api + '/phr/'
// let downUrl = 'http://gxkf-prod.cn-bj.ufileos.com/FEPortal201812201812358292.xlsx'
let downUrl = 'http://gxkf-prod.cn-bj.ufileos.com/FEPortal20181222151297554.xlsx'
function list (params) {
  return axios.post(url + 'doctor/physicalExam/v3.3/search', params)
}

function importExcelFile (file) {
  return axios.post(url + 'doctor/physicalExam/v3.3/importExcel', file)
}

export default {
  diction,
  list,
  downUrl,
  importExcelFile
}
