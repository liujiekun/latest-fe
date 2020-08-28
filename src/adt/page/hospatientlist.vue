<template>
  <!-- <div
    class="patientList"
    :class="{isShowPatienList:isShow}"
  >
    <div
      class="btn"
      @click="showPatient"
      :class="{isShowPatienListBtn:isShow}"
    >
      <div>入院患者列表</div>
    </div>
    <div class="settle_body payStyle"> -->
    <slide-window
      :width="590"
      :paddingTop="90"
      :show="isShow"
      @modShow="setShow"
      @getData="showPatient">
      <template slot="handler">
        <span style="width:1em; line-height:1.2em">入院患者列表</span>
      </template>
      <template slot="default">
        <div class="flex-column h100">
          <div class="main-head" style="padding-right:100px">
            <ever-form2
              ref="form"
              v-model="queryObj"
              labelWidth="180px"
              :schema="querySchema"
              :is-query="true"
              @query="list()">
              <template slot="patientName">
                <patient-select
                  v-model="queryObj.patientNames"
                  @select="selectCheck"
                  placeholder='客户姓名'
                  :allowCreate="true"
                  :hideNo="true"
                  :searchParam="{
                    'temporary': 1
                  }"
                ></patient-select>
              </template>
              <template slot='admitDeptId'>
                <ever-select
                  :options='dptArr'
                  :placeholder="'入院科室'"
                  v-model='queryObj.admitDeptId'
                  :filterable='true'
                  :clearable='true'
                ></ever-select>
              </template>
              <template slot="buttons">
                <el-button
                  class="query-btn"
                  type="primary"
                  @click="list()"
                >查询</el-button>
                <el-button @click="clearquery()">重置</el-button>
              </template>
              <div slot='default'></div>
            </ever-form2>
          </div>
          <!-- height="calc(100vh - 278px)" -->
          <!-- <el-table
            :data="tableData"
            style="width: 100%"
            class="no-border table-hover-blue highlight-current-row ever-table-wrap"
            @row-click="handledetail"> -->
          <div class="flex1box">
            <el-table
              :data="tableData"
              style="width: 100%"
              ref="hospatientlist"
              class="no-border table-hover-blue highlight-current-row ever-table-wrap fixPadding"
              @row-dblclick="showDetail"
              :default-sort = "{prop: 'patientName', order: 'descending'}">
              <el-table-column
                prop="patientNumber"
                label="患者编号"
                show-overflow-tooltip
                minWidth="80"
                align="center"
              ></el-table-column>
              <el-table-column
                prop="patientName"
                label="姓名"
                show-overflow-tooltip
                width="80"
                align="center"
              ></el-table-column>
              <el-table-column
                label="性别"
                width="50"
                align="center"
              >
                <template slot-scope="scope">
                  <sys-value type="GBT.2261.1" :code="scope.row.sex"></sys-value>
                </template>
              </el-table-column>
              <el-table-column
                label="年龄"
                width="80"
                align="center">
                <template slot-scope="scope">
                  {{scope.row.ageShowText}}
                </template>
              </el-table-column>
              <el-table-column
                prop="admitDeptName"
                label="入院科室"
                sortable
                width="100"
                align="center"
              ></el-table-column>
              <el-table-column
                prop="admitWardName"
                label="入院病区"
                sortable
                width="100"
                align="center"
              ></el-table-column>
              <el-table-column
                prop="status"
                label="客户状态"
                width="80"
                align="center"
                :formatter="statusInfo"
              ></el-table-column>
            </el-table>
          </div>
          <ever-pagination
            :page-sizes="pageSizes"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :totalCount="totalCount"
            class="ptb10"
          ></ever-pagination>
      </div>
    </template>
  </slide-window>
</template>
<script>
import patientSelect from '@/components/patientselect'
import api from '@/adt/store/register'
import SlideWindow from '@/components/slidewindow'

