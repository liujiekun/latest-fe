<template>
<div>
  <div class="codebox">
    <div class="steplis">
      <el-steps direction="vertical" :active="stepIndex">
        <el-step title=""></el-step>
        <el-step title=""></el-step>
        <el-step title=""></el-step>
        <el-step title=""></el-step>
      </el-steps>
    </div>
    <el-form class="forms" :model="formData" :rules="rulesForm" ref="scanCodeForm" label-width="80px">
      <el-form-item label="血源编码" prop="bloodSourceCode">
        <el-input ref="bloodSourceCode" v-model.trim="formData.bloodSourceCode" @focus="setStepIndex(1)" @keyup.enter.native="enterEvent(formData.bloodSourceCode, 0)" placeholder="扫描或输入条码" autofocus>
          <i slot="suffix" class="el-input__icon iconfont icon-saomiao"></i>
        </el-input>
      </el-form-item>
      <el-form-item label="品种编码" prop="varietiesCode">
        <el-input ref="varietiesCode" v-model.trim="formData.varietiesCode" @focus="setStepIndex(2)" @keyup.enter.native="enterEvent(formData.varietiesCode, 1)" placeholder="扫描或输入条码">
          <i slot="suffix" class="el-input__icon iconfont icon-saomiao"></i>
        </el-input>
      </el-form-item>
      <el-form-item label="血型编码" prop="bloodTypeCode">
        <el-input ref="bloodTypeCode" v-model.trim="formData.bloodTypeCode" @focus="setStepIndex(3)" @keyup.enter.native="enterEvent(formData.bloodTypeCode, 2)" placeholder="扫描或输入条码">
          <i slot="suffix" class="el-input__icon iconfont icon-saomiao"></i>
        </el-input>
      </el-form-item>
      <el-form-item label="效期编码" prop="validityCode">
        <el-input ref="validityCode" v-model.trim="formData.validityCode" @focus="setStepIndex(4)" @keyup.enter.native="enterEvent(formData.validityCode, 3)" placeholder="扫描或输入条码">
          <i slot="suffix" class="el-input__icon iconfont icon-saomiao"></i>
        </el-input>
      </el-form-item>
    </el-form>
    </div>
    <div class="mt10">
      <el-button ref="submits" type="primary" @click="scanCodeSubmit">提交</el-button>
    </div>
  </div>
</template>

