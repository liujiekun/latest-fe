<template>
  <div id="lcpath">
    <div class="left">
      <div class="path-header">
        <div
          class="title"
          @click="right = 1"
        >{{pathwayData.pathwayInstance && pathwayData.pathwayInstance.pathwayName || '----'}}</div>
        <div
          v-for="item in pathwayData.stageInstanceList"
          :key="item.id"
          class="stage"
          @click="stageClick(item)"
          :class="stageClass(item)"
        >
          {{item.stageName}}
          <!-- <i class="icon iconfont icon-kaishi1" style="color:#1c7bef"></i> -->
          <i
            class="icon iconfont icon-zhuyuan-yizhu-daizhi"
            style="color:#1c7bef"
            v-if="item.id !== curExcuteStageId && item.showHandle"
          ></i>
        </div>
        <div class="title" @click="right = 2" style="cursor:pointer;">变异信息</div>
      </div>
      <div class="bottom" v-if="type == 'ys'">
        <el-button-group>
          <el-button
            type="text"
            class="path-op-btn"
            icon="icon iconfont icon-exit"
            @click="exitPathway"
          >退出路径</el-button>
          <el-button type="text" class="path-op-btn" @click="next">
            下一阶段
            <i class="icon iconfont icon-next"></i>
          </el-button>
        </el-button-group>
      </div>
    </div>
    <div class="right" :class="right == 2 ? 'padding' : ''">
      <!-- 临床路径 -->
      <template v-if="right == 1 && stageId">
        <el-tabs v-model="activeName" class="path-tabs">
          <el-tab-pane label="主要医嘱" name="yz" v-if="type == 'ys'"></el-tab-pane>
          <el-tab-pane label="诊疗工作" name="zl" v-if="type == 'ys'"></el-tab-pane>
          <el-tab-pane label="护理工作" name="hl"></el-tab-pane>
        </el-tabs>
        <huandzl
          ref="huandzl"
          :id="stageId"
          :status="status"
          :key="stageId"
          :type="activeName"
          :jueType="type"
          v-if="(activeName == 'zl' || activeName == 'hl') && stageId"
        ></huandzl>
        <div class="padd" v-if="activeName == 'yz'" :key="stageId">
          <!-- 主要医嘱-->
          <treatment
            ref="treatment"
            :type="'path'"
            :stage-id="stageId"
            @success="YZBY"
            @operation="getOperation"
            :is-send-advice="status == '10' && stageId === curExcuteStageId"
            :history-stage="stageId !== curExcuteStageId"
          ></treatment>
        </div>
      </template>
      <ever-no-data v-if="right == 1 && !stageId" tipTxt="暂无记录"></ever-no-data>
      <variationtable ref="variationtable" v-if="right == 2"></variationtable>
    </div>
    <variation ref="variation" :key="key" @success="BYsuccess"></variation>
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
      <span>当前已经是路径的最后阶段了，确定是否完成路径？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="finishPathway">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import variation from '@/inpatient/components/path/variation.vue' // 临床路径变异
