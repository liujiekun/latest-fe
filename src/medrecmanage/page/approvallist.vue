<template>
  <div class="layout medrecmamage">
    <ever-form2 :schema="schema" v-model="queryObj" :inline="true" :is-query="true" @query="list">
      <template slot="deptId">
        <el-select
          :disabled="loading"
          v-model="queryObj.deptId"
          filterable
          :placeholder="'请选择科室'"
          :clearable="true"
        >
          <el-option
            v-for="item in deptArr"
            :key="item.id"
            :label="item.name"
            :value="item.sectionRecordId"
          ></el-option>
        </el-select>
      </template>
      <template slot="initiator">
        <el-select
          :disabled="loading"
          v-model="queryObj.initiator"
          filterable
          :placeholder="'请选择医生'"
          :clearable="true"
        >
          <el-option v-for="item in doctorArr" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </template>
      <template slot="daterange">
        <ever-range-picker
          :disabled="loading"
          :start.sync="queryObj.startTime"
          :end.sync="queryObj.endTime"
        ></ever-range-picker>
      </template>
      <template slot="applyStatus">
        <el-select :disabled="loading" v-model="queryObj.applyStatus" :placeholder="'请选择'">
          <el-option v-for="item in statusArr" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </template>
    </ever-form2>
    <div>
      <ever-table
        :table-loading="loading"
        ref="table"
        :columns="columns"
        :data="tableData"
        @eventChange="eventChange"
        :row-class-name="rowClassName"
      ></ever-table>
      <el-row>
        <el-col :span="24" align="right">
          <el-pagination
            :disabled="loading"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[20, 50, 100]"
            :page-size="pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="count"
          ></el-pagination>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import phrapi from '@/form/store/phrapi'
import deptCascader from '@/arrange/page/scheduling/deptcascader'
import '@/medrecmanage/assets/table.less'
import doctorapi from '@/csa/store/queryapi.js'
import dptapi from '@/arrange/store/appointapi'

const schema = [
  {
    name: 'deptId',
    label: '申请科室',
    comp: 'custom'
  },
  {
    name: 'initiator',
    label: '申请医生',
    comp: 'custom'
  },
  {
    name: 'applyStatus',
    label: '我的审批',
    comp: 'custom'
  },
  {
    name: 'daterange',
    label: '时间',
    comp: 'custom'
  }
]
export default {
  async mounted () {
    await this.list()
    const res = await doctorapi.getDoctor({ staffType: 'DOCTOR' })
    const dpts = await dptapi.getWarehouseDeptList()
    if (dpts.data.length) {
      this.deptArr = dpts.data
    }
    this.doctorArr = res.data
  },
  components: {
    deptCascader
  },
  data () {
    let queryObj = this.$ever.createObjFromSchema(schema)
    queryObj.applyStatus = '0'
    return {
      deptArr: [],
      statusArr: [
        {
          id: '0',
          name: '待处理'
        },
        {
          id: '1',
          name: '已处理'
        }
      ],
      timer: null,
      loading: false,
      doctorArr: [],
      pagesize: 20,
      count: 0,
      currentPage: 1,
      schema,
      queryObj,
      flag: false,
      tableData: [],
      columns: [
        {
          key: 'ever-op', // 该列的唯一标示，没有prop时应该加上该属性
          type: 'btns',
          label: '操作',
          btns: this.formatBtn
        },
        {
          prop: 'processStatus',
          label: '状态',
          formatter: this.fomatContent,
          customCellSpanClassFormatter ({ value }) {
            if (value === '0') {
              return 'blue'
            } else if (value === '3') {
              return 'red'
            } else {
              return ''
            }
          }
        },
        {
          prop: 'deptName',
          label: '科室'
        },
        {
          prop: 'createName',
          label: ' 申请人'
        },
        {
          prop: 'applyTime',
          label: '提交时间',
          formatter: this.formatTime
        },
        {
          prop: 'applyComment',
          label: '备注'
        }
      ]
    }
  },
  methods: {
    formatBtn ({ row }) {
      let baseBtns = [
        {
          prop: 'check',
          label: '审批'
        }
      ]
      if (row.processStatus !== '0' || this.queryObj.applyStatus === '1') {
        baseBtns = [
          {
            prop: 'info',
            label: '查看详情'
          }
        ]
      }
      return baseBtns
    },
    rowClassName ({ row }) {
      if (row.processStatus !== '0') {
        return 'grey'
      } else {
        return ''
      }
    },
    formatTime ({ value }) {
      const time = new Date(value)
      return this.$moment(time).format('YYYY-MM-DD')
    },
    fomatContent ({ value }) {
      switch (value) {
        case '0':
          return '待审批'
        case '1':
          return '审批通过'
        case '2':
          return '主动撤回'
        case '3':
          return '不同意'
      }
    },
    handleSizeChange (val) {
      this.pagesize = val
      this.handleCurrentChange(1)
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.list()
    },
    eventChange ({ prop, row }) {
      const queryObj = {
        id: row.businessCode,
        back: 1 // 1 有返回按钮 0 没有返回按钮
      }
      if (prop === 'check') {
        this.$router.push({ name: 'case_approval', query: queryObj })
      } else if (prop === 'info') {
        this.$router.push({ name: 'case_approval', query: queryObj })
      }
    },
    list () {
      const query = Object.assign(this.queryObj, {
        pagesize: this.pagesize,
        offset: (this.currentPage - 1) * this.pagesize
      })
      this.loading = true
      phrapi.queryTask(query).then(res => {
        const arr1 = []
        const arr2 = []
        res.resultList = res.resultList == null ? [] : res.resultList
        res.resultList.forEach(item => {
          if (item.processStatus === '0') {
            arr1.push(item)
          } else {
            arr2.push(item)
          }
        })
        this.tableData = [...arr1, ...arr2]
        this.count = res.totalCount
        this.loading = false
      })
    }
  },
  watch: {
    queryObj: {
      handler (val) {
        this.currentPage = 1
        this.list()
      },
      deep: true
    }
  }
}
</script>
<style scoped lang="scss">
.layout {
  min-height: 880px;
  background-color: white;
  padding: 10px 0px 10px 10px;
}
.dept {
  width: 220px;
}
/deep/ .el-form .el-form-item {
  margin-bottom: 0px;
}
/deep/ .el-table {
  margin: 0px;
  margin-top: -10px;
}
</style>

