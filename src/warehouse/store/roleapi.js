import {auth as axios} from '@/auth/store/api'

// 获取计划列表
function getUsersByRole (params) {
  return axios.post('permission/user/getUsersByRole', params).then(result => {
    return result
  })
}

export default{
  getUsersByRole
}
