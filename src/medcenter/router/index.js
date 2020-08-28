import MedCenter from '@/medcenter/page/medcenter.vue'
import MedAppoint from '@/medcenter/page/appoint.vue'
import Appointmedlist from '@/medcenter/page/appointmedlist.vue'
import MedDetail from '@/medcenter/page/appointdetail.vue'
import ReportManage from '@/medcenter/page/reportmanage.vue'
import BatchOrder from '@/medcenter/page/batchorder.vue'

export default [
  {
    path: '/medcenter',
    component: MedCenter,
    redirect: '/medcenter/appointmedlist',
    children: [
      {
        path: 'appointmedlist',
        component: Appointmedlist
      },
      {
        path: 'appoint',
        component: MedAppoint
      },
      {
        path: 'meddetail',
        name: 'meddetail',
        component: MedDetail,
        meta: {
          secActiveIndex: '/medcenter/appoint'
        }
      },
      {
        path: 'reportmanage',
        component: ReportManage
      },
      {
        path: 'batchorder',
        component: BatchOrder
      }
    ]
  }
]