<script>
import api from '../store/scancodeapi'
import bloodwarningapi from '../store/bloodwarningapi'
// import config from '../util/bloodconfig.js'
export default {
  props: ['formData', 'isCode', 'isScreeningCode', 'bloodTakeId', 'bloodMatchingId'],
  data () {
    return {
      rulesForm: {},
      api: api,
      codeObject: {},
      stepIndex: 1,
      BLOOD_TYPE_CODE: [],
      BLOOD_ABO_RH_CODE: []
    }
  },
  created () {
    if (this.formData && (typeof this.isCode === 'undefined' || this.isCode)) {
      for (let item in this.formData) {
        this.$set(this.rulesForm, item, [{
          required: true,
          message: '请扫描或输入条码'
        }])
      }
    }
    bloodwarningapi.getBloodVarietyConfigList().then(res => {
      if (res) {
        this.setConfig('BLOOD_TYPE_CODE', res)
      }
    })
    bloodwarningapi.getBloodTypeConfigList().then(res => {
      if (res) {
        this.setConfig('BLOOD_ABO_RH_CODE', res)
      }
    })
  },
  methods: {
    setConfig (code, arr) {
      arr.map(item => {
        let code = item.bloodTypesCode || item.bloodVarietyCode
        item.name = item.bloodVarietyName
        if (code.indexOf(',') !== -1) {
          item.code = code.split(',')
        } else {
          item.code = [code]
        }
      })
      this[code] = arr
    },
    setStepIndex (index) {
      this.stepIndex = index
    },
    enterEvent (val, index) {
      if (typeof this.isCode !== 'undefined' && this.isCode === false && val) {
        let params = Object.assign({}, this.formData, { bloodTakeId: this.bloodTakeId, bloodMatchingId: this.bloodMatchingId })
        this.api.scanBloodBankCode(params).then(result => {
          if (result) {
            this.$emit('scanBloodBankCode', result)
          }
        })
      }
      if (this.isScreeningCode && val) {
        this.$emit('scanCodeChange', this.screeningCode(val, index))
      }
    },
    screeningCode (val, index) {
      let obj = null
      switch (index) {
        case 0:
          this.$refs.varietiesCode.focus()
          break
        case 1:
          obj = this.selectArr(val, this.BLOOD_TYPE_CODE)
          Object.assign(this.codeObject, obj)
          if (this.formData.validityCode) this.enterEvent(this.formData.validityCode, 3)
          this.$refs.bloodTypeCode.focus()
          return { bloodTypes: obj.name || '' }
        case 2:
          obj = { abo: this.selectArr(val, this.BLOOD_ABO_RH_CODE).bloodTypesName || '', rh: this.selectArr(val, this.BLOOD_ABO_RH_CODE).bloodTypeAttachName || '' }
          Object.assign(this.codeObject, obj)
          this.$refs.validityCode.focus()
          return obj
        case 3:
          this.$refs.submits.$el.focus()
          return this.dateCount(val)
      }
    },
    dateCount (code) {
      let year = '2' + code.substr(0, 3)
      let fullYear = year + '-1' + '-1'
      let day = Number(code.substr(3, 3))
      let date = code.substr(6, 2) + ':' + code.substr(8, 2) + ':00'
      let bloodExpirationDate = this.getNewData(fullYear, day) + ' ' + date
      let drawBloodDate = ''
      if (this.codeObject.effectiveTimeType === 2) drawBloodDate = this.getNewData((year - this.codeObject.effectiveTime) + '-1' + '-1', day) + ' ' + date
      if (this.codeObject.effectiveTimeType === 1) drawBloodDate = this.getNewData(fullYear, day - this.codeObject.effectiveTime) + ' ' + date
      let params = {
        drawBloodDate: drawBloodDate,
        bloodExpirationDate: bloodExpirationDate
      }
      Object.assign(this.codeObject, params)
      return params
    },
    getNewData (dateTemp, days, type = 'YYYY-MM-DD') {
      return this.$moment(dateTemp).date(days).format(type)
    },
    selectArr (val, arr) {
      let index = arr.findIndex(item => {
        return item.code.includes(val)
      })
      return index > -1 ? arr[index] : ''
    },
    scanCodeSubmit () {
      this.$emit('scanCodeSubmit', 1)
      for (var i in this.codeObject) {
        this.codeObject[i] = ''
      }
    }
  }
}
</script>
<style scoped lang="scss">
.codebox{
  box-shadow: 4px 0 10px 0 rgba(0,0,0,0.1);
  display: flex;
  padding: 20px 0 10px 0;
  padding-right: 30px;
}
.steplis{
  display: inline-block;
  height: 188px;
  width: 30px;
  vertical-align: top;
  padding-top: 8px;
  padding-left: 10px;
}
.forms{
  flex: 1;
  display: inline-block;
  /deep/ .el-input__suffix{
    right: 10px;
  }
  /deep/ .icon-saomiao{
    color: #999;
  }
}
.el-step.is-vertical {
  /deep/ .el-step__line{
    width: 1px;
    background: #1C7BEF;
  }
  /deep/ .el-step__icon{
    background: #1C7BEF;
    color: #fff;
    border: 0px!important;
  }
  /deep/ .is-finish{
    position: relative;
    /deep/ .is-text::before{
      position: absolute;
      width: 0px;
      height: 0px;
      right: -8px;
      content: "";
      border-width: 5px;
      border-style: solid;
      border-color: transparent transparent transparent #1C7BEF;
    }
  }
}

</style>
