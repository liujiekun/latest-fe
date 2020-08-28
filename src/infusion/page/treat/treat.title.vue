<template>
    <el-row class="treat_title">
        <el-col :span='24'>
        <b>{{item.serviceName}}</b>
        <span class="emgency" v-if='Number(item.emergencyFlag) === 1'>加急</span>
          <el-tag class="mr5" size="small" effect="dark" :type="outpatient_status_tag(OUTPATIENT_ADVICE_STATUS[item.status].txt)">{{OUTPATIENT_ADVICE_STATUS[item.status].txt}}</el-tag>
          <el-tag size="small" effect="dark" :type="paid_status_tag(PAY_STATUS[item.payStatus])" v-if='item.payStatus !== null && $route.query.visitType != 3'>{{PAY_STATUS[item.payStatus]}}</el-tag>
          <el-tag size="small" effect="dark" type="success" >{{item.price}}元</el-tag>
          <el-tag size="small" effect="dark" type="success" v-if='item.providerName' >开单科室：{{item.providerName}}</el-tag>
          <el-tag size="small" effect="dark" type="success" v-if='item.doctorName'>开单医生：{{item.doctorName}}</el-tag>
          <!-- <el-tag size="small" effect="dark" type="success" >科室费用总额：{{item.price}}元</el-tag> -->
        </el-col>
        <el-row  class="clearfix" style='width: 100%;minHeight: 40px;'>
          <div v-for='li in showJson'  :key='li.code' style="float:left;paddingRight:25px;"> 
          <template v-if='item[li.code] || item[li.code] === 0'>
            <span  class='table_header'> {{li.name}}</span>
            <span  class='table_body'>
              <template v-if='li.insuranceIdentification'>
                  {{item.insuranceIdentification === 0 ? '自费' :''}}
                  {{item.insuranceIdentification === 1 ? '医保' :''}}
              </template>
              <template v-else-if='li.count'>
                  {{item.complateCount}}/{{item.outpatientExecutes && item.outpatientExecutes.length}}
              </template>
              <template v-else-if='li.totalUseDay'>
                  {{item.useDay}}天
              </template>
              <template v-else>
                  {{item[li.code]}}
              </template>
            </span>
            </template>
          </div>
        </el-row>
        <div class="apppush" v-if='showApp'>
            App推送
            <el-switch
            :disabled="!IsEncounterByTriageId"
            @change='AppPushChange(item)'
            v-model="item.isPushApp">
        </el-switch>
        </div>
    </el-row>
