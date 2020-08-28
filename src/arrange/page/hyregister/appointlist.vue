<template>
  <div id="appointlist">
    <el-row class="header">
      <el-col :span="12" align="left">
        <strong class="title">今日预约</strong>
      </el-col>
      <el-col :span="12" align="right">
        <i class="el-icon-warning"></i>
        <span>
          已有
          <em>{{appointList.length}}条</em> 预约
        </span>
        <el-button size="mini" class="ml10" @click="clearAppoint">不使用预约</el-button>
      </el-col>
    </el-row>
    <el-radio-group v-model="appoint" value-key="id" style="width:100%">
      <el-table max-height="140" :data="appointList" :show-header="true" style="width: 100%">
        <el-table-column label width="80">
          <template slot-scope="scope">
            <el-radio :label="scope.row"></el-radio>
          </template>
        </el-table-column>
        <el-table-column label="科室" prop="deptName" width="120"></el-table-column>
        <el-table-column label="患者姓名" width="120">
          <template slot-scope="scope">{{scope.row.patient ? scope.row.patient.name : '--'}}</template>
        </el-table-column>
        <el-table-column label="医生" prop="appointmentResourceName" width="120">
          <template slot-scope="scope">{{scope.row.resourceName}}</template>
        </el-table-column>
        <el-table-column label="服务" prop="serviceName" width="250">
          <template slot-scope="scope">{{scope.row.serviceName}}</template>
        </el-table-column>
        <el-table-column label="日期" width="160">
          <template slot-scope="scope">{{$moment(scope.row.date).format('YYYY-MM-DD')}}</template>
        </el-table-column>
        <el-table-column label="时间" width="160">
          <template slot-scope="scope">{{scope.row.startTimeStr}}</template>
        </el-table-column>
        <el-table-column label="渠道" width="120">
          <template slot-scope="scope">{{scope.row.channelName || '全部'}}</template>
        </el-table-column>
        <el-table-column label="状态" width="120">
          <template slot-scope="scope">{{scope.row.appointmentStateDesc}}</template>
        </el-table-column>
        <el-table-column label="备注">
          <template slot-scope="scope">{{scope.row.symptom || '--'}}</template>
        </el-table-column>
      </el-table>
    </el-radio-group>
  </div>
</template>
<script>
import api from '@/arrange/store/appointapi'

export default {
  props: ['patient', 'initService'],
  data () {
    return {
      api,
      appoint: '',
      appointList: []
    }
  },
  watch: {
    'patient' (val) {
      if (val) {
        this.queryAppointList()
      } else {
        this.appointList = []
        this.clearAppoint()
      }
    },
    'appoint' (val) {
      this.$emit('getAppoint', this.appoint)
    },
    'initService' (val) {
      this.clearAppoint()
    }
  },
  methods: {
    clearAppoint () {
      this.appoint = { useAppoint: false, clear: true, patient: this.patient, appointmentType: 1, id: -1 }
    },
    queryAppointList () {
      this.api.getToDayAppointList({
        appointmentType: 1,
        canRegister: true,
        patientId: this.patient.id,
        patientPhone: this.patient.mobile,
        appointmentDate: this.$moment().format('YYYY-MM-DD')
      }).then(rs => {
        if (rs.head.errCode || !rs.data[0]) {
          this.appointList = []
          this.appoint = { useAppoint: false, clear: false, patient: this.patient, appointmentType: 1 }
        } else {
          this.appointList = rs.data.map(item => {
            item.useAppoint = true
            return item
          })
          this.appointList[0].patient = this.patient
          this.appoint = this.appointList[0]
        }
      })
    }
  }
}
</script>
<style scoped>
#appointlist {
  background: #ffffff;
  padding: 10px 10px 0;
}
#appointlist .header {
  margin-bottom: 5px;
  font-size: 14px;
}
#appointlist .header strong.title {
  font-size: 14px;
  border-left: 3px solid #1c7bef;
  padding-left: 10px;
  color: #000;
}
#appointlist .header span em {
  color: #ee4433;
  font-style: normal;
}
#appointlist .el-icon-warning {
  color: #ee4433;
}
#appointlist .el-table {
  margin-top: 0;
}
#appointlist .el-radio /deep/ .el-radio__label {
  display: none;
}
</style>
