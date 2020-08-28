<template>
  <el-dialog :title="title" :visible.sync="visibleFlag"  append-to-body id='addpath' width='500px'>
    <el-row :gutter="20">
      <el-col :span='6' class="textright">患者：</el-col>
      <el-col :span='18'>{{name}}</el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span='6' class="textright">主诊断：</el-col>
      <el-col :span='18'>{{diseaseName}}</el-col>
    </el-row>
    <template v-if='title === "添加路径提示"'>
      <el-row :gutter="20">
          <el-col :span='5' class="textright">符合路径：</el-col>
          <el-col :offset='5' :span='19' v-for='path in pathwayList' :key='path.id'>
            <el-radio v-model="pathwayId" :label="path.id">{{path.pathwayName}}</el-radio>
          </el-col>
      </el-row>
      <el-row :gutter="20" >
        <el-col class="textright">
          <el-button @click='title = "拒绝入径提示"; sending = false'>拒绝入径</el-button>
          <el-button type="primary" :disabled='!pathwayId || sending' @click='enterPathway'>确认入径</el-button>
        </el-col>
      </el-row>
    </template>
     <template v-else>
      <el-row :gutter="20">
        <ever-form2 ref='form' :schema="querySchema" v-model="queryObj" :rules='rules' :nosubmit="true"></ever-form2>
      </el-row>
      <el-row :gutter="20" >
        <el-col class="textright">
          <el-button @click='close'>取消</el-button>
          <el-button type="primary" @click='refuseEnterPathway' :disabled="sending">确认</el-button>
        </el-col>
      </el-row>
    </template>
  </el-dialog>
</template>

<script>
import api from '@/inpatient/store/resident.js'
export default {
  data () {
    let querySchema = [
      {
        name: 'reasonId',
        label: '拒绝原因',
        comp: 'ever-select',
        span: 24,
        props: {
          options: [],
          placeholder: '请选择拒绝原因'
        }
      },
      {
        name: 'reasonDetail',
        label: '拒绝明细',
        span: 24,
        comp: 'el-input',
        props: {
          type: 'textarea',
          placeholder: '请输入拒绝明细'
        }
      }
    ]
    let queryObj = this.$ever.createObjFromSchema(querySchema)
    return {
      api,
      querySchema,
      queryObj,
      visibleFlag: false,
      title: '添加路径提示',
      pathwayId: '',
      diseaseName: '',
      name: '',
      pathwayList: [],
      obj: {},
      zhenduan: [],
      sending: false,
      rules: {
        reasonId: [
          { required: true, message: '必选项', trigger: 'blur' }
        ],
        reasonDetail: [
          { required: true, message: '必填项', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    async open (obj) {
      this.obj = obj
      this.zhenduan = JSON.parse(obj.medicalRecord.outpatientHead.ZHEN_DUAN)
      if (!this.zhenduan || this.zhenduan.length === 0) return
      this.diseaseName = this.zhenduan[0].diseaseName
      this.name = obj.patient.name
      let res = await this.api.mappingPathway({
        hospitalizedNumber: this.obj.hospitalizedNumber,
        diagnosisId: this.zhenduan[0].diseaseCode,  // 诊断id
        sex: this.obj.patient.sex,  // 1男  2 女
        age: this.obj.patient.age,
        providerId: this.obj.providerId
      })
      if (Number(res.data.flag) === 1 && res.data.pathwayList && res.data.pathwayList.length > 0) {
        this.getConstantsByKey()
        this.title = '添加路径提示'
        this.visibleFlag = true
        this.pathwayList = res.data.pathwayList || []
      }
    },
    close () {
      this.visibleFlag = false
      this.sending = false
    },
    async getConstantsByKey () {
      let res = await this.api.getConstantsByKey({
        code: 'REFUSE_REASON'
      })
      let arr = []
      res.data.forEach(val => {
        arr.push({
          id: val.key,
          name: val.value
        })
      })
      this.$ever.getFieldFromSchema(this.querySchema, 'reasonId').props.options = arr
    },
    async enterPathway () { // 入径
      this.sending = true
      let res = await this.api.enterPathway({
        hospitalizedNumber: this.obj.hospitalizedNumber,
        diagnosisId: this.zhenduan[0].diseaseCode,
        pathwayId: this.pathwayId
      }).catch(_ => {
        this.sending = false
      })
      if (res.head && res.head.errCode === 0) {
        this.$notify({
          title: '入径成功',
          type: 'success',
          message: res.head && res.head.errMsg
        })
        this.close()
        this.$bus.$emit('patient_mgt_shua')
      }
    },
    async refuseEnterPathway () { // 拒绝入境
      this.$refs.form.$refs.form.validate(async valid => {
        if (valid) {
          this.sending = true
          let res = await this.api.refuseEnterPathway({
            hospitalizedNumber: this.obj.hospitalizedNumber,
            diagnosisId: this.zhenduan[0].diseaseCode,
            reasonId: this.queryObj.reasonId,
            reasonDetail: this.queryObj.reasonDetail
          }).catch(_ => {
            this.sending = false
          })
          if (res.head && res.head.errCode === 0) {
            this.$notify({
              title: '提交成功',
              type: 'success',
              message: res.head && res.head.errMsg
            })
            this.close()
          }
        }
      })
    }
  },
  watch: {

  }
}
</script>
<style lang="scss">
 #addpath{
   .el-row{
    line-height: 50px;
    .textright{
        text-align: right;
    }
  }
 }
</style>

