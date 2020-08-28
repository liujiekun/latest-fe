<template>
  <div class="execute_form">
    <div class="header">
      患者：
      <span>{{patient.patient.name}}</span>门诊编号：
      <span>{{patient.patient.outpatientNumber}}</span>年龄：
      <span>{{patient.patient.ageShowText}}</span>性别：
      <span v-if="patient.patient.sex==='1'">男</span>
      <span v-if="patient.patient.sex==='2'">女</span>手术名称：
      <span>{{patient.surgeryName}}</span>
    </div>
    <ever-form2
      :schema="schema"
      v-model="queryobj"
      label-position="right"
      :nosubmit="nosubmit?true:false"
      labelWidth="80px"
      :allDisabled="patient.surgeryStatus === 3"
    >
      <template slot="default">
        <el-button type="primary" @click="submit()">确认完成</el-button>
      </template>
    </ever-form2>
  </div>
</template>
<script>
import api from '@/csa/store/eop.js'

let schema = [
  {
    name: 'applianceProviderId',
    label: '手术科室',
    span: 12,
    comp: 'ever-select',
    props: {
      placeholder: '请选择',
      options: [],
      disabled: true,
      // needObjFlag: true,
      filterable: true,
      clearable: true
    }
  },
  {
    name: 'anaesthesiaDoctorId',
    label: '麻醉医生',
    span: 12,
    comp: 'ever-select',
    props: {
      placeholder: '请选择',
      options: [],
      // needObjFlag: true,
      filterable: true,
      clearable: true
    }
  },
  {
    name: 'surgeryRoomId',
    label: '手术室',
    span: 12,
    comp: 'ever-select',
    props: {
      options: [],
      disabled: true,
      // needObjFlag: true,
      placeholder: '请输入'
    }
  },
  {
    name: 'anaesthesiaAssistantId',
    label: '麻醉助手',
    span: 12,
    comp: 'ever-select',
    props: {
      placeholder: '请选择',
      options: [],
      multiple: true,
      // needObjFlag: true,
      filterable: true,
      clearable: true
    }
  },
  {
    name: 'startTime',
    label: '手术开始',
    comp: 'el-date-picker',
    span: 12,
    props: {
      style: 'width: 100%;',
      placeholder: '开始时间',
      type: 'datetime',
      valueFormat: 'yyyy-MM-dd HH:mm',
      format: 'yyyy-MM-dd HH:mm'
    }
  },
  {
    name: 'anaesthesiaType',
    label: '麻醉方式',
    comp: 'sys-type',
    span: 12,
    props: {
      code: 'CV06.00.103'
    }
  },
  {
    name: 'endTime',
    label: '手术结束',
    comp: 'el-date-picker',
    span: 12,
    props: {
      style: 'width: 100%;',
      placeholder: '结束时间',
      type: 'datetime',
      valueFormat: 'yyyy-MM-dd HH:mm',
      format: 'yyyy-MM-dd HH:mm'
    }
  },
  {
    name: 'surgeryNurseId',
    label: '手术护士',
    span: 12,
    comp: 'ever-select',
    props: {
      // needObjFlag: true,
      placeholder: '请选择',
      options: [],
      multiple: true,
      filterable: true,
      clearable: true
    }
  },
  {
    name: 'operatorDoctorId',
    label: '主刀医生',
    span: 12,
    comp: 'ever-select',
    props: {
      // needObjFlag: true,
      placeholder: '请选择',
      options: [],
      filterable: true,
      clearable: true
    }
  },
  {
    name: 'assistantDoctorId',
    label: '手术助手',
    span: 12,
    comp: 'ever-select',
    props: {
      // needObjFlag: true,
      placeholder: '请选择',
      multiple: true,
      options: [],
      filterable: true,
      clearable: true
    }
  },
  {
    name: 'tourNurseId',
    label: '巡回护士',
    span: 12,
    comp: 'ever-select',
    props: {
      // needObjFlag: true,
      placeholder: '请选择',
      options: [],
      multiple: true,
      filterable: true,
      clearable: true
    }
  },
  {
    name: 'scrubNurseId',
    label: '洗手护士',
    span: 12,
    comp: 'ever-select',
    props: {
      // needObjFlag: true,
      placeholder: '请选择',
      options: [],
      multiple: true,
      filterable: true,
      clearable: true
    }
  },
]
export default {
  props: ['nosubmit', 'patient'],
  data () {
    let queryobj = this.$ever.createObjFromSchema(schema)
    return {
      queryobj,
      queryObj: queryobj,
      schema,
      api,
      deptO: [],
      deptT: [],
      deptS: [],
      deptF: []
    }
  },
  created () {
    this.getFormOptions()
    this.echo()
  },
  methods: {
    zxsubmit () {
      this.submit()
    },
    echo () {
      let info = this.deepCopy(this.patient)
      if (this.queryobj.applianceProviderId) {
        info.applianceProviderId = this.queryobj.applianceProviderId
      }
      if (this.queryobj.anaesthesiaType) {
        info.anaesthesiaType = this.queryobj.anaesthesiaType
      }
      if (this.queryobj.operatorDoctorId) {
        info.operatorDoctorId = this.queryobj.operatorDoctorId
      }
      if (this.queryobj.anaesthesiaDoctorId) {
        info.anaesthesiaDoctorId = this.queryobj.anaesthesiaDoctorId
      }
      if (this.queryobj.surgeryRoomId) {
        info.surgeryRoomId = this.queryobj.surgeryRoomId
      }
      if (info.anaesthesiaAssistantId && info.anaesthesiaAssistantId !== '') info.anaesthesiaAssistantId = JSON.parse(info.anaesthesiaAssistantId)
      if (info.assistantDoctorId && info.assistantDoctorId !== '') info.assistantDoctorId = JSON.parse(info.assistantDoctorId)
      if (info.scrubNurseId && info.scrubNurseId !== '') info.scrubNurseId = JSON.parse(info.scrubNurseId)
      if (info.surgeryNurseId && info.surgeryNurseId !== '') info.surgeryNurseId = JSON.parse(info.surgeryNurseId)
      if (info.tourNurseId && info.tourNurseId !== '') info.tourNurseId = JSON.parse(info.tourNurseId)
      if (info.startTime && info.startTime !== '') info.startTime = this.$moment(info.startTime).format('YYYY-MM-DD HH:mm:SS')
      if (info.endTime && info.endTime !== '') info.endTime = this.$moment(info.endTime).format('YYYY-MM-DD HH:mm:SS')
      this.queryobj = info
      if (info.applianceProviderId) this.getRoom(info.applianceProviderId)
    },
    submit () {
      // let copyQueryobj = this.deepCopy(this.queryobj)
      if (this.queryobj.startTime && this.queryobj.endTime) {
        if (this.$moment(new Date(this.queryobj.endTime)).valueOf() - this.$moment(new Date(this.queryobj.startTime)).valueOf() <= 0) {
          return this.$notify({
            title: '时间选择错误',
            type: 'warning',
            message: '开始时间要早于结束时间'
          })
        }
      }
      let params = {}
      if (this.queryobj.anaesthesiaType !== '') params.anaesthesiaType = this.queryobj.anaesthesiaType
      if (this.queryobj.applianceProviderId) {
        params.applianceProviderId = this.queryobj.applianceProviderId
        const found = this.deptO.find(el => el.id === this.queryobj.applianceProviderId)
        params.applianceProviderName = found.name
      }
      if (this.queryobj.operatorDoctorId) {
        params.operatorDoctorId = this.queryobj.operatorDoctorId
        const found = this.deptS.find(el => el.id === this.queryobj.operatorDoctorId)
        params.operatorDoctorName = found.name
      }
      if (this.queryobj.anaesthesiaDoctorId) {
        params.anaesthesiaDoctorId = this.queryobj.anaesthesiaDoctorId
        const found = this.deptS.find(el => el.id === this.queryobj.anaesthesiaDoctorId)
        params.anaesthesiaDoctorName = found.name
      }
      if (this.queryobj.surgeryRoomId) {
        params.surgeryRoomId = this.queryobj.surgeryRoomId
        const found = this.deptT.find(el => el.id === this.queryobj.surgeryRoomId)
        params.surgeryRoom = found.name
      }
      if (this.patient.notificationId) params.notificationId = this.patient.notificationId
      params.id = this.$route.query.id
      params.anaesthesiaAssistantId = this.queryobj.anaesthesiaAssistantId && this.queryobj.anaesthesiaAssistantId.length > 0 ? JSON.stringify(this.queryobj.anaesthesiaAssistantId) : ''
      params.assistantDoctorId = this.queryobj.assistantDoctorId && this.queryobj.assistantDoctorId.length > 0 ? JSON.stringify(this.queryobj.assistantDoctorId) : ''
      params.scrubNurseId = this.queryobj.scrubNurseId && this.queryobj.scrubNurseId.length > 0 ? JSON.stringify(this.queryobj.scrubNurseId) : ''
      params.surgeryNurseId = this.queryobj.surgeryNurseId && this.queryobj.surgeryNurseId.length > 0 ? JSON.stringify(this.queryobj.surgeryNurseId) : ''
      params.tourNurseId = this.queryobj.tourNurseId && this.queryobj.tourNurseId.length > 0 ? JSON.stringify(this.queryobj.tourNurseId) : ''
      if (this.queryobj.startTime) params.startTime = this.queryobj.startTime.toString().replace(/\s+/g, 'T')
      if (this.queryobj.endTime) params.endTime = this.queryobj.endTime.toString().replace(/\s+/g, 'T')
      if (!this.nosubmit) {
        this.$confirm('是否确认手术完成，确认后信息不可修改！', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(({ value }) => {
          this.api.savePostOperation(params).then(res => {
            if (res.data) {
              this.$notify({
                type: 'success',
                title: '成功',
                message: '术后登记表单保存成功！'
              })
              this.$router.push({
                name: 'eop'
              })
            }
          })
        })
      } else {
        this.api.saveSurgeryExecut(params).then(res => {
          if (res.data) {
            this.$messageTips(this, 'success', '手术执行成功！')
            this.$emit('success', res.data)
            if (!this.$route.query.id) {
              this.$router.push({
                name: 'details',
                query: {
                  id: this.patient.id,
                  isZx: true
                }
              })
            }
          } else {
            this.$emit('success', null)
          }
        })
      }
    },
    deepCopy (obj1) {
      let _obj = JSON.stringify(obj1)
      let obj2 = JSON.parse(_obj)
      return obj2
    },
    getFormOptions () {
      let params = {
        typeCodeList: ['NURSE'],
        orgIdList: [this.$store.state.currentUser.organizationId + ''],
        usePermissionStatus: 'Y'
      }
      let param = {
        baseStaffPermission1CodeList: ['03'],
        orgIdList: [this.$store.state.currentUser.organizationId + ''],
        usePermissionStatus: 'Y'
      }
      this.api.getStaffListByCondition(param).then(res => {
        this.setOptions('operatorDoctorId', res.data.resultList) // 主刀医生
        this.setOptions('anaesthesiaDoctorId', res.data.resultList) // 麻醉医生
        this.setOptions('assistantDoctorId', res.data.resultList) // 手术助手
        this.deptS = res.data.resultList
      })
      this.api.getStaffListByCondition(params).then(res => {
        this.deptF = res.data.resultList
        this.setOptions('tourNurseId', res.data.resultList) // 巡回护士
        this.setOptions('scrubNurseId', res.data.resultList) // 洗手护士
        this.setOptions('surgeryNurseId', res.data.resultList) // 手术护士
        this.setOptions('anaesthesiaAssistantId', res.data.resultList) // 麻醉助手
      })
      this.getTenantSubjectListByCondition()
      // if (!this.patient.anaesthesiaType) this.patient.anaesthesiaType = ''
      // let obj = this.deepCopy(this.patient)
      // if (this.patient) {
      //   this.queryobj = obj
      // }
    },
    setOptions (name, res) {
      this.$ever.getFieldFromSchema(
        this.schema,
        name
      ).props.options =
        res
    },
    async getTenantSubjectListByCondition () {  // 查询全部住院科室
      let res = await this.api.getTenantSubjectListByCondition({
        outSubjectGetTenantSubjectListByConditionReqDTO: {
          type2CodeList: ['02.04']
        }
      })
      this.procviderOptions = []
      if (res.data && res.data.resultList) {
        res.data.resultList = res.data.resultList.map(item => {
          return {
            id: item.tenantSubjectCode,
            name: item.tenantSubjectName
          }
        })
        this.deptO = res.data.resultList
        this.setOptions('applianceProviderId', res.data.resultList)
      }
    },
    async getRoom (val) {
      let res = await this.api.getTenantSubjectListHasRoomByCondition({
        idList: [val]
      })
      let arr = []
      let flag = true
      if (res.data && res.data.resultList) {
        res.data.resultList.forEach(vl => {
          vl.roomList.forEach(el => {
            if ((this.queryobj.surgeryRoomId === el.id) && flag) {
              arr.push(el)
              flag = false
            }
          })
        })
        this.deptT = arr
        this.setOptions('surgeryRoomId', arr)
      }
    }
  },
  watch: {
    'queryObj.applianceProviderId': {
      handler (val) {
        if (val !== '') {
          this.getRoom(val)
        }
      },
      deep: true
    }
  }
}
</script>
<style lang="scss" scope>
.execute_form {
  background-color: #ffffff;
  /deep/ .el-dialog__body {
    padding: 0;
  }
  /deep/ .el-button {
    margin-left: 80px;
  }
  /deep/ .el-form {
    padding: 20px 20px 28px 5px;
  }
  /deep/ .el-date-editor {
    width: 100%;
  }
  .header {
    padding: 20px 20px;
    border-top: 1px solid #d8d8d8;
    border-bottom: 1px solid #d8d8d8;
    font-size: 14px;
    color: #666666;
    // margin-bottom: 20px;
    span {
      color: #333333;
      font-weight: 500;
      margin-right: 30px;
    }
  }
}
</style>
