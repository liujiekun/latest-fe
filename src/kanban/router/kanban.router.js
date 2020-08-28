import kanban from '../page/kanbanframe'
import Welcome from '@/login/page/welcome'
import servicePanel from '@/workspace/page/service.panel/list' // 服务看板入口
import Report from '@/arrange/page/reservation/report.vue' // 客服工作站 检查检验报告解读
import Appointregister from '@/arrange/page/reservation/appointregister.vue' // 预约记录
import Appointpanel from '@/arrange/page/appoint/appointpanel.vue' // 预约看板
import Registerpanel from '@/arrange/page/appoint/registerpanel.vue' // 预约看板
import AppointInspect from '@/arrange/page/appoint/appoint-inspect.vue' // 预约检查
import Inspection from '@/infusion/page/inspection.upload.vue' // 医技工作台
import Appointcheck from '@/arrange/page/reservation/appointcheck.vue' // 预约体检
// import Triage from '@/arrange/page/triage/triage.vue' // 门诊分诊
import MedicalTriage from '@/arrange/page/triage/medicaltriage.vue' // 医技分诊
import nursemain from '@/arrange/page/nurse/nurse-scheduling.vue' // 护士排班
import assistant from '@/arrange/page/scheduling/assistant.vue' // 助理排班
import RoomSetting from '@/arrange/page/setting/roomsetting.vue' // 门诊医生排班-诊室分配
import RoomRules from '@/arrange/page/setting/roomrules.vue' // 诊室规则维护
import PackageSaleList from '@/crm/page/packagesale/packagesalelist' // 套餐下单-个人下单
import OrderDetails from '@/crm/page/packagesale/orderdetails'// 订单详情
import UseDetailList from '@/crm/page/packagesale/usedetailsinfo'
import PackageInfo from '@/crm/page/packagesale/packageinfo'
/*
import GroupPackageSaleList from '@/crm/page/packagesale/grouppackagesalelist'
import GroupMaintainList from '@/crm/page/packagesale/groupmaintainlist' // 团体下单
*/

import UploadInfo from '@/crm/page/packagesale/uploadinfo' // 团体维护
import Triage from '@/arrange/page/triage/standard.triage.vue' // 门诊分诊
import TriageSetting from '@/arrange/page/triage/triagesetting.vue' // 门诊分诊
import planList from '@/card/page/marketingpackage/guaranteeplan/planlist.vue'
import planDetails from '@/card/page/marketingpackage/guaranteeplan/plandetails.vue'
export default [
  {
    path: '/kanban',
    name: 'kanban',
    redirect: '/kanban/welcome',
    component: kanban,
    children: [
      {
        path: 'welcome',
        meta: {
          full: true
        },
        component: Welcome
      },
      {
        path: 'service',
        name: 'service',
        component: servicePanel
      },
      {
        path: 'appoint',
        name: 'appoint',
        component: kanban,
        redirect: '/appoint/appointlist',
        children: [
          {
            path: 'appointlist',
            name: 'appointlist',
            component: Appointregister
          },
          {
            path: 'appointinspect/:type/:scene/',
            name: 'appointinspect',
            component: AppointInspect
          }
        ]
      },
      {
        path: 'report',
        name: 'report',
        component: Report
      },
      {
        path: 'appointpanel',
        name: 'appointpanel',
        component: Appointpanel
      },
      {
        path: 'registerpanel',
        name: 'registerpanel',
        component: Registerpanel
      },
      {
        path: 'inspection/:serviceType',
        name: 'inspection',
        component: Inspection,
        meta: {
          secActiveIndex: '/kanban/servicePanel'
        }
      },
      {
        path: 'appointcheck',
        name: 'appointcheck',
        component: Appointcheck
      },
      {
        path: 'triage',
        name: 'triage',
        component: Triage
      },
      {
        path: 'package',
        name: 'package',
        component: kanban,
        children: [
          {
            path: 'order',
            name: 'order',
            component: PackageSaleList,
            meta: {
              thirdActiveIndex: '/kanban/package/order'
            }
          },
          {
            path: 'plan',
            name: 'plan',
            component: planList,
            meta: {
              thirdActiveIndex: '/kanban/package/plan'
            }
          },
          {
            path: 'plandetails/:id',
            name: 'plandetails',
            component: planDetails,
            meta: {
              thirdActiveIndex: '/kanban/package/plan'
            }
          }
        ]
      },
      {
        path: 'triageSetting',
        name: 'triageSetting',
        component: TriageSetting
      },
      {
        path: 'medicaltriage',
        name: 'medicaltriage',
        component: MedicalTriage
      },
      {
        name: 'nursemain',
        path: 'nursemain',
        component: nursemain
      },
      {
        name: 'assistant',
        path: 'assistant',
        component: assistant
      },
      {
        name: 'roomsetting',
        path: 'roomsetting',
        component: RoomSetting
      },
      {
        name: 'roomrules',
        path: 'roomrules',
        component: RoomRules
      },
      {
        path: 'orderdetails/:combinationId',
        name: 'orderdetails',
        component: OrderDetails
      },
      {
        path: 'usedetails/:id/:setMealId',
        name: 'usedetails',
        component: UseDetailList
      },
      {
        path: 'packageinfo/:id/:setMealId',
        name: 'packageinfo',
        component: PackageInfo
      },
      {
        path: 'uploadinfo/:id',
        name: 'uploadinfo',
        component: UploadInfo
      }
    ]
  }
]
