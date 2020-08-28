<template>
  <div class="details">
    <ever-bread-crumb :name="breadCrumbName" :path="path" :showTitle="true" :pathTo="true"></ever-bread-crumb>
    <div class="details_body">
      <div class="details_left">
        <div class="details_left_top">
          <card :item="cardInfo" :is-details="true" @cardClick="cardClick"></card>
        </div>
        <div class="details_left_bottom">
          <ul v-if="cardInfo.surgeryStatus !==4">
            <li v-for="(item, index) in liArr" :class="{'clickBg': index === activeIndex,'pointer_events': cardInfo.surgeryStatus ===1&&(index===4||index===5)}" @click="liClick(index)" :key="item">
              {{item}}
              <span v-if="(index === activeIndex)&&index!==4&&index!==5" @click="handlePrint">
                <i class="icon iconfont icon-editor-print"></i>打印
              </span>
            </li>
          </ul>
          <div class="cancel" v-else>
            <p class="p1">{{cardInfo.cancelTime | formatDateByExp('YYYY-MM-DD HH:mm')}}</p>
            <p class="p2">由 {{cardInfo.cancelUser}} 取消</p>
            <p class="p3">取消说明：</p>
            <p class="p4">{{cardInfo.cancelRemarks}}</p>
          </div>
        </div>
      </div>
      <div class="details_right">
        <execute-form v-if="activeIndex === 5" :patient="cardInfo" :key="key"></execute-form>
        <feeorders v-if="activeIndex === 4" :baseInfo="baseInfo" :disabled="cardInfo.surgeryStatus === 3" :provider-types="['01.02', '01.03', '02.01', '02.02', '02.03', '02.04']" :t-fee-limit="hasPermission('Auth_menu_eop_fee_return')" :fees-type="5" workspace="SMGL-001"></feeorders>
        <everNoData v-if="!isSs" class="no-data" :type="'custom'">
          <template slot="custom">
            <p>手术未执行，尚未生成手术记录</p>
            <el-button style="margin-top:10px" type="primary" @click="cardClick('zx')">立即执行</el-button>
          </template>
        </everNoData>
        <el-button v-if="activeIndex !== 4 && activeIndex !== 5&&isSs&&cardInfo.surgeryStatus !== 4" type="text" @click="saveRecord" :disabled="cardInfo.surgeryStatus === 3"><i class="iconfont icon-baocun"></i> 保存模板</el-button>
        <evereditor v-if="isCreate && schema.element && activeIndex !== 4 && activeIndex !== 5 && isSs&&editorOpts.customEchoData&&cardInfo.surgeryStatus" menu="base" :html="schema.element" :toolbars="toolbars" :editable.sync="cardInfo.surgeryStatus !== 3" :page-settings.sync="pageSettings" :options="editorOpts" mode="editor" ref="saveTemplate">
        </evereditor>
      </div>
    </div>
    <operation-dialog ref="operationDialog" @success="success('zx')"></operation-dialog>
    <addinspect :type="4" ref="addinspect" :value="patient" :show.sync="addinspectShow" @success="success"></addinspect>
  </div>
</template>
<script>
import operationDialog from '@/csa/page/execute.operation.dialog.vue'
import dialogPrint from '@/inpatient/page/medicalrecord/dialog.print'
import addinspect from '@/arrange/page/appoint/dialog-addinspect.vue'
import feeorders from '@/inpatient/components/fee.orders/index.vue'
import executeForm from '@/csa/page/execute.form.vue'
import card from '@/csa/components/eop.card.vue'
import { jcpPrintEditor } from '@/util/common'
import urlMap from '@/inpatient/urls'
import { request } from '@/util/req'
import evereditor from 'evereditor'
import api from '@/csa/store/eop.js'

