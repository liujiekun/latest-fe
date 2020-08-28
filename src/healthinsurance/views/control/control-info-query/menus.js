import { jljhCode, sysqzyyCode } from '@/rcm/otmdiscomponent/config-js/medicalorglist.js'

// 蛟河的信息查询
import jljhybSettleInfo from '@/rcm/otmdiscomponent/jljhmedical/jljh-report/jljh-ybsettleinfo.vue'
import jljhInhosQuery from '@/rcm/otmdiscomponent/jljhmedical/jljh-report/jljh-inhosquery.vue'
import jljhApproval from '@/rcm/otmdiscomponent/jljhmedical/jljh-report/jljh-approval.vue'

// 三亚的信息查询
// 医疗待遇封锁信息查询
import BlockInfo from './blockinfo.vue'
// 再转状态查询
import HospitalStatus from './hospitalstatus.vue'
// 城乡居民结算查询
// import residentQuery from '@/rcm/otmdiscomponent/sysqzyy-medical/report/resident-settle-query.vue'
// 结算单ID查询
import settlementID from '@/rcm/otmdiscomponent/sysqzyy-medical/report/settlementid.vue'

const thirdActiveIndex = '/hi/control/controlInfoQuery'
const Menus = [{
  id: 'jljhybSettleInfo',
  name: '结算信息查询',
  component: jljhybSettleInfo,
  include: [jljhCode]
},
{
  id: 'jljhInhosQuery',
  name: '在院信息查询',
  component: jljhInhosQuery,
  include: [jljhCode],
},
{
  id: 'jljhApproval',
  name: '个人封锁及审批信息查询',
  component: jljhApproval,
  include: [jljhCode],
},
{
  id: 'blockinfo',
  name: '医疗待遇封锁信息查询',
  component: BlockInfo,
  include: [sysqzyyCode]
},
{
  id: 'hospitalstatus',
  name: '在院状态查询',
  component: HospitalStatus,
  include: [sysqzyyCode]
},
// {
//   id: 'residentQuery',
//   name: '结算信息查询',
//   component: residentQuery,
//   include: [sysqzyyCode]
// },
{
  id: 'settlementID',
  name: '就诊结算ID查询',
  component: settlementID,
  include: [sysqzyyCode]
}]
export default Menus.map(menu => {
  menu.path = menu.id
  menu.routerLink = `${thirdActiveIndex}/${menu.id}`
  menu.meta = {
    thirdActiveIndex: thirdActiveIndex
  }
  return menu
})
