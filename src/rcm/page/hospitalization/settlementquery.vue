<template>
  <div class="layout_inner flex_col_1_hidden main-wrap">
    <ever-form2 ref="form" :schema="schema" v-model="queryObj" :span="6">
      <template slot="btns">
        <el-button type="primary" size="small" @click="queryList(true)">查询</el-button>
        <el-button type="primary" size="small" @click="reset">重置</el-button>
      </template>
      <div></div>
    </ever-form2>
    <div class="tableContainer">
      <el-table :data="tableData" border stripe v-loading="loading">
        <el-table-column label="操作" prop min-width="90">
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="showDetail(scope.row)">查看明细</el-button>
          </template>
        </el-table-column>
        <el-table-column label="结算单号" prop="settleCode" width="140" show-overflow-tooltip></el-table-column>
        <el-table-column label="费用总额" prop="totalFee" min-width="120" align="right">
          <template slot-scope="scope">{{scope.row.totalFee | formatToFinacial}}</template>
        </el-table-column>
        <el-table-column label="结算状态" prop="status">
          <template slot-scope="scope">{{scope.row.status | settleStatus}}</template>
        </el-table-column>
        <el-table-column label="结算类型" prop="settlementType">
          <template slot-scope="scope">{{scope.row.settlementType | settleType}}</template>
        </el-table-column>
        <el-table-column label="住院号" prop="ipNo" width="140" show-overflow-tooltip></el-table-column>
        <el-table-column label="患者姓名" prop="patientName" width="90" show-overflow-tooltip></el-table-column>
        <el-table-column label="保险公司" prop="insuranceOrgName" width="120" show-overflow-tooltip></el-table-column>
        <el-table-column label="医保支付" prop="medPay" min-width="120" align="right">
          <template slot-scope="scope">{{scope.row.medPay | formatToFinacial}}</template>
        </el-table-column>
        <el-table-column label="冲预交金" prop="totalDeposit" min-width="120" align="right">
          <template slot-scope="scope">{{scope.row.totalDeposit | formatToFinacial}}</template>
        </el-table-column>
        <el-table-column label="自付金额" prop="selfPay" min-width="120" align="right">
          <template slot-scope="scope">{{scope.row.selfPay | formatToFinacial}}</template>
        </el-table-column>
        <el-table-column label="优惠金额" prop="benefitFee" min-width="120" align="right">
          <template slot-scope="scope">{{scope.row.benefitFee | formatToFinacial}}</template>
        </el-table-column>
        <el-table-column label="尾差金额" prop="diffFee" min-width="120" align="right">
          <template slot-scope="scope">{{scope.row.diffFee | formatToFinacial(6)}}</template>
        </el-table-column>
        <el-table-column label="抹零金额" prop="wipeOffFee" min-width="120" align="right">
          <template slot-scope="scope">{{scope.row.wipeOffFee | formatToFinacial}}</template>
        </el-table-column>
        <el-table-column label="收费员" prop="createByName" width="90" show-overflow-tooltip></el-table-column>
        <el-table-column label="结算时间" prop="createTime" width="160"></el-table-column>
      </el-table>
      <ever-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :pagesize="pagesize"
        :totalCount="totalCount"
        :current="current"
      ></ever-pagination>
    </div>
  </div>
</template>

<script>
import list from '@/util/list'
import { settleStatus, settleType } from '@/rcm/page/hospitalization/hospitalization-config.js'
import { searchSettleInfo } from '@/rcm/store/hospital/hospital.js'
import medicalOrgSelect from '@/rcm/otmdiscomponent/medicalorgselect.vue'
const schema = [{
  label: '患者姓名',
  name: 'patientId',
  comp: 'ever-patient-select-query'
},
{
  label: '住院号',
  name: 'ipNo',
},
{
  label: '结算单号',
  name: 'settleCode',
},
{
  label: '结算类型',
  name: 'settlementType',
  comp: 'ever-select',
  props: {
    options: settleType
  }
},
{
  label: '结算状态',
  name: 'status',
  comp: 'ever-select',
  props: {
    options: settleStatus
  }
},
{
  label: '结算时间',
  name: 'createTime',
  comp: 'everRangePicker',
  props: {
    defaultTime: [],
    outformat: 'YYYY-MM-DD HH:mm:ss',
    autoWidth: true
  }
},
{
  label: '',
  name: 'btns',
  labelWidth: '15px',
  comp: 'custom'
}]
export default {
  mixins: [list],
  data () {
    const queryObj = this.$ever.createObjFromSchema(schema)
    return {
      schema,
      queryObj,
      api: {
        list: searchSettleInfo
      }
    }
  },
  methods: {
    queryList (flag) {
      const [createTimeStart, createTimeEnd] = this.queryObj.createTime
      this.queryObj.createTimeStart = createTimeStart && this.$moment(createTimeStart).format('YYYY-MM-DD 00:00:00')
      this.queryObj.createTimeEnd = createTimeEnd && this.$moment(createTimeEnd).format('YYYY-MM-DD 23:59:59')
      this.list(flag)
    },
    reset () {
      this.$refs.form.resetForm()
    },
    showDetail (row) {
      let queryParams = {
        patientId: row.patientId,
        ipNo: row.ipNo,
        settlementId: row.id,
        ipStatus: row.ipStatus
      }
      if (row.settlementType === 1) {
        queryParams.source = 'final'
      } else {
        queryParams.source = 'half'
      }
      this.$router.push({
        path: '/adt/hospitalSettle/settlementQuery/detail',
        query: queryParams
      })
    }
  },
  filters: {
    settleStatus (val) {
      let itemIndex = settleStatus.find(item => item.id === `${val}`)
      return itemIndex && itemIndex.name
    },
    settleType (val) {
      let itemIndex = settleType.find(item => item.id === `${val}`)
      return itemIndex && itemIndex.name
    }
  },
  components: {
    medicalOrgSelect
  }
}
</script>
<style scoped>
.layout_inner {
  display: flex;
  flex-direction: column;
}
.tableContainer {
  overflow: auto;
}
</style>
