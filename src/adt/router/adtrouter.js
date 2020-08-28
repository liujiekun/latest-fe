import adt from '../page/hospitalization'
import Welcome from '@/login/page/welcome'
import register from '@/adt/page/register' // 入院办理 入院登记
import bedSearch from '@/adt/page/bedsearch' // 床位查询
import inHosManage from '@/adt/page/inhosmanage' // 在院患者管理
import moneyManage from '@/adt/page/moneymanage' // 催款管理
import moneyRules from '@/adt/page/moneyrules' // 催款规则
import member from '@/crm/page/member' // 客户管理
import leaveHospita from '@/adt/page/leavehospita' // 出院管理
import patientdialog from '@/adt/page/patientdialog' // 在院管理详情
import patientdetails from '@/adt/page/patientdetails'
import leavepatient from '@/adt/page/leavepatientdialog'
import depositManage from '@/rcm/page/hospitalization/depositmanage'

// rcm 业务
import chargetab from '@/rcm/page/hospitalization/chargetab'
import refundhospital from '@/rcm/page/hospitalization/refundhospital'
import HospitalizationDateForm from '@/rcm/page/income/hospitalizationday/hospitalizationdateform'
import hosdaily from '@/rcm/page/income/hospitalizationday/hosdaily'
import CostListSearch from '@/rcm/page/hospitalization/costlistsearch'
import Reports from '@/rcm/page/hospitalization/reports'
import drugsummary from '@/rcm/page/hospitalization/drugsummary'
import drugdetail from '@/rcm/page/hospitalization/drugdetail'

// 20200724调整住院收费菜单
import hospitalSettle from '@/rcm/page/hospitalization/hospitalsettle.vue'
import depositPayment from '@/rcm/page/hospitalization/depositpayment.vue'
import depositPaymentDetail from '@/rcm/page/hospitalization/depositpaymentdetail.vue'
import settlementPay from '@/rcm/page/hospitalization/settlementpay.vue'
import settlementPayDetail from '@/rcm/page/hospitalization/settlementpaydetail.vue'
import settlementQuery from '@/rcm/page/hospitalization/settlementquery.vue'
import settlementQueryDetail from '@/rcm/page/hospitalization/settlementquerydetail.vue'

import BiRouter from '@/bi/router/index.js'

export default [
  {
    path: '/adt',
    name: 'adt',
    redirect: '/adt/register',
    component: adt,
    children: [
      {
        path: 'welcome',
        meta: {
          full: true
        },
        component: Welcome
      },
      {
        path: 'register',
        name: 'register',
        component: register
      },
      {
        path: 'bedsearch',
        component: bedSearch
      },
      {
        path: 'member',
        component: member
      },
      {
        path: 'leaveHospita',
        component: leaveHospita
      },
      {
        path: 'leavepatient',
        component: leavepatient
      },
      {
        path: 'patientdialog',
        redirect: 'patientdialog/patientdetails',
        component: patientdialog,
        children: [
          {
            path: 'patientdetails',
            component: patientdetails,
            meta: {
              thirdActiveIndex: '/adt/patientdialog/patientdetails'
            }
          },
          {
            path: 'depositmanage',
            component: depositManage,
            meta: {
              thirdActiveIndex: '/adt/patientdialog/depositmanage',
              type: 1
            }
          },
          {
            path: 'chargetab',
            component: chargetab,
            meta: {
              thirdActiveIndex: '/adt/patientdialog/chargetab'
            }
          }
        ]
      },
      {
        path: 'inhosmanage',
        component: inHosManage,
        children: [
          {
            path: 'chargedetail',
            component: chargetab,
            meta: {
              thirdActiveIndex: '/adt/chargedetail'
            }
          },
          {
            path: 'retirementmanage',
            component: refundhospital,
            meta: {
              thirdActiveIndex: '/adt/retirementmanage'
            }
          },
        ]
      },
      {
        path: 'moneymanage',
        component: moneyManage,
        meta: {
          thirdActiveIndex: '/adt/moneymanage'
        }
      },
      {
        path: 'moneyrules',
        component: moneyRules,
        meta: {
          thirdActiveIndex: '/adt/moneyrules'
        }
      },
      {
        path: 'hospitalSettle',
        component: hospitalSettle,
        redirect: 'hospitalSettle/depositPayment',
        children: [{
          path: 'depositPayment',
          component: depositPayment
        },
        {
          path: 'depositPayment/detail',
          component: depositPaymentDetail,
          meta: {
            thirdActiveIndex: '/adt/hospitalSettle/depositPayment'
          }
        },
        {
          path: 'settlementPay',
          component: settlementPay
        },
        {
          path: 'settlementPay/detail',
          component: settlementPayDetail,
          meta: {
            thirdActiveIndex: '/adt/hospitalSettle/settlementPay'
          }
        },
        {
          path: 'settlementQuery',
          component: settlementQuery
        },
        {
          path: 'settlementQuery/detail',
          component: settlementQueryDetail,
          meta: {
            thirdActiveIndex: '/adt/hospitalSettle/settlementQuery'
          }
        }
        ]
      },
      {
        path: 'daily/settlement/:feeType',
        name: 'hospitalizationettlement',
        component: HospitalizationDateForm
      },
      {
        path: 'daily/settlement/:feeType/:id',
        name: 'hospitalizationettlementId',
        component: HospitalizationDateForm
      },
      {
        path: 'daily/hosdaily',
        component: hosdaily
      },
      {
        path: 'costlistsearch',
        component: CostListSearch
      },
      {
        path: 'reports',
        component: Reports
      },
      {
        path: 'drugsummary',
        component: drugsummary
      },
      {
        path: 'drugdetail',
        component: drugdetail
      },
      ...BiRouter({
        searchMode: true,
        thirdActiveIndex: '/adt/reportlist/hospitalizationfee'
      }),
    ]
  }
]
