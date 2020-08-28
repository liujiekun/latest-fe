import Warehouse from '../page/warehouse'
// import Workshift from '../page/workshift'
// import WorkshiftList from '../page/workshiftlist'
import StorageRoom from '../page/storageroom'
import StorageRoomAdd from '../page/storageroom.new'
import StorageRoomList from '../page/storageroomlist'
import StorageRoomSystemConfig from '../page/storageroom.systemconfig'
import Manufacturer from '../page/manufacturer'
import ManufacturerList from '../page/manufacturerlist'
import StockAmount from '../page/stockamount'
import StockAmountList from '../page/stockamountlist'

// SRM 院内供应关系
import Organization from '@/warehouse/views/organization/router/index.js'

// 资质管理
import IntelligenceList from '../page/intelligencelist'
import Intelligence from '../page/intelligence'

// 诊所管理
import Commondiagnosis from '@/sob/page/commondiagnosis'
import WristbandSettings from '@/sob/page/wristband/settings'
import Medicalrecords from '@/sob/page/medicalrecords'
import Inspect from '../page/inspect'
import InspectList from '../page/inspectlist'
import InspectDetail from '../page/inspectdetail'

import Welcome from '@/login/page/welcome'

// 处方模版
import PrescriptionTplLayout from '@/sob/page/prescription.template/layout'
import PrescriptionTplList from '@/sob/page/recipe.template/layout'
import PrescriptionTplAdd from '@/sob/page/recipe.template/addtemplate'
import PrescriptionFeeTplAdd from '@/sob/page/recipe.template/addfeetemplate'
import DeptTplAdd from '@/sob/page/recipe.template/dpttemplate'
import DeptFeeTplAdd from '@/sob/page/recipe.template/dptfeetemplate'
// 模版

// 机构设置
import ManufacturerCheck from '../page/manufacturermanage/manufacturercheck'

// 物资列表
import MaterialTableList from '../page/materialtable/materialtablelist'
import CreateMaterial from '../page/materialtable/creatematerial'
import MaterialSee from '../page/materialtable/materialsee'

// 物资设置
import MaterialBusiness from '../page/institutionmaterial/materialbusiness'
import MaterialLists from '../page/institutionmaterial/materiallist'
import MaterialListsee from '../page/institutionmaterial/materialsee'
import MaterialDetail from '../page/institutionmaterial/materialdetail'
import RelationMaterial from '../page/institutionmaterial/relationmaterial'
import DictionarySee from '@/warehouse/page/groupmaterial/dictionarysee'

// // 支付方式
// import PaymentMethod from '../page/payment/paymentmethod'
// import CombinationConfig from '../page/payment/combinationconfig'
// import DiscountProportion from '../page/payment/discountproportion'

// 终端管理
import DeviceList from '@/warehouse/page/devicemanage/view/devicelist.vue'
import SelfhelpMechineCon from '@/warehouse/page/devicemanage/view/selfhelpcon.vue'
import LargescreenCon from '@/warehouse/page/devicemanage/view/largescreencon.vue'

// 分诊设置
import TriageSetting from '@/arrange/page/triage/triagesetting.vue'

// phr 模版
import phrtpllist from '@/form/page/phrtpllist'

// 短信管理路由表
import MESSAGECENTER from '@/msgcenter/router/index.js'

// 数据导入路由表
import DATAIMPORT from '@/warehouse/page/dataimport/router/index'

// 日志
import PatientLog from '../page/patientlog.vue'
// 中转路由
import routerBack from '@/manages/components/router.back'

// 打印路由
import PRINTROUTER from '@/print/router'
import organizationRouteList from '@/manages/router/oss'

// 建筑 病区 病房 床位 等等
import buildingRouter from '@/warehouse/page/building/router/router'
// 长春医保签到
import insurancesignin from '@/rcm/page/insurancesignin'
// 医保目录对照
import medicalItemList from '@/rcm/otmdiscomponent/medicalitemlist.vue'

// 医保对账数据上传
import reconciliationUpload from '@/rcm/otmdiscomponent/reconciliation/data.upload.vue'
// 医保对账费用申报
import costDeclaration from '@/rcm/otmdiscomponent/reconciliation/cost.declaration.vue'
// 医保审批管理 转院审批
import transferApproval from '@/rcm/otmdiscomponent/insurance-approval/transfer-approval'
// 医保审批管理 疾病审批上报
import diseaseApproval from '@/rcm/otmdiscomponent/insurance-approval/disease-approval'
// 病历模版
import MEDICAL_MANAGE from '@/warehouse/router/medicalmanage'

