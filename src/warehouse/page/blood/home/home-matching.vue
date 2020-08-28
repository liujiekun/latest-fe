<template>
  <div class="home home-default boxshadownone">
    <div class="home-heading">
      <p class="opt" v-if="tableData.length">共{{tableData.length}}项</p>
      <h4>交叉配血</h4>
    </div>
    <div class="home-body taskWar">
      <div class="noCnt" v-if="loading">
        <div class="c">
          <i class="el-icon-loading"></i>
          加载中
        </div>
      </div>
      <div class="noCnt" v-if="emptyData">
        <everNoData tipTxt="暂无配血任务"></everNoData>
      </div>
      <div class="table" v-if="tableData[0]">
        <el-table
          :data="tableData"
          :show-header="false"
          class="no-border tr-height-40"
          style="width: 100%"
          >
          <el-table-column
          align="left"
          width="25">
            <template slot-scope="scope">
              <span v-if="scope.row.isPressing"><i class="iconfont icon-werehouse_ji"></i></span>
            </template>
          </el-table-column>
          <el-table-column
            prop=""
            label="患者姓名"
            width="150">
            <template slot-scope="scope">
              <!-- <span class="blue" @click="$router.push(`/blood/manage/crossmatching/${scope.row.id}`)">{{scope.row.code}}</span> -->
              <!-- <i v-if="scope.row.isPressing" class="iconfont icon-werehouse_ji"></i> -->
              <span class="blue" @click="$router.push(`/blood/manage/crossmatching/${scope.row.id}`)">{{scope.row.patientName}}</span><span v-if="scope.row.age" style="margin-left: 10px">({{scope.row.age}}岁)</span>
            </template>
          </el-table-column>
          <!-- <el-table-column
            prop=""
            label="名字">
            <template slot-scope="scope">
              <span>{{scope.row.patientName}}<span v-if="scope.row.patientAge">({{scope.row.patientAge}}岁)</span></span>
            </template>
          </el-table-column> -->
          <el-table-column
            prop=""
            width="130"
            label="科室">
            <template slot-scope="scope">
              <span>{{scope.row.sectionName}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop=""
            width="130"
            label="病区">
            <template slot-scope="scope">
              <span>{{scope.row.areaName}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop=""
            label="床号">
            <template slot-scope="scope">
              <span>{{scope.row.hospitalBedNum}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop=""
            align="right"
            width="100"
            label="申请医生">
            <template slot-scope="scope">
              <span class="light-gray">{{scope.row.doctorName}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop=""
            align="right"
            width="170"
            label="申请时间">
            <template slot-scope="scope">
              <span class="light-gray">{{scope.row.applyTime}}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>
<script>
import api from '../store/bloodmatchingapi'
import getstorage from '@/warehouse/page/storages/util/getstorage'
import { FULL_IN_OUT_TYPE, dateFormat, wsConnect } from '@/util/common'
import list from '@/util/list'
import bloodconfig from '../util/bloodconfig'
import setName from '@/util/setstatusname'
export default {
  mixins: [getstorage, list, setName],
  data () {
    return {
      api,
      bloodconfig,
      FULL_IN_OUT_TYPE,
      pagesize: 10,
      listParams: { status: bloodconfig.BLOOD_MATCHING_STATUS[1].id }
    }
  },
  mounted () {
    wsConnect('/exchange/exchange.warehouse.bloodbank/warehouse.queue.bloodmatching.exchange', (client, res) => {
      this.list()
    })
  },
  methods: {
    dateFormat
  }
}
</script>

<style lang="scss" scoped>
.boxshadownone{
  box-shadow: none;
  border-radius: 0 0 0;
  padding-bottom: 20px!important;
  /deep/ .el-table--border td:first-child .cell{
    padding: 0px!important;
  }
}
.noCnt{height:100%;text-align:center;
  -webkit-box-pack: center;
  -webkit-box-align: center;
  -webkit-box-orient: vertical;
}
.taskWar{
  height: calc(100vh - 327px);overflow-y: auto;overflow-x: hidden;
}
.icon-werehouse_ji{
  color: #EE4433;
}
</style>
