<template>
  <div class="layout_inner" v-loading="loading">
    <ever-form2 :schema="schema" v-model="obj" :isQuery="true" :inline="true">
      <template slot="btns">
        <el-button type="primary" size="small" @click="list">查询</el-button>
      </template>
      <div></div>
    </ever-form2>
    <div class="middleLayer">
      <el-button class="btnRight" type="primary" size="small" @click="upload(false)">上传</el-button>
    </div>
    <el-table :data="tableData" border stripe @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column label="科室编号" prop="code"></el-table-column>
      <el-table-column label="科室名称" prop="name"></el-table-column>
      <el-table-column label="负责人姓名" prop="chargerName"></el-table-column>
      <el-table-column label="负责人电话" prop="chargerMobile"></el-table-column>
      <el-table-column label="在便职工数" prop="employeeNum"></el-table-column>
      <el-table-column label="床位数" prop="bedNum"></el-table-column>
      <el-table-column label="经办人" prop="operator"></el-table-column>
      <el-table-column label="经办日期" prop="operateDate"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="upload(scope.row)">上传</el-button>
        </template>
      </el-table-column>
    </el-table>
    <ever-pagination
      :current="current"
      :page-sizes="pageSizes"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :totalCount="totalCount"
    ></ever-pagination>
  </div>
</template>

<script>
import list from '@/util/list'
import {
  uploadDeptInfo,
  selectList
} from '@/healthinsurance/store/syyb.insurance.js'
import { sysqzyyCode } from '@/rcm/otmdiscomponent/config-js/medicalorglist.js'
let schema = [
  {
    label: '上传标识',
    comp: 'ever-select',
    props: {
      options: [
        {
          id: '1',
          name: '全部'
        },
        {
          id: '2',
          name: '已上传'
        }, {
          id: '0',
          name: '未上传'
        }
      ]
    }
  },
  {
    label: '',
    name: 'btns',
    labelWidth: '15px',
    comp: 'custom'
  }
]
export default {
  mixins: [list],
  data () {
    let obj = this.$ever.createObjFromSchema(schema)
    return {
      schema,
      obj,
      loading: false,
      multipleSelection: []
    }
  },
  methods: {
    handleSelectionChange (val) {
      console.log(val)
      this.multipleSelection = val
    },
    upload (row) {
      let params = {
        macId: this.macId,
        insuranceOrgId: sysqzyyCode,
        param: []
      }
      if (row) {
        params.param = [row]
      } else {
        params.param = this.multipleSelection
      }
      if (!params.param.length) {
        this.$messageTips(this, 'error', '请选择上传数据')
        return
      }
      this.loading = true
      uploadDeptInfo(params).then(rs => {
        if (!rs.head.errCode) {
          this.loading = false
          this.$messageTips(this, 'success', '上传成功')
          this.list()
        }
      }).catch(rj => {
        this.loading = false
      })
    },
    list () {
      let params = {
        offset: 0,
        pagesize: 1000
      }
      selectList(params).then(rs => {
        if (!rs.head.errCode) {
          rs.data.resultList.forEach(item => {
            item.code = item.localCode
            item.name = item.orgSubjectName
            item.chargerName = ''
            item.chargerMobile = ''
            item.employeeNum = ''
            item.bedNum = ''
            item.operator = item.updateBy
            item.operateDate = item.updateTime
          })
          this.tableData = rs.data.resultList
        }
      })
    }
  }
}
</script>
<style scoped>
.query {
  width: 100%;
}
.middleLayer {
  text-align: right;
}
</style>
