import rcm from './api'
const url = 'ar/receivable/'

function get (id) {
  return rcm.post(url + 'get', {
    id
  })
}

export default {
  get
}