export default {
  data () {
    return {
      api,
      breadCrumbName: '返回',
      liArr: ['手术风险评估', '安全检查', '手术用物清点记录', '手术记录', '手术计费', '术后登记'],
      activeIndex: -1,
      baseInfo: {},
      id: this.$route.query.id,
      cardInfo: {},
      addinspectShow: false,
      patient: {},
      key: '',
      isSs: true,
      pageSettings: {
        paperName: 'A4',
        paperWidth: 210,
        paperHeight: 297,
        portrait: true,
        pagePadding: [10, 10, 10, 10],
      },
      printVisible: false,
      toolbars: ['Undo', 'Redo'],
      editorOpts: {
        suggestItems: [],
        templateItems: []
      },
      schema: {
        element: null
      },
      schemaId: [
        'b42253a7-cbf0-46ee-b87a-017306700aff', // CHA手术风险评估表
        '1281ff86-f56c-4fab-8e18-1244a4c11311', // 手术安全核查表
        '70adc743-4125-43c8-b827-967d99ba0c60', // 手术用物清点记录
        '6f5d15ef-dab2-4c60-9d18-e5ee7758184b' // 手术记录
      ],
      param: [],
      path: '',
      tFeeLimit: false, // 退费权限
      isCreate: false
    }
  },
  components: { executeForm, card, feeorders, evereditor, dialogPrint, operationDialog, addinspect },
  created () {
    this.getCardInfo()
  },
  methods: {
    // 查询是否有退费权限
    hasPermission (auth) {
      return this.$hasPermission(auth)
    },
    // 获取详情信息方法
    async getCardInfo (name) {
      this.getSurgeryNotification().then(res => {
        if (res.data.surgeryStatus !== 4) {
          if (this.$route.query.isZx || name === 'zx') return this.liClick(3)
          if (this.$route.query.isJf) return this.liClick(4)
          if (this.$route.query.isDj) return this.liClick(5)
          if (name !== 'mb') this.liClick(0)
        }
      })
    },
    async cardClick (type, item) {
      // 卡片按钮回调-- sqzb:术前准备 ssjf:手术计费 shdj:术后登记 zx:执行 gy:改约 qxzx:取消执行
      if (type === 'sqzb') {
        this.$router.push({
          name: 'details',
          query: {
            id: item.id
          }
        })
      } else if (type === 'ssjf') {
        this.liClick(4)
      } else if (type === 'shdj') {
        this.liClick(5)
      } else if (type === 'zx') {
        let query = {
          id: this.id,
        }
        let res = await this.api.getSurgeryNotification(query)
        res.data.notificationId = this.id
        this.$refs.operationDialog.opens(res.data)
      } else if (type === 'gy') {
        let query = {
          id: item.appointId
        }
        let res = await this.api.getById(query)
        this.patient = res.data
        this.addinspectShow = true
      } else if (type === 'qxzx') {
        let query = {
          id: item.id
        }
        this.$confirm('您确定要取消手术执行吗', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(({ value }) => {
          this.api.cancelExecute(query).then(rs => {
            if (!rs.head.errCode) {
              this.$notify({
                type: 'success',
                title: '成功',
                message: '取消执行成功！'
              })
              this.getCardInfo()
            }
          })
        })
      }
    },
    // 保存文档型表单
    async saveRecord () {
      this.param[this.activeIndex] = this.$refs.saveTemplate.getHtml()
      let query = {
        id: this.$route.query.id,
        riskAssessment: this.param[0],
        safetyCheck: this.param[1],
        materialsCheck: this.param[2],
        operationNote: this.param[3],
      }
      let res = await this.api.saveSurgeryForm(query)
      if (res.head && res.head.errCode === 0) {
        this.$messageTips(this, 'success', '保存成功！')
        this.getCardInfo('mb')
      }
    },
    // 打印文档型表单
    async handlePrint (row) {
      let printConfig = {
        preview: true
      }
      jcpPrintEditor(this, printConfig, this.pageSettings, [{ dom: this.$refs.saveTemplate.getHtml() }], () => {
        this.$messageTips(this, 'success', '打印成功')
      })
    },
    // 成功回调
    success (name) {
      this.getCardInfo(name)
    },
    liClick (index) {
      this.activeIndex = index
      this.isSs = this.activeIndex === 3 && this.cardInfo.surgeryStatus === 1 ? !!false : !!true
      if (index === 4 || index === 5) {
        this.baseInfo = {
          visitNumber: this.cardInfo.visitNumber,
          doctorId: this.cardInfo.anaesthesiaDoctorId,
          patientId: this.cardInfo.patientId,
          patientName: this.cardInfo.patientName,
          providerId: this.cardInfo.applianceProviderId,
          providerName: this.cardInfo.applianceProviderName,
          visitType: this.cardInfo.visitType,
          adviceId: this.cardInfo.adviceId
        }
        this.key = new Date() + ''
        return false
      }
      if (index === 0 && this.cardInfo.riskAssessment) {
        this.schema.element = this.cardInfo.riskAssessment
        return false
      }
      if (index === 1 && this.cardInfo.safetyCheck) {
        this.schema.element = this.cardInfo.safetyCheck
        return false
      }
      if (index === 2 && this.cardInfo.materialsCheck) {
        this.schema.element = this.cardInfo.materialsCheck
        return false
      }
      if (index === 3 && this.cardInfo.operationNote) {
        this.schema.element = this.cardInfo.operationNote
        return false
      }
      this.getTpl(this.schemaId[index])
    },
    // 通过ID初始化文档型表单
    getTpl (schemaId) {
      request(urlMap.medicalRecord.getDocTpl, {
        id: schemaId
      }).then(res => {
        this.isCreate = false
        this.getSurgeryNotification()
        this.schema = res.data.schema
      })
    },
    async getSurgeryNotification () {
      let query = {
        id: this.$route.query.id,
      }
      let res = await this.api.getSurgeryNotification(query)
      this.cardInfo = res.data
      // 回显文档型表单基础数据
      res.data.patient.outpatientNumber = res.data.patient.outpatientNumber ? res.data.patient.outpatientNumber : ''
      res.data.patient.applianceProviderName = res.data.applianceProviderName ? res.data.applianceProviderName : ''
      res.data.patient.SEX = res.data.patient.sex === '1' ? '男' : '女'
      this.$set(this.editorOpts, 'customEchoData', res.data.patient)
      this.isCreate = true
      return res
    }
  }
}
</script>
<style lang="scss" scoped>
.details {
  height: 100%;
  display: flex;
  flex-direction: column;
  .details_body {
    display: flex;
    flex: 1;
    overflow: hidden;
  }
  .details_left {
    width: 380px;
    display: flex;
    height: 100%;
    flex-direction: column;
    padding-left: 10px;
    .details_left_top {
      width: 100%;
    }
    .details_left_bottom {
      width: 100%;
      flex: 1;
      background-color: #ffffff;
      border-radius: 8px;
      .cancel {
        margin-left: 15px;
        font-size: 14px;
        .p1,
        .p2 {
          color: #ff0000;
        }
        .p3 {
          color: #999999;
        }
        .p4 {
          word-break: break-all;
          color: #333333;
          font-weight: 500;
        }
      }
      ul {
        margin: 0;
        padding: 10px 10px 0;
        .clickBg {
          background-color: #eeeeee;
          color: #1c7bef;
        }
        .pointer_events {
          pointer-events: none;
          color: #999999;
        }
        li {
          padding: 15px 11px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          border-radius: 2px;
          span {
            float: right;
          }
        }
      }
    }
  }
  .details_right {
    flex: 1;
    padding: 0 20px;
    .no-data {
      margin-top: 260px;
    }
    /deep/ .ever-table.el-table .icon.ever-table-config {
      margin-top: 2px;
    }
    /deep/ .base {
      height: 95%;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      .editor_content_wrap {
        flex: 1;
        overflow-y: scroll;
      }
    }
    /deep/ .menubar {
      display: none;
    }
    /deep/
      .ever__editor.base
      .editor_content_wrap
      .editor__content
      .ProseMirror {
      max-height: 80%;
    }
  }
}
</style>
