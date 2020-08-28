<template>
  <div>
    <div class="layout_inner">
      <div class="main-head">
        <ever-form2
          :schema="querySchema"
          v-model="queryObj"
          @query="query(queryObj)"
          :is-query="true"
          :labelWidth="'130px'"
        >
          <template slot="datepicker">
            <ever-range-picker
              :start.sync="queryObj.settleStartDate"
              :end.sync="queryObj.settleEndDate"
              :autoWidth="true"
              @change="query(queryObj)"
            ></ever-range-picker>
          </template>
          <template slot="itemId">
            <el-select
              v-model="queryObj.itemId"
              filterable
              remote
              clearable
              :disabled="false"
              :placeholder="'请输入关键词'"
              :remote-method="funs"
              :loading="false"
              @change="query(queryObj)"
              style="width:100%"
            >
              <el-option
                v-for="item in itemIdOptions"
                :key="item.id"
                :label="item.name"
                :value="item.objectId || item.id"
              ></el-option>
            </el-select>
          </template>
          <div></div>
        </ever-form2>
        <div class="main-option">
          <div class="totaloutpatient">
            <span>
              项目合计：
              <b>￥{{totalSum | formatToFinacial}}</b>
            </span>
            <span style="padding-left: 40px;">
              本页小计：
              <b>￥{{pageTotal | formatToFinacial}}</b>
            </span>
          </div>
          <el-button type="primary" style="margin-right: 20px;" @click="query(queryObj)">查询</el-button>
          <doc-download
            @downFile="downFile"
            class="docdownload"
            ref="childMethods"
            btnTxt="导出"
            style="float:right;"
          ></doc-download>
          <!-- <el-button
            type="primary"
            @click="printDailyList"
          >打印</el-button>-->
        </div>
      </div>
      <el-table v-loading.body="loading" :data="tableData" style="width: 100%" id="pTable">
        <el-table-column width="190" prop="settlecode" label="结算单号">
          <template slot-scope="scope">
            <a
              href="javascript:void(0)"
              @click="settlementDetail(scope.row)"
            >{{scope.row.settlecode}}</a>
          </template>
        </el-table-column>
        <el-table-column width="160" prop="outpatientNumber" label="门诊档案号">
          <template
            slot-scope="scope"
          >{{scope.row.outpatientNumber?scope.row.outpatientNumber:scope.row.patientid}}</template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="patientName" label="患者姓名" width="90"></el-table-column>
        <el-table-column show-overflow-tooltip prop="diagnosis" label="门诊诊断"></el-table-column>
        <el-table-column show-overflow-tooltip prop="patientAgeShowText" label="年龄" width="110"></el-table-column>
        <el-table-column show-overflow-tooltip prop="patientSex" label="性别" width="50">
          <template slot-scope="scope">{{scope.row.patientSex === 1 ? '男' : '女'}}</template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="itemClassName" label="财务分类"></el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="itemname"
          label="项目明细"
          v-if="queryObj.isShowDetail"
        ></el-table-column>
        <el-table-column show-overflow-tooltip prop="itemname" label="项目名称" v-else></el-table-column>
        <el-table-column show-overflow-tooltip prop="price" label="项目单价" align="right">
          <template slot-scope="scope">{{scope.row.price | formatToFinacial}}</template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="quantity" label="数量" align="right"></el-table-column>
        <el-table-column show-overflow-tooltip prop="preFee" label="项目合计" align="right">
          <template slot-scope="scope">{{scope.row.preFee | formatToFinacial}}</template>
        </el-table-column>
        <!-- <el-table-column show-overflow-tooltip prop="discounts" label="优惠金额" align="right">
          <template slot-scope="scope">{{scope.row.discounts | formatToFinacial}}</template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="income" label="实收金额" align="right">
          <template slot-scope="scope">{{scope.row.income | formatToFinacial}}</template>
        </el-table-column> -->
        <el-table-column show-overflow-tooltip prop="orderDeptName" label="开单科室"></el-table-column>
        <el-table-column show-overflow-tooltip prop="exeOrderDeptName" label="执行科室"></el-table-column>
        <el-table-column show-overflow-tooltip prop="doctorName" label="开单医生"></el-table-column>
        <el-table-column show-overflow-tooltip prop="exeDoctorName" label="执行医生"></el-table-column>
        <el-table-column show-overflow-tooltip prop="feeType" label="收款方式">
          <template slot-scope="scope">{{scope.row.feeType | feeTypeFn}}</template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="createUser" label="收费员"></el-table-column>
        <el-table-column show-overflow-tooltip prop="channelName" label="渠道来源"></el-table-column>
        <el-table-column show-overflow-tooltip prop="returnFlag" label="退费标识">
          <template slot-scope="scope">{{scope.row.returnFlag ? '退款' : '收款'}}</template>
        </el-table-column>
        <el-table-column width="160" prop="createTime" label="创建时间"></el-table-column>
      </el-table>
      <el-row type="flex" justify="end">
        <ever-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :totalCount="totalCount"
        ></ever-pagination>
      </el-row>
    </div>
  </div>
