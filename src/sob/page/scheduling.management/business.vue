<template>
  <div class="wrap">
    <el-form :inline="true" :model="form" label-width="70px">
      <el-form-item label="排班名称">
        <el-input v-model="form.name" placeholder="排班名称" class="searchinput"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit" class="search">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" :border="false" style="width: 100%">
      <el-table-column fixed prop="sceneCode" label="code"></el-table-column>
      <el-table-column fixed prop="name" label="排班类型"></el-table-column>
      <el-table-column fixed prop="sceneName" label="对象"></el-table-column>
      <el-table-column fixed prop="scenePname" label="关联对象"></el-table-column>
      <el-table-column fixed label="场景">
        <template slot-scope="scope">
          <span>{{scope.row.businessType}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed label="产生号源">
        <template slot-scope="scope">
          <span>{{scope.row.numberFlag === 1?"是":"否"}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed prop="serviceName" label="收费项目"></el-table-column>
      <el-table-column fixed prop="scope" label="排班到"></el-table-column>
      <el-table-column fixed label="排班模式">
        <template slot-scope="scope">
          <span>{{scope.row.period}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed prop="auditing_flag" label="需要审核">
        <template slot-scope="scope">
          <span>{{scope.row.auditingFlag === 1?"审核":"不审核"}}</span>
        </template>
      </el-table-column>
      <el-table-column label="班次">
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
        :page-sizes="[10,20,30]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount"
      ></el-pagination>
    </div>
    <scheduling ref="scheduling" :schedu="schedu" @success="success"></scheduling>
  </div>
</template>
<script>
import api from '../../store/scheduling'
import scheduling from './scheduling'
export default {
  data () {
    return {
      api,
      tableData: [],
      totalCount: 0,
      schedu: '',
      currentPage: 1,
      pagesize: 10,
      offset: 0,
      form: {
        name: ''
      }
    }
  },
  created () {
    this.selectSysBusinessList({
      pagesize: this.pagesize,
      offset: this.offset,
      name: this.form.name
    })
  },
  methods: {
    success (val) {
      if (val) {
        this.selectSysBusinessList({
          pagesize: this.pagesize,
          offset: (this.currentPage - 1) * this.pagesize || 0,
          name: this.form.name
        })
      }
    },
    handleClick (val) {
      this.schedu = val
      this.$refs.scheduling.dialogVisible = true
    },
    selectSysBusinessList (params) {
      this.api.selectSysBusinessList(params)
        .then(rs => {
          if (rs.head.errCode) {
            return false
          }
          this.tableData = rs.data
          this.totalCount = rs.totalCount
        })
    },
    onSubmit () {
      this.selectSysBusinessList(
        {
          pagesize: this.pagesize,
          offset: this.offset,
          name: this.form.name
        }
      )
    },
    handleSizeChange (val) {
      this.pagesize = val
      this.selectSysBusinessList({
        pagesize: this.pagesize,
        offset: (this.currentPage - 1) * this.pagesize || 0,
        name: this.form.name
      })
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.selectSysBusinessList({
        pagesize: this.pagesize,
        offset: (this.currentPage - 1) * this.pagesize || 0,
        name: this.form.name
      })
    }
  },
  components: {
    scheduling
  }
}
</script>
<style scoped>
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
