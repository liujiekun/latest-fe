<template>
<div class="medDetail">
  <el-row>
    <el-col :span="20">
        <span class="icon_detail" @click="$router.push('/medcenter/appoint')"><i data-v-f4a6a122="" class="el-icon-arrow-left box_sha_1"></i>{{patientObj.setMealName}}</span>
        <span>{{patientObj.patientName}}</span>
        <span>{{patientObj.patientSex=='1'?'男':'女'}}</span>
        <span>{{patientObj.mobile}}</span>
        <span>{{patientObj.companyName}}</span>
    </el-col>
    <el-col :span="4" clss="tr">
        <el-button size="medium" type="info" plain @click="printNew">打印指引单</el-button>
        <el-button size="medium" type="primary" :disabled="isBill" @click="setBill">报到</el-button>
    </el-col>
  </el-row>
  <el-tabs v-model="activeName">
    <el-tab-pane v-for="(item,i) in deptData" :label="item.catalogue" :name="item.index" :key="i">
    </el-tab-pane>
  </el-tabs>
  <appoint-open ref="appointOpen" :isBill="isBill" :isPrint="isPrint" :deptObj="deptObj"
  :settlementId="settlementId" :patientObj="patientObj" @getData="getData" @otherData="otherData"></appoint-open>
</div>
</template>
<script>
import api from '@/medcenter/store/medappointapi'
import appointOpen from '@/medcenter/page/appointopen'
import {frPrint} from '@/util/common'
export default {
  data () {
    return {
      api,
      appoint: '',
      shareInfo: '',
      shareTime: '',
      results: '',
      birthData: [
          {id: 1, name: '张三', sex: '1', mobile: '13476234556', company: '公司'}
      ],
      deptData: [
      ],
      deptId: null,
      deptObj: {
        catalogue: '根目录',
        doctorName: '',
        dptName: '',
        setMealCatalogId: ''
      },
      id: this.$route.query.id ? this.$route.query.id : null,
      patientObj: this.$route.query ? this.$route.query : null,
      saveData: [],
      selectPrint: [],
      baseCode: 'SHENG_RI_TI_JIAN',
      objFlag: {
        '133f4cf1-63e3-4497-8b1b-c2f4a76f052f': true
      },
      isPrint: true,
      settlementId: '',
      isBill: true,
      activeName: ''
    }
  },
  created () {
    // console.log(this.$route.query, 'this.$route.params')
    this.deptId = ''
    let params = {
      physicalExamId: this.id// 目录id
    }
    // 目录列表
    this.finByMealCatalogId(params)
  },
  watch: {
    'activeName': function (val) {
      this.getDept(this.deptData[val])
    }
  },
  methods: {
    finByMealCatalogId (params) { // 获取体检目录
      this.api.finByMealCatalogId(params).then(rs => {
        let obj = {
          catalogue: '根目录',
          doctorName: '',
          dptName: '',
          setMealCatalogId: ''
        }
        if (rs && rs.data) {
          this.deptData = rs.data
          this.deptData.unshift(obj)
        } else {
          this.deptData.unshift(obj)
        }
        this.deptData.forEach((el, i) => {
          el.index = String(i)
        })
      })
    },
    getData (val) {
      this.saveData = val
      // 有已经报到或者未支付则置灰
      // this.isPrint = val.some(v => {
      //   return v.adviceId
      // })
      // let isStatus = val.some(v => {
      //   return v.payStatus === 0
      // })
      // if (!this.isPrint && !isStatus) {
      //   this.isBill = false
      // } else {
      //   this.isBill = true
      // }
      this.isBill = !(val.some(v => {
        return (v.payStatus === 1 && ((v.adviceType !== '799' && v.isAppointment === 0) || (v.adviceType === '799' && v.isAppointment !== 3)))
      }))
      // let isSave = val.some(v => {
      //   return (v.adviceType !== '799' && v.setMealWithin === 1 && v.payStatus === 1 && v.isAppointment === 0) || (v.adviceType === '799' && v.setMealWithin === 1 && v.payStatus === 1 && v.isAppointment !== 3)
      // })
    },
    otherData (val) {
      this.selectPrint = val
    },
    createAppoint (params) { // 保存体检预约
      if (this.saveData && this.saveData[0]) {
        let data = []
        data = this.saveData.map(v => {
          v.patientId = this.patientObj.patientId
          if (v && v.timeObj && v.timeObj.startTimeStr && v.timeObj.endTimeStr) {
            v.subTime = v.timeObj.startTimeStr
            v.appointmentEndtime = v.timeObj.endTimeStr
          } else {
            v.subTime = null
            v.appointmentEndtime = null
          }
          if (v && v.examDoctorObj && v.examDoctorObj.resourceId && v.examDoctorObj.resourceName) {
            v.examDoctorId = v.examDoctorObj.resourceId
            v.examDoctor = v.examDoctorObj.resourceName
          } else {
            v.examDoctorId = null
            v.examDoctor = null
          }
          if (v.detailObj && v.detailObj.adviceContent && JSON.parse(v.detailObj.adviceContent)['excuteProvider']) {
            v.deptId = JSON.parse(v.detailObj.adviceContent)['excuteProvider']['id']
            v.deptName = JSON.parse(v.detailObj.adviceContent)['excuteProvider']['name']
          }
          return v
        })
        data = data.map(v => {
          if (v.newItem) { // phr新增项目不需要id
            v.id = null
          }
          return v
        })
        console.log(data, 'save')
        if (data && data[0]) {
          this.api.createAppoint(data).then(rs => {
            if (rs && rs.head.errCode === 0 && rs.data !== 0) {
              this.$notify({
                title: '成功',
                type: 'success',
                message: '保存成功',
                duration: 2000
              })
              let params = {
                physicalExamId: this.id, // 主键id
                setMealCatalogId: this.deptObj.setMealCatalogId// 目录id
              }
              this.$refs.appointOpen.getBySetMealCatalogId(params)
            }
          })
        }
      }
    },
    getDept (item) {
      if (item && item.setMealCatalogId) {
        this.deptId = item.setMealCatalogId
        this.deptObj = item
      } else {
        this.deptId = ''
        this.deptObj = {
          catalogue: '根目录',
          doctorName: '',
          dptName: '',
          setMealCatalogId: ''
        }
      }
    },
    print () {
      if (!this.selectPrint && this.selectPrint.length === 0) {
        this.$notify({
          title: '提示',
          type: 'warning',
          message: '请先勾选体检套餐',
          duration: 2000
        })
        return
      } else {
        // frPrint(this.baseCode, {id: this.patientObj.examineSn})
      }
    },
    printNew () {
      frPrint(this.baseCode, {id: this.patientObj.examineSn})
    },
    async setBill () {
      if (!this.saveData && this.saveData.length === 0) {
        this.$notify({
          title: '提示',
          type: 'warning',
          message: '请先提交体检套餐',
          duration: 2000
        })
        return
      } else {
        // 对未报到和已经支付的项目进行报到
        let data = this.saveData.filter(v => {
          if (v && !v.adviceId && v.payStatus === 1) {
            if (v.detailObj) {
              v.examineSn = this.patientObj.examineSn || ''
              v.detailObj.patientId = this.patientObj.patientId
              v.detailObj.physicalOrderId = v.id
              v.detailObj.shopSetItemId = v.orderItemId
              v.detailObj.price = v.price
              if (v && v.adviceContent) {
                v.excuteProvider = JSON.parse(v.adviceContent)['excuteProvider']['id']
              }
              v.physicalExamVo = v.detailObj
              return v
            }
          }
        })
        if (!data || data.length === 0) {
          return
        }
        let res = await this.api.createPhysicalInfo(data)
        if (res && res.head.errCode === 0) {
          this.$messageTips(this, 'success', '成功')
          let params = {
            physicalExamId: this.id, // 主键id
            setMealCatalogId: this.deptObj.setMealCatalogId// 目录id
          }
          this.$refs.appointOpen.getBySetMealCatalogId(params)
          // this.$refs.appointOpen.pay2(res)
          // this.settlementId = res.data
          // localStorage.setItem('settlementId', res.data)
        }
      }
    },
    save () {
    }
  },
  components: {
    appointOpen
  }
}
</script>
<style scoped>
.medDetail{height:100%;}
.medDetail{height:100%;display: flex;flex-direction:column;overflow: hidden;}
.medDetail /deep/ .el-table {margin:0;}
.medDetail .el-breadcrumb{background:#ffffff!important;line-height:32px;}
.medDetail .layout_breadcrumb{height:32px;}
.medDetail .icon_detail{display: inline-block;height:32px;line-height: 32px;cursor: pointer;}
.medDetail .el-col:nth-child(2){text-align:right;}
.medDetail .el-tabs {background:#ffffff;padding:0 10px;margin-top:10px;}
.medDetail .dept_list .root_title{height: 44px;padding:4px;border:1px solid #eeeeee;line-height: 44px;margin-top: 16px;font-weight: 700;}
.medDetail .dept_list .on{background: #eaf2fc;border: 1px solid #1c7bef!important;}
.medDetail .box_sha_1{ background-color: #fff;}
.medDetail .el-icon-arrow-left{ padding: 1px;cursor: pointer;background: #fff;border-radius: 2px;margin-right:10px;}
.tr{text-align: right;}
</style>
