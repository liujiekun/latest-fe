<template>
  <div class="flex_column_full flex_column_full_hidden">
    <div class="title">
      <ever-form2
        v-model="obj"
        :schema="schema"
        :gutter="20"
        :is-query="true"
        :inline="true"
        label-position="right"
        @query="query">
        <template slot="default">
          <el-form-item>
            <el-button
              type="primary"
              @click="query">
              查询
            </el-button>
          </el-form-item>
          <el-form-item>
            <el-divider direction="vertical"></el-divider>
            当前第 {{ currentPage }} 页/共 {{ totalPage }} 页
            <el-button
              :disabled="hidePrev"
              icon="el-icon-arrow-left"
              size="mini"
              @click="prev"></el-button>
            <el-button
              :disabled="hideNext"
              size="mini"
              @click="next">
              <i class="el-icon-arrow-right el-icon--right"></i>
            </el-button>
          </el-form-item>
        </template>
      </ever-form2>
    </div>
    <div
      id="pdf_outer_jianyan"
      class="flex_col_1_auto">
      <el-row class="padding_left_5">
        <el-col :span="leftSpan">
          <el-table
            ref="jyTable"
            highlight-current-row
            :data="leftTableData"
            @row-click="showDetail"
            @header-click="headerClick">
            <el-table-column
              :header-align="columnAlign"
              prop="inspectionReportDate"
              show-overflow-tooltip
              label="报告日期">
              <template slot-scope="scope">
                {{ scope.row.inspectionReportDate}}
              </template>
            </el-table-column>
            <el-table-column
              :header-align="columnAlign"
              prop="inspectionServiceName"
              show-overflow-tooltip
              label="检验名称">
              <template slot-scope="scope">
                <template v-if="scope.row.pdfInfo.length <= 1">{{ scope.row.inspectionServiceName }}</template>
                <template v-else>
                  <el-dropdown trigger="click" style="width: 100%">
                    <div class="el-dropdown-link cp ellipsis_box">
                      <div class="col_1">{{ scope.row.inspectionServiceName }}</div><i class="el-icon-caret-bottom"></i>
                    </div>
                    <el-dropdown-menu
                      slot="dropdown"
                      class="table-button-menu">
                      <el-dropdown-item
                        v-for="(item, index) of scope.row.pdfInfo"
                        :key="index"
                        @click.native="showPdf(item)">
                        {{ item.name }}
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </template>
              </template>
            </el-table-column>
            <el-table-column
              width="35"
              prop="openIcon"
              header-align="right">
              <template
                slot="header">
                <i class="el-icon-arrow-left hand"></i>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
        <el-col :span="middleSpan">
          <div
            class="expand"
            @click="hideTable = false">
            <i class="el-icon-arrow-right hand"></i>
          </div>
        </el-col>
        <el-col :span="rightSpan">
          <paper-jianyan
            :start-index="startIndex"
            :header-data="patientInfo"
            :table-data="tableData"
            :show="showComponent"
            :pdf-height="pdfHeight"
            :pdf-url="pdfUrl">
          </paper-jianyan>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  import storage from '@/util/storage'
  import urlMap from '@/inpatient/urls'
  import { request } from '@/util/req'
  import mixins from '@/inpatient/page/medicalrecord/mixins/info.view.mixins.js'
  import pdfMixins from '@/inpatient/page/medicalrecord/mixins/pdf.mixins.js'
  import { dateFormat } from '@/util/common'

  export default {
    name: 'check_jianyan',
    mixins: [mixins, pdfMixins],
    props: {
      patientId: {
        type: String
      },
      hospitalizedNumber: {
        type: String
      },
      deptId: {
        type: String
      }
    },
    data () {
      let schema = [
        {
          name: 'inspectionServiceName',
          label: '检验名称'
        },
        {
          name: 'inspectionReportDate',
          label: '报告日期',
          comp: 'date-picker',
          props: {
            type: 'daterange',
            outformat: 'yyyy-MM-dd',
            startPlaceholder: '开始时间',
            endPlaceholder: '结束时间'
          }
        }
      ]
      let obj = this.$ever.createObjFromSchema(schema)
      return {
        schema,
        obj,
        leftTableData: [],
        patientInfo: {},
        tableData: [],
        pageSize: 20,
        totalPage: 1,
        currentPage: 1,
        tenantId: storage.getLocalStorage('TENANTID'),
        visitOrgId: storage.getLocalStorage('CLINICID'),
        pdfId: 'pdf_outer_jianyan'
      }
    },
    computed: {
      defaultQueryObj () {
        return {
          tenantId: this.tenantId,
          orgId: this.visitOrgId,
          tenantSubjectId: this.deptId,
          patientId: this.patientId,
          hospitalizedNumber: this.hospitalizedNumber,
          doctorAdviceStatusCode: '60' }
      },
      hidePrev () {
        return this.currentPage === 1
      },
      hideNext () {
        return this.currentPage === this.totalPage
      },
      startIndex () {
        return (this.currentPage - 1) * this.pageSize
      }
    },
    methods: {
      query () {
        this.showComponent = ''
        let queryObj = Object.assign({}, this.defaultQueryObj, this.obj)
        if (queryObj.inspectionReportDate && queryObj.inspectionReportDate.length === 2) {
          queryObj.reportStartTime = dateFormat(this.obj.inspectionReportDate[0], false, 'startDay')
          queryObj.reportEndTime = dateFormat(this.obj.inspectionReportDate[1], false, 'endDay')
        }
        delete queryObj.inspectionReportDate
        if (!queryObj.inspectionServiceName) {
          delete queryObj.inspectionServiceName
        }
        request(urlMap.quote.jianyan, queryObj).then(res => {
          if (res.head.errCode === 0) {
            if (res.data.length > 0) {
              this.leftTableData = this.makeLeftTableData(res.data)
              // 第一条数据非pdf时,渲染检验报告单
              if (res.data[0].resultReportSource !== '2') this.setPatientInfo(res.data[0])
            } else {
              this.leftTableData = []
              this.patientInfo = {}
              this.allTableData = []
              this.tableData = []
              this.totalPage = 1
              this.currentPage = 1
            }
          }
        })
      },
      makeLeftTableData (datas) {
        datas.forEach(data => {
          data.pdfInfo = []
          if (data.resultReportSource === '2' && data.pdfReportUrl) {
            let pdfArr = JSON.parse(data.pdfReportUrl)
            for (let i = 0; i < pdfArr.length; i++) {
              let pdfObj = pdfArr[i]
              data.pdfInfo.push({ name: pdfObj.relName, url: pdfObj.fileId })
            }
          }
        })
        return datas
      },
      setPatientInfo (data) {
        this.showComponent = 'info'
        this.$refs.jyTable.setCurrentRow(data)
        if (data.visit) {
          this.$set(this.patientInfo, 'kebie', data.visit.visitTenantSubjectName)
          this.$set(this.patientInfo, 'bed', data.visit.visitBedName)
          if (data.visit.mainDiagnosis) {
            this.$set(this.patientInfo, 'linchuangzhenduan', data.visit.mainDiagnosis)
          } else {
            // 主诊断没有时拼接次诊断
            if (data.visit.admissionDiagnosis) {
              let result = []
              let admissionDiagnosis = JSON.parse(data.visit.admissionDiagnosisJson)
              admissionDiagnosis.forEach(item => {
                result.push(item.diseaseName)
              })
              this.$set(this.patientInfo, 'linchuangzhenduan', result.join())
            }
          }
          if (data.visit.patientInfo) {
            this.$set(this.patientInfo, 'name', data.visit.patientInfo.patientName)
            this.$set(this.patientInfo, 'age', this.$filters.birthdayComputed(data.visit.patientInfo.birthday))
            this.$set(this.patientInfo, 'sex', this.makeSex(data.visit.patientInfo.genderCode))
          }
        }

        this.$set(this.patientInfo, 'zhuyuanhao', data.hospitalizedNumber)
        this.$set(this.patientInfo, 'biaobenzhonglei', data.specimenTypeName)
        this.$set(this.patientInfo, 'yangbenbianhao', data.specimenNumber)
        this.$set(this.patientInfo, 'caiyangshijian', dateFormat(data.specimenSamplingDateTime, 'YYYY-MM-DD HH:mm'))
        this.$set(this.patientInfo, 'songjianyisheng', data.specimenDistributorName)
        this.$set(this.patientInfo, 'beizhu', data.applicationRemark)
        this.$set(this.patientInfo, 'jieshoushijian', dateFormat(data.specimenReceivedDate, 'YYYY-MM-DD HH:mm'))
        this.$set(this.patientInfo, 'baogaoshijian', dateFormat(data.inspectionReportDate, 'YYYY-MM-DD HH:mm'))
        this.$set(this.patientInfo, 'jianyanzhe', data.reportDoctorName)
        this.$set(this.patientInfo, 'shenhezhe', data.reportReviewDoctorName)

        if (data.inspectionResultDetails && data.inspectionResultDetails.length > 0) {
          this.allTableData = data.inspectionResultDetails
        } else {
          this.allTableData = []
        }
        this.totalPage = Math.ceil(this.allTableData.length / this.pageSize) || 1
        this.setPagination()
      },
      prev () {
        if (this.hidePrev) return
        this.currentPage--
        this.setPagination(this.currentPage)
      },
      next () {
        if (this.hideNext) return
        this.currentPage++
        this.setPagination(this.currentPage)
      },
      setPagination (current) {
        if (!current) current = 1
        let start = (current - 1) * this.pageSize
        this.tableData = this.allTableData.slice(start, start + this.pageSize)
      },
      showDetail (data) {
        this.showComponent = data.resultReportSource !== '2' ? 'info' : 'pdf'
        if (this.showComponent === 'pdf') {
          if (data.pdfInfo.length === 1) this.showPdf(data.pdfInfo[0])
          return
        }

        this.currentPage = 1
        this.setPatientInfo(data)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .title {
    height: 32px;
    padding: 5px 5px;
    border-bottom: 1px solid #dadce0;
  }
  .padding_left_5 {
    padding-left: 5px;
  }
  .expand {
    margin-top: 5px;
    margin-left: 5px;
    width: 35px;
    padding: 3px 0px;
    background: #dadce0;
    text-align: center;
  }
  .hand {
    margin: auto;
    cursor: pointer;
  }
  .ellipsis_box {
    display: flex;
    .col_1 {
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }
</style>
