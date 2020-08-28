<template>
  <div class="right-tree-container">
    <div class="right-tree-box">
      <el-tree :default-expand-all="true" ref="" node-key="id" :data="treedata" :props="defaultProps" @node-click="handleNodeClick">
        <div v-if="treedata.length > 0" :class="{'custom-tree-node': true, 'tree-checked': data.id === nowCheckNode.id}" slot-scope="{ node, data }">
          {{data.label}}
        </div>
      </el-tree>
<!--      <div>-->
<!--        <li  @click="handleNodeClick(item)" :class="{'inspect-list-item': true, 'tree-checked': item.id === nowCheckNode}"  v-for="(item, index) in treedata">-->
<!--          {{item.label}}-->
<!--        </li>-->
<!--      </div>-->
    </div>
    <div v-if="nowCheckNode" class="tree-detail">
      <div class="btn-box">
<!--        <el-button size="medium" @click="togglePdf">-->
<!--          <span v-if="!showPdf">PDF报告</span>-->
<!--          <span v-if="showPdf">数据报告</span>-->
<!--        </el-button>-->
        <el-image
          v-if="nowCheckNode.examineResult.imageUrl"
          class="preview-img-btn"
          style=""
          :src="nowCheckNode.examineResult.imageUrl"
          :preview-src-list="[nowCheckNode.examineResult.imageUrl]">
          <div slot="placeholder" class="image-slot">
            <el-button size="medium" @click="showNoImgTip" style="margin-left: 0">影像查看</el-button>
          </div>
          <div slot="error" class="image-slot">
            <el-button size="medium" @click="showNoImgTip" style="margin-left: 0">影像查看</el-button>
          </div>
        </el-image>
        <el-button size="medium" @click="showNoImgTip">影像查看</el-button>
        <btn-box :reportData="nowCheckNode"></btn-box>
      </div>
      <div class="tree-detail-inner">
<!--        <iframe v-show="showPdf" src="http://file.dakawengu.com/file/2018-05-29/20180527-tianfeng.pdf" frameborder="0"></iframe>-->
        <template v-if="nowCheckNode.examineResult.reportSourceResult === '2' && nowCheckNode.examineResult.pdfReportUrl">
          <template v-for="(item, index) in JSON.parse(nowCheckNode.examineResult.pdfReportUrl)">
            <pdfShow :url="$ever.fileUrl + $ever.filePath + item.fileId" ></pdfShow>
          </template>
        </template>
        <template v-if="nowCheckNode.examineResult.reportSourceResult !== '2'">
          <report :reportData="nowCheckNode"/>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import btnBox from './components/btnpopper'
import report from './components/report'
import pdfShow from '@/phr/component/pdf-show'
import {request} from '@/util/req'
import urls from '@/phr/api/urls'
export default {
  data () {
    return {
      showPdf: false,
      reportData: {},
      nowCheckNode: null,
      treedata: [
      ],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  created () {
    this.getTree()
  },
  methods: {
    showNoImgTip () {
      this.$messageTips(this, 'warning', '暂无影像', '提示')
    },
    getTree () {
      request(urls.inspectList, {
        visitSerialTypeCode: this.$route.query.visitSerialTypeCode,
        visitSerialNumber: this.$route.query.visitSerialNumber,
        patientId: this.$route.query.patientId, // '6kVXTS0TJEStcLAGd60 ', // ,
        outpatientSerialNumber: this.$route.query.outpatientSerialNumber, // 'OP201909170000003216' // ,
        hospitalizedNumber: this.$route.query.hospitalizedNumber
      }).then((res) => {
        console.log(res)
        // if (res.head.errCode === 0) {
        let resdata = res.data
        let templateTree = []

        resdata.forEach((item, index) => {
          let tempparent = {
            id: item.date,
            label: this.$moment(item.date).format('YYYY-MM-DD'),
            ...(item),
            children: []
          }
          item.examines.forEach((ritem, rindex) => {
            tempparent.children.push({
              id: ritem.examineUniqueNumber,
              label: ritem.doctorAdviceContent,
              ...(ritem)
            })
          })
          templateTree.push(tempparent)
        })
        this.treedata = templateTree
        if (templateTree[0] && templateTree[0].children.length > 0) {
          this.nowCheckNode = templateTree[0].children[0]
          // this.nowCheckNode.examineResult.imageUrl = $ever.fileUrl + $ever.filePath + 'zGj60nOSQGHzisqKbfA'
        }
        // }
      })
    },
    togglePdf () {
      this.showPdf = !this.showPdf
    },
    handleNodeClick (data, node) {
      if (node.isLeaf) {
        this.nowCheckNode = data
      }
    }
  },
  components: {
    btnBox,
    report,
    pdfShow
  }
}
</script>

<style lang="less" scoped>
  .preview-img-btn{
    position: relative; left: 93px; width:78px; height:32px; top:11px;
    /deep/  .el-image__preview{
        opacity: 0;
      }
    /deep/ .el-image__error{
      opacity: 0;
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
    .btn-box{
      min-width: 836px;
      max-width: 1400px;
      margin: 0 auto 10px;
      text-align: right;
      button{
        margin-left: 10px;
      }
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
  .inspect-list-item{
    height: 26px;
    line-height: 26px;
    margin-left: 15px;
    font-size: 12px;
    cursor: pointer;
    &:hover {
      color: #4484C9;
    }
    &.tree-checked {
      color: #4484C9;
    }
  }
</style>
