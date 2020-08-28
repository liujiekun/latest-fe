<template>
  <div id="audit_schedule">
    <!-- {{template}}<br/>{{selectOrgan}}<br/>{{selectDept}} -->
    <el-row class="search-audit">
      <el-col :span="20">
        <el-form :model="params" :inline="true" label-width="10" label-position="right">
          <el-form-item>
            <el-select
              v-model="template"
              placeholder="请选择模版"
              value-key="id"
              filterable
              @change="changeTemplate"
            >
              <el-option
                v-for="item in templateList"
                :key="item.id"
                :value="item"
                :label="item.name"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="selectOrgan" placeholder="请选择机构" value-key="organId">
              <el-option
                v-for="item in template.templetOrgList"
                :key="item.organId"
                :value="item"
                :label="item.organName"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <dept-cascader
              v-model="selectDept"
              :organ-id="params.organId"
              :template-type="template.timeTrunkType"
            ></dept-cascader>
          </el-form-item>
          <el-form-item>
            <el-select v-model="params.status" placeholder="状态" value-key="deptId" clearable>
              <el-option :value="1" label="待审批"></el-option>
              <el-option :value="2" label="已审批"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-date-picker
              v-model="params.arrangeMonth"
              type="month"
              value-format="yyyy-MM"
              placeholder="选择月"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSearch" icon="el-icon-search">查询</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="depName" label="专科" width="160"></el-table-column>
      <el-table-column prop="arrangeMonth" label="月份" width="160"></el-table-column>
      <el-table-column width="160" prop="updaterName" label="修改人"></el-table-column>
      <el-table-column width="160" prop="updateTime" label="修改时间">
        <template slot-scope="scope">{{$moment(scope.row.updateTime).format('YYYY-MM-DD HH:mm:ss')}}</template>
      </el-table-column>
      <el-table-column width="160" align="center" label="状态">
        <template slot-scope="scope">
          <label v-if="scope.row.status === 1">待审核</label>
          <label v-if="scope.row.status === 2">已审核</label>
          <label v-if="!scope.row.status">无效</label>
        </template>
      </el-table-column>
      <el-table-column width="120" align="center" prop="aptRecCount" label="影响预约"></el-table-column>
      <el-table-column width="120" align="center" prop="aptCount" label="影响挂号"></el-table-column>
      <el-table-column prop="remark" label="说明"></el-table-column>
      <el-table-column align="center" label="操作" width="100">
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="setCurrentItem(scope.row)"
            size="small"
          >{{scope.row.status === 1 ? '审批' : '查看'}}</el-button>
          <el-button
            v-if="scope.row.aptRecCount > 0 || scope.row.aptCount > 0"
            type="text"
            @click="download(scope.row.id)"
            size="small"
          >下载</el-button>
        </template>
      </el-table-column>
    </el-table>
    <ever-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :totalCount="totalCount"
      :current="current"
    ></ever-pagination>
    <dialog-audit :show.sync="showAudit" :value="currentItem" @success="onSearch"></dialog-audit>
  </div>
</template>
<script>
import api from '@/arrange/store/settingapi'
import tempapi from '@/arrange/store/templateapi'
import schedulingapi from '@/arrange/store/schedulingapi'
import dialogAudit from '@/arrange/page/setting/dialog-audit.vue'
import deptCascader from '@/arrange/page/scheduling/deptcascader'
import list from '@/util/list'
export default {
  mixins: [list],
  data () {
    return {
      api,
      tempapi,
      schedulingapi,
      templateList: [],
      deptList: [],
      statusData: [],
      tableData: [],
      currentItem: '',
      showAudit: false,
      params: {
        arrangeMonth: '',
        arrangeTempletId: '',
        status: 1,
        organId: '',
        orgId: '',
        depId: '',
        offset: 0,
        pagesize: 20
      },
      offset: 0,
      pagesize: 20,
      template: '',
      selectOrgan: '',
      selectDept: '',
      totalCount: 0
    }
  },
  created () {
    this.getTemplateList()
  },
  mounted () {
    if (Object.getOwnPropertyNames(this.$route.query).length !== 0) {
      this.currentItem = this.$route.query
      this.showAudit = true
    }
  },
  watch: {
    'template': {
      handler (val) {
        this.params.arrangeTempletId = val.id
        this.selectOrgan = val.templetOrgList[0]
      },
      deep: true
    },
    'selectOrgan': {
      handler (val) {
        this.params.organId = val.organId
        this.params.orgId = val.organId
      },
      deep: true
    },
    'selectDept' (val) {
      this.params.depId = val ? val.id : ''
    },
    'params': {
      handler (val) {
        if (val.arrangeTempletId && val.orgId) {
          this.getAudit(val)
        }
      },
      deep: true
    }
  },
  methods: {
    handleSizeChange (val) {
      this.pagesize = val
      this.params.pagesize = this.pagesize
    },
    handleCurrentChange (val) {
      this.offset = (val - 1) * this.pagesize
      this.params.offset = this.offset
    },
    changeTemplate () {
    },
    onSearch () {
      this.getAudit(this.params)
    },
    getAudit (params) {
      this.tempapi.getAudit(params).then(rs => {
        if (rs && rs.data) {
          this.tableData = rs.data
          this.totalCount = rs.totalCount
        }
      })
    },
    getTemplateList () {
      this.tempapi.list().then(rs => {
        if (rs.head.errCode) {
          return false
        }
        if (rs && rs.data[0]) {
          this.templateList = rs.data
          this.template = rs.data[0]
          this.selectOrgan = this.template.templetOrgList[0]
        }
      })
    },
    setCurrentItem (val) {
      this.currentItem = val
      this.showAudit = true
    },
    download (id) {
      window.open(this.api.getDownLoadUrl(id))
    }
  },
  components: {
    dialogAudit,
    deptCascader
  }
}
</script>
<style scoped>
#audit_schedule {
  background: #ffffff;
  padding: 10px;
}
#audit_schedule .search-audit {
  border-bottom: 1px solid #ddd;
}
</style>

