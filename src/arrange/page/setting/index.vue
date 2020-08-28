<template>
  <div id="setting" @click="docEvent($event)">
    <search-header
      :show-first-dept="true"
      :init-dept="selectDept"
      @query="query"
      @selectTemplate="setTemplate"
      @getOrgan="setOrgan"
      @getDept="setDept"
    >
      <el-button type @click="delArrangeBaseset">删除</el-button>
      <el-popover
        popper-class="popper_class"
        v-model="visible"
        placement="bottom"
        width="840"
        height="100"
        trigger="click"
      >
        <el-form :model="form" label-width="66px" ref="addform">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item
                label="专科"
                prop="deptId"
                :rules="[{required: true, message: '必填项', trigger: 'change'}]"
              >
                <dept-cascader
                  v-model="selectDept"
                  :organ-id="params.organId"
                  :template-type="template.timeTrunkType"
                  :show-first-dept="true"
                ></dept-cascader>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="医生">
                <el-select v-model="form.resourceId" clearable style="width:100%">
                  <el-option
                    v-for="item in arrangeResource"
                    :key="item.id"
                    :value="item.id"
                    :label="item.resourceName"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item
                label="服务"
                prop="serviceList"
                :rules="[{required: true, message: '必填项', trigger: 'change', type: 'array'}]"
              >
                <el-select v-model="form.serviceList" multiple style="width:100%" value-key="id">
                  <el-option
                    v-for="item in serviceList"
                    :key="item.id"
                    :value="item"
                    :label="item.name"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24" style="max-height:400px;overflow:auto;">
              <el-form-item label="时段">
                <el-row v-for="(item, i) in form.timerangeList" :key="i">
                  <el-col :span="5">
                    <el-form-item label label-position="0">
                      <el-time-select
                        style="width:100%"
                        v-model="item.startTime"
                        :picker-options="{start: '00:00', step: '00:10', end: '23:50'}"
                        placeholder="选择时间"
                      ></el-time-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="5">
                    <el-form-item label label-position="0" style="padding-left:10px;">
                      <el-time-select
                        style="width:100%;"
                        v-model="item.endTime"
                        :picker-options="{start: '00:00', step: '00:10', end: '24:00', minTime: item.startTime}"
                        placeholder="选择时间"
                      ></el-time-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="4">
                    <el-form-item label label-position="0" style="padding-left:10px;">
                      <el-select v-model="item.arrangeType" style="width:100%;">
                        <el-option label="按频次" :value="1"></el-option>
                        <el-option label="按数量" :value="2"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="4" v-if="item.arrangeType === 1">
                    <el-form-item label label-position="0" style="padding-left:10px;">
                      <el-input style="width:100%" v-model="item.serviceTimeSlice" placeholder="分钟">
                        <span slot="append">分钟</span>
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="4" v-if="item.arrangeType === 1">
                    <el-form-item label label-position="0" style="padding-left:10px;">
                      <el-input style="width:100%" v-model="item.sliceVolume" placeholder="人">
                        <span slot="append">人</span>
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="4" v-if="item.arrangeType === 2">
                    <el-form-item label label-position="0" style="padding-left:10px;">
                      <el-input style="width:100%" v-model="item.totalVolume" placeholder>
                        <span slot="append">人</span>
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="4" v-if="item.arrangeType === 2">
                    <el-form-item label label-position="0" style="padding-left:10px;">&nbsp;</el-form-item>
                  </el-col>
                  <el-col :span="2" align="right">
                    <el-form-item label label-width="0">
                      <i class="iconfont icon-tianjia" @click="addTimeTrunk" v-if="i === 0"></i>
                      <i class="iconfont icon-delete" @click="delTimeTrunk(i)" v-else></i>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20" class="footer">
            <el-col :span="12">
              <el-button type="primary" @click="batchCreateTimeTrunk">批量生成</el-button>
              <el-button type @click="resetTimeTrunk">重置</el-button>
            </el-col>
            <el-col :span="12" align="right">
              <el-button type="primary" @click="saveBasesetResource" :disabled="isDisable">确定</el-button>
              <el-button type @click="visible=false">取消</el-button>
            </el-col>
          </el-row>
        </el-form>
        <el-button type="primary" slot="reference">排号设置</el-button>
      </el-popover>
    </search-header>
    <el-row class="body" type="flex">
      <el-col class="left">
        <div class="left_header">
          <table width="100%" cellpadding="0" cellspacing="0">
            <thead>
              <tr>
                <th width="111" style="min-width:111px;">科室</th>
                <th align="left">医生</th>
              </tr>
            </thead>
          </table>
        </div>
        <div class="left_wrap" ref="left">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tbody>
              <tr
                v-for="(item, i) in deptResourceList"
                :key="i + '-' + 1"
                @click="setCurrentIndex(item)"
                :class="{on: currentIndex && currentIndex.id === item.id}"
              >
                <td width="111" align="center" style="min-width:111px;">
                  <div class="ellipsis" style="width:111px;">{{item.deptName}}</div>
                </td>
                <td align="left">
                  <div class="ellipsis" style="width:80px;">{{item.resourceName}}</div>
                </td>
              </tr>
              <tr v-for="i of leftTotal" :key="i + '-' + 2">
                <td align="center" width="111" style="min-width:111px;"></td>
                <td align="left"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </el-col>
      <el-col class="middle">
        <div class="middle_header">
          <table width="100%" cellpadding="0" cellspacing="0">
            <thead>
              <tr>
                <th width="100%">服务</th>
              </tr>
            </thead>
          </table>
        </div>
        <div class="middle_wrap" ref="middle">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tbody>
              <tr
                v-for="(item, i) in serviceRelListN"
                :key="i + '-' + 1"
                @click="modifyService(item)"
              >
                <td align="center">
                  <div class="ellipsis" style="width:120px;">{{item.serviceName}}</div>
                </td>
              </tr>
              <tr v-for="i of serviceTotal" :key="i + '-' + 2">
                <td align="center"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </el-col>
      <el-col class="right">
        <div class="right_header" ref="header">
          <table cellpadding="0" cellspacing="0">
            <thead>
              <tr>
                <th width="120">时间</th>
                <th width="120" class="number">频次/数量</th>
                <th width="120" v-for="j of timeCol" align="center" :key="j">{{j}}</th>
              </tr>
            </thead>
          </table>
        </div>
        <div class="right_wrap" @scroll="handleScroll">
          <table cellpadding="0" cellspacing="0">
            <tbody>
              <tr v-for="(item, i) in timerangeList" :key="i + '-' + 1">
                <td width="120" align="center">{{item.startTimeStr}}</td>
                <td width="120" class="number" align="center" @dblclick="setEdit(item)">
                  <template v-if="item.arrangeType === 1">
                    <span v-if="item.isEdit">
                      <el-input v-model="item.serviceTimeSlice" size="mini"></el-input>/
                      <el-input v-model="item.sliceVolume" size="mini"></el-input>
                    </span>
                    <span
                      class="numbertext"
                      v-else
                    >{{item.serviceTimeSlice}}{{item.timeSliceUnit == 's' ? '秒钟':item.timeSliceUnit == 'm' ?'分钟':item.timeSliceUnit == 'h' ? '小时':''}}/{{item.sliceVolume+'次'}}</span>
                  </template>
                  <template v-else>
                    <span v-if="item.isEdit">
                      <el-input v-model="item.totalVolume" size="mini"></el-input>
                    </span>
                    <span class="numbertext" v-else>{{item.totalVolume ? item.totalVolume + '个':''}}</span>
                  </template>
                </td>
                <td width="120" v-for="j of timeCol" align="center" :key="i + '-' + j + '-' + 1">
                  <setpop
                    v-if="item.timesliceVOList[j-1]"
                    :dataNum="item.timesliceVOList[j-1].startTimeStr"
                    :basesetTimesliceId="item.timesliceVOList[j-1].channelRelList[0].basesetTimesliceId"
                    @pup="pup"
                    :channelId="parseInt(item.timesliceVOList[j-1].channelRelList[0].channelId)"
                  ></setpop>
                </td>
              </tr>
              <tr v-for="i of rightTotal" :key="i">
                <td width="120"></td>
                <td width="120"></td>
                <td width="120" v-for="j of timeCol" align="center" :key="i + '-' + j + '-' + 2"></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="right_hack"></div>
      </el-col>
    </el-row>
    <mofity-server
      :dialogTableVisible.sync="showdialog"
      :info="info"
      @refresh="refresh"
      :serviceList="serviceList"
    ></mofity-server>
  </div>