</template>
<script>
import api from '@/infusion/store/infusion.js'
import {PAY_STATUS} from '@/util/otherconfig.js'
export default {
  props: ['item', 'showApp', 'IsEncounterByTriageId'],
  data () {
    return {
      api,
      PAY_STATUS,
      showJson: [
        {
          name: '标本类型',  // 值集
          code: 'specimenTypeName',
          span: 3
        },
        {
          name: '检验指导',  // 文本
          code: 'checkGuidance',
          span: 4
        },
        {
          name: '医保类型',  // 自己解析
          code: 'insuranceIdentification',
          insuranceIdentification: true,
          span: 4
        },
        {
          name: '部位',
          code: 'positionName',
          span: 4
        },
        {
          name: '检查目的', // 文本
          code: 'examineTarget',
          span: 4
        },
        {
          name: '简要病史', // 文本
          code: 'illHis',
          span: 4
        },
        {
          name: '频次', // 文本
          code: 'useFreqName',
          span: 4
        },
        {
          name: '天数', // 文本
          code: 'useDay',
          totalUseDay: true,
          span: 4
        },
        {
          name: '执行次数', // 文本
          count: true,
          code: 'count',
          span: 4
        },
        {
          name: '嘱托', // 文本
          code: 'entrust',
          span: 6
        }
      ],
      OUTPATIENT_ADVICE_STATUS: {
        '0': { col: '#1C7BEF', txt: '开立' },
        '1': { col: '#1C7BEF', txt: '已提交' },
        '2': { col: '#EE4433', txt: '已驳回' },
        '3': { col: '#FF9C00', txt: '未出库' },
        '4': { col: '#1C7BEF', txt: '待执行' },
        '5': { col: '#5CBC2C', txt: '已完成' },
        '6': { col: '#666', txt: '已停止' },
        '7': { col: '#666', txt: '已撤回' },
        '8': { col: '#1C7BEF', txt: '有报告' },
        '9': { col: '#1C7BEF', txt: '报告未出' },
        '10': { col: '#1C7BEF', txt: '报告中' },
        '11': { col: '#666', txt: '已作废' },
        '12': { col: '#FF9C00', txt: '待停止' },
  // '20': { col: '#5CBC2C', txt: '已打印' },
        '30': { col: '#5CBC2C', txt: '报告中' },    // lis 检验 已采集 状态 显示为报告中
        '35': { col: '#5CBC2C', txt: '报告中' },    // lis 检验 已配送 状态 显示为报告中
        '40': { col: '#5CBC2C', txt: '报告中' },    // lis 检验 已打印 状态 显示为报告中
        '45': { col: '#5CBC2C', txt: '报告中' },    // lis 检验 已签收 状态 显示为报告中
        '50': { col: '#1C7BEF', txt: '报告中' },    // lis 检验 检验中（上机） 状态 显示为报告中
        '60': { col: '#5CBC2C', txt: '报告已出' },  // lis pacs 状态，发布报告
        '70': { col: '#EE4433', txt: '处方驳回' },
        '100': { col: '#1C7BEF', txt: '预约' },
        '110': { col: '#5CBC2C', txt: '报告中' },    // pacs 检查的 登记 状态，显示为 报告中
        '120': { col: '#1C7BEF', txt: '报告中' },    // pacs 检查的 检查完成 状态，显示为 报告中
        '130': { col: '#1C7BEF', txt: '报告中' },    // pacs 检查的 初步报告 状态，显示为 报告中
        '140': { col: '#5CBC2C', txt: '审核报告' },
        '150': { col: '#5CBC2C', txt: '退库中' },
        '160': { col: '#5CBC2C', txt: '已退库' },
        '170': { col: '#5CBC2C', txt: '部分退库中' },
        '180': { col: '#5CBC2C', txt: '退库驳回' },
        '190': { col: '#5CBC2C', txt: '已出库' },
        '200': { col: '#5CBC2C', txt: '部分已退库' },
        '210': { col: '#5CBC2C', txt: '已取消' }
      }
    }
  },
  mounted () {
    if (this.$route.query.adviceType !== '802') {
      this.showJson.splice(8, 1)
    }
  },
  methods: {
    outpatient_status_tag (text) {
      if (text === '已提交' || text === '报告中') return 'success'
      // if (text === '报告已出') return 'success'
      return ''
    },
    paid_status_tag (text) {
      if (text === '未支付') return 'danger'
      if (text === '已支付') return 'success'
      return ''
    },
    async AppPushChange () {
      let res = await this.api.updateDoctorAdviceById({
        id: this.item.id,
        isPushApp: this.item.isPushApp ? 1 : 0
      })
      if (res && res.head && res.head.errCode === 0) {
        this.$notify({
          title: '成功',
          message: '操作成功',
          type: 'success'
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
 .treat_title{
    background: #f8f8f8;
    margin-top: 5px;
    line-height: 40px;
    color: #333;
    font-size: 18px;
    padding:5px;
    padding-left: 15px;
    /deep/ .el-tag--dark.el-tag--danger{
      background-color: #ee4433;
      border-color: #ee4433;
    }
    /deep/.el-tag--dark.el-tag--success{
        background-color: #68c899;
        border-color: #68c899;
    } 
    .mr5{
      margin-right: 5px;
    }
    .right_btn{
        text-align: right;
        padding-right: 15px;
    }
    .emgency{
        background: red;
        color: #fff;
        font-size: 12px;
        width: 36px;
        display: inline-block;
        text-align: center;
        height: 24px;
        line-height: 24px;
        border-radius: 4px;
        margin-right: 10px;
    }
    .apppush{
      position: absolute;
      right: 0px;
      top: 5px;
      font-size: 12px;
      color: #666;
      line-height: 20px;
      text-align: center;
      width: 70px;
    }
    .table_header{
      font-size: 12px;
      color: #999;
      line-height: 20px;
      display: block;
    }
    .table_body{
      display: block;
      color: #333;
      font-size: 14px;
      line-height: 25px;
      padding-bottom: 5px;
    }
}
</style>
