<template>
  <div>
    <ever-bread-crumb
      style="margin-top: -10px"
      :name="'返回'"
      show-edit-fnt="false"
      :have-return="true"
      v-if="back"
    ></ever-bread-crumb>
    <div class="layout">
      <el-row>
        <el-col>
          <h2 class="title">审批详情</h2>
        </el-col>
        <el-col :span="6" class="overtext line">
          <span class="label">审批单名称：</span>
          <span class="content">病历修改</span>
        </el-col>
        <el-col :span="6" class="overtext line">
          <span class="label">发起人：</span>
          <span class="content">{{name}}</span>
        </el-col>
        <el-col :span="6" class="overtext line">
          <span class="label">发起时间：</span>
          <span class="content">{{time}}</span>
        </el-col>
        <el-col :span="6" class="overtext line">
          <el-button size="small" type="primary" @click="contrastBox = true">查看详情</el-button>
        </el-col>
        <el-col :span="6" class="overtext line">
          <span class="label">备注：</span>
          <span class="content">{{remarkmsg}}</span>
        </el-col>
      </el-row>
      <time-line
        :remark-flag="true"
        v-if="haveLogs"
        :disabled="disabled"
        :data="logs"
        @agree="agree"
        @disagree="disagree"
        @remark="remark"
        disagreetext="不同意"
      ></time-line>
    </div>
    <el-dialog
      title="评论"
      :close-on-click-modal="false"
      :visible.sync="remarkBox"
      @close="textarea = ''"
    >
      <el-input
        placeholder="请输入评论(最多100字)"
        v-model.trim="textarea"
        :autosize="{ minRows: 4, maxRows: 6 }"
        type="textarea"
      ></el-input>
      <div class="box">
        <el-button type="primary" @click="submitRemark">确定</el-button>
        <el-button @click="remarkBox = false">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog
      class="history-compare"
      :close-on-click-modal="false"
      :visible.sync="contrastBox"
      width="50%"
      v-if="contrastBox"
    >
      <template slot="title">
        <patient-header
          :code="`THC_PATIENT_HEAD_001`"
          :patient-id="patientId"
          :dpt-id="dptId"
          :visit-number="visitId"
        ></patient-header>
      </template>
      <el-row>
        <el-col :span="12" class="borderbox noleftborder" style="padding: 0px">
          <h-select
            info="更改前"
            :is-doc="isDoc"
            :id="firstId"
            :schema-id="schemaId"
            :show-select="false"
          ></h-select>
        </el-col>
        <el-col :span="12" class="borderbox" style="padding: 0px">
          <h-select
            info="更改后"
            :is-doc="isDoc"
            :id="secondId"
            :schema-id="schemaId"
            :show-select="false"
          ></h-select>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
import timeLine from '@/warehouse/page/components/procurement/approval'
import hSelect from '@/workspace/page/outpatient/historyoption'
import patientHeader from '@/inpatient/components/common.head.js'
import { debounce } from '@/util/common'
import phrapi from '@/form/store/phrapi'

export default {
  data () {
    return {
      schemaId: '',
      isDoc: false,
      contrastBox: false,
      logs: [],
      dialogVisible: false,
      radio: '1',
      reason: '',
      rowData: {},
      queryObj: {},
      secondId: '',
      firstId: '',
      patientId: '',
      dptId: '',
      visitId: '',
      disabled: true,
      textarea: '',
      remarkBox: false,
      back: true,
      name: '',
      time: '',
      remarkmsg: ''
    }
  },
  computed: {
    haveLogs () {
      return this.logs.length !== 0
    }
  },
  watch: {
    textarea (val) {
      this.textarea = this.textarea.substr(0, 100)
    }
  },
  created () {
    this.init()
    const user = this.$store.state.currentUser
    this.operateName = user.name
    this.operateId = user.userId
  },
  methods: {
    async init (flag = true) {
      this.id = this.queryStr('id')
      this.back = Number(this.queryStr('back')) === 1
      const info = await phrapi.getProcessInfo({id: this.id})
      this.firstId = info.formDataId
      this.secondId = info.processFormDataId
      this.schemaId = info.formTemplateId
      this.patientId = info.patientId
      this.dptId = info.dptId
      this.visitId = info.visitId
      this.isDoc = info.designerId !== '1'
      this.disabled = info.processStatus !== '0'
      this.name = info.createName
      this.time = info.createTime
      this.remarkmsg = info.processRemark ? info.processRemark : '无'
      if (flag) { // 首次渲染调
        this.getProcess()
      }
    },
    async getProcess () {
      const result = await phrapi.queryProcessHistory({
        id: this.id
      })
      this.logs = result
      this.logs.forEach((item) => {
        this.taskId = item.taskId ? item.taskId : this.taskId
      })
      this.init(false)
    },
    queryStr (val) {
      return this.$route.query[val]
    },
    agree: debounce(function (val) {
      let params = {
        processData: {
          taskId: this.taskId,
        },
        taskVariables: {
          suggestion: val,
          operateName: this.operateName,
          operateId: this.operateId,
          audit: 1
        },
        businessData: {
          id: this.id,
          audit: 1
        }
      }
      phrapi.finish(params).then(res => {
        // this.$router.push({ name: 'case_approvallist' })
        this.getProcess()
      })
    }),
    disagree (val) {
      let params = {
        processData: {
          taskId: this.taskId,
          actDefinitionKey: 'firstUserTask'
        },
        taskVariables: {
          operateName: this.operateName,
          operateId: this.operateId,
          suggestion: val,
          audit: 0
        },
        businessData: {
          id: this.id,
          audit: 0
        }
      }
      phrapi.finish(params).then(res => {
        // this.$router.push({ name: 'case_approvallist' })
        this.getProcess()
      })
    },
    remark () {
      this.remarkBox = true
    },
    submitRemark () {
      phrapi
        .addProcessData({
          medicalRecordProcessId: this.id,
          taskCode: this.taskId,
          processShowData: this.textarea
        })
        .then(res => {
          this.remarkBox = false
          this.$messageTips(this, 'success', '评论成功')
          this.getProcess()
        })
    }
  },
  components: {
    timeLine,
    hSelect,
    patientHeader
  }
}
</script>
<style lang="scss" scoped>
.title {
  border-left: 3px solid #1c7bef;
  padding-left: 15px;
  text-align: left;
  margin: 0;
  margin-bottom: 15px;
  font-size: 16px;
}
.label {
  display: inline-block;
  width: 70px;
  height: 14px;
  font-size: 14px;
  text-align: right;
  color: #999999;
  margin-right: 5px;
}
.content {
  display: inline-block;
  font-size: 14px;
  color: #333333;
}
.layout {
  min-height: 880px;
  background-color: white;
  padding: 10px 0px 10px 10px;
}
/deep/ .history-compare {
  /deep/ .el-dialog {
    min-width: 1200px;
  }
  /deep/ .el-dialog__header {
    padding: 20px;
    padding-bottom: 0px;
  }
}
.noleftborder {
  border-right: 0px solid #cccccc;
}
.borderbox {
  border: 1px solid #cccccc;
}
.noleftborder {
  border-right: 0px solid #cccccc;
}
.box {
  margin-top: 10px;
}
</style>
