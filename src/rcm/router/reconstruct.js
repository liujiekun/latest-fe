import Rcm from '../page/rcm'
import reconstruct from '@/rcm/page/outpatientSettlement/outpatientfee.vue'
import settle from '@/rcm/page/outpatientSettlement/settle.vue'
import settled from '@/rcm/page/outpatientSettlement/settled.vue'
import settledetail from '@/rcm/page/outpatientSettlement/settleddetail.vue'
export default [
  {
    path: '/rcm',
    name: 'rcmoutpatient',
    component: Rcm,
    children: [
      {
        path: 'reconstruct',
        component: reconstruct,
        redirect: 'reconstruct/peddingsettlement',
        children: [
          {
            path: 'peddingsettlement',
            component: settle,
            meta: {
              returnFlag: 0,
              status: 0,
              thirdActiveIndex: '/rcm/reconstruct'
            }
          }, {
            path: 'refunded',
            component: settle,
            meta: {
              returnFlag: 1,
              status: 1,
              thirdActiveIndex: '/rcm/reconstruct'
            }
          }, {
            path: 'settled',
            component: settled,
            meta: {
              status: 2,
              thirdActiveIndex: '/rcm/reconstruct'
            }
          }, {
            path: 'settleddetail',
            component: settledetail
          },
        ]
      }
    ]
  }
]
