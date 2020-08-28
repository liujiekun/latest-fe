// 集团管理工作站
import GroupManage from '@/manages/manages.vue'
import Welcome from '@/login/page/welcome'

import Configure from '@/manages/page/configure/index'
import FormDemo from '@/manages/components/formdemo' // wh 自定义表单模板使用demo
import RouterBack from '@/manages/components/router.back'
// -------------------------------------------------------------------------------------
import organizationRouteList from '@/manages/router/oss'
// 机构管理
import OrganizationListCustom from '@/warehouse/page/group/view/organization/organizationcustom' // 自定义架构
import OrganizationListCross from '@/warehouse/page/group/view/organization/organizationcross' // 跨机构供应关系
import OrganizationListCrossDetail from '@/warehouse/page/group/view/organization/organizationcrossdetail' // 跨机构供应关系详情
import OrganizationListCrossOrder from '@/warehouse/page/group/view/organization/organizationcrossorder' // 库房权重设置
//
// 物资
import Material from '@/manages/page/material'
import MaterialConcise from '@/manages/page/material/concise.index'
// 物资模版 移动过来
import MaterialList from '@/warehouse/page/groupmaterial/materiallist'
import MaterialTempletList from '@/warehouse/page/groupmaterial/materialtempletlist'
import MaterialTempletEdit from '@/warehouse/page/groupmaterial/materialtempletedit'
import TempDictionary from '@/warehouse/page/groupmaterial/tempdictionary'
import TempDictionarySee from '@/warehouse/page/groupmaterial/tempdictionarysee'
import TempDictionaryProperty from '@/warehouse/page/groupmaterial/tempdictionaryproperty'

// 物资配置
// import MaterialConfigure from '@/manages/page/material/material.configure'
// 物资新建&详情
import MaterialInfo from '@/manages/page/material/material.info'
// 药理分类
import AgencyPharmacologyList from '@/warehouse/page/agency/view/pharmacology/pharmacologylist'
import AgencyAssociationdDrugList from '@/warehouse/page/agency/view/pharmacology/associationdruglist'
// -------------------------------------------------------------------------------------
// 医嘱项管理、组套项管理、医嘱项管理（简洁）、组套项管理（简洁）合在了一起
// import Stack from '@/manages/page/prescription/stack.vue'
import ServiceManage from '@/manages/page/prescription/service.vue'
import ServiceSetManage from '@/manages/page/prescription/service.set.vue'
// 新增-编辑医嘱项
import ServiceManageDetail from '@/manages/page/prescription/service.detail.vue'
import ServiceSetManageDetail from '@/manages/page/prescription/service.set.detail.vue'
// import ServiceManageCreate from '@/sob/page/service.manage/create.form'
// import ServiceManageEdit from '@/sob/page/service.manage/edit.form'

// 新增-编辑组套
// import Serviceset from '@/sob/page/serviceset.manage/form'

// 身份卡
import IdCardList from '@/card/page/idcardmanage/idcardlist'
import IdCardContent from '@/card/page/idcardmanage/idcardcontent'

// 活动管理
import Activitys from '@/card/page/activitymanagement/activitylist'
import ActivityContent from '@/card/page/activitymanagement/activitycontent'
// -------------------------------------------------------------------------------------
// 短信管理路由表
import MESSAGECENTER from '@/msgcenter/router/index.js'
// 套餐管理
import PackageManage from '@/card/page/marketingpackage/packagemanagement'
import MarketingPackage from '@/card/page/marketingpackage/marketingpackagedetail'

// 模板管理
import FollowTemplate from '@/follow/page/template/followtemplate'
import FollowTemplateDetail from '@/follow/page/template/followtemplatedetail'
// import newcreate from '@/follow/page/template/newcreate'

