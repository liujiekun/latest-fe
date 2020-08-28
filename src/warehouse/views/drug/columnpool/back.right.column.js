import { tableColWidth } from '@/util/table-config'
import {
  statusHtml
} from '@/warehouse/views/util/html'
import {
  tableDefaultCellValue
} from '@/warehouse/views/util/constant'
import sysValue from '@/components/sysvalue'
import BackIconHTML from './back.icon.html'
import materialShowName from '@/warehouse/page/components/material.show.name.vue'
import Vue from 'vue'
const filters = Vue.options.filters
const bus = Vue.prototype.$bus
export default function columns () {
  return [
    {
      prop: 'custom_prop',
      label: '标识',
      slotName: 'custom_prop',
      align: 'center',
      width: 43,
      render (h, ctx, row, index) {
        return BackIconHTML(h, row)
      }
    },
    {
      prop: 'name',
      label: '物资名称',
      slotName: 'name',
      render (h, ctx, row, index) {
        /**
         * cdssResult:cdss校验结果
         * auditRejectedReson: 驳回原因
         * rejectionReason: 拒绝入库原因
         */
        const { materialName, localMaterialId, icons, cdssResult, rejectionReason, auditRejectedReson, outHospitalizedStatus } = row.taskItemList[0] || {}
        return h('div',
          {
            class: {
              f_bold: true
            }
          },
          [
            h('div', [
              materialName && h(materialShowName, {
                props: {
                  materialName: materialName,
                  icons: icons,
                  localMaterialId
                },
                class: {
                  df: true
                }
              })
            ]),
            (row.source === 28 && auditRejectedReson) && h('div', { // 驳回展示
              class: {
                df: true,
                dfc: true
              },
            },
              [
                h('div', {
                  class: {
                    df: true, flex1: true
                  },
                  style: {
                    flex: '0 0 40px'
                  }
                },
                  [
                    h('span', { // 标识
                      class: {
                        markIcon: true
                      },
                      style: {
                        background: '#e43'
                      }
                    },
                      '驳回')
                  ]),
                h('div',
                  {
                    class: {
                      flex1: true
                    }
                  },
                  [
                    h('div', { //  驳回内容
                      class: { flex1: true, red: true },
                      style: {
                        'line-height': '18px'
                      },
                      domProps: {
                        innerHTML: auditRejectedReson
                      }
                    })
                  ]
                ),
                (row.source !== 29 || (outHospitalizedStatus && ![8, 9, 10, 11].includes(outHospitalizedStatus))) && h('div', { // 删除驳回原因
                  domProps: {
                    innerHTML: '<i class="iconfont icon-delete"></i>'
                  },
                  on: {
                    click: (e) => {
                      // 派发删除异常信息
                      bus.$emit('back:delete-exception-cause', row, e, index)
                    }
                  },
                  class: {
                    blue: true, cur: true, df: true, flex1: true
                  },
                  style: {
                    flex: '0 0 15px',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }
                }
                ),
              ]),
            (row.source === 28 && rejectionReason) && h('div', { // 拒收原因说明
              class: {
                df: true,
                dfc: true
              },
            },
              [
                h('div', {
                  class: {
                    df: true, flex1: true
                  },
                  style: {
                    flex: '0 0 40px'
                  }
                },
                  [
                    h('span', {
                      class: {
                        markIcon: true
                      },
                      style: {
                        background: '#f27700'
                      }
                    },
                      '拒收')
                  ]),
                h('div', {
                  class: {
                    flex1: true
                  },
                  style: {
                    'line-height': '18px'
                  }
                },
                  [
                    h('div', {
                      class: { flex1: true, cOrange: true },
                      domProps: {
                        innerHTML: rejectionReason
                      }
                    })
                  ]),
              ]),
            cdssResult && h('div', { // csdd展示
              class: {
                df: true,
                dfc: true
              },
            },
              [
                h('div', {
                  class: {
                    df: true, flex1: true
                  },
                  style: {
                    flex: '0 0 40px'
                  }
                },
                  [
                    h('span', { // cdss 标识
                      class: {
                        markIcon: true
                      },
                      style: {
                        background: '#eb9e05',
                      }
                    },
                      'CDSS')
                  ]),
                h('div', {
                  class: {
                    flex1: true
                  },
                  style: {
                    'line-height': '18px'
                  }
                },
                  [
                    h('div', { class: { flex1: true, cOrg: true } }, cdssResult) // cdss 内容
                  ]),
              ]),
          ])
      }
    },
    {
      prop: 'dis',
      label: '异常',
      slotName: 'dis',
      source: 29, // 29 住院 28 门诊
      width: 200,
      render (h, ctx, row, index) {
        /**
         * cdssResult:cdss校验结果
         * auditRejectedReson: 驳回原因
         * rejectionReason: 拒绝入库原因
         */
        const { rejectionReason, auditRejectedReson, outHospitalizedStatus } = row.taskItemList[0] || {}
        return h('div',
          {
            class: {
              f_bold: true
            }
          },
          [
            auditRejectedReson && h('div', { // 驳回展示
              class: {
                df: true,
                dfc: true
              },
            },
              [
                h('div', {
                  class: {
                    df: true, flex1: true
                  },
                  style: {
                    flex: '0 0 40px'
                  }
                },
                  [
                    h('span', { // 标识
                      class: {
                        markIcon: true
                      },
                      style: {
                        background: '#e43'
                      }
                    },
                      '驳回')
                  ]),
                h('div',
                  {
                    class: {
                      flex1: true
                    }
                  },
                  [
                    h('div', { //  驳回内容
                      class: { flex1: true, red: true },
                      style: {
                        'line-height': '18px'
                      },
                      domProps: {
                        innerHTML: auditRejectedReson
                      }
                    })
                  ]
                ),
                (row.source !== 29 || (outHospitalizedStatus && ![8, 9, 10, 11].includes(outHospitalizedStatus))) && h('div', { // 删除驳回原因
                  domProps: {
                    innerHTML: '<i class="iconfont icon-delete"></i>'
                  },
                  on: {
                    click: (e) => {
                      // 派发删除异常信息
                      bus.$emit('back:delete-exception-cause', row, e, index)
                    }
                  },
                  class: {
                    blue: true, cur: true, df: true, flex1: true
                  },
                  style: {
                    flex: '0 0 15px',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }
                }
                ),
              ]),
            rejectionReason && h('div', { // 拒收原因说明
              class: {
                df: true,
                dfc: true
              },
            },
              [
                h('div', {
                  class: {
                    df: true, flex1: true
                  },
                  style: {
                    flex: '0 0 40px'
                  }
                },
                  [
                    h('span', {
                      class: {
                        markIcon: true
                      },
                      style: {
                        background: '#f27700'
                      }
                    },
                      '拒收')
                  ]),
                h('div', {
                  class: {
                    flex1: true
                  },
                  style: {
                    'line-height': '18px'
                  }
                },
                  [
                    h('div', {
                      class: { flex1: true, cOrange: true },
                      domProps: {
                        innerHTML: rejectionReason
                      }
                    })
                  ]),
              ])
          ])
      }
    },
    {
      prop: 'spec',
      label: '规格',
      slotName: 'spec',
      render (h, ctx, row, index) {
        const { spec } = row.taskItemList[0] || {}
        return spec ? h('span', spec) : h('span', tableDefaultCellValue)
      },
      width: tableColWidth.name4W80
    },
    {
      prop: 'type',
      label: '剂型',
      slotName: 'type',
      render (h, ctx, row, index) {
        const { dosageForm } = row.taskItemList[0] || {}
        return dosageForm ? h(sysValue, {
          props: {
            code: dosageForm,
            type: 'THC_WH_DRUG_FORM'
          },
        }) : h('span', tableDefaultCellValue)
      },
      width: tableColWidth.w150,
    },
    {
      prop: 'num',
      label: '退货数量',
      slotName: 'num',
      render (h, ctx, row, index) {
        const { num, packagUnitName } = row.taskItemList[0] || {}
        return h('div', [
          num,
          packagUnitName
        ])
      },
      width: tableColWidth.name4W80,
    },
    {
      prop: 'operationName',
      label: '申请人',
      slotName: 'operationName',
      render (h, ctx, row, index) {
        const { operationName, providerName } = row || {}
        return h('div', [
          operationName, `(${providerName})`
        ])
      },
      width: tableColWidth.w150,
    },
    {
      prop: 'status',
      label: '状态',
      slotName: 'status',
      render (h, ctx, row, index) {
        const html = statusHtml(ctx, row, index, 'back')
        return h('div', { domProps: { innerHTML: html } })
      },
      width: tableColWidth.name4W80,
    },
    {
      prop: 'inStockTime',
      label: '入库时间',
      formatter ({ value }) {
        return value ? filters.formatDateByExp(value, 'YYYY-MM-DD HH:mm') : tableDefaultCellValue
      },
      width: tableColWidth.datetimeW150,
    },
  ]
}