// 诊断管理
import Groupdiagnosis from '@/warehouse/page/group/view/diagnosisgroup/groupdiagnosis'
import Diagnosismanage from '@/warehouse/page/group/view/diagnosisgroup/diagnosismanage'
import diseaseConfig from '@/warehouse/page/group/view/diagnosisgroup/disease-config'

/* ---------------诊疗设置---------------- */
// 医嘱项管理
import ServiceManageList from '@/sob/page/service.manage/list'
import ServiceManageCreate from '@/sob/page/service.manage/create.form'
import ServiceManageEdit from '@/sob/page/service.manage/edit.form'
// 组套管理
import Serviceset from '@/sob/page/serviceset.manage/form'
import ServicesetList from '@/sob/page/serviceset.manage/list'
// 门急诊医生自动打印
import AutoprintSet from '@/sob/page/autoprint.set'
// 住院医护打印、门急诊医生打印规则
import NurseAutoprintSet from '@/sob/page/nurseautoprint.set'
// 计费规则设置
import billingrule from '@/warehouse/page/group/view/billing/billingrule'
// 附加费管理
import surchargeLayOut from '@/sob/page/service.surcharge/surcharge.layout.vue'
// 附加费管理 - 用法管理
// import serviceusageList from '@/sob/page/service.usage/list'
import serviceusageForm from '@/sob/page/service.usage/form'
// 附加费管理 - 煎法管理
// import serviceDecoctList from '@/sob/page/service.surcharge/decoct.vue'
// 调价历史
import PriceDetails from '@/rcm/page/tariffs/price.details/price.details.vue'
import PriceDetailsList from '@/rcm/page/tariffs/price.details/price.details.list.vue'
// 医保管理路由表
import HealthCare from '@/rcm/healthcare/router/index.js'

// 显著医保报账
import xzCostDeclaration from '@/rcm/otmdiscomponent/xz.reconciliation/xz.cost.declaration'
import xzCostSupplement from '@/rcm/otmdiscomponent/xz.reconciliation/xz.cost.supplement'

