<template>
  <div class="treat_edit">
    <el-dialog 
      :title="item.serviceName" 
      :visible.sync="dialogFormVisible" 
      width='800'  
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
    <reportCardpdf ref='reportcardpdf' v-show='li.resultReportSource != 1'  :key='executeResult.id'></reportCardpdf>
    <div  v-show='li.resultReportSource == 1' class="clearfix">
      <reportCard800 v-if='serviceType == "800"' :report="li.executeResult"></reportCard800>
      <reportCard801 v-if="serviceType == '801'" :report="li.executeResult"></reportCard801>
    </div>
    <div class="interpretation">
      <div class="title">医生解读</div>
      <div class="teaxtarea">
        <el-input
          type="textarea"
           :maxlength='200'
          :autosize="{ minRows: 3}"
          placeholder="医生解读"
          v-model="interpretationOfContent">
        </el-input>
      </div>
      <div class="clearfix bottom">
          <el-checkbox v-model="isAuditor">审核</el-checkbox>
         <el-button type="primary" class="btn" @click='submit'  :disabled='interpretationOfContent == ""'>提交</el-button>
      </div>
      <div v-for='item in list' :key='item.id' class="list">
        <p>{{item.createTime | formatDateByExp('YYYY-MM-DD HH:mm:ss')}}</p>
        <el-row style="lineHeight:33px">
          <el-col :span='21' style="textAlign: right;" class="col21"> 
            <div class="leftname">
              {{item.interpreterName}}
              <el-tag size="mini">{{item.interpreterRole}}</el-tag>
              <el-tag size="mini" type="success" v-if='item.isAuditor == 1'>审核</el-tag>：
            </div>
            <el-input
              type="textarea"
              class="textarea_edit"
              :disabled="!item.edit"
              :class="item.edit ? 'active' :''"
              resize='none'
              :maxlength='200'
              :autosize="{ minRows: 1}"
              placeholder="请输入内容"
              v-model="item.interpretationOfContent">
            </el-input>
              <!-- @focus="item.edit = true"
              @blur="blur(item)" -->
          </el-col>
          <el-col :span='3' class="rightbtn" >  
              <i class="iconfont icon-zhuyuan-yizhu-yizhix" :class="item.interpretationOfContent == '' ? 'dis' :''"  v-if='item.edit' @click='modify(item)'>提交</i>
              <i class="iconfont icon-bianji" v-if='!item.edit' @click='item.edit = true'>编辑</i>
              <el-popover
                trigger="manual"
                placement="left"
                v-model="item.visible"
                width="160">
                <p>确认要删除解读吗？</p>
                <div style="text-align: right; margin: 0">
                  <el-button size="mini" type="text" @click="item.visible = false">取消</el-button>
                  <el-button type="primary" size="mini" @click="drop(item)">确定</el-button>
                </div>
                <span slot="reference" @click='item.visible = true' ><i class="iconfont icon-delete"></i>删除</span>
              </el-popover>

          </el-col>
        </el-row>
      </div>
    </div>
</el-dialog>
  </div>
</template>
<script>
import api from '@/infusion/store/infusion.js'
import reportCard800 from '@/workspace/components/report.card.800.vue'
import reportCard801 from '@/workspace/components/report.card.801.vue'
import reportCardpdf from '@/workspace/components/report.card.pdf.vue'
// import {isJsonStr} from '@/util/common'
export default {
  components: {
    reportCard800,
    reportCard801,
    reportCardpdf
  },
  props: [],
  data () {
    return {
      api,
      interpretationOfContent: '',
      dialogFormVisible: false,
      isAuditor: false,
      list: [],
      item: {},
      li: {},
      executeResult: {},
      activeName: 'first',
      serviceType: ''
    }
  },
  mounted () {
    this.serviceType = String(this.$route.params.serviceType || this.$route.query.adviceType)
  },
  methods: {
    open (item, li) {
      this.dialogFormVisible = true
      this.item = item
      this.li = li
      if (li.resultReportSource !== '1') {
        this.$nextTick(() => {
          this.$refs.reportcardpdf.open(item, li)
        })
      }
      li.createTime = this.$moment(li.createTime).format('YYYY-MM-DD HH:mm')
      this.init()
    },
    blur (item) {
      setTimeout(() => {
        item.interpretationOfContent = item.oldinterpretationOfContent
        item.edit = false
      }, 200)
    },
    async modify (item) {
      if (!item.interpretationOfContent) return
      item.oldinterpretationOfContent = item.interpretationOfContent
      let res = await this.api.createInterpretation({
        adviceId: this.item.id,
        executeId: this.li.id,
        executeResultId: this.li.executeResult.id,
        id: item.id,
        interpretationOfContent: item.interpretationOfContent,
      }).catch(_ => {
        this.init()
      })
      if (res && res.head && res.head.errCode === 0) {
        this.$notify({
          title: '成功',
          message: '修改解读成功',
          type: 'success'
        })
        this.init()
      }
    },
    async drop (item) {
      item.visible = false
      let res = await this.api.delInterpretation({
        id: item.id
      })
      if (res && res.head && res.head.errCode === 0) {
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success'
        })
        this.init()
      }
    },
    async init () {
      this.interpretationOfContent = ''
      this.isAuditor = false
      let res = await this.api.getInterpretation({
        executeId: this.li.id
      })
      var list = res.data || []
      list.forEach(element => {
        element.visible = false
        element.oldinterpretationOfContent = element.interpretationOfContent
        element.edit = false
      })
      this.list = list
      if (this.item.isThirdAdvice !== 1) {
        this.$refs.reportcardpdf.open(this.item, this.li)
      }
    },
    async submit () {
      let res = await this.api.createInterpretation({
        adviceId: this.item.id,
        executeId: this.li.id,
        executeResultId: this.li.executeResult.id,
        interpretationOfContent: this.interpretationOfContent,
        isAuditor: this.isAuditor ? '1' : '0', // 0-否 1-是
      }).catch(_ => {
        this.init()
      })
      if (res && res.head && res.head.errCode === 0) {
        this.$notify({
          title: '成功',
          message: '解读成功',
          type: 'success'
        })
        this.init()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.treat_edit{
  /deep/ .el-dialog{
    max-height: 600px;
    width: 800px;
    overflow: auto;
  }
  .interpretation{
    padding-top:20px;
    .title{
      border-left: 2px solid #1C7BEF;
      color:#1C7BEF;
      padding-left: 5px;
      margin-bottom: 5px;
    }
    .teaxtarea{
      margin-bottom: 10px;
    }
    .bottom{
      line-height: 30px;
      padding-bottom: 8px;
      .btn{
        border-radius: 5px;
        padding-left: 20px;
        padding-right: 20px;
        float: right;
      }

    }
    .list{
      border-top:1px solid #e6e6e6;
      padding-bottom: 10px;
      .col21{
        display: flex;
        .textarea_edit{
          flex: 1;
        }
      }
      p {
        font-size: 12px;
        color: #999999;
        line-height: 12px;
      }
      .rightbtn{
        font-size: 12px;
        color: #666666;
        cursor: pointer;
        text-align: right;
        i{
          font-size: 10px;
        }
        .dis{
          color: #ccc;
        }
      }
      .textarea_edit{
        float: left;
        /deep/ textarea{
          border: 1px solid #fff;
        }
      }
      /deep/ .el-textarea.is-disabled .el-textarea__inner{
        background-color: #ffffff;
        color: #000;
        cursor: auto;
      }
      .active{
         /deep/ textarea{
          border: 1px solid #bbb;
        }
      }
    }
  }
}
</style>