let schema = [
  {
    label: '患者编号',
    name: 'outpatientNumber',
    comp: 'input',
    props: {
      placeholder: '患者编号'
    },
  },
  {
    label: '姓名',
    name: 'patientName',
    comp: 'custom',
    props: {
      filterable: true,
      clearable: true
    },
  },
  {
    label: '入院科室',
    name: 'admitDeptId',
    comp: 'custom',
  },
  {
    label: '客户状态',
    name: 'status',
    comp: 'checkbox',
    initValue: ['1', '3'],
    parentClass: 'status',
    props: {
      options: [
        {value: '待入院', label: '1'},
        {value: '待入科', label: '3'}
      ]
    },
  },
  {
    label: '',
    name: 'buttons',
    comp: 'custom',
  }
]
let statusList = {
  1: '待入院',
  3: '待入科'
}
export default {
  data () {
    var obj = this.$ever.createObjFromSchema(schema)
    return {
      tableData: [],
      dptArr: [],
      querySchema: schema,
      queryObj: obj,
      isShow: false,
      pageSizes: [10, 20, 30, 50],
      pagesize: 20,
      pageIndex: 1,
      totalCount: 0,
      selectName: ''
    }
  },
  watch: {
    'queryObj.patientNames': {
      handler (val) {
        this.selectName = val.length < 12 ? val : this.selectName
      },
      deep: true
    }
  },
  components: {
    patientSelect,
    SlideWindow
  },
  mounted () {
    this.list()
    this.getTenantMethod()
  },
  methods: {
    setShow (val) {
      this.isShow = val
    },
    showPatient () {
      // this.isShow = !this.isShow
      // if (this.isShow === true) {
        // 更新待入院患者列表
      this.list()
      // }
    },
    async showDetail (row, column) {
      this.$refs.hospatientlist.setCurrentRow(row)
      let status = await api.getByIdInfo({ id: row.id })
      if (!status.head.errCode) {
        this.$emit('showDetail', status.data)
        this.isShow = false
      } else {
        this.$notify({
          message: '不能办理登记',
          type: 'error'
        })
      }
    },
    clearquery () {
      this.queryObj.patientNames = ''
      this.selectName = ''
      this.$refs.form.resetForm()
      this.list()
    },
    // 患者列表
    async list () {
      let params = {
        offset: (this.pageIndex - 1) * this.pagesize || '0',
        pagesize: this.pagesize || '20',
        patientNumber: this.queryObj.outpatientNumber,
        patientName: this.selectName ? this.selectName : this.queryObj.patientNames,
        admitDeptId: this.queryObj.admitDeptId,
        status: this.queryObj.status
      }
      let result = await api.getSearchInfo(params)
      if (result.head && result.head.errCode === 0) {
        this.tableData = result.data.resultList
        for (let item of this.tableData) {
          // 患者门诊编号
          item.outpatientNumber = item.patient && item.patient.patientOrg && item.patient.patientOrg.outpatientNumber
        }
        this.totalCount = result.totalCount
      }
    },
    handleSizeChange (val) {
      this.pagesize = val
      this.list()
    },
    handleCurrentChange (val) {
      this.pageIndex = val
      this.list()
    },
    statusInfo (val) {
      return statusList[val.status]
    },
    getTenantMethod () {
      api.getTenantList({type2CodeList: ['01.01']}).then(res => {
        if (res.head && res.head.errCode === 0) {
          res.data.resultList.forEach(item => {
            let obj = {
              id: item.tenantSubjectCode,
              name: item.tenantSubjectName
            }
            this.dptArr.push(obj)
          })
        }
      })
    },
    selectCheck (val) {
      this.selectName = val.name
    }
  }
}
</script>
<style scoped>
.status .el-form-item__content /deep/ .el-checkbox-group{padding-top:10px}
.flex1box /deep/ .fixPadding .el-table__header-wrapper .el-table__header th .cell{padding: 0!important}
/* .layout_box .main-head .el-form {
  border-bottom: none;
}
.patientList {
  height: 100vh;
  width: 596px;
  position: fixed;
  transition: all linear 0.3s;
  left: -596px;
  top: 0;
  z-index: 100;
  padding: 95px 0;
  border: 2px solid #ccc;
  box-sizing: border-box;
  overflow-x: visible;
  background-color: #fff;
  box-shadow: 10px 0 10px rgba(0, 0, 0, 0.05);
}
.isShowPatienList {
  transition: all linear 0.3s;
  left: 0px;
  right: auto;
}
.patientList .isShowPatienListBtn.btn {
  transition: all linear 0.3s;
  left: 596px;
}
.patientList .payStyle {
  width: 590px;
  background-color: #fff;
}
.patientList .btn {
  transition: all linear 0.3s;
  position: fixed;
  left: 0px;
  top: 30%;
  width: 15px;
  font-size: 14px;
  padding: 37px 13px;
  background-color: #409eff;
  cursor: pointer;
  color: #ffffff;
  z-index: 200;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
}
.patientList .isShowPatienListBtn {
  transition: all linear 0.3s;
  left: 596px;
}
.patientList .main-title {
  margin: 10px 0 0 20px;
  text-align: left;
  font-size: 16px;
  font-weight: bold;
}
.patientList .main-head {
  width: 415px;
  margin: 0 auto;
}
.patientList /deep/ .el-button {
  width: 140px;
  height: 40px;
  border-radius: 5px;
  font-size: 13px;
}
.patientList .query-btn {
  background-color: #1C7BEF;
}
.patientList /deep/ .el-checkbox-group {
  padding: 5px;
}


.patientList /deep/ .el-form-item {
  margin: 5px 10px 5px 5px;
}
.patientList /deep/ .form.ever_query_from .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
}
.patientList /deep/ .el-input__inner,
.el-textarea__inner {
  padding: 0 10px;
}
.el-table__body tr.current-row > td {
  background-color: #bedeff;
}
.patientList /deep/ .el-table__body tr:hover > td {
  color: white;
  background-color: #1c7bef !important;
}
.patientList /deep/ .el-table th,
.patientList /deep/ .el-table td {
  padding-top: 2px !important;
  padding-bottom: 2px !important;
}
.patientList .pagecomponent {
  bottom: 10px;
  right: 5px;
} */
</style>

