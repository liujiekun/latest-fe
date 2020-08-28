// 发药列表表格配置
import { tableColWidth } from '@/util/table-config'
import { showIconFontHospital } from '@/warehouse/views/util/html'
import {
  HOSPITAL_STATUS,
  CHINESE_MEDICINE_TYPE,
  tableDefaultCellValue
} from '@/warehouse/views/util/constant'
import {
  WEST_MEDICINE_TYPE
} from '@/util/common'
import { localToFixed } from '@/warehouse/views/util/index'
import materialShowName from '@/warehouse/page/components/material.show.name.vue'
import AdviceIcon from '@/warehouse/views/drug/component/advice.icon'
import sysValue from '@/components/sysvalue'
import ChineseMedicine from '@/warehouse/views/drug/component/chinese.medicine.vue'
import Vue from 'vue'
// import store from '@/store/index'
const bus = Vue.prototype.$bus
const filters = Vue.prototype.$filters
/**
 * pageType：页面标识所属项 1、任务列表  2、任务列表  3、缺货任务  4、发药记录 (表格列，在哪些页面中显示就标记对应的数字) 没有定义pageType 代表所有页面都需要该表格列
 * uddChecked: UDD包才需要展示
 * noChineseMedicine: 非中药列（即只有在非中药数据中才展示）
 * isChineseMedicine: 中药列（即只有在中药数据中才展示）**** 业务场景中通过 非isChineseMedicine 并且有render属性才会过滤掉西药表格列的展示
 */
function getterRowsSetting (row, type) {
  // source 来源，1 - 本院 ； 2 - 自备； 3 - 出院带药 ；4 - 补费发药
  const { status, taskType, _sourceData, source } = row
  const hasCancel = _sourceData.some(task => { // 存在缺货数据
    return task.status === 4
  })
  // 补费发药不能编辑异常
  if (hasCancel || status === 5 || CHINESE_MEDICINE_TYPE.includes(String(taskType)) || source === 4) return !type ? tableDefaultCellValue : ''
  return type ? `<span class="blue cur"><i class="iconfont icon-xiugai"></i></span>` : ''
}
const STATUS_LIST = [12, 2] // 待摆药和待发药状态
function mapSourceBugData (list) { // 遍历udd包所有数据，查看是否有异常或缺货数据 或者包含任务的主状态不是"待摆药" | "待出库"
  return list.some(row => {
    const { identification, shortage, status } = row
    return identification || shortage === 23 || !STATUS_LIST.includes(status)
  })
}
export default [
  {
    prop: 'choose',
    label: '选择',
    width: 40,
    slotName: 'checkboxed',
    uddChecked: true,
    pageType: [2],
    render (h, ctx, row, index) {
      const { customSelectionValue, _sourceData, isCustomCancel } = row
      return !isCustomCancel ? h('el-checkbox', {
        style: {
          'margin-left': '-8px',
          left: '50%'
        },
        attrs: {
          // 摆药、发药操作 1.任务未打印 2.缺货任务 3.异常任务 4.任务的主状态不是"待摆药" | "待出库"
          disabled: !!mapSourceBugData(_sourceData)
        },
        props: {
          value: customSelectionValue // 自定义表格udd数据选择框字段
        },
        nativeOn: {
          input: function (event) {
            const checked = row.customSelectionValue = event.target.checked
            bus.$emit('hospital:checkbox-change', row, checked, index, ctx)
          },
        },
      }) : h('div', {
        class: {
          alg_c: true
        }
      }, tableDefaultCellValue)
    }
  },
  {
    prop: 'upd',
    label: '改',
    width: 32,
    align: 'center',
    pageType: [1, 2],
    defaultCellValue: '',
    formatter ({ row }) {
      return getterRowsSetting(row, 0)
    },
    beforeHtmlFormatter ({ row }) {
      return getterRowsSetting(row, 1)
    },
    beforeHtmlEvent: 'handlerTableEdit'
  },
  {
    prop: 'action',
    label: '操作',
    width: tableColWidth.name4W80,
    pageType: [3],
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
    slotName: 'custom_prop',
    width: 71,
    render (h, ctx, row) {
      return showIconFontHospital(h, row, ['dateType', 'status'])
    }
  },
  {
    prop: 'name',
    label: '物资名称',
    slotName: 'name',
    render (h, ctx, row, index) {
      /**
       * cdssResult:cdss校验结果
       * exceptionCause:异常原因
       * description: 医生说明
       */
      // row.pageType:发药页面标识 1任务审核
      // mainFlag:父子医嘱标识 1父医嘱  2子医嘱  lastMain:1最后一条子医嘱
      const { description, status, materialName, icons, localMaterialId, cdssResult, exceptionCause, mainFlag, lastMain, taskType, _sourceData, pageType, identification } = row
      return !CHINESE_MEDICINE_TYPE.includes(`${taskType}`) ? h('div',
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
          identification > 0 && exceptionCause && h('div', { // 异常展示
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
              !!(STATUS_LIST.includes(status) && !description && identification) && h('div', { // 待出库 并且 没有医生说明时,异常标识为1时，才可以展示删除
                domProps: {
                  innerHTML: '<i class="iconfont icon-delete"></i>'
                },
                on: {
                  click: (e) => {
                    // 派发删除异常信息
                    bus.$emit('hospital:delete-exception-cause', row, e, index)
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
          cdssResult && h('div', { // cdss展示
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
          description && h('div', { // 医生说明
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
        ]) : h(ChineseMedicine, {
          props: {
            isEdit: true, // 标记 住院udd包 中药展示标记icon
            metaData: row,
            pageType,
            tableData: _sourceData
          }
        })
    }
  },
  {
    prop: 'spec',
    label: '规格',
    slotName: 'spec',
    noChineseMedicine: 1,
    render (h, ctx, row, index) {
      const { spec } = row || {}
      return spec ? h('span', spec) : tableDefaultCellValue
    },
    width: tableColWidth.name4W80
  },
  {
    prop: 'num',
    label: '数量',
    slotName: 'num',
    noChineseMedicine: 1,
    render (h, ctx, row, index) {
      const { num, packagUnitName } = row || {}
      return h('div', [
        localToFixed(num),
        packagUnitName
      ])
    },
    width: tableColWidth.name3W65
  },
  {
    prop: 'type',
    label: '剂型',
    slotName: 'type',
    noChineseMedicine: 1,
    render (h, ctx, { dosageForm, taskType }, index) {
      return dosageForm && WEST_MEDICINE_TYPE.includes(String(taskType)) ? h(sysValue, {
        props: {
          code: dosageForm,
          type: 'THC_WH_DRUG_FORM'
        },
      }) : h('span', tableDefaultCellValue)
    },
    width: tableColWidth.dateW105
  },
  {
    prop: 'status',
    width: tableColWidth.name4W80,
    label: '状态',
    noChineseMedicine: 1,
    slotName: 'status',
    render (h, ctx, { status }, index) {
      const html = filters.formateValueToFnt(status, { list: HOSPITAL_STATUS })
      return h('div', {
        domProps: {
          innerHTML: `<span class="${filters.formateValueToFnt(status, { list: HOSPITAL_STATUS, showKey: 'color' })}" > ${html}</span>`
        }
      })
    }
  },
  {
    prop: 'createTime',
    width: tableColWidth.datetimeAllW160,
    isChineseMedicine: true,
    slotName: 'createTime',
    label: '创建时间',
    pageType: [1, 2],
    render (h, ctx, { taskItemCreateTime, createTime }) {
      return h('span', filters.formatDateByExp(taskItemCreateTime || createTime) || tableDefaultCellValue)
    }
  }
]
