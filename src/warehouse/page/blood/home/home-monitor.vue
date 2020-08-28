<template>
  <div id="workToday" class="home home-default">
    <div class="monitor-btnlist">
      <div class="grid-content bg-purple">
        <el-button class="blood-home" @click="popBloodSamp">
          <div>
            <i class="iconfont icon-shouyang wh32" style="color: #5CA5FF"></i>
          </div>
          收样
        </el-button>
      </div>
      <div class="grid-content bg-purple">
        <el-button class="blood-home" @click="popBloodColl">
          <div>
            <i class="iconfont icon-quxue wh32" style="color: #FF8E45"></i>
          </div>
          取血
        </el-button>
      </div>
      <div class="grid-content bg-purple">
        <el-button class="blood-home" @click="$router.push('/blood/entry/entryblood')">
          <div>
            <i class="iconfont icon-ruku1 wh32" style="color: #5DD3BF"></i>
          </div>
          血液入库
        </el-button>
      </div>
      <div class="grid-content bg-purple">
        <el-button class="blood-home" @click="$router.push('/blood/query/bloodinventory')">
          <div>
            <i class="iconfont icon-chaxun2 wh32" style="color: #8C84F7"></i>
          </div>
          库存查询
        </el-button>
      </div>
    </div>
    <div class="hr"></div>
    <!-- <div class="monitor-radius">
      <div class="radius-default radius-danger">
        <div class="vertical-align">
          <span class="title">{{obj.overdueNum}}</span>
          <span>已过期</span>
        </div>
      </div>
      <div class="radius-default radius-warning">
        <div class="vertical-align">
          <span class="title">{{obj.expiringNum}}</span>
          <span>即将过期</span>
        </div>
      </div>
      <div class="radius-default">
        <div class="vertical-align">
          <span class="title">{{obj.normalNum}}</span>
          <span>正常</span>
        </div>
      </div>
    </div>
    <div class="hr"></div>
    <div class="monitor-status-list">
      <el-row>
        <el-col :span="12" v-for="(item, index) in obj.itemList" :key="index">
          <el-col class="alg_r" :span="12">{{item.bloodTypesName}}</el-col>
          <el-col class="alg_c color_55" :span="4">{{item.overdueNum}}</el-col>
          <el-col class="alg_c color_05" :span="4">{{item.expiringNum}}</el-col>
          <el-col class="alg_c" :span="4">{{item.normalNum}}</el-col>
        </el-col>
      </el-row>
      <el-row v-if="items && items.length > 10">
        <el-col style="text-align:right; padding-right: 10px"><el-button @click="$router.push('/blood/query/inventory')" type="text">查看更多</el-button></el-col>
      </el-row>
    </div> -->
    <!-- 收样 -->
    <blood-sampling ref="bloodSamp"></blood-sampling>
    <!-- 取血 -->
    <blood-collection ref="bloodColl"></blood-collection>
  </div>
</template>

<script>
import api from '../store/bloodhomeapi'
import getstorage from '@/warehouse/page/storages/util/getstorage'
import bloodCollection from './blood.collection'
import bloodSampling from './blood.sampling'
export default {
  mixins: [getstorage],
  data () {
    return {
      api: api,
      obj: {},
      items: [],
      setIntTime: null
    }
  },
  components: {
    bloodCollection,
    bloodSampling
  },
  methods: {
    popBloodSamp () {
      this.$refs.bloodSamp.open()
    },
    popBloodColl () {
      this.$refs.bloodColl.open()
    },
    changes () {
      let params = {
        storageRoomId: this.storageId
      }
      this.api.getBloodHomeInfo(params).then(result => {
        if (result) {
          this.items = [...result.itemList]
          if (result.itemList.length > 10) {
            result.itemList.splice(10, 10)
          }
          this.obj = Object.assign({}, result)
        }
      })
    }
  },
  created () {
    // let that = this
    // that.changes()
    // this.setIntTime = setInterval(_ => {
    //   that.changes()
    // }, 60000)
  },
  destroyed () {
    // clearInterval(this.setIntTime)
  }
}
</script>

<style scoped lang="scss">
.monitor-radius{text-align: center; padding: 12px 0;}
.radius-default{color: #999;margin: 10px 20px; width: 120px;height: 120px; border:5px solid #DCDFE6; border-radius:50%; text-align: center; line-height: 120px; display: inline-block;}
.vertical-align{vertical-align: middle; line-height: 0px; display: inline-block;}
.vertical-align span{ width: 100%; display: inline-block; line-height: 20px; font-size: 14px; color: #999;}
.vertical-align span.title{font-size: 32px; padding-bottom: 10px; font-weight: bold;}
.radius-warning span.title{color: #E6A23C;}
.radius-danger span.title{color: #F56C6C;}
.home-default{height: 180px; padding:0px;}
.monitor-status-list{padding-top:30px;}
.wh32 {
  display: inline-block;
  width: 32px;
  height: 32px;
  font-size: 32px;
  padding-bottom: 15px;
}
.pt30 {
  padding-top: 30px;
}
.monitor-status-list .el-col {margin-bottom: 15px; font-size: 15px; color: #000;}
.monitor-btnlist{
  height: 180px;
  text-align: center;
  .bg-purple{
    display: inline-block;
    margin: 30px 12px;
  }
}
.blood-home {
  width: 170px;
  height: 120px;
  box-shadow: 0px 1px 5px rgba(0, 0, 0, 0.2);
  border: 0px!important;
}
.datas{padding:10px 10px 50px; background: #FFF url('../../../../assets/img/001.png') right bottom no-repeat;height: 130px}
.fastenter { height: 60px; padding: 0 30px; display: inline-block;}
.dataCell{text-align: center;}
.dataCell .tit{color: #000;line-height: 20px;padding-bottom: 10px; font-size: 14px}
.dataCell .num{font-size: 25px;color: #1C7BEF;line-height: 30px;font-weight: 500; height: 45px}
@media screen and (max-width: 1600px) {
  #workToday /deep/ .el-button.btn-small {
    padding: 7px !important;
  }
}
.monitor-status-list .color_55{color: #fa5555}
.monitor-status-list .color_05{color: #eb9e05}
.iconfont{padding-right: 5px;}
</style>
