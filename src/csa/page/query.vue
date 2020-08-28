<template>
  <div class="layout_inner">
    <div class="main-head">
      <el-row>
        <ever-form2 :schema="querySchema" v-model="queryObj" :inline="true" :nosubmit="true">
          <template slot="button">
            <el-button @click="list">查询</el-button>
            <el-button @click="exports">导出</el-button>
            <!-- <el-button>打印</el-button> -->
          </template>
        </ever-form2>
      </el-row>
    </div>
    <el-table v-loading.body="loading" :data="tableData" border>
      <el-table-column prop label="指定">
        <template slot-scope="scope">
          <el-row v-if="scope.row.appointTime">时间</el-row>
          <el-row v-if="scope.row.appointAnesthesiologist">麻醉医生</el-row>
          <el-row v-if="scope.row.appointDoctor">主刀医生</el-row>
        </template>
      </el-table-column>
      <el-table-column prop="surgeryStatus" label="状态">
        <template slot-scope="scope">
          <span v-if="scope.row.surgeryStatus==1">未交接</span>
          <span v-else-if="scope.row.surgeryStatus==11">已交接</span>
          <span v-else-if="scope.row.surgeryStatus==12">已出室</span>
          <span v-else-if="scope.row.surgeryStatus==2">进行中</span>
          <span v-else-if="scope.row.surgeryStatus==3">已完成</span>
          <span v-else-if="scope.row.surgeryStatus==4">已取消</span>
          <span v-else-if="scope.row.surgeryStatus==5">已终止</span>
          <span v-else-if="scope.row.surgeryStatus==20">待执行</span>
          <span v-else-if="scope.row.surgeryStatus">{{scope.row.surgeryStatus}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="surgeryRoom" label="手术室" show-overflow-tooltip></el-table-column>
      <el-table-column prop="stage" label="台次"></el-table-column>
      <el-table-column prop="hospitalBedNum" label="床号"></el-table-column>
      <el-table-column prop="patient.name" label="患者姓名" show-overflow-tooltip></el-table-column>
      <el-table-column prop="patient.sex" label="性别" show-overflow-tooltip width="60">
        <template slot-scope="scope" v-if="scope.row.patient">{{scope.row.patient.sex | formatSex}}</template>
      </el-table-column>
      <el-table-column prop="patient.age" label="年龄" show-overflow-tooltip width="60">
        <template
          slot-scope="scope"
          v-if="scope.row.patient"
        >{{scope.row.patient.birthday | formatDateByExp('YYYY-MM-DD') | birthdayComputed}}</template>
      </el-table-column>
      <el-table-column prop="applianceProviderName" label="科室" show-overflow-tooltip></el-table-column>
      <el-table-column prop="surgerySource" label="来源" width="60" v-if="type == 'ssmz'">
        <template slot-scope="scope">
          <template v-if="scope.row.surgerySource == 1">门诊</template>
          <template v-else-if="scope.row.surgerySource == 2">急诊</template>
          <template v-else-if="scope.row.surgerySource == 3">住院</template>
          <template v-else>--</template>
        </template>
      </el-table-column>
      <el-table-column prop="serviceName" label="医嘱名称" width="160px"></el-table-column>
      <el-table-column prop="surgeryName" label="手术名称" width="160px"></el-table-column>
      <el-table-column prop="surgeryType" label="手术类型">
        <template slot-scope="scope">
          <sys-value v-if="scope.row.surgeryType" type="THC_CPOE_SSJJJB" :code="scope.row.surgeryType"></sys-value>
          <template v-else>--</template>
        </template>
      </el-table-column>
      <el-table-column prop="surgeryLevel" label="手术等级">
        <template slot-scope="scope">
          <sys-value
            v-if="scope.row.surgeryLevel"
            type="CV05.10.024"
            :code="scope.row.surgeryLevel"
          ></sys-value>
          <span v-else>--</span>
        </template>
      </el-table-column>
      <el-table-column prop="incisionLevel" label="切口等级">
        <template slot-scope="scope">
          <sys-value
            v-if="scope.row.incisionLevel"
            type="CV05.10.022"
            :code="scope.row.incisionLevel"
          ></sys-value>
          <template v-else>--</template>
        </template>
      </el-table-column>

      <el-table-column prop="applianceDoctorName" label="申请医生" show-overflow-tooltip></el-table-column>
      <el-table-column prop="operatorDoctorName" label="主刀医生" show-overflow-tooltip></el-table-column>
      <el-table-column prop="anaesthesiaDoctorName" label="麻醉医生" show-overflow-tooltip></el-table-column>
      <el-table-column prop="anaesthesiaType" label="麻醉方式">
        <template slot-scope="scope">
          <sys-value
            v-if="scope.row.anaesthesiaType"
            type="CV06.00.103"
            :code="scope.row.anaesthesiaType + ''"
          ></sys-value>
          <template v-else>--</template>
        </template>
      </el-table-column>
      <el-table-column prop="apparatusNurseName" label="器械护士" show-overflow-tooltip>
        <template slot-scope="scope">
          <template
            v-if="JSON.parse(scope.row.apparatusNurseName)"
            v-for="(item,index) in JSON.parse(scope.row.apparatusNurseName)"
          >
            <template v-if="index != 0">,</template>
            {{item.name}}
          </template>
          <template v-else>--</template>
        </template>
      </el-table-column>
      <el-table-column prop="tourNurseName" label="巡回护士" show-overflow-tooltip>
        <template slot-scope="scope">
          <template
            v-if="JSON.parse(scope.row.tourNurseName)"
            v-for="(item,index) in JSON.parse(scope.row.tourNurseName)"
          >
            <template v-if="index != 0">,</template>
            {{item.name}}
          </template>
          <template v-else>--</template>
        </template>
      </el-table-column>
      <el-table-column prop="stageNurseName" label="上台护士" show-overflow-tooltip>
        <template slot-scope="scope">
          <template
            v-if="JSON.parse(scope.row.stageNurseName)"
            v-for="(item,index) in JSON.parse(scope.row.stageNurseName)"
          >
            <template v-if="index != 0">,</template>
            {{item.name}}
          </template>
          <template v-else>--</template>
        </template>
      </el-table-column>

      <el-table-column prop="applicationTime" label="申请日期">
        <template slot-scope="scope">{{scope.row.applicationTime | formatDateByExp("YYYY-MM-DD")}}</template>
      </el-table-column>
      <el-table-column prop="applianceProviderName" label="预计开始/结束时间" width="160px">
        <template
          slot-scope="scope"
        >{{scope.row.expectStartTime| formatDateByExp("YYYY-MM-DD HH:mm")}}——{{scope.row.expectEndTime | formatDateByExp("HH:mm")}}</template>
      </el-table-column>
      <el-table-column prop="applianceProviderName" label="手术开始/结束时间" width="160px">
        <template
          slot-scope="scope"
        >{{scope.row.startTime| formatDateByExp("YYYY-MM-DD HH:mm")}}——{{scope.row.endTime | formatDateByExp("HH:mm")}}</template>
      </el-table-column>
    </el-table>
    <el-row type="flex" justify="end" v-if="tableData.length">
      <ever-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :totalCount="totalCount"
      ></ever-pagination>
    </el-row>
  </div>
</template>
<script>
import list from '../../util/list'
import api from '@/csa/store/queryapi'
import applyapi from '@/csa/store/applyapi'
import patientapi from '@/csa/store/patientapi'
import moment from 'moment'
import storage from '@/util/storage'
let querySchemassmz = [
  {
    name: 'dateTimes',
    label: '手术日期',
    comp: 'elDatePicker',
    props: {
      type: 'daterange',
      valueFormat: 'yyyy-MM-dd',
      startPlaceholder: '开始日期',
      endPlaceholder: '结束日期'
    }
  },
  {
    name: 'surgeryLevel',
    label: '手术等级',
    comp: 'sys-type',
    props: {
      code: 'CV05.10.024'
    }
  },
  {
    name: 'anaesthesiaType',
    label: '麻醉方式',
    comp: 'sys-type',
    props: {
      code: 'CV06.00.103'
    }
  },
  {
    name: 'surgerySource',
    label: '来源',
    comp: 'ever-select',
    props: {
      options: [
        { id: 1, name: '门诊' },
        { id: 2, name: '急诊' },
        { id: 3, name: '住院' }
      ]
    }
  },
  {
    name: 'surgeryStatusNumber',
    label: '手术状态 ',
    comp: 'ever-select',
    props: {
      options: [
        { id: 1, name: '未交接' },
        { id: 11, name: '已交接' },
        { id: 12, name: '已出室' },
        { id: 2, name: '进行中' },
        { id: 3, name: '已完成' },
        { id: 5, name: '已终止' }
      ]
    }
  },
  {
    name: 'applianceDoctorId',
    label: '申请医生',
    comp: 'ever-select',
    props: {
      options: [],
      filterable: true
    }
  },
  {
    name: 'operatorDoctorId',
    label: '主刀医生',
    comp: 'ever-select',
    props: {
      options: [],
      filterable: true
    }
  },
  {
    name: 'anaesthesiaDoctorId',
    label: '麻醉医生',
    comp: 'ever-select',
    props: {
      options: [],
      filterable: true
    }
  },
  {
    name: 'surgeryRoomId',
    label: '手术室',
    comp: 'ever-select',
    props: {
      options: []
    }
  },
  {
    name: 'applianceProviderId',
    label: '申请科室',
    comp: 'providerSelect',
    props: {
      clearable: true
    }
  },
  {
    name: 'name',
    props: {
      placeholder: '手术名称、患者姓名',
      clearable: true
    }
  },
  {
    name: 'button',
    comp: 'custom',
    span: 6
  }
]
let querySchemazy = [
  {
    name: 'dateTimes',
    label: '手术日期',
    comp: 'elDatePicker',
    props: {
      type: 'daterange',
      valueFormat: 'yyyy-MM-dd',
      startPlaceholder: '开始日期',
      endPlaceholder: '结束日期'
    }
  },
  {
    name: 'zhiding',
    label: '指定',
    comp: 'ever-select',
    props: {
      options: [
        {
          name: '全部',
          id: 'all'
        },
        {
          name: '指定时间',
          id: 'appointTime'
        },
        {
          name: '指定麻醉医生',
          id: 'appointAnesthesiologist'
        },
        {
          name: '指定主刀医生',
          id: 'appointDoctor'
        }
      ],
      filterable: true
    }
  },
  {
    label: '手术状态 ',
    name: 'surgeryStatusNumber',
    comp: 'ever-select',
    props: {
      options: [
        { id: 1, name: '未交接' },
        { id: 11, name: '已交接' },
        { id: 12, name: '已出室' },
        { id: 2, name: '进行中' },
        { id: 3, name: '已完成' },
        { id: 5, name: '已终止' }
      ],
      filterable: true
    }
  },
  {
    name: 'operatorDoctorId',
    label: '主刀医生',
    comp: 'ever-select',
    props: {
      options: [],
      filterable: true
    }
  },
  {
    name: 'anaesthesiaDoctorId',
    label: '麻醉医生',
    comp: 'ever-select',
    props: {
      options: [],
      filterable: true
    }
  },
  {
    name: 'surgeryRoomId',
    label: '手术室',
    comp: 'ever-select',
    props: {
      options: []
    }
  },
  {
    name: 'applianceProviderId',
    label: '申请科室',
    comp: 'providerSelect',
    props: {
      clearable: true
    }
  },
  {
    name: 'name',
    props: {
      placeholder: '手术名称、患者姓名',
      clearable: true
    }
  },
  {
    name: 'button',
    comp: 'custom',
    span: 6
  }
]
export default {
  props: ['type'],
  mixins: [list],
  data () {
    let queryObj, querySchema
    if (this.type === 'zy') {
      querySchema = querySchemazy
      queryObj = this.$ever.createObjFromSchema(querySchema)
    } else if (this.type === 'ssmz') {
      querySchema = querySchemassmz
      queryObj = this.$ever.createObjFromSchema(querySchema)
    }
    queryObj.dateTimes = queryObj.dateTimes || []
    let time = Date.parse(new Date()) - (60000 * 60 * 24 * 7)
    queryObj.dateTimes.push(moment(time).format('YYYY-MM-DD'))
    queryObj.dateTimes.push(moment().format('YYYY-MM-DD'))
    return {
      queryObj,
      querySchema,
      api,
      patientapi,
      applyapi,
      wardOption: [],
      options: [],
      sourceOptions: [
        { id: 1, name: '门诊' },
        { id: 2, name: '急诊' },
        { id: 3, name: '住院' }
      ],
      deptOption: [],
      doctorOption: []
    }
  },
  created () {
    this.getDoctor()
    this.getWard()
  },
  methods: {
    async exports () {
      let queryObj = JSON.parse(JSON.stringify(this.queryObj))
      const TOKEN = storage.getStorageByClinic('TOKEN')
      if (queryObj.surgeryStatus) queryObj.surgeryStatus = queryObj.surgeryStatus.join(',')
      let url = this.$ever.api + '/workbench/surgeryNoticeController/exportSurgeryNotice?'
      Object.keys(queryObj).forEach(val => {
        if (queryObj[val]) url += val + '=' + encodeURIComponent(queryObj[val]) + '&'
      })
      url += 'token=' + encodeURIComponent(TOKEN)
      console.log(url)
      window.open(url, url)
    },
    getWard (val) { // 手术室列表
      this.applyapi.getWard({ timeTrunkType: '8' }).then(rs => {
        if (rs && rs.data) {
          let arr = []
          rs.data.forEach(item => {
            arr.push({
              id: item.resourceId,
              name: item.resourceName
            })
          })
          this.$ever.getFieldFromSchema(this.querySchema, 'surgeryRoomId').props.options = arr
        }
      })
    },
    getDoctor () { // 获取医生
      this.api.getDoctor({ staffType: '39' }).then(rs => {
        if (rs && rs.data) {
          this.$ever.getFieldFromSchema(this.querySchema, 'operatorDoctorId').props.options = rs.data
          this.$ever.getFieldFromSchema(this.querySchema, 'anaesthesiaDoctorId').props.options = rs.data
          if (this.$ever.getFieldFromSchema(this.querySchema, 'applianceDoctorId')) this.$ever.getFieldFromSchema(this.querySchema, 'applianceDoctorId').props.options = rs.data
        }
      })
    }
  },
  watch: {
    'queryObj': {
      handler (val) {
        val.surgeryStatus = []
        if (val.surgeryStatusNumber) {
          val.surgeryStatus.push(val.surgeryStatusNumber)
        }
        if (val.dateTimes) {
          val.startTime = val.dateTimes[0] || ''
          val.endTime = val.dateTimes[1] || ''
        } else {
          val.startTime = ''
          val.endTime = ''
        }
        if (val.zhiding) {
          val[val.zhiding] = 1
        } else {
          delete val.all
          delete val.appointAnesthesiologist
          delete val.appointTime
          delete val.appointDoctor
        }
      },
      immediate: true,
      deep: true
    }
  }
}
</script>
<style lang='scss' scoped>
</style>

