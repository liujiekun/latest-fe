// 病历管理工作站
import Hospital from '@/inpatient/page/hospital.vue'

// 召回管理
import caseRecall from '@/medrecmanage/page/caserecall.vue'
// 历史管理
import caseHistory from '@/medrecmanage/page/casehistory.vue'
// 门诊审批
import approval from '@/medrecmanage/page/approval.vue'
// 审批列表页
import approvallist from '@/medrecmanage/page/approvallist.vue'
// 运行病历
import RunRecord from '@/medrecmanage/page/recordmanage/runrecord.vue'
// 病历归档
import RecordArchive from '@/medrecmanage/page/recordmanage/recordarchive.vue'
// 病历打印
import RecordPrint from '@/medrecmanage/page/recordmanage/recordprint.vue'

export default [
  {
    name: 'case',
    path: '/case',
    redirect: '/case/runrecord',
    component: Hospital,
    meta: {
      secActiveIndex: '/case/runrecord',
      route: 'case'
    },
    children: [
      {
        name: 'case_recall',
        path: 'recall',
        component: caseRecall,
        meta: {
          secActiveIndex: '/case/recall',
          route: 'case'
        }
      },
      {
        name: 'case_history',
        path: 'history',
        component: caseHistory,
        meta: {
          secActiveIndex: '/case/history',
          route: 'case'
        }
      },
      {
        name: 'case_approval',
        path: 'approval',
        component: approval,
        meta: {
          secActiveIndex: '/case/approval',
          route: 'case'
        }
      },
      {
        name: 'case_approvallist',
        path: 'approvallist',
        component: approvallist,
        meta: {
          secActiveIndex: '/case/approvallist',
          route: 'case'
        }
      },
      {
        name: 'case_runrecord',
        path: 'runrecord',
        component: RunRecord,
        meta: {
          thirdActiveIndex: '/case/runrecord'
        }
      },
      {
        name: 'case_recordarchive',
        path: 'recordarchive',
        component: RecordArchive,
        meta: {
          thirdActiveIndex: '/case/runrecord'
        }
      },
      {
        name: 'case_recordprint',
        path: 'recordprint',
        component: RecordPrint,
        meta: {
          // secActiveIndex: '/case/runrecord',
          thirdActiveIndex: '/case/recordprint',
          prole: 2// 需要用到打印权限,护士
        }
      }
    ]
  }
]
