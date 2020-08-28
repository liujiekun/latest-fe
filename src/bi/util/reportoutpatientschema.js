// 门诊schema
import doctor from '@/rcm/page/outpatientSettlement/doctorselect.vue'
// const YES_NO = [
//   { id: '1', name: '是' }
// ]
// 预存款查询类型
const FEE_TYPE = [
  { id: '1', name: '充值' },
  { id: '2', name: '消费' },
  { id: '3', name: '提现' },
  { id: '4', name: '转卡转入' },
  { id: '5', name: '转卡转出' },
  { id: '6', name: '退费' },
  { id: '7', name: '提现手续费' }
]

// 收费监控
// export const CHARGE_MONITORING = [
//   {
//     name: 'name',
//     label: '姓名',
//     props: {
//       clearable: true,
//       placeholder: '姓名'
//     }
//   },
//   {
//     name: 'outpatient_number',
//     label: '门诊病历号',
//     props: {
//       clearable: true,
//       placeholder: '门诊病历号'
//     }
//   },
//   {
//     name: 'itemName',
//     label: '收费项目',
//     props: {
//       clearable: true,
//       placeholder: '收费项目'
//     }
//   },
//   {
//     name: 'orderDept',
//     label: '开单科室',
//     comp: 'providerSelect',
//     props: {
//       clearable: true
//     },
//   },
//   {
//     label: '开单医生',
//     name: 'orderDoctor',
//     comp: doctor,
//     props: {
//       field: {
//         clearable: true
//       }
//     }
//   },
//   {
//     name: 'itemClass',
//     label: '费用类别',
//     comp: 'sys-type',
//     props: {
//       useValue: true,
//       code: 'THC_RCM_FIN_TYPE',
//       placeholder: '费用类别'
//     }
//   },
//   {
//     name: 'createBy',
//     label: '收费员',
//     comp: doctor,
//     props: {
//       field: {
//         clearable: true
//       }
//     }
//   },
//   {
//     name: 'comDept',
//     label: '核算科室',
//     comp: 'providerSelect',
//     props: {
//       clearable: true,
//       placeholder: '核算科室'
//     }
//   },
//   {
//     name: 'returnFlag',
//     label: '退费标志',
//     comp: 'ever-select',
//     props: {
//       filterable: false,
//       options: YES_NO,
//       placeholder: '退费标志'
//     }
//   },
//   {
//     name: 'shopSetItemId',
//     label: '套餐标志',
//     comp: 'ever-select',
//     props: {
//       filterable: false,
//       options: YES_NO,
//       placeholder: '套餐标志'
//     }
//   },
//   {
//     name: 'discount',
//     label: '打折标志',
//     comp: 'ever-select',
//     props: {
//       filterable: false,
//       options: YES_NO,
//       placeholder: '打折标志'
//     }
//   },
//   {
//     name: 'startTime',
//     label: '开始时间',
//     comp: 'datePicker',
//     props: {
//       placeholder: '开始时间',
//       showformat: 'yyyy-MM-dd HH:mm:ss',
//       outformat: 'yyyy-MM-dd HH:mm:ss'
//     }
//   },
//   {
//     name: 'endTime',
//     label: '结束时间',
//     comp: 'datePicker',
//     props: {
//       placeholder: '结束时间',
//       showformat: 'yyyy-MM-dd HH:mm:ss',
//       outformat: 'yyyy-MM-dd HH:mm:ss'
//     }
//   }
// ]

// 预存款查询
export const PRE_DEPOSIT_INQUIRY = [
  {
    name: 'outpatient_number',
    label: '病历号',
    props: {
      clearable: true,
      placeholder: '病历号'
    }
  },
  {
    name: 'card_id',
    label: '卡号',
    props: {
      clearable: true,
      placeholder: '卡号'
    }
  },
  {
    name: 'name',
    label: '姓名',
    props: {
      clearable: true,
      placeholder: '姓名'
    }
  },
  {
    name: 'mobile',
    label: '联系电话',
    props: {
      clearable: true,
      placeholder: '联系电话'
    }
  },
  {
    name: 'createBy',
    label: '收费员',
    comp: doctor,
    props: {
      field: {
        clearable: true
      }
    }
  },
  {
    name: 'type',
    label: '类型',
    comp: 'ever-select',
    props: {
      filterable: false,
      options: FEE_TYPE,
      placeholder: '类型'
    }
  },
  {
    name: 'startTime',
    label: '开始时间',
    comp: 'datePicker',
    props: {
      placeholder: '开始时间',
      showformat: 'yyyy-MM-dd HH:mm:ss',
      outformat: 'yyyy-MM-dd HH:mm:ss'
    }
  },
  {
    name: 'endTime',
    label: '结束时间',
    comp: 'datePicker',
    props: {
      placeholder: '结束时间',
      showformat: 'yyyy-MM-dd HH:mm:ss',
      outformat: 'yyyy-MM-dd HH:mm:ss'
    }
  }
]

// 门诊收费汇总按日期
export const FEE_SUMMARY_BY_DATE = [
  {
    name: 'createBy',
    label: '收费人',
    comp: doctor,
    props: {
      field: {
        clearable: true
      }
    }
  },
  {
    name: 'startTime',
    label: '开始时间',
    comp: 'datePicker',
    props: {
      placeholder: '开始时间',
      showformat: 'yyyy-MM-dd HH:mm:ss',
      outformat: 'yyyy-MM-dd HH:mm:ss'
    }
  },
  {
    name: 'endTime',
    label: '结束时间',
    comp: 'datePicker',
    props: {
      placeholder: '结束时间',
      showformat: 'yyyy-MM-dd HH:mm:ss',
      outformat: 'yyyy-MM-dd HH:mm:ss'
    }
  }
]
