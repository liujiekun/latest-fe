<template>
  <div class="right-tree-container">
    <div class="right-tree-box">
      <el-tree :default-expand-all="true" ref="" node-key="id" :data="treedata" :props="defaultProps" @node-click="handleNodeClick">
        <div v-if="treedata.length > 0" :class="{'custom-tree-node': true, 'tree-checked': data.id === nowCheckNode.id}" slot-scope="{ node, data }">
          {{data.label}}
        </div>
      </el-tree>
    </div>
    <div v-if="nowCheckNode" class="tree-detail">
      <div class="btn-box">
        <el-button size="medium" @click="showHistory">历史对比</el-button>
        <btn-popper :reportData="lineData"></btn-popper>
      </div>
      <div class="tree-detail-inner">
        <!--        <iframe v-show="showPdf" src="http://file.dakawengu.com/file/2018-05-29/20180527-tianfeng.pdf" frameborder="0"></iframe>-->
        <template v-if="nowCheckNode.result.resultReportSource === '2' && nowCheckNode.result.pdfReportUrl">
          <template v-for="(item, index) in JSON.parse(nowCheckNode.result.pdfReportUrl)">
            <pdfShow :url="$ever.fileUrl + $ever.filePath + item.fileId" ></pdfShow>
          </template>
        </template>
        <template v-if="nowCheckNode.result.resultReportSource !== '2'">
          <report :reportData="nowCheckNode"/>
        </template>
      </div>
    </div>
    <el-dialog
      title=""
      :visible.sync="dialogVisible"
      v-if="dialogVisible"
      >
      <div class="history-box">
        <div class="history-test-box">
          <div class="test-title">检验</div>
          <ul>
            <li :class="{'checked': item.inspectionResultDetailId === currentChart.inspectionResultDetailId}" v-for="(item, index) in nowCheckNode.result.details" :key="item.inspectionItemId + index" @click="getChartData(item, 'change')">
              {{item.inspectionItemNameAbbr}}
            </li>
          </ul>
        </div>
        <div class="history-chat-box">
          <div class="chat-title">{{nowCheckNode.inspectionServiceName}}</div>
          <div class="chat-checkbox">
            <el-checkbox-group v-model="checkList" @change="changeCheckbox">
              <el-checkbox v-for="(item, index) in checkListOptions" :label="item.value" :key="item.value"></el-checkbox>
            </el-checkbox-group>
          </div>
          <div class="chat-box" ref="testChart" id="testChart" style="width: 600px;height:400px;">

          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import echarts from 'echarts'
