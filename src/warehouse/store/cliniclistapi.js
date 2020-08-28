import { warehouse as axios } from './api'
const url = 'clinic/'

async function list (params) {
  return await axios.post(url + 'getClinicList/', params)
    .then((response) => {
      if (response.length === 0) {
        return []
      } else {
        return response
      }
    })
}

export default {
  list
}
