// 发药列表表格配置
import { tableColWidth } from '@/util/table-config'
import {
  showIcon,
  statusHtml
} from '@/warehouse/views/util/html'
import {
  PLACEHOLDER_ICON,
  tableDefaultCellValue
} from '@/warehouse/views/util/constant'
import {
  WEST_MEDICINE_TYPE
} from '@/util/common'
import { componentUpward } from '@/warehouse/views/util/index'
import storage from '@/util/storage'
import sysValue from '@/components/sysvalue'
import materialShowName from '@/warehouse/page/components/material.show.name.vue'
import AdviceIcon from '@/warehouse/views/drug/component/advice.icon'
import Vue from 'vue'
const filters = Vue.options.filters
/**
 * mark：发药界面所属项 1、任务审核  2、收方发药  3、缺货任务  4、发药记录 5、任务列表
 * includ: 发药类型（整单 | 明细）：1、只有按明细发药才需要 2、只有按处方发药才需要
 * little: 少许需要单独展示的 1、修改发药方式时，标记异常展示物资明细
 */
const codeWidth = 130
function getterRowsSetting (row, type) {
  // 发货方式、邮寄标记、状态、异常标记:identification、缺货标记:shortage、pageType:当前页面(对标mark)
  const { delivery, mailFlag, status, identification, pageType, shortage } = row
  // 非异常
  // 条件一: 自取、待出库可操作
  // 条件二: 邮寄、邮寄完成非待出库和非已完成不可操作
  // 条件三: pageType = 4 发药记录页面  所有都不可操作
  // 如有自定义异常标识， 说明是父子医嘱并且包含异常信息，不可操作 （customIdentification） | 虚拟库房不可操作
  if (pageType === 4 || row.customIdentification || columns.isInvented) return type ? tableDefaultCellValue : ''
  if ((identification && shortage !== 23) || ((delivery === 0 && ![2, 3].includes(status)) ||
    (delivery === 1 && (mailFlag || ![2, 3].includes(status))))
  ) {
    return !type ? tableDefaultCellValue : ''
  } else if ((!identification || shortage === 23) &&
    ((delivery === 0 && [2, 3].includes(status)) ||
      (delivery === 1 && !mailFlag && [2, 3].includes(status)))
  ) {
    return type ? `<span class="blue cur"><i class="iconfont icon-xiugai"></i></span>` : ''
  }
  // todo:自备都能编辑
  // return type && [2, 3].includes(status) ? `<span class="blue cur"><i class="iconfont icon-xiugai"></i></span>` : ''
}
export default function columns () {
  return [
    {
      prop: '',
      label: '改',
      width: 32,
      mark: [2, 5],
      includ: 1, // 1、只有按明细发药才需要 2、只有按处方发药才需要展示
      defaultCellValue: '',
      align: 'center',
      formatter ({ row }) {
        return getterRowsSetting(row, 0)
      },
      beforeHtmlFormatter ({ row }) {
        return getterRowsSetting(row, 1)
      },
      beforeHtmlEvent: 'edit'
    },
    {
      prop: '',
      label: '操作',
      width: tableColWidth.name4W80,
      mark: [3],
      defaultCellValue: '',
      formatter ({ row }) {
        return row.shortage === 23 && row.status !== 4 ? '' : tableDefaultCellValue
      },
      beforeHtmlFormatter ({ row }) {
        return row.shortage === 23 && row.status !== 4 ? `<span class="blue cur">无法到货</span>` : ``
      },
      beforeHtmlEvent: 'unReachableHandler'
    },
    {
      prop: 'custom_prop',
      label: '标识',
      mark: [2, 3, 4, 5],
      slotName: 'custom_prop',
      width: 73,
      render (h, ctx, row, index) {
        return showIcon(h, row, PLACEHOLDER_ICON.slice(0, -1), true)
      }
    },
    {
      prop: 'name',
      mark: [1, 2, 3, 4, 5],
      little: [1],
      label: '物资名称',
      slotName: 'name',
      render (h, ctx, row, index) {
        // TODO: taskItemList 是一个数组明细， 现今只有一条，后续如有展示明细，需进行再处理
        /**
         * cdssResult:cdss校验结果
         * exceptionCause:异常原因
         * rejectionReasons:驳回原因
         * description: 医生说明
         * dialogFlag: 编辑弹窗展示时需进行异常和驳回删除操作
         * identification: 异常标识
         * examineFlag: 审核
         * 删除驳回原因或删除异常原因abnormallyDeleteHandler
         * ctx.parent.abnormallyDeleteHandler(row, index, type=1) =>  type  1:驳回原因  0:异常原因
         */
        // row.pageType:发药页面标识 1任务审核
        // mainFlag:父子医嘱标识 1父医嘱  2子医嘱  lastMain:1最后一条子医嘱
        const { description, examineFlag, status, dialogFlag, pageType, identification } = row
        const { cdssResult, localMaterialId, exceptionCause, materialName, icons, rejectionReasons, mainFlag, lastMain } = row.taskItemList[0] || {}
        // 转换一下驳回原因，医生说明存在并且驳回原因也存在时， 清空驳回原因， 不显示
        let rejectionReasonsInfo = rejectionReasons
        if (description && rejectionReasonsInfo && examineFlag === 0) rejectionReasonsInfo = ''
        return h('div',
          {
            class: {
              f_bold: true
            }
          },
          [
            h('div', [
              mainFlag > 0 && h(AdviceIcon, {
                class: {
                  fl: true, mr5: true
                },
                props: {
                  mainFlag,
                  lastMain
                }
              }),
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
            (identification > 0 || dialogFlag) && exceptionCause && h('div', { // 异常展示
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
                    h('span', { // 异常标识
                      class: {
                        markIcon: true
                      },
                      style: {
                        background: '#e43'
                      }
                    },
                      '异常')
                  ]),
                h('div',
                  {
                    class: {
                      flex1: true
                    }
                  },
                  [
                    h('div', { //  异常内容
                      class: { flex1: true, red: true },
                      style: {
                        'line-height': '18px'
                      },
                      domProps: {
                        innerHTML: exceptionCause
                      }
                    })
                  ]
                ),
                ((status === 2 && (!description || (description && identification))) || dialogFlag) && h('div', { // status = 2 待出库 并且 没有医生说明时 或者 医生说明存在和异常标识也存在，代表第二次操作异常，才可以删除异常原因 可以自己删除异常 ； dialogFlag 编辑弹框数据才有的自定义字段
                  domProps: {
                    innerHTML: '<i class="iconfont icon-delete"></i>'
                  },
                  on: {
                    click: (e) => {
                      let parent
                      if ((parent = componentUpward(ctx, 'abnormallyDeleteHandler'))) {
                        parent.abnormallyDeleteHandler(row, index, 0)
                      }
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
            (rejectionReasonsInfo && (pageType === 1 || pageType === undefined)) && h('div', { // 驳回原因:只有任务审核页面才显示驳回原因
              class: {
                df: true, dfc: true
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
                    h('div', {
                      class: { flex1: true, red: true },
                      style: {
                        'line-height': '18px'
                      },
                      domProps: {
                        innerHTML: rejectionReasonsInfo
                      }
                    })
                  ]
                ),
                // 驳回原因删除按钮 - 审核状态为驳回 | 不存在医生说明 | 弹出框展示 并且 是审核页面
                (examineFlag === 1 || !description || (dialogFlag && pageType === 1)) && h('div', {
                  domProps: {
                    innerHTML: '<i class="iconfont icon-delete"></i>'
                  },
                  on: {
                    click: (e) => {
                      let parent
                      if ((parent = componentUpward(ctx, 'abnormallyDeleteHandler'))) {
                        parent.abnormallyDeleteHandler(row, index, 1)
                      }
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
            description && h('div', { // 医生说明：todo:在任务审核页面才需要展示  && row.pageType === 1
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
                        background: '#1c78ef',
                      }
                    },
                      '说明')
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
                      class: { flex1: true, cBlue: true },
                      domProps: {
                        innerHTML: description
                      }
                    }) // 医生强制审核通过原因说明
                  ]),
              ])
          ])
      }
    },
    {
      prop: 'spec',
      label: '规格',
      mark: [1, 2, 3, 4, 5],
      slotName: 'spec',
      render (h, ctx, row, index) {
        const { spec } = row.taskItemList[0] || {}
        return spec ? h('span', spec) : tableDefaultCellValue
      },
      width: tableColWidth.name4W80
    },
    {
      prop: 'type',
      label: '剂型',
      mark: [1, 2, 3, 4, 5],
      slotName: 'type',
      render (h, ctx, row, index) {
        const { dosageForm } = row.taskItemList[0] || {}
        return dosageForm && WEST_MEDICINE_TYPE.includes(String(row.taskType)) ? h(sysValue, {
          props: {
            code: dosageForm,
            type: 'THC_WH_DRUG_FORM'
          },
        }) : h('span', tableDefaultCellValue)
      },
      width: tableColWidth.dateW105
    },
    {
      prop: 'measure',
      label: '每次用量',
      mark: [1, 2, 3, 4, 5],
      width: tableColWidth.name4W80,
      slotName: 'measure',
      render (h, ctx, row, index) {
        const { measure, measureUnitId } = row.taskItemList[0] || {}
        return measure ? h('span', [
          measure,
          measureUnitId && h(sysValue, {
            props: {
              code: measureUnitId,
              type: 'THC_WH_DOSE_UNIT'
            },
          })
        ]) : h('span', tableDefaultCellValue)
      }
    },
    {
      prop: 'rate',
      label: '频次',
      mark: [1, 2, 3, 4, 5],
      slotName: 'rate',
      render (h, ctx, row, index) {
        const { useFreq } = row.taskItemList[0] || {}
        return useFreq ? h(sysValue, {
          props: {
            code: useFreq,
            initoptions: JSON.parse(storage.getSessionStorage('FREQUENCY_LIST')) || []
          },
        }) : h('span', tableDefaultCellValue)
      },
      width: tableColWidth.name5W90
    },
    {
      prop: 'days',
      label: '天数',
      mark: [1, 2, 3, 4, 5],
      slotName: 'days',
      render (h, ctx, row, index) {
        const scope = row.taskItemList[0] || {}
        return h('span', scope.useDay ? (filters.subZeroAndDot(scope.useDay) + '天') : tableDefaultCellValue)
      },
      width: tableColWidth.name2W54
    },
    {
      prop: 'channel',
      label: '给药途径',
      mark: [1, 2, 3, 4, 5],
      slotName: 'channel',
      render (h, ctx, row, index) {
        const scope = row.taskItemList[0] || {}
        return WEST_MEDICINE_TYPE.includes(String(row.taskType)) ? h('div', [
          scope.employ && h(sysValue, {
            props: {
              code: scope.employ,
              type: 'CV06.00.102'
            },
          }),
          h('div', [scope.dropSpeed && h(sysValue, { // 滴速
            props: {
              code: scope.dropSpeed,
              type: 'THC_CPOE_DropRate'
            },
          })])
        ]) : h('span', tableDefaultCellValue)
      },
      width: tableColWidth.dateW105
    },
    {
      prop: 'num',
      label: '数量',
      mark: [1, 2, 3, 4, 5],
      slotName: 'num',
      render (h, ctx, row, index) {
        const { num, packagUnitName } = row.taskItemList[0] || {}
        return h('div', [
          num,
          packagUnitName
        ])
      },
      width: tableColWidth.name3W65
    },
    {
      prop: 'sourceCode',
      label: '处方号/业务单号',
      mark: [2, 3, 4, 5],
      includ: 1,
      formatter: ({ row: { sourceCode, doctorAdviceCode } }) => {
        return sourceCode || doctorAdviceCode
      },
      width: codeWidth
    },
    {
      prop: 'adviceExecuteCode',
      label: '执行单号',
      mark: [2, 3, 4, 5],
      includ: 1,
      formatter: ({ row: { adviceExecuteCode, source } }) => {
        return source === 5 ? '' : adviceExecuteCode
      },
      width: codeWidth
    },
    {
      prop: 'status',
      mark: [2, 3, 4, 5],
      width: tableColWidth.name4W80,
      label: '状态',
      slotName: 'status',
      render (h, ctx, row, index) {
        const html = statusHtml(ctx, row, index)
        return h('div', { domProps: { innerHTML: html } })
      }
    },
    {
      prop: 'finishTime',
      mark: [4],
      width: 130,
      label: '发药时间',
      formatter ({ value }) {
        return filters.formatDateByExp(value, 'YYYY-MM-DD HH:mm')
      },
    },
  ]
}
