import {sob} from './api'

function hosAppliance (params) {
  return sob.post('hospitalizedappliance/get', params)
}
export default {
  hosAppliance
}
