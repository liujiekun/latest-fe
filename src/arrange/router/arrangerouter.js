import arrange from '../page/index.vue'
import appointpanel from '../page/reservation/appointpanel.vue'
import SourceDetail from '@/arrange/page/source/sourceDetail'
import Source from '@/arrange/page/source/source'
import Schedulingmain from '@/arrange/page/scheduling/main.vue'
import Templatemain from '@/arrange/page/template/main.vue'
export default [
  {
    path: '/appoint/',
    name: 'appoint',
    component: appointpanel,
    children: []
  },
  {
    path: '/arrange/',
    redirect: '/arrange/schedulingmain/',
    name: 'arrange',
    component: arrange,
    children: [
      {
        name: 'source',
        path: 'source',
        component: Source
      },
      {
        name: 'sourceDetail',
        path: 'source/:id',
        component: SourceDetail
      },
      {
        name: 'templatemain',
        path: 'templatemain',
        component: Templatemain
      },
      {
        name: 'schedulingmain',
        path: 'schedulingmain',
        component: Schedulingmain
      }
    ]
  }
]
