<template>
  <div class="examphrform flex_column_full_hidden">
    <!-- {{this.$route.query}} -->
    <!-- title -->
    <div class="flex_column_1">
      <el-tabs class="flex_column_1" v-model="activeName">
        <el-tab-pane :label="formName" name="form">
          <phrform
            :code="tplCode"
            :visit-id="visitId"
            :patient-id="patientId"
            :dpt-id="dptId"
            v-model="form"
            ref="form"
            :nosubmit="true"
            :schemaId.sync="schemaId"
            :allDisabled="allDisabled"
            :tplName.sync="formName"
            @focus="setFocus"
          ></phrform>
        </el-tab-pane>
      </el-tabs>
      <!-- form -->
      <!-- button -->
      <el-row type="flex" justify="end" style="padding: 10px">
        <el-col :span="24" align="right">
          <!-- <el-button @click="cancelAll" v-if="examType==1" :disabled="!allDisabled">取消总检</el-button> -->
          <el-button @click="save" type="primary" v-if="examType==2" :disabled="allDisabled">保存</el-button>
          <el-button @click="saveAll" type="primary" v-if="examType==1" :disabled="allDisabled">保存</el-button>
          <el-button @click="finished" type="primary" v-if="examType==2" :disabled="allDisabled">分检完成</el-button>
          <el-button @click="handelAll" type="primary" v-if="examType==1" :disabled="allDisabled">总检完成</el-button>
        </el-col>
      </el-row>
    </div>
    <addition class="flex_layout_scroll" v-if="examType==2" :allDisabled="allDisabled"></addition>
  </div>