import btnPopper from './components/btnpopper'
import report from './components/report'
import pdfShow from '@/phr/component/pdf-show'
import {request} from '@/util/req'
import urls from '@/phr/api/urls'
export default {
  data () {
    return {
      lineData: { doctorAdvice: {}, report: {} }, // 示踪对象
      chatOptionObj: [],
      currentChart: {},
      reportItemList: [{id: 1, name: '白细胞(WBC)'}, {id: 2, name: '平均红细胞血红蛋白浓度(MCHC)'}],
      checkList: [],
      checkListOptions: [],
      dialogVisible: false,
      showPdf: false,
      reportData: {},
      nowCheckNode: null,
      treedata: [
      ],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      chartOption: {
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        // toolbox: {
        //   feature: {
        //     saveAsImage: {}
        //   }
        // },
      }
    }
  },
  mounted () {

  },
  created () {
    this.getTree()
  },
  methods: {
    /**
     * 获取左侧树列表
     */
    getTree () {
      request(urls.testList, {
        visitSerialTypeCode: this.$route.query.visitSerialTypeCode,
        visitSerialNumber: this.$route.query.visitSerialNumber,
        patientId: this.$route.query.patientId, // '3eo8Hu6CfRj0p95fFry',
        outpatientSerialNumber: this.$route.query.outpatientSerialNumber, // 'QZZIH20200212310' ,
        hospitalizedNumber: this.$route.query.hospitalizedNumber,
      }).then((res) => {
        console.log(res)
        // if (res.head.errCode === 0) {
        let resdata = res.data
        let templateTree = []

        resdata.forEach((item, index) => {
          let tempparent = {
            id: item.inspectionTime,
            label: this.$moment(item.inspectionTime).format('YYYY-MM-DD'),
            ...(item),
            children: []
          }
          item.inspections.forEach((ritem, rindex) => {
            tempparent.children.push({
              id: ritem.patientInspectionId,
              label: ritem.inspectionServiceName,
              ...(ritem)
            })
          })
          templateTree.push(tempparent)
        })
        this.treedata = templateTree
        if (templateTree[0] && templateTree[0].children.length > 0) {
          this.nowCheckNode = templateTree[0].children[0]
          this.getLine()
        }
        // }
      })
    },
    /**
     * 折线图 多选框日期 被改变时候 进行数据筛选
     */
    changeCheckbox () {
      console.log(this.checkList)
      this.filterChartOption(this.chatOptionObj, this.checkList)
    },
    /**
     * 点击 历史数据按钮 时
     */
    showHistory () {
      this.dialogVisible = true
      setTimeout(() => {
        this.initDialogChart()
      })
    },
    /**
     * 初始化折线图 弹出框 数据
     */
    initDialogChart () {
      this.chart = echarts.init(this.$refs.testChart)
      this.chart.setOption(this.chartOption)
      if (this.nowCheckNode.result.details.length > 0) {
        this.getChartData(this.nowCheckNode.result.details[0])
      }
    },
    /**
     * 格式化 折线图 数据
     * @param data
     * @returns {{xAxis: [], series: [], checkList: [], checkListOptions: [], chatOptionObj: []}}
     */
    getChartOption (data) {
      let tempOption = {xAxis: [], series: [], checkListOptions: [], checkList: [], chatOptionObj: []}
      data.hisDataList.forEach((item, index) => {
        tempOption.checkListOptions.push({
          value: item.resultDate,
          label: item.resultDate
        })
        tempOption.checkList.push(item.resultDate)
        item.details.forEach((ditem, dindex) => {
          tempOption.xAxis.push(item.resultDate)
          tempOption.series.push(parseInt(ditem.inspectionQuantityValue))
          tempOption.chatOptionObj.push({
            date: item.resultDate,
            value: parseInt(ditem.inspectionQuantityValue)
          })
        })
      })
      return tempOption
    },
    /**
     * 通过 日期checkbox 过滤数据
     * @param chatOptionObj
     * @param checkList
     */
    filterChartOption (chatOptionObj, checkList) {
      let optionsData = { xAxis: [], series: [] }
      chatOptionObj.forEach((item, index) => {
        if (checkList.includes(item.date)) {
          optionsData.xAxis.push(item.date)
          optionsData.series.push(item.value)
        }
      })
      this.setChartOption(optionsData.xAxis, optionsData.series)
    },
    /**
     * 获取折线图数据
     * @param item
     * @param type
     */
    getChartData (item, type = 'init') {
      console.log(item)
      this.currentChart = item
      request(urls.hisList, {
        resultDetailId: item.inspectionResultDetailId, // '45e02b72-a8d6-41e1-b754-8da69335e7bf4'
        limit: 10
      }).then((res) => {
        console.log(res)
        // if (res.head.errCode === 0) {
        let optionsData = this.getChartOption(res.data)
        if (type === 'init') {
          this.checkListOptions = optionsData.checkListOptions
          this.checkList = optionsData.checkList
        }
        this.chatOptionObj = optionsData.chatOptionObj
        this.filterChartOption(optionsData.chatOptionObj, this.checkList)
        // }
      })
    },
    /**
     * 设置折线图数据
     * @param xAxis
     * @param series
     */
    setChartOption (xAxis, series) {
      this.chart.setOption({
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: xAxis
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            type: 'line',
            stack: '总量',
            data: series
          }
        ]
      })
    },
    togglePdf () {
      this.showPdf = !this.showPdf
    },
    /**
     * 左侧树节点被点击选择时
     * @param data
     * @param node
     */
    handleNodeClick (data, node) {
      console.log(data, node)
      if (node.isLeaf) {
        this.nowCheckNode = data
        this.getLine()
      }
    },
    /**
     * 获取示踪数据
     */
    getLine () {
      request(urls.lineList, {
        patientInspectionId: this.nowCheckNode.patientInspectionId
      }, 'get').then((res) => {
        this.lineData = res.data
        if (res.head.errCode === 0) {

        }
      })
    }
  },
  components: {
    btnPopper,
    report,
    pdfShow
  }
}
</script>

<style lang="less" scoped>
  .right-tree-container /deep/ .el-dialog{
    width: 900px;
  }
  .history-box{
    display: flex;
    width: 100%;
    .history-test-box{
      overflow: auto;
      height: 500px;
      width: 240px;
      flex-shrink: 0;
      border-right: solid 1px #F1F2F5;
      .test-title{
        font-size: 16px;
      }
      ul{
        padding: 0;
        li{
          line-height: 25px;
          cursor:pointer;
          &:hover{
            color: #4484C9;
          }
          &.checked{
            color: #4484C9;
          }
        }
      }
    }
    .history-chat-box{
      height: 500px;
      flex: 1;
      padding: 0 10px;
      .chat-title{
        font-size: 18px;
        margin-bottom: 10px;
        .chat-checkbox{
          margin-bottom: 10px;
        }
      }
    }
  }
  .btn-box {
    min-width: 836px;
    max-width: 1400px;
    margin: 0 auto 10px;
    text-align: right;
    button {
      margin-left: 10px;
    }
  }
  .tree-detail{
    padding: 15px 15px 0 25px;
    height: 100%;
    flex: 1;
    box-sizing: border-box;
    overflow: auto;
    .tree-detail-inner{
      min-width: 836px;
      max-width: 1400px;
      background: #fff;
      min-height: calc(~'100% - 43px');
      margin: 0 auto;
      position: relative;
    }
  }
  .tree-detail-inner{
    iframe{
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
    }
  }
</style>
