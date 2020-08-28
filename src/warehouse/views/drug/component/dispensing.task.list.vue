<template>
  <div>
    <div :class="{'dis-plist-item': pageType !== 2}" v-for="(item, index) in listData" :key="index" >
      <div class="dis-house-title" v-show="pageType === 1 || pageType === 3">
        {{item.room}}
      </div>
      <!-- pageType 1 去库房 2 摆药单号 -->
      <task-table
        :storage-room-id="pageType == 1 ? item.roomId : item.code"
        :listData="listData"
        v-if="totalObj(item.itemList).cancelTotal.length !== item.itemList.length"
        :totalObj = "totalObj(item.itemList)"
        :tableData="item.itemList"
        :currentData="item"
        :pageType="pageType"
        :columns="userColumns"
        :totalcolumns = "userTotalColumns"
        :showCheckbox = "handelShowCheckbox(item.itemList)"
        @resSelect="resSelect"
        @goDispensing="goDispensing"
        @goSend="goSend"
      ></task-table>
    </div>
  </div>
</template>

<script>
import taskTable from './dispensing.task.table'
import { showIconFontHospital } from '@/warehouse/views/util/html'
// import HospitalMethodsMixin from '@/warehouse/views/drug/mixin/hospital.methods.mixin.js'
import HospitalColumns from '@/warehouse/views/drug/columnpool/hospital.column'
import { tableColWidth } from '@/util/table-config'
import { tableDefaultCellValue, EMPLOY_NOT } from '@/warehouse/views/util/constant'
import sysValue from '@/components/sysvalue'
import Vue from 'vue'
import {
  CHINESE_MEDICINE_TYPE
} from '@/warehouse/views/util/constant.js'
const filters = Vue.prototype.$filters
let totalcolumns = [
  {
    prop: 'name',
  },
  {
    prop: 'spec',
  },
  {
    prop: 'num',
  },
]
let columns = [
  {
    prop: 'choose',
  },
  {
    prop: 'indexNum',
    label: '',
    slotName: 'indexNum',
    width: 35,
    render (h, ctx, row, index) {
      return h('div', { style: { 'text-align': 'center' } },
        index + 1 || tableDefaultCellValue)
    },
  },
  {
    prop: 'action',
  },
  {
    prop: 'upd',
  },
  {
    prop: 'custom_prop',
    label: '标识',
    slotName: 'custom_prop',
    width: 91,
    render (h, ctx, row) {
      const { taskType, adviceTypes } = row
      if (adviceTypes !== '0' && !CHINESE_MEDICINE_TYPE.includes(`${taskType}`)) {
        return showIconFontHospital(h, row, [], true)
      } else {
        return showIconFontHospital(h, row, ['dateType'], true)
      }
    }
  },
  {
    prop: 'bedNum',
    notSelectCheckbox: true,
    label: '床号',
    width: tableColWidth.name3W65
  },
  {
    prop: 'patientName',
    notSelectCheckbox: true,
    label: '患者名',
    slotName: 'patientName',
    render (h, ctx, row, index) {
      return h('div', [
        row.patientName || tableDefaultCellValue,
        !!row.mqMsg && h('span', {
          class: {
            red: true, f12: true, ml5: true, f_bold: true
          }
        }, 'new')
      ])
    },
    width: tableColWidth.name4W80
  },
  // {
  //   prop: 'allergicHis',
  //   label: '过敏史',
  //   slotName: 'allergicHis',
  //   width: tableColWidth.name4W80,
  //   noChineseMedicine: 1,
  //   render (h, ctx, row) {
  //     return h('div', row.history || tableDefaultCellValue)
  //   },
  // },
  {
    prop: 'name',
  },
  {
    prop: 'spec',
  },
  {
    prop: 'implementTime',
    slotName: 'implementTime',
    label: '执行时间',
    notSelectCheckbox: true,
    noChineseMedicine: 1,
    render (h, ctx, row) {
      const { implementTime, adviceTypes } = row
      return h('div', adviceTypes === '0' ? '立即执行' : filters.formatDateByExp(implementTime, 'YYYY-MM-DD HH:mm'))
    },
    width: 125
  },
  {
    prop: 'num',
  },
  {
    prop: 'channel',
    label: '给药途径',
    mark: [1, 2, 3, 4, 5],
    notSelectCheckbox: true,
    slotName: 'channel',
    noChineseMedicine: 1,
    width: tableColWidth.name5W90,
    render (h, ctx, row, index) {
      const { employ, dropSpeed } = row
      return employ || dropSpeed ? h('div', [
        employ === '-1' && employ && h('div', EMPLOY_NOT[0].name),
        employ !== '-1' && employ && h(sysValue, {
          props: {
            addOptions: EMPLOY_NOT,
            code: employ,
            type: 'CV06.00.102'
          },
        }),
        dropSpeed && h('div', [dropSpeed && h(sysValue, { // 滴速
          props: {
            code: dropSpeed,
            type: 'THC_CPOE_DropRate'
          },
        })])
      ]) : tableDefaultCellValue
    }
  },
  {
    prop: 'status',
  },
  {
    prop: 'createTime',
  }
  // {
  //   label: '操作',
  //   slot: 'op',
  //   width: 150,
  // }
]
let firstCol = {
  prop: 'indexNum',
  label: '',
  slotName: 'indexNum',
  width: 40,
  render (h, ctx, row, index) {
    return h('div', index || tableDefaultCellValue)
  },
}
export default {
  name: 'dispensingtasklist',
  // mixins: [HospitalMethodsMixin],
  components: {
    taskTable
  },
  props: ['listData', 'pageType'],
  data () {
    return {
      userColumns: [],
      userTotalColumns: [],
      name: 'dispensing.task.list',
      tableChecked: [],
    }
  },
  created () {
    this.userColumns = this.handelCol(columns)
    this.userTotalColumns = this.handelCol(totalcolumns)
  },
  methods: {
    totalObj (data) {
      let errTotal = []
      let cancelTotal = []
      data.map((item, index) => {
        if (item.identification || item.shortage === 23) {
          errTotal.push({ ...item })
        }
        if (item.status === 5) {
          cancelTotal.push({ ...item })
        }
      })
      return { errTotal, cancelTotal }
    },
    handelShowCheckbox (data) {
      if (this.pageType === 1) {
        return true
      } else if (this.pageType === 2) {
        let unCheckCol = data.find((item, index) => {
          return (item.identification || item.shortage === 23 || item.status === 5)
        })
        if (unCheckCol) {
          return true
        } else {
          return false
        }
      } else {
        return false
      }
    },
    getNewCol () {
      if (this.userColumns.length === 0) {
        this.userColumns = this.handelCol(columns)
      }
      this.userColumns[0] = firstCol
      return this.userColumns
    },
    handelCol (columns) {
      let tempCol = []
      columns.forEach((item, index) => {
        let tempitem = HospitalColumns.find((hitem, index) => {
          return hitem.prop === item.prop && !item.render
        })
        if (tempitem) {
          // if (this.pageType === 3 && tempitem.prop === 'name') {
          //   let tempRender = tempitem.render
          //   tempitem.render = function (h, ctx, row, index) {
          //     let newRow = {...row}
          //     newRow.taskType = '301'
          //     return tempRender(h, ctx, newRow, index)
          //   }
          // }
          tempCol.push(tempitem)
        } else {
          tempCol.push(item)
        }
      })
      return tempCol
    },
    resSelect (data) {
      this.tableChecked = data
    },
    goDispensing (data, callback) {
      this.$emit('goDispensing', data, callback)
    },
    goSend (data, callback) {
      this.$emit('goSend', data, callback)
    }
  }
}
</script>

<style  lang="less" scoped>
  .dis-plist-item{
    background: #fff;
    padding: 10px;
    border-bottom: solid 1px #ededed;
    /deep/ .el-table{
      margin-top: 0;
    }
    position: relative;
    .dis-house-title{
      position: absolute;
      right:0;
      top: 15px;
      background: #1C7BEF;
      height: 32px;
      line-height: 32px;
      color: #fff;
      border-radius: 100px 0 0 100px;
      font-size: 14px;
      padding: 0 8px;
    }
    .dis-btn-box{
      text-align: center;
    }
  }
</style>
