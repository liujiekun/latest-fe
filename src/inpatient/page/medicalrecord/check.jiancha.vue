<template>
  <div class="flex_column_full flex_column_full_hidden">
    <div class="title">
      <ever-form2
        :schema="schema"
        v-model="obj"
        :gutter="20"
        :is-query="true"
        :inline="true"
        label-position="right"
        @query="query">
      </ever-form2>
    </div>
    <div class="flex_col_1_auto" id="pdf_outer_jiancha">
      <el-row class="padding_left_5">
        <el-col :span="leftSpan">
          <el-table
            :data="leftTableData"
            highlight-current-row
            @row-click="showDetail"
            @header-click="headerClick">
            <el-table-column
              :header-align="columnAlign"
              prop="applicationDate"
              show-overflow-tooltip
              label="报告日期">
              <template slot-scope="scope">
                {{scope.row.applicationDate}}
              </template>
            </el-table-column>
            <el-table-column
              :header-align="columnAlign"
              prop="doctorAdviceContent"
              show-overflow-tooltip
              label="检查名称">
              <template slot-scope="scope">
                <template v-if="scope.row.pdfInfo.length <= 1">{{ scope.row.doctorAdviceContent }}</template>
                <template v-else>
                  <el-dropdown trigger="click" style="width: 100%">
                    <div class="el-dropdown-link cp ellipsis_box">
                      <div class="col_1">{{ scope.row.doctorAdviceContent }}</div><i class="el-icon-caret-bottom"></i>
                    </div>
                    <el-dropdown-menu slot="dropdown" class="table-button-menu">
                      <el-dropdown-item
                        v-for="(item, index) of scope.row.pdfInfo"
                        :key="index"
                        @click.native="showPdf(item)"
                      >{{item.name}}
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
              <template slot="header">
                <i class="el-icon-arrow-left hand"></i>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
        <el-col :span="middleSpan">
          <div class="expand" @click="hideTable = false">
            <i class="el-icon-arrow-right hand"></i>
          </div>
        </el-col>
        <el-col :span="rightSpan">
          <paper-jianyan
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
  import { dateFormat } from '@/util/common'
  import pdfMixins from '@/inpatient/page/medicalrecord/mixins/pdf.mixins.js'

  export default {
    name: 'check_jiancha',
    mixins: [pdfMixins],
    props: {
      patientId: {
        type: String
      },
      hospitalizedNumber: {
        type: String
      },
      deptId: {
        type: String
      },
      visitType: {
        type: String,
        default: '3'
      }
    },
    data () {
      let schema = [
        {
          name: 'serviceName',
          label: '检查名称'
        },
        {
          name: 'applicationDate',
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
        orgId: storage.getLocalStorage('CLINICID'),
        pdfId: 'pdf_outer_jiancha'
      }
    },
    computed: {
      defaultQueryObj () {
        return {
          orgId: this.orgId,
          deptId: this.deptId,
          visitType: this.visitType,
          patientId: this.patientId,
          hospitalizedNumber: this.hospitalizedNumber
        }
      }
    },
    methods: {
      query () {
        this.showComponent = ''
        let queryObj = Object.assign({}, this.defaultQueryObj, this.obj)
        if (queryObj.applicationDate && queryObj.applicationDate.length === 2) {
          queryObj.applicationDateStart = dateFormat(this.obj.applicationDate[0], false, 'startDay')
          queryObj.applicationDateEnd = dateFormat(this.obj.applicationDate[1], false, 'endDay')
        }
        delete queryObj.applicationDate
        if (!queryObj.serviceName) {
          delete queryObj.serviceName
        }
        this.queryObj = queryObj
        request(urlMap.quote.jiancha, queryObj).then(res => {
          if (res.head.errCode === 0) {
            this.leftTableData = this.makeData(res.data)
          }
        })
      },
      makeData (datas) {
        if (!datas) return []
        datas.forEach(data => {
          data.pdfInfo = []
          if (data.examineResults && data.examineResults.length > 0 && data.examineResults[0].pdfReportUrl) {
            data.examineResults.forEach(item => {
              if (item.pdfReportUrl) {
                let pdfArr = JSON.parse(item.pdfReportUrl)
                for (let i = 0; i < pdfArr.length; i++) {
                  let pdfObj = pdfArr[i]
                  data.pdfInfo.push({name: pdfObj.relName, url: pdfObj.fileId})
                }
              }
            })
          }
        })
        return datas
      },
      showDetail (data) {
        if (data.pdfInfo && data.pdfInfo.length === 1) {
          this.showPdf(data.pdfInfo[0])
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .title {
    height: 32px;
    padding: 5px;
    border-bottom: 1px solid #dadce0;
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
