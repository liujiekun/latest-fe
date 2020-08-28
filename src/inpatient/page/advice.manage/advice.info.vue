<template>
  <div class="advice-info">
    <span class="iconfont icon-exit close-btn" @click="close"></span>
    <el-tabs v-model="activeName">
      <el-tab-pane label="医嘱费用" name="aboutFee">
        <fee-manage ref="feeManage" :cur-advice="curAdvice" :scene="3" :base-info="baseInfo" :disabled="true"></fee-manage>
      </el-tab-pane>
      <el-tab-pane label="分解记录" name="history">
        <el-row type="flex" justify="end">
          <el-checkbox v-model="useless" @change="uselessChange">显示无效记录</el-checkbox>
        </el-row>
        <ever-table
          border
          :loading="false"
          :columns="columns"
          :data="tableData"
          :is-pagination="false"
          :is-drag-table="true"
          :max-height="150"
        >
        </ever-table>
        <el-row type="flex" justify="end">
          <ever-pagination
            v-if="totalCount"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :totalCount="totalCount"
            :current="pagination.page"
            :pagesize="pagination.pagesize"
          ></ever-pagination>
        </el-row>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import feeManage from './fee.manage.vue'
import i18n from '@/assets/locals/index'
import api from '@/inpatient/store/advice/resolve'

export default {
  components: {
    feeManage
  },
  props: {
    baseInfo: {
      type: Object,
      default: () => { return {} }
    },
    curAdvice: {
      type: Array
    }
  },
  data () {
    return {
      activeName: 'aboutFee',
      tableData: [],
      columns: [],
      totalCount: 0,
      pagination: {
        page: 1,
        pagesize: 10
      },
      useless: false
    }
  },
  created () {
    this.useless = JSON.parse(localStorage.getItem('useless'))
    this.columns = this.getColumns()
  },
  methods: {
    close () {
      this.$emit('close')
    },
    async getHistory () {
      let mainAdvice = this.curAdvice[0]
      let params = {
        doctorAdviceIds: [mainAdvice.id],
        executeRecordFilter: this.useless ? 1 : 0,
        pagesize: this.pagination.pagesize,
        offset: this.pagination.pagesize * (this.pagination.page - 1)
      }
      let res = await api.querySplitedRecordList(params)
      this.tableData = res.data
      this.totalCount = res.totalCount
    },
    handleSizeChange (size) {
      this.pagination.pagesize = size
      this.getHistory()
    },
    handleCurrentChange (page) {
      this.pagination.page = page
      this.getHistory()
    },
    uselessChange () {
      localStorage.setItem('useless', JSON.stringify(this.useless))
      this.getHistory()
    },
    getColumns () {
      return [{
        prop: 'splitTime',
        label: i18n.t('分解时间'),
        showOverflowTooltip: true,
        minWidth: '10%',
        // undraggable: true
      },
      {
        prop: 'splitName',
        label: i18n.t('分解人'),
        minWidth: '10%',
        showOverflowTooltip: true
      },
      {
        prop: 'submitTime',
        label: i18n.t('分解提交时间'),
        minWidth: '10%',
        showOverflowTooltip: true
      },
      {
        prop: 'submitName',
        label: i18n.t('分解提交人'),
        showOverflowTooltip: true,
        minWidth: '10%'
      },
      {
        prop: 'completeTime',
        label: i18n.t('执行时间'),
        showOverflowTooltip: true,
        minWidth: '10%',
      },
      {
        prop: 'executeName',
        label: i18n.t('执行人'),
        showOverflowTooltip: true,
        minWidth: '10%'
      },
      {
        prop: 'planTime',
        label: i18n.t('计划时间'),
        showOverflowTooltip: true,
        minWidth: '10%'
      }]
    }
  },
  watch: {
    curAdvice: {
      handler (val) {
        this.activeName = 'aboutFee'
        this.tableData = []
      },
      deep: true
    },
    activeName (val) {
      if (val === 'history') {
        this.getHistory()
      } else {
        this.$refs.feeManage && this.$refs.feeManage.getTableList()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.advice-info {
  position: relative;
  .close-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    color: #999;
    font-size: 12px;
    margin-top: 3px;
    cursor: pointer;
    z-index: 10;
  }
  /deep/ .fee-manage {
    padding-right: 0;
  }
}
</style>
