export const RECEIVABLE_TYPE = {
  1: '商业保险应收单',
  2: '医疗保险应收单'
}

/**
 * 判断是否为空
 * @param str
 * @returns {string}
 */
export const isNull = str => {
  return String(str) === '' ||
    str === null ||
    str === 'null' ||
    String(str) === 'undefined'
    ? !0
    : !1
}

/**
 * 流程状态
 * @type {{0: string, 1: string, 2: string, 3: string}}
 */
export const PROCESS_STATUS = {
  0: '已定义',
  1: '已发布',
  2: '已卸载',
  3: '已作废'
}

export const SETTLEMENT_TYPE = [
  { id: 1, name: '门诊' },
  { id: 3, name: '挂号' }
]

export const SETTLEMENT_TABLE_TYPE = {
  1: '门诊',
  3: '挂号',
  7: '商城'
}

export const ACCOUNT_CHECK_STATUS = {
  0: '平账',
  1: '存在差异'
}

/**
 * 导出表格包裹elementUI Table
 * @param id          require       String        包裹盒子id
 * @param print       unrequire     Boolean       是否为打印
 * @param title       unrequire     String        打印Title
 */
export const wrapTable = function (id, print, title) {
  let exportTable = document.getElementById('exportTable')
  if (exportTable) document.body.removeChild(exportTable)
  let speTable = document.createElement('div')
  exportTable = document.createElement('table')
  let titleH3 = document.createElement('h3')
  if (print) {
    titleH3.className = 'print_header center'
    titleH3.innerHTML = title
    speTable.className = 'table_spe'
    speTable.appendChild(titleH3)
    speTable.appendChild(exportTable)
    let speTableWrap = document.createElement('div')
    speTableWrap.id = 'exportTable'
    speTableWrap.style.width = '0px'
    speTableWrap.style.height = '0px'
    speTableWrap.style.position = 'absolute'
    speTableWrap.style.top = '-99999px'
    speTableWrap.style.left = '-99999px'
    speTableWrap.appendChild(speTable)
    document.body.appendChild(speTableWrap)
  } else {
    exportTable.id = 'exportTable'
    exportTable.style.width = '0px'
    exportTable.style.height = '0px'
    exportTable.style.position = 'absolute'
    exportTable.style.top = '-99999px'
    exportTable.style.left = '-99999px'
    document.body.appendChild(exportTable)
  }
  let tableWrap = document.getElementById(id)
  let header = tableWrap.querySelector(
    '.el-table__header-wrapper .el-table__header'
  )
  let body = tableWrap.querySelector('.el-table__body-wrapper .el-table__body')
  let footer = tableWrap.querySelector(
    '.el-table__footer-wrapper .el-table__footer'
  )
  exportTable.innerHTML =
    (header ? header.innerHTML : '') +
    (body ? body.innerHTML : '') +
    (footer ? footer.innerHTML : '')
}

// 医保radio
export const BUSINESS_FULL_SELFFEE_INSURANCE = [
  { id: 1, name: '商保' },
  { id: 2, name: '全自费' }
]

// 消息通道日结router
export const MESSAGE_CHANNEL_DAY_KNOT = [
  { param: 'CSSET', name: '门诊收费结算单', dayKnotRoute: '/rcm/daily/settlement/1' },
  { param: 'CSREG', name: '门诊挂号结算单', dayKnotRoute: '/rcm/daily/settlement/3' },
  { param: 'IPPRE', name: '住院预交金结算单', dayKnotRoute: '/hospitalization/daily/settlement/0' },
  { param: 'IPSET', name: '住院收费结算单', dayKnotRoute: '/hospitalization/daily/settlement/1' },
  { param: 'MKSET', name: '营销收费结算单', dayKnotRoute: '/rcm/daily/rcmSettlement' }
]

// 体检套餐分类ID
export const MEPC_ID = 'bc2d4997-d2f0-49ed-bbca-932dc7e442ff'

// 是否使用状态
export const STATUS_OF_USE = [
  { id: '', name: '全部' },
  { id: 1, name: '未使用' },
  { id: 2, name: '已使用' }
]

// 生日提醒弹框
export function birthdayPopup (_this) {
  _this.$notify({ customClass: 'birContainer', iconClass: 'icon iconfont icon-bis cOrg birthday-icon-size', message: '今天是患者生日，请注意', duration: 3000 })
}

// 产房套餐分类ID
export const PREGNANCY_TEST_PACKAGE = 'f9163156-4509-474e-b276-b67ac8208f5d'

// 套餐设置适用机构设置code
export const PSAOS_CODE = 'meal_organization_mode'
// 套餐设置适用机构设置Arr
export const INSTITUTIONAL_CITY = [
  { id: '1', name: '按机构设置' },
  { id: '2', name: '按城市设置' }
]

// 自定义地址区域code
export const CUSTOM_ADDRESS_AREA = 'SXX19011400001AW7wt'

// 应收实收
export const RECEIVABLE_ACTUAL_HARVEST = [{ id: '1', name: '应收金额' }, { id: '2', name: '实收金额' }]

// 财务分类
export const FINANCIAL_CLASSIFICATION = [{ id: '1', name: '一级财务分类' }, { id: '2', name: '二级财务分类' }]

export const BILLING_STATUS = [
  { id: 1, name: '未结算' },
  { id: 2, name: '已结算' }
]

export const DISCOUNT_METHOD = [{ id: 1, name: '折扣比例' }, { id: 2, name: '折扣金额' }] // 折扣方式

// /**
//  * props                        字段含义
//  * @param data                  需要递归数据(array)
//  * @param parentId              指定父级id匹配索引
//  */
// export function arr2Tree ({ data, parentId = 'parentId' }) { // 无限递归树结构
//   // 删除 所有 children,以防止多次调用
//   data.forEach(function (item) { delete item.children })
//   // 将数据存储为 以 id 为 KEY 的 map 索引数据列
//   let map = {}
//   data.forEach(function (item) { map[item.id] = item })
//   let val = []
//   data.forEach(function (item) {
//     // 以当前遍历项，的pid,去map对象中找到索引的id
//     let parent = map[item[parentId]]
//     // 如果找到索引，那么说明此项不在顶级当中,那么需要把此项添加到，他对应的父级中
//     parent ? (parent.children || (parent.children = [])).push(item) : val.push(item) // 如果没有在map中找到对应的索引ID,那么直接把 当前的item添加到 val结果集中，作为顶级
//   })
//   return val
// }

export const ACTIVITY_FILE_TYPE = 115 // 活动档案type

export const IDENTIFY_CARD_FILE_TYPE = 120 // 身份卡档案type

export const PACKAGE_FILE_TYPE = 119 // 套餐档案type