import treatment from '@/inpatient/page/open'
import api from '@/inpatient/store/resident.js'
import huandzl from '@/inpatient/components/path/huandzl.vue'
import variationtable from '@/inpatient/components/path/variation.table.vue'
import { setTimeout } from 'timers'
export default {
  data () {
    return {
      api,
      activeName: '',
      type: '',
      key: 0,
      adviceType: '',
      visitType: '',
      stageId: '',
      waitSendData: '',
      callbackData: '',
      baseInfo: {},
      right: 1,
      pathwayData: {},
      adviceIds: [],
      status: '', // 阶段的状态
      curExcuteStageId: '',
      dialogVisible: false,
      nextVariationArr: []
    }
  },
  components: {
    treatment,
    huandzl,
    variationtable,
    variation
  },
  mounted () {
    this.init()
  },
  methods: {
    async BYsuccess (type) {
      if (String(type) === '50') {
        let res = await this.api.exitPathway({
          id: this.pathwayData.pathwayInstance.id
        })
        if (res.head && res.head.errCode === 0) {
          // this.$notify({
          //   title: '退出成功',
          //   type: 'success',
          //   message: res.head && res.head.errMsg
          // })
          this.$messageTips(this, 'success', '退出成功', '提示')
          setTimeout(_ => {
            this.$bus.$emit('patient_mgt_shua')
          }, 500)
        }
      } else if (String(type) === '20') { // 每条医嘱一个弹窗
        if (this.adviceIds.length === 0) {
          this.init()
          this.$bus.$emit('variate_submit')
          this.$bus.$emit('patient_mgt_shua')
        } else {
          this.YZBY(this.adviceIds)
        }
      } if (['10', '30', '40'].indexOf(String(type)) > -1) {
        if (this.nextVariationArr.length === 0) {
          setTimeout(_ => {
            this.$bus.$emit('patient_mgt_shua')
          }, 500)
        } else {
          this.nextVariation(this.nextVariationArr)
        }
      } else {
        this.$bus.$emit('patient_mgt_shua')
      }
    },
    getOperation (flag) {
      let n = -1
      this.pathwayData.stageInstanceList.forEach((item, index) => {
        if (item.id === this.stageId) {
          item.showHandle = flag
          n = index
        }
      })
      this.$set(this.pathwayData.stageInstanceList, n, this.pathwayData.stageInstanceList[n])
    },
    stageClass (stage) {
      if (String(stage.status) === '0') return 'off'
      if (String(stage.status) === '10') return 'on'
      if (this.stageId === stage.id) return 'active'
    },
    stageClick (item) {
      if (!item.status) return
      this.status = item.status
      if (String(item.status) === '0') {
        this.stageId = ''
        this.status = ''
        return// 有哪些状态不能点击
      }
      this.right = 1
      this.stageId = item.id
    },
    async init () {
      let res = await this.api.getPathwayStageInstanceInfo({
        hospitalizedNumber: this.$route.query.hospitalizedNumber
      })
        .catch(_ => { // 有异常跳出本页面，主要针对退出路径和完成路径
          if (this.$route.path === '/resident/patientmgt/path') {
            this.$router.push({
              path: '/resident/patientmgt/open',
              query: this.$route.query
            })
          }
        })
      if (res && res.data && res.data.stageInstanceList && res.data.stageInstanceList.length) {
        this.pathwayData = res.data
        res.data.stageInstanceList.forEach(item => {
          item.showHandle = false
          if (String(item.status) === '10') {
            this.curExcuteStageId = item.id
            this.stageClick(item)
          }
        })
      }
    },
    BY () {
      let obj = {
        pathwayInstanceId: this.pathwayData.pathwayInstance.id,
        pathName: this.pathwayData.pathwayInstance.pathwayName,
        hospitalizedNumber: this.$route.query.hospitalizedNumber
      }
      this.pathwayData.stageInstanceList.forEach(val => {
        if (String(val.status) === '10') {
          obj.stageInstanceName = val.stageName
          obj.stageInstanceId = val.stageId
        }
      })
      return obj
    },
    async finishPathway () {
      let res = await this.api.finishPathway({
        id: this.pathwayData.pathwayInstance.id
      })
      if (res.head && res.head.errCode === 0) {
        this.$messageTips(this, 'success', '路径完成', '提示')
        this.$bus.$emit('patient_mgt_shua')
      }
    },
    nextVariation (arr) {
      this.nextVariationArr = arr
      console.log(arr)
      if (arr[0].laststage) { // 最后一个路径，需要退出
        this.dialogVisible = true
      } else {
        let obj = this.BY()
        obj.type = arr[0].code
        obj.typeName = arr[0].aberrancename
        obj.pathName = arr[0].projectname
        this.variationOpen(obj)
      }
      this.nextVariationArr.shift()
    },
    async next () {
      let stageId, id
      this.pathwayData.stageInstanceList.forEach(val => {
        if (String(val.status) === '10') {
          stageId = val.stageId
          id = val.id
        }
      })
      if (!stageId || !id) {
        this.dialogVisible = true
        return
      }
      let res = await this.api.updateStatusAndNext({
        stageId: stageId,
        id: id, //
        hospitalizedNumber: this.$route.query.hospitalizedNumber,
        pathwayId: this.pathwayData.pathwayInstance.pathwayId,
        pathwayInstanceId: this.pathwayData.pathwayInstance.id
      })
      if (res.head && res.head.errCode === 0) {
        if (res.data && res.data.length) {
          this.nextVariation(res.data)
        } else {
          this.$messageTips(this, 'success', '执行成功', '提示')
          this.init()
        }
      }
    },
    variationOpen (obj) {
      this.key++
      setTimeout(_ => {
        this.$refs.variation.open(obj)
      })
    },
    YZBY (adviceIds) { // 医嘱变异
      this.adviceIds = adviceIds
      if (!this.adviceIds.length) return
      let obj = this.BY()
      obj.type = 20
      obj.typeName = '新增路径外项目'
      obj.pathName = this.adviceIds[0].adviceName
      obj.adviceId = this.adviceIds[0].adviceId
      this.adviceIds.shift()
      this.variationOpen(obj)
    },
    exitPathway () {
      let obj = this.BY()
      obj.type = 50
      obj.typeName = '路径退出'
      // adviceId: '1'
      this.variationOpen(obj)
    }
  },
  watch: {
    'activeName': {
      handler (val) {
        if (val === 'hl' || val === 'zl') {
          setTimeout(_ => {
            this.$refs.huandzl.init()
          })
        }
      },
      immediate: true
    },
    'right': {
      handler (val) {
        val === 1 ? this.activeName = 'yz' : setTimeout(_ => {
          this.$refs.variationtable.init()
        })
      },
      immediate: true
    },
    '$route.path': {
      handler (val) {
        if (val.indexOf('resident') > -1) {
          this.type = 'ys' // 医生
          this.activeName = 'yz'
        } else if (val.indexOf('inpatient') > -1) {
          this.type = 'hs'
          this.activeName = 'hl'
        }
      },
      immediate: true
    }
  }
}
</script>
<style lang="scss">
#lcpath {
  background: #fff;
  display: flex;
  flex-direction: row;
  .title {
    line-height: 40px;
    color: #000;
    font-size: 14px;
    background: #eeeeee;
    font-weight: bold;
    padding-left: 15px;
  }
  .stage {
    line-height: 45px;
    cursor: pointer;
    padding-left: 15px;
    font-size: 14px;
    &:hover {
      background-color: #dbe8f8;
    }
  }
  .left {
    display: flex;
    flex-direction: column;
    width: 200px;
    background: #fff;
    .off {
      color: #999999;
    }
    .on {
      color: #1c7bef;
    }
    .active {
      color: #f60;
    }
    .path-header {
      flex: 1;
    }
    .bottom {
      width: 100%;
      .el-button-group {
        width: 100%;
        border-top: 1px solid #cacaca;
        .path-op-btn:last-child {
          border-left: 1px solid #cacaca;
        }
      }
      .el-button {
        width: 50%;
        color: #1c7bef;
        font-size: 12px;
      }
      i {
        vertical-align: baseline;
        font-size: 12px;
        margin: 0 2px;
      }
    }
  }
  .right {
    flex: 1;
    height: 100%;
    border-left: 1px solid #ccc;
    overflow-y: scroll;
    .path-tabs {
      .el-tabs__header {
        border-bottom: 1px #ddd solid;
        padding-left: 15px;
        background: #eee;
      }
    }
    .el-table {
      margin-top: 0;
    }
    .padd {
      padding: 0 15px 15px;
      /deep/ .treatment_layout {
        background-color: #fff;
      }
      /deep/ .footarea {
        border-top: 1px #ddd solid;
        border-radius: 0;
      }
    }
  }
  .padding {
    padding: 15px;
  }
}
</style>
