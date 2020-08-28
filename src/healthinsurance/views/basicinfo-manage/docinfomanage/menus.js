import { sysqzyyCode } from '@/rcm/otmdiscomponent/config-js/medicalorglist.js'
import operatorinfo from '@/healthinsurance/views/basicinfo-manage/docinfomanage/operatorinfo.vue'
const thirdActiveIndex = '/hi/basicConfigInfo/docInfoManage'
const Menus = [{
  id: 'operatorinfo',
  name: '医师信息上报',
  component: operatorinfo,
  include: [sysqzyyCode]
},
]
export default Menus.map(menu => {
  menu.path = menu.id
  menu.routerLink = `${thirdActiveIndex}/${menu.id}`
  menu.meta = {
    thirdActiveIndex: thirdActiveIndex
  }
  return menu
})
