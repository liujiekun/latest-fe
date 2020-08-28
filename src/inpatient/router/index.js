// 住院护士工作站
import Hospital from '../page/hospital.vue'

import wristbandList from '@/sob/page/wristband/list'
// import docs from '@/inpatient/page/docs'
import docswrapper from '@/inpatient/page/docswrapper'

// 病区管理
// import ward from '@/inpatient/page/ward.mgt.vue'

// 患者管理
import patientmgt from '@/inpatient/page/patient.mgt.vue'

// 临床路径
import path from '@/inpatient/components/path/path.vue'

// 医嘱管理
import adviceLayout from '@/inpatient/page/advice.manage/manage.layout'
import adviceReview from '@/inpatient/page/advice.manage/review'
import adviceResolve from '@/inpatient/page/advice.manage/resolve'
import adviceExecute from '@/inpatient/page/advice.manage/execute'
import sampleManage from '@/inpatient/page/advice.manage/sample.manage'

// 执行打印
import printLayout from '@/inpatient/page/execute.print/print.layout'
import executeOrder from '@/inpatient/page/execute.print/execute.order'
import bottlePaper from '@/inpatient/page/execute.print/bottle.paper'
import infusionCard from '@/inpatient/page/execute.print/infusion.card'

// 患者医嘱
import patientAdvice from '@/inpatient/page/advice.manage/patient.advice'
import patientFeeList from '@/inpatient/page/advice.manage/patient.fee'
// 历史就诊

import patientInfo from '@/crm/components/patiententry_horizontal'

// 体温表
import memberbaseinfo from '@/crm/page/memberbaseinfo'
// 随访
import followup from '@/crm/page/visit'
import mytask from '@/crm/page/mytask'
import alltask from '@/crm/page/alltask'
import newfollowlist from '@/crm/page/healthy/newfollowlist'
import executetask from '@/crm/page/executetask'
import subtaskdetails from '@/crm/page/subtaskdetails'

// 计费模版
import billtemplate from '@/sob/page/recipe.template/layout'
import PrescriptionFeeTplAdd from '@/sob/page/recipe.template/addfeetemplate'
// import DeptFeeTplAdd from '@/sob/page/recipe.template/dptfeetemplate'
// 病历模版管理
// import { getTemplateManageRoute } from '@/emr/router/index.js'

// 病历模版管理
import templateManage from '@/emr/page/template.manage'
// 欠费查询
// import Arrearagequery from '@/rcm/page/hospitalization/arrearagequery'

