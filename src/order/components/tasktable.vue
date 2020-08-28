/*
 * @Author: xiongzhiqing@everjiankang.com
 * @Date: 2020-03-02 10:47:44
 * @Last Modified by: xiongzhiqing@everjiankang.com
 * @Last Modified time: 2020-03-04 10:43:25
 */
<template>
  <div>
    <!-- 西药 -->
    <ever-table
      ref="table"
      border
      table-class="no-margin-table small-padding"
      table-default-cell-value=" "
      :columns="columns"
      :data="tableData"
      :is-record-url-params="false"
      :show-index="type == 5"
      index-label=""
      :not-select-checkbox="true">
      <!-- 超市收银需要展示序号 -->
      <template v-for="column in renderColumns" :slot="column.slotName">
        <el-table-column
          :key="column.prop"
          :slot="column.prop"
          :label="column.label"
          :width="column.width"
          :prop="column.prop">
          <template slot="header" slot-scope="scope">
            <span v-if="false">{{scope}}</span>
            {{column.label}}
          </template>
          <template slot-scope="scope">
            <coltd-functional :row="scope.row" :index="scope.$index" :render="column.render" :td-key="column.prop"></coltd-functional>
          </template>
        </el-table-column>
      </template>
    </ever-table>
  </div>
</template>

<script>
import { tableDefaultCellValue } from '@/warehouse/views/util/constant'
import ColtdFunctional from '@/warehouse/views/drug/mixin/coltd.functional.js'
import westerntable from './columns/westerntable'
import { WEST_MEDICINE_TYPE, CHINESE_MEDICINE_TYPE } from '@/util/common'
export default {
  name: 'TaskTable',
  props: {
    orderType: { // orderType，0代表发药单，1代表退药单
      type: [Number],
      required: true,
      default: 1
    },
    taskType: { // 物资类型 301 西药  302 中成药 303 中药饮片 304 中成药
      type: String,
      default: '301'
    },
    tableData: {
      type: Array,
      default: () => []
    },
    type: { // 业务类型 (业务类型： 门诊／住院／超市收银／互联网商城等) => TASK_TYPE 3: 住院
      type: Number,
      default: 1
    }
  },
  data () {
    return {
      tableDefaultCellValue,
      WEST_MEDICINE_TYPE,
      CHINESE_MEDICINE_TYPE,
      tableColumns: [],
    }
  },
  methods: {

  },
  mounted () {

  },
  computed: {
    columns () {
      /**
       * types: // 业务类型 (业务类型： 门诊／住院／超市收银／互联网商城等) => TASK_TYPE 3: 住院
       * orderType: // 单据类型 -- 订单任务数据 (DOCUMENT_TYPE) 0: 发药单  1: 退药单
      */
      // 动态计算表格列内容 -- 根据表格类型筛选列 （中药）
      if (CHINESE_MEDICINE_TYPE.includes(this.taskType) && this.orderType === 0) {
        return westerntable.filter(column => column.chineseMedicine)
      }
      // 退药单据 并且非 超市收银退药
      if (this.orderType === 1 && this.type !== 5) {
        return westerntable.filter(column => ((column.orderType === undefined && (!column.types || column.types.includes(this.type))) || column.orderType === this.orderType))
      }

      // 过滤具体业务类型表格列
      return westerntable.filter(column => (
        (!column.types && column.orderType === undefined) ||
        (column.types && column.types.includes(this.type) && column.orderType === undefined) ||
        (column.orderType !== undefined && column.orderType === this.orderType && (!column.types || (column.types && column.types.includes(this.type))))
      ))
    },
    renderColumns () {
      return this.columns.filter(column => column.render)
    },
    isWest () {
      return WEST_MEDICINE_TYPE.includes(this.taskType)
    },
    isChinese () {
      return CHINESE_MEDICINE_TYPE.includes(this.taskType)
    }
  },
  components: {
    ColtdFunctional
  }
}
</script>

<style lang="scss" scoped>

</style>