</template>

<script>
import api from '@/rcm/store/income/reportForms'
import list from '@/util/list'
import sob from '@/sob/store/serviceapi'
import { frPrint } from '../../../../util/print'
import rcmDoctorSelect from '@/rcm/page/outpatientSettlement/doctorselect'
import globalUrlMap from '@/login/store/globalurls'

const querySchema = [
  {
    name: 'datepicker',
    comp: 'custom',
    label: '创建时间',
    span: 6
  },
  {
    name: 'patientId',
    placeholder: '输入患者姓名',
    comp: 'ever-patient-select',
    props: {
      options: []
    },
    label: '患者',
    span: 6
  },
  {
    name: 'outPatientNumber',
    props: {
      placeholder: '输入患者门诊档案号'
    },
    label: '门诊档案号',
    span: 6
  },
  {
    name: 'orderDept',
    label: '开单科室',
    comp: 'everSubjectSelect',
    props: {
      clearable: true,
      type: 'select',
      fields: 'id'
    },
    span: 6
  },
  {
    name: 'orderDoctor',
    label: '开单医生',
    comp: 'everStaffSelect',
    props: {
      useCache: true,
      clearable: true,
      type: 'select',
      fields: 'id',
      params: { typeCode: 'DOCTOR' }
    },
    span: 6
  },
  {
    name: 'exeOrderDept',
    label: '执行科室',
    comp: 'everSubjectSelect',
    props: {
      clearable: true,
      type: 'select',
      fields: 'id'
    },
    span: 6
  },
  {
    name: 'exeOrderDoctor',
    label: '执行医生',
    comp: 'everStaffSelect',
    props: {
      useCache: true,
      clearable: true,
      type: 'select',
      fields: 'id',
      params: { typeCode: 'DOCTOR' }
    },
    span: 6
  },
  {
    name: 'settlecode',
    label: '结算单号',
    span: 6
  },
  // 20191011一级分类不用了，项目类别更名为财务分类
  // {
  //   name: 'fatherItemClass',
  //   label: '医嘱项目一级分类',
  //   comp: 'sys-type',
  //   props: {
  //     useValue: true,
  //     code: 'THC_RCM_FIN_CATEGORY'
  //   },
  //   span: 6
  // },
  {
    name: 'itemClass',
    label: '财务分类',
    comp: 'sys-type',
    props: {
      useValue: true,
      code: 'THC_RCM_FIN_TYPE'
    },
    span: 6
  },
  {
    name: 'itemId',
    label: '项目明细',
    comp: 'custom',
    span: 6
  },
  {
    name: 'settlementType',
    label: '收款方式',
    comp: 'ever-select',
    props: {
      useValue: true,
      options: [{
        id: 1,
        name: '门诊'
      }, {
        id: 2,
        name: '挂号'
      }]
    },
    span: 6
  },
  {
    name: 'returnFlag',
    label: '是否退款',
    comp: 'ever-select',
    props: {
      options: [
        { name: '是', id: '1' },
        { name: '否', id: '0' }
      ]
    },
    span: 6
  },
  {
    name: 'channelId',
    label: '渠道来源',
    comp: 'ever-select',
    props: {
      options: []
    },
    span: 6
  },
  {
    name: 'diagnosis',
    label: '门诊诊断',
    props: {
      placeholder: '请输入门诊诊断'
    },
    span: 6
  },
  {
    name: 'createBy',
    label: '收费员',
    comp: 'everStaffSelect',
    props: {
      useCache: true,
      clearable: true,
      type: 'select',
      fields: 'id'
    },
    span: 6
  },
  // 20191227注释，说rcm不会再有组套的概念了，都是明细
  // {
  //   name: 'isShowDetail',
  //   label: '',
  //   comp: 'checkbox',
  //   props: {
  //     options: [
  //       {
  //         id: '显示组套明细',
  //         name: '显示组套明细'
  //       }
  //     ]
  //   },
  //   span: 6
  // }
]
export default {
  mixins: [list],
  data () {
    let queryObj = this.$ever.createObjFromSchema(querySchema)
    queryObj.settleStartDate = this.$moment()
      .date(1)
      .format('YYYY-MM-DD')
    queryObj.settleEndDate = ''
    return {
      tableData: [],
      totalCount: 0,
      querySchema: querySchema,
      queryObj: queryObj,
      itemIdOptions: [],
      funs: query => {
        console.log(query)
      },
      api,
      dialogVisible: false,
      fullscreenLoading: false,
      loading: false,
      pageTotal: 0,
      totalSum: 0,
      feeTypeOpt: [],
      noStoreQuery: true,
      listApiName: undefined
    }
  },
  async created () {
    const _self = this
    // _self.$ever.getFieldFromSchema(_self.querySchema, 'itemId').funs =
    //   _self.queryService
    _self.funs = _self.queryService
    _self.feeTypeOpt = _self.$ever.getFieldFromSchema(
      _self.querySchema,
      'settlementType'
    ).props.options
    try {
      let search = await api.searchSourch()
      if (search && search.head && search.head.errCode === 0 && search.data) {
        _self.$ever.getFieldFromSchema(_self.querySchema, 'channelId').props.options =
          search.data.resultList
      }
    } catch (err) {

    }
  },
  filters: {
    feeTypeFn: val => {
      let str
      switch (val) {
        case 1:
          str = '门诊'
          break
        case 3:
          str = '挂号'
          break
        default:
          str = ''
      }
      return str
    }
  },
  watch: {
    'queryObj.isShowDetail': {
      handler: function (val) {
        if (val) {
          this.listApiName = 'listDetails'
        } else {
          this.listApiName = undefined
        }
      }
    }
  },
  methods: {
    async downFile () {
      for (let key in this.queryObj) {
        if (!this.queryObj[key]) {
          delete this.queryObj[key]
        }
      }
      const result = await api.exportDailyDetails(this.queryObj)
      if (
        result &&
        result.head &&
        result.head.errCode === 0 &&
        result.data &&
        result.data.fileId
      ) {
        let filename = this.$ever.api + globalUrlMap.phoneMapping.download.url + result.data.fileId
        window.open(filename)
      }
    },
    afterList (result) {
      if (result.head.errCode === 0) {
        let sum = 0
        result.data.forEach(function (item) {
          sum += item.preFee
        })
        this.pageTotal = sum
        this.totalSum = (result.dataSum && result.dataSum.fee) || 0
      }
    },
    async queryService (query) {
      const _self = this
      if (query) {
        const postdata = {
          name: query
        }
        const result = await sob.list(postdata)
        if (result && result.data && result.data.length) {
          // _self.$ever.getFieldFromSchema(_self.querySchema, 'itemId').options =
          // result.data
          _self.itemIdOptions = result.data
        }
      } else {
        // _self.$ever.getFieldFromSchema(_self.querySchema, 'itemId').props.options = []
        _self.itemIdOptions = []
      }
    },
    printDailyList () {
      if (this.queryObj.patientId) {
        let code = 'thc_rcm_settleDetail_medical'
        let params = {
          patientId: this.queryObj.patientId,
          settleStartDate: this.queryObj.settleStartDate,
          settleEndDate: this.queryObj.settleEndDate ? this.queryObj.settleEndDate : '',
          userid: localStorage.USERID
        }
        let printParams = {}
        printParams.preview = true
        frPrint(code, params, printParams)
      } else {
        this.$messageTips(this, 'error', '请先选择要打印的患者')
      }
    },
    async settlementDetail (row) {
      location.href = `${this.$ever.rcmIndex}/rcm/reconstruct/settled?patientId=${row.patientid}&visitNumber=${row.rootorderid}&showDetail=0&settlementid=${row.settlementid}&dptId=${row.orderDept}&showlist=true`
    },
    handleSubmit () {
      this.dialogVisible = false
    },
    handleDetails (data) {
      this.$router.push(`/cost/compute/${data.id}`)
    }
  },
  components: {
    rcmDoctorSelect
  }
}
</script>
<style scoped>
.totaloutpatient {
  font-size: 14px;
  float: left;
  color: #666;
  line-height: 36px;
}
.totaloutpatient b {
  font-weight: normal;
  color: #000;
}
</style>

