
import birthnurse from '@/birth/page/index'

// 医嘱管理
import adviceLayout from '@/inpatient/page/advice.manage/manage.layout'
import adviceReview from '@/inpatient/page/advice.manage/review'
import adviceExecute from '@/inpatient/page/advice.manage/execute'
import adviceLabelPrint from '@/inpatient/page/advice.manage/labelprint'

// 病区管理
import ward from '@/inpatient/page/ward.mgt.vue'

// 患者管理
import patientmgt from '@/inpatient/page/patient.mgt.vue'

// 检验标本
import sampledelivery from '@/inpatient/page/testsamples/sampledelivery.vue'
import samplecheck from '@/inpatient/page/testsamples/samplecheck.vue'

// 计费模版
import billtemplate from '@/sob/page/recipe.template/layout'
import PrescriptionFeeTplAdd from '@/sob/page/recipe.template/addfeetemplate'
import DeptFeeTplAdd from '@/sob/page/recipe.template/dptfeetemplate'

// import docs from '@/inpatient/page/docs'
import docswrapper from '@/inpatient/page/docswrapper'
import patientAdvice from '@/inpatient/page/advice.manage/patient.advice'
import patientFeeList from '@/inpatient/page/advice.manage/patient.fee'
import path from '@/inpatient/components/path/path.vue'
import patientInfo from '@/crm/components/patiententry_horizontal'
import temperature from '@/inpatient/components/temperature.vue'
import temperatureview from '@/inpatient/components/temperatureview.vue'

export default [
  {
    name: 'birth_nurse',
    path: '/birth_nurse',
    component: birthnurse,
    redirect: '/birth_nurse/ward',
    meta: {
      space: 'birth_nurse',
      type: '3', // 1-门诊；2-急诊；3-住院
      role: '2' // 角色 护士 - '2' | 医生 - '1'
    },
    children: [
      {
        // 病区管理
        name: 'nurse_ward',
        path: 'ward',
        component: ward,
        meta: {
          active: '/birth_nurse/ward'
        }
      },
      {
        name: 'adviceManage',
        path: 'advice',
        component: adviceLayout,
        redirect: 'advice/review',
        meta: {
          speClass: 'spe_wrap'
        },
        children: [
          {
            name: 'review',
            path: 'review',
            component: adviceReview,
            meta: {
              secActiveIndex: '/birth_nurse/advice',
              active: '/birth_nurse/advice/review',
              speClass: 'spe_wrap'
            }
          },
          {
            name: 'execute',
            path: 'execute',
            component: adviceExecute,
            meta: {
              secActiveIndex: '/birth_nurse/advice',
              speClass: 'spe_wrap'
            }
          },
          {
            name: 'labelprint',
            path: 'labelprint',
            component: adviceLabelPrint,
            meta: {
              secActiveIndex: '/birth_nurse/advice',
              speClass: 'spe_wrap'
            }
          }
        ]
      },
      {
        // 患者管理
        name: 'patientmgt',
        path: 'patientmgt',
        component: patientmgt,
        redirect: '/birth_nurse/patientmgt/advice',
        meta: {
          fullscreen: true
        },
        children: [
          {
            path: 'docs/:id?/:dataId?/:code?',
            component: docswrapper,
            meta: {
              handleType: 1, // 操作类型
              secActiveIndex: '/birth_nurse/patientmgt'
            }
          },
          {
            path: 'advice',
            component: patientAdvice,
            meta: {
              secActiveIndex: '/birth_nurse/patientmgt'
            }
          },
          {
            path: 'fee',
            component: patientFeeList,
            meta: {
              secActiveIndex: '/birth_nurse/patientmgt'
            }
          },
          {
            path: 'path',
            component: path,
            meta: {
              secActiveIndex: '/birth_nurse/patientmgt'
            }
          },
          {
            path: 'patientinfo',
            component: patientInfo,
            meta: {
              secActiveIndex: '/birth_nurse/patientmgt'
            }
          },
          {
            path: 'temperature',
            component: temperature,
            meta: {
              secActiveIndex: '/birth_nurse/patientmgt'
            }
          },
          {
            path: 'temperatureview',
            component: temperatureview,
            meta: {
              secActiveIndex: '/birth_nurse/patientmgt'
            }
          }
        ]
      },
      // 检验标本
      {
        name: 'sampledelivery',
        path: 'sampledelivery',
        component: sampledelivery
      },
      {
        name: 'samplecheck',
        path: 'samplecheck',
        component: samplecheck
      },
      {
        path: 'billtemplate/:visitType',
        name: 'templateList',
        component: billtemplate
      },
      {
        path: 'billtemplate/addfee/:visitType',
        name: 'templateFeeAdd',
        component: PrescriptionFeeTplAdd
      },
      {
        path: 'billtemplate/adddpt/:visitType',
        name: 'templateDptFeeAdd',
        component: DeptFeeTplAdd
      }
    ]
  }
]