export default [
  {
    name: 'inpatient',
    path: '/inpatient',
    redirect: '/inpatient/patientmgt',
    meta: {
      space: 'inpatient',
      type: '3', // 1-门诊；2-急诊；3-住院
      role: '2' // 角色 护士 - '2' | 医生 - '1'
    },
    component: Hospital,
    children: [
      // ...getTemplateManageRoute({
      //   workshopTag: 'hospitalForNurse'
      // }),
      // {
      //   path: 'template',
      //   name: 'template',
      //   redirect: 'template/templatemanage',
      //   children: [
      //     ...getTemplateManageRoute({
      //       workshopTag: 'hospitalForNurse'
      //     }),
      //   ]
      // },
      {
        name: 'templatemanage',
        path: 'tplmanage/templatemanage',
        component: templateManage,
        meta: {
          workshopTag: 'hospitalForNurse',
          thirdActiveIndex: '/inpatient/tplmanage/templatemanage'
        }
      },

      // {
      //   // 病区管理
      //   name: 'ward',
      //   path: 'ward',
      //   component: ward,
      //   meta: {
      //     active: '/inpatient/ward'
      //   }
      // },
      // 费用模版
      {
        path: 'billtemplate/:visitType',
        name: 'feeTemplateList',
        component: billtemplate
      },
      {
        path: 'billtemplate/:id/:visitType',
        name: 'feeTemplateAdd',
        component: PrescriptionFeeTplAdd,
        meta: {
          secActiveIndex: '/inpatient/billtemplate/5'
        }
      },
      {
        // 患者管理
        name: 'patientmgt',
        path: 'patientmgt',
        component: patientmgt,
        redirect: '/inpatient/patientmgt/advice',
        meta: {
          fullscreen: true
        },
        children: [
          {
            path: 'docs',
            component: docswrapper,
            meta: {
              prole: 2, // 护士
              ptype: 1, // 住院
              sceneType: 3, // 1-住院医生 2-急诊 3-护理//权限控制要用
              qualityControl: 3, // 1门诊 2医生 3护士 //时限质控要用
              handleType: 1, // 操作类型
              secActiveIndex: '/inpatient/patientmgt'
            }
          },
          {
            path: 'advice',
            component: patientAdvice,
            meta: {
              secActiveIndex: '/inpatient/patientmgt'
            }
          },
          {
            path: 'fee',
            component: patientFeeList,
            meta: {
              secActiveIndex: '/inpatient/patientmgt'
            }
          },
          {
            path: 'path',
            component: path,
            meta: {
              secActiveIndex: '/inpatient/patientmgt'
            }
          },
          {
            path: 'patientinfo',
            component: patientInfo,
            meta: {
              secActiveIndex: '/inpatient/patientmgt'
            }
          }
        ]
      },
      {
        name: 'ivisit',
        path: 'ivisit',
        component: followup
      },
      {
        name: 'imytask',
        path: 'imytask',
        component: mytask
      },
      {
        name: 'ialltask',
        path: 'ialltask',
        component: alltask
      },
      {
        name: 'inewfollowlist',
        path: 'inewfollowlist',
        component: newfollowlist
      },
      {
        name: 'iexecutetask',
        path: 'iexecutetask/:patientId/:taskId',
        component: executetask
      },
      {
        name: 'isubtaskdetails',
        path: 'isubtaskdetails/:taskId/:patientId',
        component: subtaskdetails
      },
      // {
      //   path: 'docs/:id?',
      //   component: docswrapper
      // },
      {
        path: 'memberbaseinfo/:id?',
        component: memberbaseinfo
      },
      {
        // 腕带管理
        name: 'wristband',
        path: 'wristband',
        component: wristbandList,
        meta: {
          active: '/inpatient/wristband/2'
        }
      },
      {
        // 腕带管理
        name: 'wristbandPage',
        path: 'wristband/:type',
        component: wristbandList,
        meta: {
          active: '/inpatient/wristband/2'
        }
      },
      {
        name: 'adviceManage',
        path: 'advice',
        component: adviceLayout,
        redirect: 'advice/review',
        meta: {
          speClass: 'spe_wrap',
        },
        children: [
          {
            name: 'review',
            path: 'review',
            component: adviceReview,
            meta: {
              active: '/inpatient/advice/review',
              speClass: 'spe_wrap'
            }
          },
          {
            name: 'resolve',
            path: 'resolve',
            component: adviceResolve,
            meta: {
              active: '/inpatient/advice/review',
              speClass: 'spe_wrap'
            }
          },
          {
            name: 'execute',
            path: 'execute',
            component: adviceExecute,
            meta: {
              active: '/inpatient/advice/review',
              speClass: 'spe_wrap'
            }
          },
          {
            name: 'sampleManage',
            path: 'sampleManage',
            component: sampleManage,
            meta: {
              active: '/inpatient/advice/review',
              speClass: 'spe_wrap'
            }
          }
        ]
      },
      {
        name: 'executePrint',
        path: 'print',
        component: printLayout,
        redirect: 'print/executeOrder',
        meta: {
          speClass: 'spe_wrap'
        },
        children: [
          {
            name: 'executeOrder',
            path: 'executeOrder',
            component: executeOrder,
            meta: {
              active: '/inpatient/print/executeOrder',
              speClass: 'spe_wrap'
            }
          },
          {
            name: 'bottlePaper',
            path: 'bottlePaper',
            component: bottlePaper,
            meta: {
              active: '/inpatient/print/bottlePaper',
              speClass: 'spe_wrap'
            }
          },
          {
            name: 'infusionCard',
            path: 'infusionCard',
            component: infusionCard,
            meta: {
              active: '/inpatient/print/infusionCard',
              speClass: 'spe_wrap'
            }
          }
        ]
      }
      // {
      //   // 欠费查询
      //   name: 'arrearagequery',
      //   path: 'arrearagequery',
      //   component: Arrearagequery
      // }
    ]
  }
]