// servicePattern
import processBindList from '@/sob/page/process.bind/list'
import processBindForm from '@/sob/page/process.bind/form'
// 频次管理
import FrequencyList from '@/sob/page/frequency.manage/list'
import FrequencyForm from '@/sob/page/frequency.manage/form'
// 频次管理（core）
import CoreFrequencyList from '@/sob/page/frequency.manage.core/list'
import CoreFrequencyForm from '@/sob/page/frequency.manage.core/form'
// 医嘱排斥组管理
import excludeList from '@/sob/page/advice.exclude/list'
import excludeForm from '@/sob/page/advice.exclude/form'
// 检验耗材管理
import mergeItemsList from '@/sob/page/service.merge/list'
import mergeItemsForm from '@/sob/page/service.merge/form'
// 用法管理
import serviceusageList from '@/sob/page/service.usage/list'
import serviceusageForm from '@/sob/page/service.usage/form'
// 诊断管理
import Groupdiagnosis from '@/warehouse/page/group/view/diagnosisgroup/groupdiagnosis'
import Diagnosismanage from '@/warehouse/page/group/view/diagnosisgroup/diagnosismanage'
import orgDiseaseConfig from '@/warehouse/page/group/view/diagnosisgroup/org-disease-config'
// 患者公共头部信息组件
import commonhead from '@/manages/page/commonhead/commonhead'
// import commonheadEdit from '@/manages/page/commonhead/commonhead.edit'
import configManagesDetail from '@/manages/page/commonhead/configmanagesdetail'
// 客户编号管理
import Membernumberlist from '@/crm/page/membernumber/membernumberlist'
import Membernumberedit from '@/crm/page/membernumber/membernumberedit'
// 计费规则设置
import billingrule from '@/warehouse/page/group/view/billing/billingrule'
import billingruleEdit from '@/warehouse/page/group/view/billing/billingrule.edit'
// 开单属性管理
import schemaSetList from '@/sob/page/schema.manage/schema.list.vue'
import schemaSetEdit from '@/sob/page/schema.manage/schema.edit.vue'
// 开单属性关联
import schemaRelateList from '@/sob/page/schema.manage/schema.relate.list.vue'
import schemaRelateEdit from '@/sob/page/schema.manage/schema.relate.edit.vue'
// 过敏规则
import AllergyRule from '@/warehouse/page/components/wh.material.irritability.vue'

// 住院护士打印规则
import NurseAutoprintSet from '@/sob/page/nurseautoprint.set'

// 大客户档案
import keyAccountManage from '@/warehouse/page/group/view/keyaccountmanage/keyaccountmanage.vue'
import profiles from '@/warehouse/page/group/view/keyaccountmanage/profilelist.vue'
import profile from '@/warehouse/page/group/view/keyaccountmanage/profile.vue'
import welfareProgrammes from '@/warehouse/page/group/view/keyaccountmanage/welfarelist.vue'
import welfare from '@/warehouse/page/group/view/keyaccountmanage/welfare.vue'
// 排班预约设置 班次
import Workmain from '@/warehouse/page/group/view/operationsManagement/workmain/main.vue'
import Numbermain from '@/warehouse/page/group/view/operationsManagement/numberrule/numbermain.vue'
import Appointment from '@/warehouse/page/group/view/operationsManagement/appointmentrule/appointment.vue'
import Templatemain from '@/arrange/page/template/main.vue'
import Operatingmain from '@/arrange/page/scheduling/main.vue'
import Organizationscheduling from '@/warehouse/page/group/view/operationsManagement/organizationscheduling/organization.vue'
import Personscheduling from '@/warehouse/page/group/view/operationsManagement/personscheduling/person.vue'

// 预约规则配置
import appointConfig from '@/arrange/page/rules/config.vue'
import rulesList from '@/arrange/page/rules/ruleslist.vue'
// 问卷管理
import Survey from '@/manages/page/survey/list.vue'
import SurveyMain from '@/manages/page/survey/main.vue'
import SurveyNewMain from '@/manages/page/survey/newmain.vue'
import SurveyAnswerList from '@/manages/page/survey/answerlist.vue'
import SurveyDetail from '@/manages/page/survey/detail.vue'
import SurveyReport from '@/manages/page/survey/report.vue'
import SurveyAnswer from '@/manages/page/survey/answer.vue'

