<template>
  <div class="wrap">
    <el-form :inline="true" :model="form" label-width="70px">
      <el-form-item label="规则名称">
        <el-input v-model="form.name" placeholder="规则名称" class="searchinput"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit" class="search">查询</el-button>
      </el-form-item>
      <el-form-item style="float:right">
        <el-button type="primary" @click="clickDepart">科室配置</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" :border="false" style="width: 100%">
      <el-table-column fixed prop="configName" label="规则名称"></el-table-column>
      <el-table-column prop="firstClassName" label="一级分类"></el-table-column>
      <el-table-column prop="secondClassName" label="二级分类"></el-table-column>
      <el-table-column prop="description" label="规则描述"></el-table-column>
      <el-table-column prop="configValue" label="值"></el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="handleClick(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalNum"
      ></el-pagination>
    </div>
    <department ref="department"></department>
    <selectpart ref="selectpart" :ruleDetail="ruleDetail" @success="success"></selectpart>
  </div>
</template>
<script>
import api from '../../store/scheduling'
import department from './department'
import selectpart from './select'
export default {
  data () {
    return {
      api,
      tableData: [],
      currentPage: 1,
      pagesize: 10,
      offset: 0,
      totalNum: 0,
      ruleDetail: '',
      form: {
        name: ''
      }
    }
  },
  created () {
    this.getRuleConfigList({
      pagesize: this.pagesize,
      offset: this.offset,
      configName: this.form.name
    })
  },
  methods: {
    clickDepart () {
      this.$refs.department.dialogVisible = true
    },
    handleClick (v) {
      this.$refs.selectpart.dialogVisible = true
      this.ruleDetail = v
    },
    success () {
      this.getRuleConfigList({
        pagesize: this.pagesize,
        offset: (this.currentPage - 1) * this.pagesize || 0,
        configName: this.form.name
      })
    },
    getRuleConfigList (params) {
      this.api.getRuleConfigList(params)
        .then(rs => {
          if (rs.head.errCode) {
            return false
          }
          this.tableData = rs.data
          this.totalNum = rs.totalCount
        })
    },
    onSubmit () {
      this.getRuleConfigList(
        {
          pagesize: this.pagesize,
          offset: this.offset,
          configName: this.form.name
        }
      )
    },
    handleSizeChange (val) {
      this.pagesize = val
      this.getRuleConfigList({
        pagesize: this.pagesize,
        offset: (this.currentPage - 1) * this.pagesize || 0,
        configName: this.form.name
      })
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.getRuleConfigList({
        pagesize: this.pagesize,
        offset: (this.currentPage - 1) * this.pagesize || 0,
        configName: this.form.name
      })
    }
  },
  components: {
    department,
    selectpart
  }
}
</script>
<style lang='scss' scoped>
.wrap {
  width: 100%;
}
.block {
  float: right;
}
.search {
  width: 70px;
}
.searchinput {
  width: 260px;
}
</style>
