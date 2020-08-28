import { jlccybCode, jlssbCode, hljybCode, jljhCode, sysqzyyCode } from '@/rcm/otmdiscomponent/config-js/medicalorglist.js'
import medialItemList from '@/rcm/otmdiscomponent/medicalitemlist.vue'
import directoryAdd from '@/rcm/healthcare/views/organization/catalogue.vue'
import directoryManage from '@/rcm/healthcare/views/organization/catalogue.download.vue'
const thirdActiveIndex = '/hi/basicConfigInfo/directoryManage'
const Menus = [{
  id: 'medialItemList',
  name: '目录对照',
  component: medialItemList,
  include: [jlccybCode, jlssbCode, hljybCode, jljhCode, sysqzyyCode]
},
{
  id: 'directoryAdd',
  name: '目录新增',
  component: directoryAdd,
  include: [hljybCode]
},
{
  id: 'directoryManage',
  name: '目录管理',
  component: directoryManage,
  include: [hljybCode]
}]
export default Menus.map(menu => {
  menu.path = menu.id
  menu.routerLink = `${thirdActiveIndex}/${menu.id}`
  menu.meta = {
    thirdActiveIndex: thirdActiveIndex
  }
  return menu
})