// 租户账户
import account from '@/manages/page/account/index.vue'
// 快递费用
import express from '@/manages/page/express/index.vue'
import expressSet from '@/manages/page/express/set.vue'

import monitor from '@/manages/page/monitor/index.vue'
// 病历字典管理
import TemplateType from '@/form/page/anamnesistype/medicalmanageindex'
// 病历模版管理
import templateManage from '@/emr/page/template.manage'
// 病历系统配置
import MedicalSystemConfig from '@/form/page/medicalsystemconfig/manage.index'

// 集团供应商管理
import SupplierMangaes from '@/manages/page/supplier/index.vue'
import SupplierAdded from '@/manages/page/supplier/views/manages.supplieradd.vue'

// 调价历史
import PriceDetails from '@/rcm/page/tariffs/price.details/price.details.vue'
import PriceDetailsList from '@/rcm/page/tariffs/price.details/price.details.list.vue'

// 供应商管理路由表
const SUPPLIER = [
  {
    path: 'supplier',
    meta: {
      location: 'supplier'
    },
    component: SupplierMangaes
  },
  {
    path: 'supplieradded',
    component: SupplierAdded,
    meta: {
      thirdActiveIndex: '/manages/supplier'
    }
  },
  {
    path: 'supplieradded/:id',
    component: SupplierAdded,
    meta: {
      thirdActiveIndex: '/manages/supplier'
    }
  }
]
// 科室路由表
const DEPARTMENT = [
  {
    path: 'workmain',
    name: 'workmain',
    component: Workmain,
    meta: {
      thirdActiveIndex: '/manages/workmain'
    }
  },
  {
    path: 'numberrule',
    name: 'numberrule',
    component: Numbermain,
    meta: {
      thirdActiveIndex: '/manages/numberrule'
    }
  },
  {
    path: 'appointmentrule',
    name: 'appointmentrule',
    component: Appointment,
    meta: {
      thirdActiveIndex: '/manages/appointmentrule'
    }
  },
  {
    path: 'templatemain',
    name: 'templatemain',
    component: Templatemain,
    meta: {
      thirdActiveIndex: '/manages/templatemain'
    }
  },
  {
    path: 'operatingmain/out', // 门诊排班
    name: 'operatingmain',
    component: Operatingmain,
    meta: {
      thirdActiveIndex: '/manages/operatingmain/out'
    }
  },
  {
    path: 'operatingmain/examine', // 检查排班
    name: 'operatingmain_examine',
    component: Operatingmain,
    meta: {
      thirdActiveIndex: '/manages/operatingmain/examine'
    }
  },
  {
    path: 'operatingmain/checkout', // 检验排班
    name: 'operatingmain_checkout',
    component: Operatingmain,
    meta: {
      thirdActiveIndex: '/manages/operatingmain/checkout'
    }
  },
  {
    path: 'operatingmain/treatment', // 治疗排班
    name: 'operatingmain_treatment',
    component: Operatingmain,
    meta: {
      thirdActiveIndex: '/manages/operatingmain/treatment'
    }
  },
  {
    path: 'operatingmain/surgery', // 手术排班
    name: 'operatingmain_surgery',
    component: Operatingmain,
    meta: {
      thirdActiveIndex: '/manages/operatingmain/surgery'
    }
  },
  {
    path: 'operatingmain/video', // 视频问诊
    name: 'operatingmain_video',
    component: Operatingmain,
    meta: {
      thirdActiveIndex: '/manages/operatingmain/video'
    }
  },
  {
    path: 'operatingmain/imgtext', // 图文问诊
    name: 'operatingmain_imgtext',
    component: Operatingmain,
    meta: {
      thirdActiveIndex: '/manages/operatingmain/imgtext'
    }
  },
  {
    path: 'organizationscheduling',
    name: 'organizationscheduling',
    component: Organizationscheduling,
    meta: {
      thirdActiveIndex: '/manages/organizationscheduling'
    }
  },
  {
    path: 'personscheduling',
    name: 'personscheduling',
    component: Personscheduling,
    meta: {
      thirdActiveIndex: '/manages/personscheduling'
    }
  },
  {
    path: 'material',
    meta: {
      location: 'material'
    },
    component: Material
  },
  {
    path: 'materialconcise',
    name: 'materialconcise',
    meta: {
      thirdActiveIndex: '/manages/materialconcise'
    },
    component: MaterialConcise
  },
  // {
  //   path: 'materialfigure',
  //   component: MaterialConfigure,
  //   meta: {
  //     thirdActiveIndex: '/manages/material'
  //   }
  // },
  {
    path: 'materialinfo/:id?',
    name: 'materialinfo',
    component: MaterialInfo,
    meta: {
      location: 'material',
      thirdActiveIndex: '/manages/material'
    }
  },
  {
    path: 'materials',
    name: 'materials',
    component: MaterialList,
    meta: {
      keepAlive: true
    }
  },
  {
    path: 'materialtemplets',
    name: 'materialtemplets',
    component: MaterialTempletList
  }, {
    path: 'materialtempletedit',
    name: 'materialtempletedit',
    component: MaterialTempletEdit,
    meta: {
      thirdActiveIndex: '/manages/materialtemplets'
    }
  },
  {
    path: 'tempdictionaryproperty/:id',
    name: 'tempdictionary_property',
    component: TempDictionaryProperty,
    meta: {
      thirdActiveIndex: '/manages/materialtemplets'
    }
  }, {
    path: 'tempdictionaryadd',
    name: 'tempdictionary_add',
    component: TempDictionary,
    meta: {
      thirdActiveIndex: '/manages/materialtemplets'
    }
  }, {
    path: 'tempdictionary/:id',
    name: 'tempdictionary_id',
    component: TempDictionary,
    meta: {
      thirdActiveIndex: '/manages/materialtemplets'
    }
  }, {
    path: 'tempdictionarysee/:id',
    name: 'tempdictionary_see',
    component: TempDictionarySee,
    meta: {
      thirdActiveIndex: '/manages/materialtemplets'
    }
  },
  {
    path: 'agencypharmacologys',
    name: 'agencypharmacologys',
    component: AgencyPharmacologyList
  },
  {
    path: 'agencyassociationdrugs/:id',
    name: 'agencyassociationdrugs',
    component: AgencyAssociationdDrugList,
    meta: {
      thirdActiveIndex: '/manages/agencypharmacologys'
    }
  },
  {
    path: 'appointconfig',
    name: 'appointconfig',
    component: appointConfig
  },
  {
    path: 'ruleslist',
    name: 'ruleslist',
    component: rulesList
  }
]
// 机构管理路由表
const COLLECTION = [
  {
    path: 'organizationscustom',
    name: 'organizationscustom',
    component: OrganizationListCustom
  },
  {
    path: 'organizationscross',
    name: 'organizationscross',
    component: OrganizationListCross
  },
  {
    path: 'organizationscrossadd',
    name: 'organizationscrossadd',
    component: OrganizationListCrossDetail,
    meta: {
      thirdActiveIndex: '/manages/organizationscross'
    }
  },
  {
    path: 'organizationscrossdetail/:id',
    name: 'organizationscrossdetail',
    component: OrganizationListCrossDetail,
    meta: {
      thirdActiveIndex: '/manages/organizationscross'
    }
  },
  {
    path: 'organizationscrossorder/:id',
    name: 'organizationscrossorder',
    component: OrganizationListCrossOrder,
    meta: {
      thirdActiveIndex: '/manages/organizationscross'
    }
  },
]
// 诊疗设置
const CLINIC_SETTING = [
  // servicePattern
  {
    path: 'processbind',
    component: processBindList,
    meta: { childNavPath: '/manages/processbindform/' }
  },
  {
    path: 'processbindform',
    component: processBindForm,
    meta: { thirdActiveIndex: '/manages/processbind' }
  },
  {
    path: 'processbindform/:id',
    component: processBindForm,
    meta: { thirdActiveIndex: '/manages/processbind' }
  },
  // 频次管理
  {
    path: 'frequency',
    component: FrequencyList
  },
  {
    path: 'frequency/:id',
    component: FrequencyForm,
    meta: { thirdActiveIndex: '/manages/frequency' }
  },
  // 频次管理（platform-core）
  {
    path: 'core-frequency',
    component: CoreFrequencyList
  },
  {
    path: 'core-frequency/:id',
    component: CoreFrequencyForm,
    meta: { thirdActiveIndex: '/manages/core-frequency' }
  },
  // 排斥组管理
  {
    path: 'exclude',
    component: excludeList
  },
  {
    path: 'exclude/:id',
    component: excludeForm,
    meta: { thirdActiveIndex: '/manages/exclude' }
  },
  // 检验耗材管理
  {
    path: 'mergeitems',
    component: mergeItemsList
  },
  {
    path: 'mergeitems/:id',
    component: mergeItemsForm,
    meta: { thirdActiveIndex: '/manages/mergeitems' }
  },
  // 用法管理
  {
    path: 'serviceusage',
    component: serviceusageList
  },
  {
    path: 'serviceusage/:id',
    component: serviceusageForm,
    meta: {
      thirdActiveIndex: '/manages/serviceusage'
    }
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
  // 诊断配置
  {
    path: 'orgDiseaseConfig',
    component: orgDiseaseConfig
  },
  // 患者信息组件
  {
    path: 'commonhead/:index?', // 根据index展示tab
    name: 'commonhead',
    component: commonhead,
    meta: {
      childNavPath: '/manages/commonhead_edit',
      thirdActiveIndex: '/manages/commonhead',
    }
  },
  {
    path: 'configmanagesdetail/:code/:id?',
    name: 'configmanagesdetail',
    component: configManagesDetail,
    meta: {
      thirdActiveIndex: '/manages/commonhead'
    }
  },
  // {
  //   path: 'commonhead',
  //   component: commonhead,
  //   meta: {
  //     childNavPath: '/manages/commonhead_edit'
  //   }
  // },
  // {
  //   path: 'commonhead_edit',
  //   component: commonheadEdit,
  //   meta: {
  //     thirdActiveIndex: '/manages/commonhead'
  //   }
  // },
  // 客户编号管理
  {
    path: 'member',
    name: 'membernumberlist',
    component: Membernumberlist
  },
  {
    path: 'member/membernumberedit',
    name: 'membernumberedit',
    component: Membernumberedit,
    meta: {
      thirdActiveIndex: '/manages/member'
    }
  },
  // 计费规则设置
  {
    name: 'billingrule',
    path: 'billingrule',
    component: billingrule,
    meta: {
      childNavPath: '/manages/billingrule_edit'
    }
  },
  {
    name: 'billingruleEdit',
    path: 'billingrule_edit/:orgType/:id',
    component: billingruleEdit,
    meta: {
      thirdActiveIndex: '/manages/billingrule'
    }
  },
  // 开单属性管理
  {
    path: 'schemamanage',
    component: schemaSetList,
    meta: {
      childNavPath: '/manages/schemaedit'
    }
  },
  {
    path: 'schemaedit',
    component: schemaSetEdit,
    meta: {
      thirdActiveIndex: '/manages/schemamanage'
    }
  },
  {
    path: 'schemaedit/:id',
    component: schemaSetEdit,
    meta: {
      thirdActiveIndex: '/manages/schemamanage'
    }
  },
  // 开单属性关联
  {
    path: 'schemarelate',
    component: schemaRelateList,
    meta: {
      childNavPath: '/manages/schemareledit'
    }
  },
  {
    path: 'schemareledit',
    component: schemaRelateEdit,
    meta: {
      thirdActiveIndex: '/manages/schemarelate'
    }
  },
  {
    path: 'schemareledit/:id',
    component: schemaRelateEdit,
    meta: {
      thirdActiveIndex: '/manages/schemarelate'
    }
  },
  // 过敏规则
  {
    path: 'allergyrule',
    component: AllergyRule
  },
  {
    path: 'groupnurseautoprintset',
    component: NurseAutoprintSet,
    meta: {
      thirdActiveIndex: '/manages/groupnurseautoprintset'
    }

  },
  {
    path: 'groupyihuautoprintset',
    component: NurseAutoprintSet,
    meta: {
      thirdActiveIndex: '/manages/groupyihuautoprintset'
    }

  },
]

// 集团排班
const ARRANGE = [

]
// 病历管理
const MEDICAL_MANAGE = [
  {
    path: 'templatetype',
    component: TemplateType,
    meta: {
      workshopTag: 'groupManage',
      thirdActiveIndex: '/manages/templatetype'
    }
  },
  {
    path: 'templatemanage',
    component: templateManage,
    meta: {
      workshopTag: 'groupManage',
      thirdActiveIndex: '/manages/templatemanage',
      rid: 'Auth_menu_manages_medicalrecord_template'
    }
  },
  {
    path: 'medicalconfig',
    component: MedicalSystemConfig,
    meta: {
      workshopTag: 'groupManage',
      thirdActiveIndex: '/manages/medicalconfig',
      rid: 'Auth_menu_manages_medicalrecord_config'
    }
  }
]

// 医嘱字典
const SERVICE_DICTIONARY = [
  {
    name: 'prescription',
    path: 'prescription',
    component: ServiceManage,
    meta: {
      thirdActiveIndex: '/manages/prescription'
    }
  },
  {
    name: 'stack',
    path: 'stack',
    component: ServiceSetManage,
    meta: {
      thirdActiveIndex: '/manages/stack'
    }
  },
  {
    name: 'prescriptionCreate',
    path: 'prescriptionadd',
    component: ServiceManageDetail,
    meta: { active: '/global/services/1', thirdActiveIndex: '/manages/prescription' }
  },
  {
    name: 'prescriptionEdit',
    path: 'prescription/editor/:id',
    component: ServiceManageDetail,
    meta: { active: '/global/services/2', thirdActiveIndex: '/manages/prescription' }
  },
  {
    name: 'stackCreate',
    path: 'stackadd',
    component: ServiceSetManageDetail,
    meta: { active: '/global/services/1', thirdActiveIndex: '/manages/stack' }
  },
  {
    name: 'stackEdit',
    path: 'stack/editor/:id',
    component: ServiceSetManageDetail,
    meta: { active: '/global/services/2', thirdActiveIndex: '/manages/stack' }
  },
  // {
  //   path: 'prescription',
  //   component: Stack,
  //   meta: {
  //     thirdActiveIndex: '/manages/prescription',
  //     routeType: 'prescription'
  //   }
  // },
  // {
  //   path: 'prescriptionconcise',
  //   name: 'prescriptionconcise',
  //   component: Stack,
  //   meta: {
  //     thirdActiveIndex: '/manages/prescriptionconcise',
  //     routeType: 'prescriptionconcise'
  //   }
  // },
  // {
  //   name: 'prescriptionconciseEdit',
  //   path: 'prescriptionconcise/editor/:id',
  //   component: ServiceManageEdit,
  //   meta: { active: '/global/services/2', thirdActiveIndex: '/manages/prescriptionconcise' }
  // },
  // {
  //   name: 'prescriptionCreate',
  //   path: 'prescriptionadd',
  //   component: ServiceManageCreate,
  //   meta: { active: '/global/services/1', thirdActiveIndex: '/manages/prescription' }
  // },
  // {
  //   path: 'prescriptionconciseadd',
  //   component: ServiceManageCreate,
  //   meta: { active: '/global/services/2', thirdActiveIndex: '/manages/prescriptionconcise' }
  // },
  // {
  //   name: 'prescriptionEdit',
  //   path: 'prescription/editor/:id',
  //   component: ServiceManageEdit,
  //   meta: { active: '/global/services/1', thirdActiveIndex: '/manages/prescription' }
  // },
  // {
  //   path: 'stack',
  //   component: Stack,
  //   meta: {
  //     thirdActiveIndex: '/manages/stack',
  //     routeType: 'stack'
  //   }
  // },
  // {
  //   path: 'stackconcise',
  //   name: 'stackconcise',
  //   component: Stack,
  //   meta: {
  //     thirdActiveIndex: '/manages/stackconcise',
  //     routeType: 'stackconcise'
  //   }
  // },
  // {
  //   name: 'stackCreate',
  //   path: 'stackadd',
  //   component: Serviceset,
  //   meta: { active: '/global/serviceset/1', thirdActiveIndex: '/manages/stack' }
  // },
  // {
  //   name: 'stackConciseCreate',
  //   path: 'stackconciseadd',
  //   component: Serviceset,
  //   meta: { active: '/global/serviceset/1', thirdActiveIndex: '/manages/stackconcise' }
  // },
  // {
  //   name: 'stackconciseEdit',
  //   path: 'stackconcise/editor/:id',
  //   component: Serviceset,
  //   meta: { active: '/global/serviceset/1', thirdActiveIndex: '/manages/stackconcise' }
  // },
  // {
  //   name: 'stackEdit',
  //   path: 'stack/editor/:id',
  //   component: Serviceset,
  //   meta: { active: '/global/serviceset/1', thirdActiveIndex: '/manages/stack' }
  // },
]
let routerArr = [
  {
    path: '/manages/',
    component: GroupManage,
    redirect: '/manages/welcome',
    meta: {
      manage: true
    },
    children: [
      {
        path: 'welcome',
        meta: {
          full: true
        },
        component: Welcome
      },
      {
        path: 'pricedetailslist',
        component: PriceDetailsList,
        meta: {
          isTenant: true,
          pathVal: 'manages'
        }
      },
      {
        path: 'pricelist', // 不带头部返回111
        component: PriceDetailsList,
        meta: {
          isTenant: true,
          pathVal: 'manages',
          noHead: true
        }
      },
      {
        path: 'pricedetails',
        component: PriceDetails,
        meta: {
          notFull: true,
        }
      },
      {
        path: 'configure',
        component: Configure
      },
      {
        path: 'formdemo/:id?',
        name: 'form',
        alias: 'form',
        component: FormDemo
      },
      {
        path: 'routerback',
        name: 'routerback',
        component: RouterBack
      },
      {
        path: 'idcards',
        name: 'idcards',
        component: IdCardList,
        meta: {
          thirdActiveIndex: '/manages/idcards'
        }
      },
      {
        name: 'idcard',
        path: 'idcard',
        component: IdCardContent,
        meta: {
          thirdActiveIndex: '/manages/idcards'
        }
      },
      {
        path: 'idcardedit/:code',
        name: 'idcardedit',
        component: IdCardContent,
        meta: {
          thirdActiveIndex: '/manages/idcards'
        }
      },
      {
        path: 'activitys',
        name: 'activitys',
        component: Activitys,
        meta: {
          thirdActiveIndex: '/manages/activitys'
        }
      },
      {
        path: 'activityadd',
        name: 'activityadd',
        component: ActivityContent,
        meta: {
          thirdActiveIndex: '/manages/activitys'
        }
      },
      {
        path: 'activitydetail/:code',
        name: 'activitydetail',
        component: ActivityContent,
        meta: {
          thirdActiveIndex: '/manages/activitys'
        }
      },
      {
        path: 'packagemanage',
        name: 'packagemanage',
        component: PackageManage,
        meta: {
          thirdActiveIndex: '/manages/packagemanage'
        }
      },
      {
        path: 'marketingpackageadd',
        component: MarketingPackage,
        meta: {
          source: 'manages',
          thirdActiveIndex: '/manages/packagemanage',
          isAdd: 1
        }
      },
      {
        path: 'marketingpackageedit',
        component: MarketingPackage,
        meta: {
          source: 'manages',
          thirdActiveIndex: '/manages/packagemanage'
        }
      },
      // 随访路由
      {
        path: 'follow/template',
        component: FollowTemplate,
        meta: {
          thirdActiveIndex: '/manages/follow/template'
        }
      },
      {
        path: 'follow/template/detail/:id?/:categoryId?',
        component: FollowTemplateDetail,
        meta: {
          thirdActiveIndex: '/manages/follow/template'
        }
      },
      // {
      //   path: 'follow/template/newcreate/:id?/:categoryId?',
      //   component: newcreate,
      //   meta: {
      //     thirdActiveIndex: '/manages/follow/template'
      //   }
      // },
      ...DEPARTMENT,
      ...organizationRouteList,
      ...SUPPLIER,
      ...SERVICE_DICTIONARY, // 医嘱字典
      {
        path: 'surveyNew',
        component: SurveyNewMain,
      },
      {
        path: 'survey',
        component: SurveyMain,
        children: [
          {
            path: '',
            name: 'survey',
            component: Survey,
            meta: {
              thirdActiveIndex: '/manages/survey'
            }
          },
          {
            path: 'answerList',
            name: 'surveyAnswerList',
            component: SurveyAnswerList,
            meta: {
              thirdActiveIndex: '/manages/survey'
            }
          },
          {
            path: 'detail/:surveyId',
            name: 'surveyDetail',
            component: SurveyDetail,
            meta: {
              thirdActiveIndex: '/manages/survey'
            }
          },
          {
            path: 'report/:surveyId',
            name: 'surveyReport',
            component: SurveyReport,
            meta: {
              thirdActiveIndex: '/manages/survey'
            }
          },
          {
            path: 'answer/:surveyId',
            name: 'surveyAnswer',
            component: SurveyAnswer,
            meta: {
              thirdActiveIndex: '/manages/survey'
            }
          },
        ],
      },
      ...MESSAGECENTER({
        thirdActiveIndex: '/manages/message',
        msgListRid: 'Auth_menu_manages_message'
      }),
      ...COLLECTION,
      ...CLINIC_SETTING, // 诊疗设置
      ...ARRANGE, // 集团排班
      ...MEDICAL_MANAGE, // 病历模版
      {
        path: 'keyAccountManage',
        redirect: 'keyAccountManage/profiles',
        component: keyAccountManage,
        children: [{
          path: 'profiles',
          component: profiles
        },
        {
          name: 'profileadd',
          path: 'profileadd',
          component: profile,
          meta: {
            thirdActiveIndex: '/manages/keyAccountManage/profiles'
          }
        },
        {
          path: 'profiles/:id',
          component: profile,
          meta: {
            thirdActiveIndex: '/manages/keyAccountManage/profiles'
          }
        },
        {
          path: 'welfare',
          component: welfareProgrammes
        },
        {
          name: 'welfareadd',
          path: 'welfareadd',
          component: welfare,
          meta: {
            thirdActiveIndex: '/manages/keyAccountManage/welfare'
          }
        },
        {
          path: 'welfare/:id',
          component: welfare,
          meta: {
            thirdActiveIndex: '/manages/keyAccountManage/welfare'
          }
        }]
      },
      {
        path: 'account',
        component: account
      },
      {
        path: 'express',
        component: express
      },
      {
        path: 'express_set',
        component: expressSet
      },
      {
        path: 'monitor',
        component: monitor
      }
    ]
  },
]
export default routerArr
