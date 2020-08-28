import Bimain from '../page/bimain'
import Welcome from '@/login/page/welcome'
import UnifiedView from '../page/unified-view.vue'
// 分析报表注册
import BiRouter from '@/bi/router/index.js'
// 供应链报表
import NewPurchasing from '@/warehouse/page/storages/reportform/newpurchase.vue'
import Purchasing from '@/warehouse/page/storages/reportform/purchase'
import Hospitalization from '@/warehouse/page/storages/reportform/hospitalization'
import Inventory from '@/warehouse/page/storages/reportform/inventory'
import CensusBoardHospitalization from '@/bi/page/censusboard/hospitalization.vue'
export default [
  {
    path: '/bi',
    component: Bimain,
    redirect: '/bi/welcome',
    children: [
      {
        path: 'welcome',
        meta: {
          full: true
        },
        component: Welcome
      },
      ...BiRouter({
        editMode: false,
        moduleSelect: false,
        searchMode: true,
        addMode: false,
      }),
      {
        path: 'unifiedview/:biroute',
        component: UnifiedView
      },
      {
        path: 'reportform',
        name: 'reportform',
        component: NewPurchasing,
        redirect: 'reportform/outpatient',
        children: [
          {
            path: 'outpatient/:status?',
            name: 'outpatient',
            component: Purchasing,
            meta: {
              thirdActiveIndex: '/bi/reportform/outpatient',
              h: true
            }
          },
          {
            path: 'hospitalization/:status?',
            name: 'hospitalization',
            component: Hospitalization,
            meta: {
              thirdActiveIndex: '/bi/reportform/hospitalization',
              h: true
            }
          },
          {
            path: 'inventory/:status?',
            name: 'inventory',
            component: Inventory,
            meta: {
              thirdActiveIndex: '/bi/reportform/inventory',
              h: true
            }
          },
        ]
      },
      {
        path: 'rcm_statistics',
        component: CensusBoardHospitalization,
        meta: {
          h: true
        }
      },
    ]
  }
]