</template>

<script>
import searchHeader from '@/arrange/page/scheduling/search.vue'
import mofityServer from '@/arrange/page/setting/mofity-server.vue'
import deptCascader from '@/arrange/page/scheduling/deptcascader'
import setpop from '@/arrange/page/setting/setpop.vue'
import api from '@/arrange/store/settingapi'
import arrangeapi from '@/arrange/store/schedulingapi'

export default {
  data () {
    return {
      api,
      arrangeapi,
      config: '',
      visible: false,
      isDisable: false,
      fixedTotal: 24,
      leftTotal: 24,
      rightTotal: 24,
      serviceTotal: 24,
      timeCol: 50,
      currentIndex: '',
      currentEdit: '',
      deptList: [],
      settingList: [],
      deptResourceList: [],
      serviceRelListN: [],
      showdialog: false,
      info: '',
      arrangeResource: [],
      timerangeList: [],
      serviceList: [],
      template: '',
      selectDept: '',
      params: {
        resourceType: 'STAFF_DOCTOR',
        serviceClassfication: '',
        organId: '',
        templetId: '',
        deptId: '',
        resourceId: '',
        resourceName: ''
      },
      form: {
        templetId: '',
        organId: '',
        deptId: '',
        resourceId: '',
        serviceRelList: [],
        serviceList: [],
        timerangeList: [{
          startTime: '',
          endTime: '',
          arrangeType: 1,
          serviceTimeSlice: '',
          sliceVolume: '',
          totalVolume: ''
        }]
      },
      option: {
        start: '00:00',
        end: '24:00',
        step: '00:10'
      }
    }
  },
  watch: {
    'params': {
      handler (val) {
        if (val.organId && val.templetId && val.deptId) {
          this.currentIndex = ''
          this.form.resourceId = ''
          this.form.serviceList = []
          this.serviceRelListN = []
          this.getDeptResourceList()
          this.getResourceService()
        }
      },
      deep: true
    },
    'deptResourceList' (v) {
      if (v.length === 0) {
        this.serviceRelListN = []
      }
    },
    'form.deptId' (val) {
      this.form.resourceId = ''
      this.form.serviceRelList = []
      this.getArrangeResource()
    },
    'currentIndex' (val) {
      if (val) {
        this.form.deptId = val.deptId
        this.getBasesetResourceDetail()
      } else {
        this.timerangeList = []
        this.rightTotal = this.fixedTotal
      }
    },
    'selectDept' (val) {
      if (val) {
        this.form.deptId = val.deptId
      }
    }
  },
  created () {
    this.setArrangeConfig()
  },
  methods: {
    setArrangeConfig () {
      this.arrangeapi.getArrangeConfig('CHARGE_PROJECT_CHANGE_LIMIT').then(rs => {
        this.config = rs.data
      })
    },
    refresh () {
      this.getBasesetResourceDetail()
    },
    modifyService (item) {
      this.showdialog = true
      this.info = item
    },
    getDeptResourceList () {
      this.api.getDeptResource(this.params).then(rs => {
        if (rs.head.errCode || !rs.data[0]) {
          this.leftTotal = this.fixedTotal
          this.deptResourceList = []
          this.serviceRelListN = []
          this.timerangeList = []
          this.currentIndex = ''
          return false
        }
        this.leftTotal = rs.data.length < this.fixedTotal ? this.fixedTotal - rs.data.length : 0
        this.deptResourceList = rs.data
        if (!this.currentIndex) {
          this.currentIndex = this.deptResourceList[0]
        }
      })
    },
    getBasesetResourceDetail () {
      this.api.getBasesetResourceDetail({ id: this.currentIndex.id }).then(rs => {
        if (rs.head.errCode || !rs.data.timerangeList[0]) {
          this.timerangeList = []
          this.rightTotal = this.fixedTotal
          return false
        }
        this.rightTotal = rs.data.timerangeList.length <= this.fixedTotal ? this.fixedTotal - rs.data.timerangeList.length : rs.data.timerangeList.length
        this.timerangeList = rs.data.timerangeList
        this.serviceRelListN = rs.data.serviceRelList
        this.serviceTotal = rs.data.serviceRelList.length < this.fixedTotal ? this.fixedTotal - rs.data.serviceRelList.length : rs.data.serviceRelList.length
      })
    },
    pup (channelId, basesetTimesliceId) {
      this.api.setTimesliceChannelRel({ channelId: channelId, basesetTimesliceId: basesetTimesliceId }).then(rs => {
      })
    },
    getArrangeResource () {
      let params = {
        resourceType: 'STAFF_DOCTOR',
        deptId: this.form.deptId,
        organId: this.params.organId,
        templetId: this.params.templetId
      }
      this.api.getResourceList(params).then(rs => {
        if (rs.head.errCode || !rs.data.resultList[0]) {
          this.arrangeResource = []
          return false
        }
        this.arrangeResource = rs.data.resultList
      })
    },
    getResourceService () {
      let params = {
        deptType: 1,
        deptId: this.form.deptId,
        resourceId: this.form.resourceId,
        orgId: this.params.organId,
        templetId: this.params.templetId,
        searchType: this.config.configValue,
        serviceClassification: this.template.serviceClassfication
      }
      this.arrangeapi.getArrangeService(params).then(rs => {
        if (rs.head.errCode || !rs.data[0]) {
          this.serviceList = []
          return false
        }
        this.serviceList = rs.data
      })
    },
    setCurrentIndex (val) {
      this.currentIndex = val
    },
    addTimeTrunk () {
      this.form.timerangeList.push({
        startTime: '',
        endTime: '',
        arrangeType: 1,
        serviceTimeSlice: '',
        sliceVolume: '',
        totalVolume: ''
      })
    },
    delTimeTrunk (index) {
      this.form.timerangeList.splice(index, 1)
    },
    resetTimeTrunk () {
      this.form.timerangeList = [{
        startTime: '',
        endTime: '',
        arrangeType: 1,
        serviceTimeSlice: '',
        sliceVolume: '',
        totalVolume: ''
      }]
    },
    setTemplate (val) {
      this.template = val
      this.params.templetId = val.id
      this.params.serviceClassfication = val.serviceClassfication
      this.form.templetId = val.id
    },
    setOrgan (val) {
      this.params.organId = val.organId
      this.form.organId = this.params.organId
    },
    setDept (val) {
      if (val) {
        this.selectDept = val
        this.params.deptId = val.deptId
      }
    },
    saveBasesetResource () {
      this.isDisable = true
      setTimeout(() => {
        this.isDisable = false
      }, 1000)
      this.$refs.addform.validate(valid => {
        if (!valid) {
          return false
        }
        this.form.serviceRelList = this.form.serviceList.map(item => {
          return {
            serviceId: item.id,
            serviceName: item.name
          }
        })
        this.api.saveOrUpdateBasesetResource(this.form).then(rs => {
          if (rs.head.errCode) {
            return false
          }
          this.$notify({
            title: '提示',
            type: 'success',
            message: '保存成功',
            duration: 2000
          })
          this.visible = false
          this.currentIndex = rs.data
          this.getDeptResourceList()
        })
      })
    },
    setEdit (item) {
      if (!item) {
        return false
      }
      if (this.currentEdit) {
        this.currentEdit.isEdit = false
      }
      this.currentEdit = item
      this.$set(item, 'isEdit', true)
    },
    query (val) {
      Object.assign(this.params, val)
      this.getDeptResourceList()
    },
    docEvent (e) {
      if (e.target.className === 'el-input__inner' || e.target.className === 'number' || e.target.className === 'numbertext') {
        return false
      }
      if (this.currentEdit && this.currentEdit.isEdit) {
        this.api.updateBasesetTimerange(this.currentEdit).then(rs => {
          this.getBasesetResourceDetail()
          this.currentEdit.isEdit = false
        })
      }
    },
    delArrangeBaseset () {
      this.$confirm('您确定要删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(_ => {
        this.api.delArrangeBasesetResource({ id: this.currentIndex.id }).then(rs => {
          if (rs.head.errCode) {
            return false
          }
          this.$notify({
            title: '提示',
            type: 'success',
            message: '已删除成功',
            duration: 2000
          })
          this.currentIndex = ''
          this.getDeptResourceList()
        })
      })
    },
    batchCreateTimeTrunk () {
      let firstStartTime = this.form.timerangeList[0].startTime
      let firstEndTime = this.form.timerangeList[0].endTime
      let arr = []
      if (!firstStartTime || !firstEndTime) {
        this.$messageTips(this, 'warning', '请填写时段开始时间和结束时间!')
        return false
      }
      let startTimeStr = '2001-01-01 ' + firstStartTime
      let endTimeStr = '2001-01-01 ' + firstEndTime
      let endTimesStr = '2001-01-01 ' + this.option.end
      let t1 = new Date(startTimeStr).getTime()
      let t2 = new Date(endTimeStr).getTime()
      let t3 = new Date(endTimesStr).getTime()
      let firstStep = parseInt((t2 - t1) / 1000 / 60)
      let totalTime = ((t3 - t1) / 1000 / 60) - firstStep
      let index = 0
      arr[0] = this.form.timerangeList[0]
      while (totalTime - firstStep >= 0) {
        let t = '2000-1-1 ' + arr[index].endTime
        let eTime = this.$moment(t).add(firstStep, 'm').format('HH:mm')
        arr.push({
          startTime: arr[index].endTime,
          endTime: eTime === '00:00' ? '24:00' : eTime,
          arrangeType: this.form.timerangeList[0].arrangeType,
          serviceTimeSlice: this.form.timerangeList[0].serviceTimeSlice,
          sliceVolume: this.form.timerangeList[0].sliceVolume,
          totalVolume: this.form.timerangeList[0].totalVolume
        })
        totalTime = totalTime - firstStep
        index++
      }
      this.form.timerangeList = arr
    },
    handleScroll (e) {
      let X = e.target.scrollLeft
      let Y = e.target.scrollTop
      this.$refs.header.scrollLeft = X
      this.$refs.left.scrollTop = Y
      this.$refs.middle.scrollTop = Y
    }
  },
  components: {
    searchHeader,
    deptCascader,
    setpop,
    mofityServer
  }
}
</script>
<style scoped>
#setting {
  padding: 10px;
  background: #fff;
  height: calc(100% - 40px);
  overflow: auto;
}
#setting table tr td,
#setting table tr th {
  border-left: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
  padding: 10px;
  height: 24px;
  font-size: 14px;
  -webkit-user-select: none; /*webkit浏览器*/
}
#setting table {
  border-right: 1px solid #ddd;
}
#setting table tr th {
  border-top: 1px solid #ddd;
  background: #ccc;
  font-size: 14px;
}
#setting table tr td {
  cursor: pointer;
}
.left {
  width: 240px;
}
.middle {
  width: 180px;
  margin-left: 2px;
}
.right {
  width: calc(100% - 370px);
  position: relative;
  margin-left: -1px;
}
.left_wrap,
.middle_wrap {
  height: 670px;
  border-bottom: 1px solid #dddddd;
  overflow: hidden;
}
.right_header {
  width: calc(100% - 38px);
  overflow: hidden;
}
.right_wrap {
  width: calc(100% - 18px);
  height: 690px;
  overflow: auto;
}
.right_hack {
  width: 20px;
  height: 46px;
  position: absolute;
  right: 18px;
  top: 0;
  background: #ccc;
}
.right table tr th,
.right table tr td {
  width: 75px;
  min-width: 75px;
}
.right table tr td .w120,
.right table tr td .number {
  width: 120px;
  min-width: 120px;
}
.middleNumber {
  width: 120px;
  min-width: 120px;
}
.middleNumber td {
  height: 67.4px !important;
}
.left table tr.on td,
.right table tr td {
  background: #efefef;
}
.middle table tr td {
  background: #efefef;
}
.footer {
  padding-top: 20px;
  padding-bottom: 10px;
  border-top: 1px solid #ddd;
}
.el-input--mini {
  width: 48px;
}
.el-input--mini /deep/ .el-input__inner {
  text-align: center;
}
</style>

