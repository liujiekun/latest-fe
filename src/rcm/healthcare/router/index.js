// 机构信息
import organization from '@/rcm/healthcare/router/organization/index.js'
// 医保对账
import insurancecheck from '@/rcm/healthcare/router/insurancecheck/index.js'

export default [
  ...organization,
  ...insurancecheck
]