// 蛟河的对账报表
import jljhybSettleInfo from '@/rcm/otmdiscomponent/jljhmedical/jljh-report/jljh-ybsettleinfo.vue'
import jljhInhosQuery from '@/rcm/otmdiscomponent/jljhmedical/jljh-report/jljh-inhosquery.vue'
import jljhApproval from '@/rcm/otmdiscomponent/jljhmedical/jljh-report/jljh-approval.vue'
export default [
  {
    path: '/warehouse',
    redirect: '/warehouse/welcome',
    name: 'warehouse',
    component: Warehouse,
    children: [
      ...MEDICAL_MANAGE,
      ...buildingRouter,
      ...HealthCare,
      ...DATAIMPORT({
        thirdActiveIndex: '/warehouse/dataimport/list'
      }),
      ...MESSAGECENTER({
        thirdActiveIndex: '/warehouse/message',
        msgListRid: 'Auth_menu_clinic_messageset'
      }),
      ...PRINTROUTER(),
      ...organizationRouteList,

      // SRM 院内供应关系
      ...Organization,
      {
        path: 'welcome',
        name: 'welcome',
        meta: {
          full: true
        },
        component: Welcome
      },
      {
        path: 'routerback',
        name: 'routerback',
        component: routerBack
      },
      {
        path: 'pricedetailslist',
        component: PriceDetailsList,
        meta: {
          isTenant: false,
          pathVal: 'warehouse'
        }
      },
      {
        path: 'pricelist', // 不带头部返回
        component: PriceDetailsList,
        meta: {
          isTenant: false,
          pathVal: 'warehouse',
          noHead: true
        }
      },
      {
        path: 'pricedetails',
        component: PriceDetails
      },
      {
        path: 'materialtables',
        name: 'materialtables',
        component: MaterialTableList,
        redirect: '/warehouse/materialtables/drugs',
        children: [
          {
            path: 'drugs',
            name: 'materialDrugs',
            component: MaterialTableList
          },
          {
            path: 'expandables',
            name: 'materialExpandables',
            component: MaterialTableList
          },
          {
            path: 'equipments',
            name: 'materialEquipments',
            component: MaterialTableList
          }
        ]
      },
      {
        path: 'busienss',
        name: 'busienss',
        component: MaterialBusiness
      },
      {
        path: 'materiallists',
        name: 'materiallists',
        component: MaterialLists,
        meta: {
          keepAlive: true
        }
      },
      {
        path: 'relationmaterial',
        name: 'relationmaterial',
        component: RelationMaterial,
        meta: {
          thirdActiveIndex: '/warehouse/materiallists'
        }
      },
      {
        path: 'materialdetail/:id?',
        name: 'materialdetail',
        component: MaterialDetail,
        meta: {
          thirdActiveIndex: '/warehouse/materiallists'
        }
      },
      {
        path: 'materiallistsee/:id',
        name: 'materiallistsee',
        component: MaterialListsee,
        meta: {
          thirdActiveIndex: '/warehouse/materiallists'
        }
      },
      {
        path: 'dictionarysee/:id',
        name: 'dictionarysee',
        component: DictionarySee,
        meta: {
          thirdActiveIndex: '/warehouse/materiallists'
        }
      },
      {
        path: 'materiallistsnew',
        name: 'materiallistsnew',
        component: MaterialLists
      },
      {
        path: 'materialsee/:id',
        name: 'materialsee',
        component: MaterialSee
      },
      {
        path: 'creatematerialadd',
        name: 'creatematerialadd',
        component: CreateMaterial
      },
      {
        path: 'intelligences',
        component: IntelligenceList
      },
      {
        path: 'intelligenceadd',
        component: Intelligence,
        meta: {
          thirdActiveIndex: '/warehouse/intelligences'
        }
      },
      {
        path: 'intelligence/:id',
        component: Intelligence,
        meta: {
          thirdActiveIndex: '/warehouse/intelligences'
        }
      },
      // {
      //   path: 'workshiftadd',
      //   component: Workshift
      // },
      // {
      //   path: 'workshifts/:id',
      //   component: Workshift
      // },
      // {
      //   path: 'workshifts',
      //   component: WorkshiftList
      // },
      {
        path: 'storageroomadd',
        component: StorageRoomAdd,
        meta: {
          thirdActiveIndex: '/warehouse/storagerooms'
        }
      },
      {
        path: 'storagerooms/:id',
        component: StorageRoom,
        meta: {
          thirdActiveIndex: '/warehouse/storagerooms'
        }
      },
      {
        path: 'storagerooms',
        component: StorageRoomList
      },
      {
        path: 'storageroomconfig',
        meta: {
          thirdActiveIndex: '/warehouse/storageroomconfig'
        },
        component: StorageRoomSystemConfig
      },
      {
        path: 'manufactureradd',
        component: Manufacturer,
        meta: {
          thirdActiveIndex: '/warehouse/manufacturers'
        }
      },
      {
        path: 'manufacturers/:id',
        component: Manufacturer,
        meta: {
          thirdActiveIndex: '/warehouse/manufacturers'
        }
      },
      {
        path: 'manufacturers',
        component: ManufacturerList
      },
      {
        path: 'stockamountadd',
        component: StockAmount
      },
      {
        path: 'stockamounts/:id',
        component: StockAmount
      },
      {
        path: 'stockamounts',
        component: StockAmountList
      },
      /* -----------------诊疗设置------------------------ */
      {
        path: 'services/:belong',
        component: ServiceManageList,
        meta: {
          thirdActiveIndex: '/warehouse/services/2'
        }
      },
      {
        path: 'services/:belong/:id',
        component: ServiceManageEdit,
        meta: {
          thirdActiveIndex: '/warehouse/services/2'
        }
      },
      {
        path: 'serviceadd',
        component: ServiceManageCreate,
        meta: {
          thirdActiveIndex: '/warehouse/services/2'
        }
      },
      {
        path: 'serviceset/:belong',
        component: ServicesetList,
        meta: {
          thirdActiveIndex: '/warehouse/serviceset/2'
        }
      },
      {
        path: 'servicesetadd',
        component: Serviceset,
        meta: {
          thirdActiveIndex: '/warehouse/serviceset/2'
        }
      },
      {
        path: 'serviceset/:belong/:id',
        component: Serviceset,
        meta: {
          thirdActiveIndex: '/warehouse/serviceset/2'
        }
      },
      {
        path: 'autoprintset',
        component: AutoprintSet
      },
      {
        path: 'nurseautoprintset',
        component: NurseAutoprintSet,
        meta: {
          thirdActiveIndex: '/warehouse/nurseautoprintset'
        }
      },
      {
        path: 'billingrule',
        component: billingrule
      },
      {
        path: 'yihuautoprintset',
        component: NurseAutoprintSet,
        meta: {
          thirdActiveIndex: '/warehouse/yihuautoprintset'
        }
      },
      {
        path: 'surcharge',
        component: surchargeLayOut
      },
      {
        path: 'surcharge/:id',
        component: serviceusageForm,
        meta: {
          thirdActiveIndex: '/warehouse/surcharge?type=usage'
        }
      },
      /* -----------------诊疗设置 end------------------------ */
      {
        path: 'commondiagnosis',
        component: Commondiagnosis
      },
      {
        name: 'phrtpllist',
        path: 'phrtpllist',
        component: phrtpllist,
        meta: {
          thirdActiveIndex: '/warehouse/phrtpllist'
        }
      },
      {
        path: 'medicalrecords',
        name: 'medicalrecords',
        component: Medicalrecords
      },
      {
        path: 'inspects',
        component: InspectList
      },
      {
        path: 'inspectadd',
        component: Inspect
      },
      {
        path: 'inspects/:id',
        component: Inspect
      },
      {
        path: 'inspectdetail/:id',
        component: InspectDetail
      },
      {
        name: 'prescipeTpl',
        path: 'prescription/template/:tplType/:belong/:page',
        component: PrescriptionTplLayout
      },
      {
        name: 'templateList',
        path: 'prescription/template/list/:visitType',
        component: PrescriptionTplList,
        meta: {
          noreg: true
        }
      },
      {
        name: 'templateAdd',
        path: 'prescription/template/add/:visitType',
        component: PrescriptionTplAdd,
        meta: {
          thirdActiveIndex: '/warehouse/prescription/template/list/:visitType'
        }
      },
      {
        name: 'templateFeeAdd',
        path: 'prescription/template/addfee/:visitType',
        component: PrescriptionFeeTplAdd
      },
      {
        name: 'templateDptAdd',
        path: 'prescription/template/adddpt/:visitType',
        component: DeptTplAdd,
        meta: {
          thirdActiveIndex: '/warehouse/prescription/template/list/:visitType'
        }
      },
      {
        name: 'templateDptFeeAdd',
        path: 'prescription/template/adddpt/:visitType',
        component: DeptFeeTplAdd
      },
      {
        path: 'manufacturercheck/:id',
        component: ManufacturerCheck
      },
      {
        path: 'wristband',
        component: WristbandSettings
      },
      // {
      //   path: 'paymentmethod',
      //   component: PaymentMethod
      // },
      // {
      //   path: 'combinationconfig',
      //   component: CombinationConfig
      // },
      // {
      //   path: 'discountproportion',
      //   component: DiscountProportion
      // },
      {
        path: 'selfhelpmechinecon',
        name: 'selfhelpmechinecon',
        component: SelfhelpMechineCon,
        meta: {
          thirdActiveIndex: '/warehouse/devicelist'
        }
      },
      {
        path: 'devicelist',
        name: 'devicelist',
        component: DeviceList,
        meta: {
          thirdActiveIndex: '/warehouse/devicelist'
        }
      },
      {
        path: 'triagesetting',
        name: 'triagesetting',
        component: TriageSetting
      },
      {
        path: 'largescreencon',
        name: 'largescreencon',
        component: LargescreenCon,
        meta: {
          thirdActiveIndex: '/warehouse/devicelist'
        }
      },
      {
        path: 'log',
        name: 'log',
        component: PatientLog,
      },
      {
        path: 'insurancesignin',
        name: 'insurancesignin',
        component: insurancesignin,
      },
      {
        path: 'xzcostsupplement',
        component: xzCostSupplement
      },
      {
        path: 'xzcostdeclaration',
        component: xzCostDeclaration
      },
      {
        path: 'medicalItemList',
        component: medicalItemList
      },
      {
        path: 'reconciliationupload',
        component: reconciliationUpload
      },
      {
        path: 'diseaseapproval',
        component: diseaseApproval
      },
      {
        path: 'transferapproval',
        component: transferApproval
      },
      {
        path: 'costdeclaration',
        component: costDeclaration
      },
      // 诊断分组管理
      {
        path: 'diagnosismanage',
        component: Diagnosismanage
      },
      // 诊断管理
      {
        path: 'groupdiagnosis',
        component: Groupdiagnosis
      },
      // 诊断版本配置
      {
        path: 'diseaseconfig',
        component: diseaseConfig
      },
      // 吉林蛟河
      {
        path: 'jljhybSettleInfo',
        component: jljhybSettleInfo
      },
      {
        path: 'jljhInhosQuery',
        component: jljhInhosQuery
      },
      {
        path: 'jljhApproval',
        component: jljhApproval
      }
    ]
  }
]