</template>
<script>
import examapi from '@/workspace/store/examapi'
import storage from '@/util/storage'
import addition from '@/medcenter/page/additionprogram'
export default {
  props: [],
  data () {
    return {
      patientId: this.$route.query.patientId,
      activeName: 'form',
      dptId: this.$route.query.dptId,
      visitId: this.$route.query.visitSn,
      schemaId: '',
      formName: '',
      form: {},
      focusField: '',
      examData: [],
      examList: [],
      examType: Number(this.$route.query.examType || this.$route.params.examType),
      warnText: '',
      allDisabled: false
    }
  },
  created () {
    // if (this.examType === 1) {
    //     // 总检
    //   this.schemaId = 'c24b5e9e-0e88-4686-983e-1283751dd5c5'
    // }
  },
  computed: {
    tplCode () {
      if (this.examType === 1) {
        // 总检
        return 'JIAN_KANG_TI_JIAN_BAO_GAO'
      } else if (this.examType === 2) {
        // 分检
        return 'JIAN_KANG_PING_GU_BIAO'
      }
    }
  },
  watch: {
    'tplCode': {
      handler (val) {
        this.$bus.$emit('MEN_ZHEN_BING_LI_MU_BAN', val, Math.random())
      },
      immediate: true
    },
    'schemaId' (val) {
      this.$emit('schemaId', val)
    }
  },
  mounted () {
    // 聚焦添加表单数据 单个引用
    this.$bus.$on('ref:append', val => {
      this.form[this.focusField] = this.form[this.focusField] + val
    })
    // 总检全部引用
    this.$bus.$on('ref:appendAll', val => {
      this.form['DL_JIAN_CHA_ZONG_SHU'] = val.TIJIANJIELUN
      this.form['DL_TI_JIAN_JIAN_YI'] = val.JIANYI
    })

    if (this.$route.query.examType === '1') { // 总检
      this.getStatus1()
    } else if (this.$route.query.examType === '2') { // 分检
      this.getStatus2()
    }
  },
  methods: {
    setFocus (name, obj) {
      this.focusField = name
    },
    // (总检)获取是否总检完成的状态，0未完成 1已完成
    getStatus1 () {
      examapi.getExamStatus({
        examineSn: this.$route.query.visitSn
      }).then(res => {
        if (res.data.status === 1) {
          this.allDisabled = true
        } else if (res.data.status === 0) {
          this.allDisabled = false
        }
      })
    },
    // (分检)获取是否总检完成的状态，0未完成 1已完成
    getStatus2 () {
      examapi.getByItemStatus({
        visitSn: this.$route.query.visitSn
      }).then(res => {
        if (res.data.status === 1 || res.data.physicalExamItemList[0].status === 1) {
          this.allDisabled = true
        } else if (res.data.status === 1 || res.data.physicalExamItemList[0].status === 1) {
          this.allDisabled = false
        }
      })
    },
    // 保存总检信息
    async saveAll () {
      let info = {
        patientId: this.patientId,
        visitId: this.visitId,
        dptId: this.dptId
      }
      let saveSuccess = await examapi.saveDataToMedicalRecord({
        orderItemId: this.$route.query.orderItemId,
        serviceId: this.$route.query.serviceId,
        visitSn: this.$route.query.visitSn,
        formTemplateId: this.schemaId,
        data: Object.assign({}, this.form, info)
      }).then(res => {
        if (res.head.errCode === 0) {
          this.$messageTips(this, 'success', '保存成功')
          return true
        }
      })
      if (saveSuccess) {
        return true
      } else {
        console.log('总检保存不成功')
      }
    },
    // 保存分检信息
    async save () {
      let info = {
        patientId: this.patientId,
        visitId: this.visitId,
        dptId: this.dptId
      }
      let saveSuccess = await examapi.saveItemDataToMedicalRecord({
        visitSn: this.$route.query.visitSn,
        formTemplateId: this.schemaId,
        data: Object.assign({}, this.form, info)
      }).then(res => {
        if (res.head.errCode === 0) {
          this.$messageTips(this, 'success', '保存成功')

          return res.data[0].orderItemId
        }
      })
      if (saveSuccess) {
        return saveSuccess
      } else {
        console.log('分检保存不成功')
      }
    },
    async finished () {
      let orderItemId = await this.save()
      // this.examData = JSON.parse(storage.getLocalStorage('examData'))
      // this.warnText = ''
      // this.examData.forEach((item, index) => {
      //   if (item.status === 1) {
      //     this.warnText += `${item.a}、`
      //   }
      // })
      // `以下项目未完成<p>${this.warnText.slice(0, -1)}<p>
      if (orderItemId) {
        examapi.updateStatusDone({
          orderItemId: orderItemId
        }).then(res => {
          this.allDisabled = true
          if (res.head.errCode === 0) {
            this.getStatus2()
            this.$messageTips(this, 'success', '分检成功')
          }
        })
        // this.$confirm(`<p>注：分检完成后不能再修改报告信息。</p>`, '分检完成确认', {
        //   dangerouslyUseHTMLString: true,
        //   confirmButtonText: '确定',
        //   cancelButtonText: '取消',
        //   type: 'warning'
        // }).then(() => {
        //   examapi.updateStatusDone({
        //     orderItemId: orderItemId
        //   }).then(res => {
        //     this.allDisabled = true
        //     if (res.head.errCode === 0) {
        //       this.$messageTips(this, 'success', '分检成功')
        //       // this.allDisabled = true
        //       // this.$router.push('/workspace/outpatient')
        //     }
        //   })
        // })
      }
    },
    async handelAll () {
      let saveSuccess = await this.saveAll()
      // console.log('saveSuccess', saveSuccess)
      this.warnText = ''
      this.examList = JSON.parse(storage.getLocalStorage('examlist'))
      this.examList.forEach(item => {
        if (item.status === 0) {
          this.warnText += `${item.dptName}、`
        }
      })
      // 以下项目未完成<p>${this.warnText.slice(0, -1)}<p>
      if (saveSuccess) {
        this.$confirm(`以下项目未完成<p>${this.warnText.slice(0, -1)}</p><p>注：总检完成后不能再修改报告信息。</p>`, '总检检完成确认', {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(res => {
          examapi.updateStatusByVisitSn({
            examineSn: this.$route.query.visitSn
          }).then(res => {
            if (res.head.errCode === 0) {
              this.getStatus1()
              this.$messageTips(this, 'success', '总检成功')
              this.allDisabled = true
            }
          })
        })
      }
    },
    cancelAll () {
      console.log('取消总检')
    }
  },
  components: {
    addition
  }
}
</script>
<style lang="scss" scoped>
.examphrform {
  background: #fff;
  /deep/ .el-tabs__nav {
    transform: translateX(10px) !important;
  }
  .flex_column_1{
    /deep/.el-tabs__content{
      flex: 1;
      padding: 10px;
      overflow-y: auto;
    }
  }
}
</style>
