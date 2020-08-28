<template>
  <div>
    <ever-form2 ref="form" :inline="true" :schema="querySchema" v-model="queryObj" :nosubmit="true">
      <template slot="button">
        <el-button @click="getAbnormalRecords">查询</el-button>
      </template>
    </ever-form2>
    <el-table border :data="BYData" tooltip-effect="dark" style="width: 100%">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="stageInstanceName" label="阶段"></el-table-column>
      <el-table-column prop="typeName" label="类型" show-overflow-tooltip></el-table-column>
      <el-table-column prop="reasonName" label="原因" show-overflow-tooltip></el-table-column>
      <el-table-column prop="detailName" label="明细" show-overflow-tooltip></el-table-column>
      <el-table-column prop="createTime" label="时间" show-overflow-tooltip></el-table-column>
    </el-table>
    <el-row type="flex" justify="end" v-if="BYData.length">
      <ever-pagination
        :current="currentPage"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :totalCount="totalCount"
      ></ever-pagination>
    </el-row>
  </div>
</template>

<script>
import api from '@/inpatient/store/resident.js'
export default {

  data () {
    let querySchema = [
      {
        name: 'stageId',
        label: '阶段',
        comp: 'ever-select',
        span: 6,
        props: {
          options: []
        }
      },
      {
        name: 'type',
        label: '类型',
        comp: 'ever-select',
        span: 6,
        props: {
          options: []
        }
      },
      {
        name: 'resonId',
        label: '原因',
        comp: 'ever-select',
        span: 6,
        props: {
          options: []
        }
      },
      {
        name: 'button',
        comp: 'custom',
        span: 6
      }
    ]
    let queryObj = this.$ever.createObjFromSchema(querySchema)
    return {
      api,
      BYData: [],
      querySchema,
      queryObj,
      currentPage: 1,
      pagesize: 20,
      totalCount: 0,
      typeList: [],
      pathwayId: ''
    }
  },
  props: [],
  created () {
    this.init()
  },
  methods: {
    handleSizeChange (val) {
      this.pagesize = val
      this.handleCurrentChange(1)
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.getAbnormalRecords()
    },
    async getAbnormalRecords () {
      let params = {
        stageInstanceId: this.queryObj.stageId,
        type: '',
        reason: this.queryObj.resonId,
        offset: Number(this.currentPage - 1) * this.pagesize,
        pagesize: this.pagesize,
        hospitalizedNumber: this.$route.query.hospitalizedNumber,
        pathwayInstanceId: this.pathwayId
      }
      this.typeList.forEach(item => {
        if (this.queryObj.type === item.id) {
          params.type = item.code
        }
      })
      let res = await this.api.getAbnormalRecords(params)
      this.BYData = res.data.resultList
      this.totalCount = res.data.totalCount
    },
    async init () {
      this.pagesize = 20
      this.currentPage = 1
      this.api.getPathwayAbnormalCollections().then(res => { // 变异类型
        this.typeList = res.data
        this.$ever.getFieldFromSchema(this.querySchema, 'type').props.options = res.data
      })
      this.api.getPathwayAbnormalDictionarys().then(res => { // 变异原因
        let arr = []
        res.data.forEach(val => {
          arr.push({
            id: val.reasonCode,
            name: val.reasonName
          })
          this.$ever.getFieldFromSchema(this.querySchema, 'resonId').props.options = arr
        })
      })
      this.api.listByHospitalizedNumber({
        hospitalizedNumber: this.$route.query.hospitalizedNumber
      }).then(res => { // 阶段
        let arr1 = []
        this.pathwayId = res.data[0].pathwayInstanceId
        this.getAbnormalRecords()
        res.data.forEach(val => {
          arr1.push({
            id: val.stageId,
            name: val.stageName
          })
          this.$ever.getFieldFromSchema(this.querySchema, 'stageId').props.options = arr1
        })
      })
    }
  },
  watch: {

  }
}
</script>
<style lang="scss" scoped>
#variation {
  h3,
  h6 {
    margin: 0;
  }
  .textcenter {
    text-align: center;
  }
  .textright {
    text-align: right;
  }
  .el-row {
    line-height: 50px;
  }
}
</style>

