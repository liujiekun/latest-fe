import Warehouse from '../page/warehouse'
// import GeneralList from '../page/generallist'
// import ClassifyList from '../page/drugclassifylist'
// import IntelligenceList from '../page/intelligencelist'
// import Intelligence from '../page/intelligence'
// import DrugCategory from '../page/drugcategory'
// import DrugCategoryList from '../page/drugcategorylist'
// import Manufacturer from '../page/manufacturer'
// import ManufacturerList from '../page/manufacturerlist'
// import Supplier from '../page/supplier'
// import SupplierList from '../page/supplierlist'
// import SupplierPrice from '../page/supplierprice'
// import Appliance from '../page/appliance'
// import ApplianceList from '../page/appliancelist'
// import EquipCustom from '../page/equipcustom'
// import DraftList from '../page/draftlist'
// import DraftTrialList from '../page/drafttriallist'
// import DrugReset from '../page/drug-reset.vue'
import ActivityTypeList from '../page/activitytypelist'
import ActivityType from '../page/activitytype'
// import ServiceManageList from '@/sob/page/service.manage/list'
// import ServiceManageCreate from '@/sob/page/service.manage/create.form'
// import ServiceManageEdit from '@/sob/page/service.manage/edit.form'
// import Serviceset from '@/sob/page/serviceset.manage/form'
// import ServicesetList from '@/sob/page/serviceset.manage/list'
// import processBindList from '@/sob/page/process.bind/list'
// import processBindForm from '@/sob/page/process.bind/form'

export default [
  {
    path: '/global',
    component: Warehouse,
    children: [
      // {
      //   path: 'generals',
      //   component: GeneralList
      // },
      // {
      //   path: 'classifys',
      //   name: 'drugclassify',
      //   component: ClassifyList
      // },
      // {
      //   path: 'equipcustom/:groupId/:wareType/:id',
      //   component: EquipCustom
      // },
      // {
      //   path: 'equipcustom/:groupId/:id',
      //   component: EquipCustom
      // },
      // {
      //   path: 'appliances',
      //   component: ApplianceList
      // },
      // {
      //   path: 'applianceadd/:category/:classifyId',
      //   component: Appliance
      // },
      // {
      //   path: 'applianceadd/:id',
      //   component: Appliance
      // },
      // {
      //   path: 'intelligences',
      //   component: IntelligenceList
      // },
      // {
      //   path: 'intelligenceadd',
      //   component: Intelligence
      // },
      // {
      //   path: 'drugcategoryadd',
      //   component: DrugCategory
      // },
      // {
      //   path: 'drugcategories/:id',
      //   component: DrugCategory
      // },
      // {
      //   path: 'drugcategories',
      //   component: DrugCategoryList
      // },
      // {
      //   path: 'manufactureradd',
      //   component: Manufacturer
      // },
      // {
      //   path: 'manufacturers/:id',
      //   component: Manufacturer
      // },
      // {
      //   path: 'manufacturers',
      //   component: ManufacturerList
      // },
      // {
      //   path: 'supplieradd',
      //   component: Supplier
      // },
      // {
      //   path: 'suppliers/:id',
      //   component: Supplier
      // },
      // {
      //   path: 'supplierprice/:supplierId/:id/:intelligenceId',
      //   component: SupplierPrice
      // },
      // {
      //   path: 'suppliers',
      //   component: SupplierList
      // },
      {
        path: 'activitytypes',
        component: ActivityTypeList
      },
      {
        path: 'activitytypeadd',
        component: ActivityType
      },
      {
        path: 'activitytype/:id',
        component: ActivityType
      },
      // {
      //   path: 'drafts',
      //   component: DraftList
      // },
      // {
      //   path: 'drafttrials',
      //   component: DraftTrialList
      // },
      // {
      //   path: 'drugadd/:systype',
      //   component: DrugReset
      // },
      // {
      //   path: 'drugadd/:systype/:id',
      //   component: DrugReset
      // },
      // {
      //   path: 'drafttrialadd/:systype',
      //   component: DrugReset
      // },
      // {
      //   path: 'drafttrialadd/:systype/:id',
      //   component: DrugReset
      // },
      // {
      //   path: 'drugsadd/:systype/:id',
      //   component: DrugReset
      // },
      // {
      //   path: 'drugswest/:systype/:id',
      //   component: DrugWest
      // },
      // {
      //   path: 'westlook/:systype/:id',
      //   component: DrugWest
      // },
      // {
      //   path: 'druglook/:systype/:id',
      //   component: DrugReset
      // },
      // {
      //   path: 'westedit/:systype/:id',
      //   component: DrugWest
      // },
      // {
      //   path: 'drugedit/:systype/:id',
      //   component: DrugReset
      // },
      // {
      //   path: 'services/:belong',
      //   component: ServiceManageList
      // },
      // {
      //   path: 'services/:belong/:id',
      //   component: ServiceManageEdit
      // },
      // {
      //   path: 'serviceadd',
      //   component: ServiceManageCreate
      // },
      // {
      //   path: 'serviceset/:belong',
      //   component: ServicesetList
      // },
      // {
      //   path: 'servicesetadd',
      //   component: Serviceset
      // },
      // {
      //   path: 'serviceset/:belong/:id',
      //   component: Serviceset
      // },
      // {
      //   path: 'processbind',
      //   component: processBindList
      // },
      // {
      //   path: 'processbindform',
      //   component: processBindForm
      // },
      // {
      //   path: 'processbindform/:id',
      //   component: processBindForm
      // }
    ]
  }
]
