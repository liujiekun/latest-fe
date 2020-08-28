<template>
  <div id="headerWar">
    <div class="navSeondlist">
      <el-row class="top_setting fr" ref="rightBox" id="rightBox">
        <el-col class="top_setting_col" style="width:160px" v-if="navPluginShowFlag">
          <ever-patient-select
            v-if="hasPermission('Auth_dom_tounav_patientselect')"
            v-model="patientObj.name"
            @select="setPatientObj"
            placeholder=" "
            size="mini"
            :allowCreate="true"
            :hideNo="true"
          ></ever-patient-select>
        </el-col>
        <el-col class="top_setting_col" v-if="navPluginShowFlag">
          <el-select
            class="inner"
            v-model="storageId"
            v-if="storagesSelectConfig.flag"
            placeholder="请选择库房"
            size="mini"
            @change="changeStorage">
            <el-option
              v-for="(items, index) in storagesSelectConfig.options"
              :key="index"
              :label="items.name"
              :value="items.id"
            ></el-option>
          </el-select>
        </el-col>
        <el-col class="top_setting_col spe">
          <login-tips></login-tips>
        </el-col>
        <el-col class="top_setting_col" v-if="navPluginShowFlag">
          <task-table-dialog ref="tasktabledialog"></task-table-dialog>
        </el-col>
        <el-col class="top_setting_col" v-if="navPluginShowFlag">
          <div>
            <msg-dialog @show="showItemDialog" @csalook='csalook'></msg-dialog>
          </div>
        </el-col>
        <el-col class="top_setting_col">
          <comment-dialog></comment-dialog>
        </el-col>
        <el-col class="top_setting_col">
          <span @click="handleHelp()">
            <i class="icon iconfont icon-wenhao"></i> 查看帮助
          </span>
        </el-col>
      </el-row>
      <div class="benchLink pl30 pr10" id="benchnameBox" v-if="navPluginShowFlag">
        <a class="cp" @click="backToHome">
          <div class="workstation">
            {{ $t( benchName || '全部工作站' ) }}
          </div>
          <div class="triangle"></div>
          <div class="wid36">
            <i class="iconfont icon-menzhen-daohang-shou"></i>
          </div>
        </a>
      </div>
      <el-menu
        :default-active="secActiveIndex"
        class="el-menu-vertical-demo"
        :router="false"
        mode="horizontal"
        v-if="navData.length > 0 && !$route.path.includes('myclinic')">
        <el-menu-item
          v-for="item in navData"
          :key="item.index"
          @click="triggerSecNav(item)"
          :index="item.index"
          v-if="hasPermission(item.auth) && item.level < maxNavNum">
          <template v-if="item.openType === '_blank'">
            <a class="inner" :href="item.index" target="_blank">{{ $t(item.name) }}</a>
          </template>
          <template v-else>
            <span class="inner">
              {{ $t(item.name) }}
            </span>
          </template>
        </el-menu-item>
        <el-submenu class="more_item" index="more" v-if="navNum >= maxNavNum">
          <a slot="title">更多</a>
          <el-menu-item
            class="topMenuPop"
            v-for="item in navData"
            :key="item.index + 'submenu'"
            :index="item.index"
            @click="triggerSecNav(item)"
            v-if="hasPermission(item.auth) && item.level >= maxNavNum">
            <template v-if="item.openType === '_blank'">
              <a class="inner" :href="item.index" target="_blank">{{ $t(item.name) }}</a>
            </template>
            <template v-else>
              <span class="inner">{{ $t(item.name) }}</span>
            </template>
          </el-menu-item>
        </el-submenu>
      </el-menu>
      <item-dialog ref="itemDialog" :appendBody="true"></item-dialog>
      <addcsa ref='addcsa'></addcsa>
    </div>
    <div v-if="this.$route.path.indexOf('/phr/analysis') === -1" class="navThirdList" id="navThirdList" v-show="navThirdArr.length > 0">
      <el-menu
        :default-active="thirdActiveIndex"
        class="el-menu-vertical-demo"
        :router="false"
        mode="horizontal"
      >
        <el-menu-item
          v-for="item in navThirdArr"
          :key="item.index"
          :index="item.index"
          v-if="hasPermission(item.auth)"
          @click="triggerThirdNav(item)"
        >
          <template v-if="item.openType === '_blank'">
            <a class="inner" :href="item.index" target="_blank">{{ $t(item.name) }}</a>
          </template>
          <template v-else>
            <span class="inner">{{ $t(item.name) }}</span>
          </template>
        </el-menu-item>
      </el-menu>
    </div>
    <div v-if="this.$route.path.indexOf('/phr/analysis') !== -1" class="verticalMenu" id="navThirdList" v-show="navThirdArr.length > 0">
      <el-menu
        :default-active="thirdActiveIndex"
        :router="false"
        mode="vertical"
        :collapse="false"
        :default-openeds="['/phr/analysis/group_diagnosis', '/phr/analysis/organ_diagnosis']"
      >
        <el-submenu
          v-for="item in navThirdArr"
          :key="item.index"
          :index="item.index"
          v-if="hasPermission(item.auth)"
          @click="triggerThirdNav(item)"
        >
          <template slot="title"><i class="iconfont icon-nav-shouru-BI"></i> {{ $t(item.name) }}</template>
          <el-menu-item v-for="(citem) in item.children" :index="citem.index" :key="citem.index" @click="triggerThirdNav(citem)">
            <template slot="title">
              <span>{{ $t(citem.name) }}</span>
            </template>
          </el-menu-item>
        </el-submenu>
      </el-menu>
    </div>
    <ever-help ref="help" :visible.sync="visible" :rid="rid" :helpConfig="helpConfig"></ever-help>
  </div>
</template>

<script>
import itemDialog from '@/infusion/components/report.card.vue'
import msgDialog from '@/message/components/msg-dialog'
import taskTableDialog from '@/message/components/task-table-dialog'
import commentDialog from '@/message/components/comment-dialog'
import loginTips from './logintips'
import { diction } from '@/store/common'
import { isJsonString } from '@/util/common'
import storage from '@/util/storage'
import navCtrl from '@/framework/store/navctrl'
import staticvars from '@/store/staticvars'
import { baseHost } from '@/store/basehost'
import addcsa from '@/csa/components/addcsa.vue'
import api from '@/csa/store/csaapi.js'
export default {
  mixins: [navCtrl],
  name: 'ever-nav',
  data: function () {
    return {
      messageBox: false,
      clientWidth: 1300,
      navNum: 0,
      maxNavNum: 2,
      inspectItem: {},
      patientObj: {},
      storageId: '',
      CLINICID: storage.getStorageByClinic('CLINICID'),
      languageOptions: [],
      navLogo: '/web/static/assets/default/img/navlogo.png',
      loading: true,
      visible: false,
      rid: '',
      helpConfig: {},
    }
  },
  created () {
    // 库房动态路由设置
    this.$bus.$on('update:changeNavData', (newNavData, index) => {
      // 过滤掉已有的动态发药流程菜单
      this.navData = this.navData.filter(item => !item.processDataId)
      this.navData.splice(index, 0, ...newNavData)
      this.computeAuthNum()
    })
    // 机构图片加载之后才会替换
    let tenantInfo = JSON.parse(localStorage.getItem('TENANTDATA'))
    if (tenantInfo && tenantInfo.navLogo) {
      var img = new Image()
      if (tenantInfo.navLogo) {
        img.src = diction.fileUrl + diction.filePath + this.fixDirtyData(tenantInfo.navLogo)
      }
      img.onload = (_) => {
        this.navLogo = img.src
      }
    }
    this.CLINICID = storage.getStorageByClinic('CLINICID')
    this.getStorageRoomId()
  },
  beforeDestroy () {
    this.$bus.$off('update:changeNavData')
  },
  mounted () {
    const _self = this
    _self.clientWidth = document.getElementById('app').clientWidth
    window.onresize = () => {
      _self.clientWidth = document.getElementById('app').clientWidth
    }
  },
  methods: {
    // 兼容老数据
    fixDirtyData (url) {
      if (url && url.indexOf('fileId=') > -1) {
        return url.substr(url.indexOf('fileId=') + 7)
      } else {
        return url
      }
    },
    loadImg () {
      this.loading = false
    },
    backToHome () {
      window.location.href = this.$ever.mainIndex + '/myclinic'
    },
    setPatientObj (value) {
      this.patientObj = value
      value.id && window.open(this.$ever.crmIndex + '/crm/memberinfo/userinfo/memberbaseinfo/' + value.id)
    },
    // 切换语言选择
    changeLange (command) {
      storage.setLocalStorage('LANG', command)
      window.location.reload()
    },
    // 切换库房类型
    async changeStorage (val) {
      this.$store.commit('setStorageId', val)
      storage.setLocalStorage('STORAGE_ID_VUEX', val)
      storage.setLocalStorage('STORAGE_ID', val)
      JSON.parse(storage.getLocalStorage('STORAGE_ITEM')).forEach(v => {
        if (v.id === val) {
          storage.setLocalStorage('MATERIAL_TYPE', v.materialType)
          storage.setLocalStorage('STORAGE_ROOM_TYPE', v.type)
          this.materialType = v.materialType
          this.storageRoomType = v.type
        }
      })
      this.warehouseNavData({ clear: true, storageId: val })
      this.$router.replace('/storages/home?storageId=' + val) // 切换库房后， 路由未产生变化时， 页面不会刷新
    },
    hasPermission (auth) {
      return this.$hasPermission(auth)
    },
    computeAuthNum () {
      this.navNum = 0
      this.navData.map(item => {
        let auth = this.$hasPermission(item.auth)
        if (auth) {
          this.navNum++
          item.level = this.navNum
          item.openType = item.openType || this.openType
        }
        return item
      })
      var _wid1 = 0
      if (document.getElementById('logoBox')) {
        _wid1 = document.getElementById('logoBox').clientWidth
      }
      var _wid2 = 0
      if (document.getElementById('benchnameBox')) {
        _wid2 = document.getElementById('benchnameBox').clientWidth
      }
      var _wid3 = this.$refs.rightBox ? this.$refs.rightBox.$el.clientWidth : 0
      let _retainWidth = (_wid1 + _wid2 + _wid3)
      this.maxNavNum = Math.floor((this.clientWidth - _retainWidth) / 80) - 2
      if (this.maxNavNum === this.navData.length) {
        this.maxNavNum = this.maxNavNum + 1
      }
    },
    showItemDialog (val) {
      this.$refs.itemDialog.openDialog(val, true)
    },
    async csalook (executeId) {
      let res = await api.getSurgeryTaskList({
        executeId
      })
      let list = res.data || []
      list.forEach(element => {
        let patient = element.patientDto || {}
        element.ageShowText = patient.ageShowText
        element.sex = patient.sex
        element.birthday = patient.birthday
        if (element.applyTime)element.applyTime = this.$moment(element.applyTime).format('YYYY-MM-DD HH:mm')
        if (element.surgeryPlanTime)element.surgeryPlanTime = this.$moment(element.surgeryPlanTime).format('YYYY-MM-DD HH:mm')
        if (element.appointmentDate)element.appointmentDateStr = this.$moment(element.appointmentDate).format('YYYY-MM-DD')
        if (element.appointmentTime)element.appointmentDateStr += '  ' + element.appointmentTime
        if (element.executeStatus && element.executeStatus === 10) element.executeStatusStr = '待安排'
        else if (element.executeStatus) element.executeStatusStr = '已安排'
        let surgeryJson = element.surgeryJson || {}
        let array = ['assistantDoctors', 'anaesthesiaAssistants', 'scrubNurses', 'circulateNurses']
        array.forEach(item => {
          if (isJsonString(surgeryJson[item])) {
            let li = JSON.parse(surgeryJson[item]) || {}
            let arr = []
            let strArr = []
            li.forEach(ele => {
              arr.push(ele.id)
              strArr.push(ele.name)
            })
            element[item] = arr
          }
        })
      })
      this.$refs.addcsa.open(list[0], 'nav')
    },
    getStorageRoomId () {
      this.storageId = this.$route.query.storageId || storage.getLocalStorage('STORAGE_ID_VUEX') || storage.getLocalStorage('INIT_STORAGE_ID')
    },
    handleHelp () {
      this.rid = sessionStorage.getItem('x-rid')
      this.helpConfig = {
        version: staticvars.version,  // 系统版本号
        helpId: '1',  // 项目id 1 thc 2 私域商城 4 互联网医院后台管理
        helpIndex: baseHost.host + this.$ever.helpIndex, // demo
        actionUrl: {
          widgetGet: diction.api + '/global-api/global-platform-extend/help/app/widget/get/',
          search: diction.api + '/global-api/global-platform-extend/help/app/content/search'
        }
      }
      this.visible = true
      this.$refs.tasktabledialog.taskVisible = false
    },
  },
  watch: {
    '$store.state.resources' (val) {
      if (val) this.computeAuthNum()
    },
    '$store.state.currentUser' (val) {
      if (val) {
        this.$nextTick(_ => {
          this.computeAuthNum()
        })
      }
    },
    'clientWidth' (val) {
      this.computeAuthNum()
    },
    '$route': function (val) {
      this.CLINICID = storage.getStorageByClinic('CLINICID')
      this.getStorageRoomId()
      this.computeAuthNum()
    },
  },
  components: {
    itemDialog,
    msgDialog,
    taskTableDialog,
    commentDialog,
    loginTips,
    addcsa
  }
}
</script>

<style lang="scss" scoped>
.language_setting {
  width: 120px;
  font-size: 14px;
  .title {
    margin: 0 10px;
    color: #666;
    line-height: 30px;
    i {
      font-size: 14px;
    }
  }
  .border_top {
    border-top: 1px solid #ccc;
  }
  .language {
    padding: 0 10px;
    line-height: 30px;
    cursor: pointer;
    i {
      float: right;
      height: 30px;
      padding-right: 7px;
      color: #409eff;
    }
    &:hover {
      color: #fff;
      background-color: #1c7bef;
      i {
        color: #fff;
      }
    }
  }
}
.benchWar {
  max-height: 400px;
  overflow: auto;
}
.logowar {
  float: left;
  padding: 5px 0 0 10px;
}
.menubar {
  float: left;
}

.navSeondlist {
  background-image: linear-gradient(-90deg, #323639, #323639);
  height: 40px;
  .el-menu {
    background: transparent;
    overflow: hidden;
    border-bottom: none;
    .el-menu-item {
      height: 40px;
      line-height: 40px;
      border-bottom: 3px solid transparent;
      padding: 0 !important;
      color: #bfcbd9;
      background-color: transparent;
      &:hover {
        background: rgba(102, 102, 102, 0.2);
        border-bottom: 3px solid #409eff !important;
      }
      .inner {
        display: block;
        padding: 0 10px;
      }
    }
    .el-menu-item.is-active {
      background-color: rgba(102, 102, 102, 0.2);
      border-bottom: 3px solid #409eff !important;
    }
    .el-submenu.is-active {
      background-color: rgba(102, 102, 102, 0.2);
    }
    .el-menu-item.logowar.is-active {
      border-bottom-color: transparent !important;
      background-color: transparent !important;
    }
    .el-submenu__title {
      height: 50px;
      line-height: 50px;
      color: #bfcbd9;
    }
    .el-submenu__title:hover {
      color: #bfcbd9;
      background-color: rgba(102, 102, 102, 0.2);
    }
  }
}

.navSeondlist .el-menu .el-menu-item.is-active,
.navSeondlist .el-menu .el-menu-item:hover {
  color: #fff !important;
  font-weight: bold;
}

.navThirdList {
  padding: 0 10px;
  background: #fff;
  .el-menu {
    border: none;
    background: #fff;
    .el-menu-item {
      height: 30px;
      line-height: 29px;
      border: none;
      padding: 0 10px;
      color: #000;
    }
    .el-menu-item:hover,
    .el-menu-item.is-active {
      color: #1c7bef;
    }
  }
}

.el-menu--horizontal > .el-submenu /deep/ .el-submenu__title {
  height: 40px;
  line-height: 40px;
  border-bottom: 5px solid transparent;
  padding: 0 13px;
  color: #bfcbd9;
  box-sizing: border-box;
}
.el-menu--horizontal > .el-submenu.is-active /deep/ .el-submenu__title {
  border-bottom: 3px solid #409eff;
}
.el-menu--horizontal > .el-submenu /deep/ .el-submenu__title:hover {
  background: rgba(102, 102, 102, 0.2) !important;
  border-bottom-color: #409eff;
  color: #bfcbd9;
}

.benchLink {
  float: left;
  height: 40px;
  line-height: 40px;
  margin: 0 10px;
  a {
    display: block;
    color: #fff;
  }
}

.topMenuPop {
  height: 40px !important;
  line-height: 40px !important;
}
.topMenuPop:hover {
  background: rgba(102, 102, 102, 0.2);
}
.topMenuPop a {
  color: #48576a;
  display: block;
  height: 40px;
  line-height: 40px;
}
.topMenuPop.el-menu-item.is-active {
  background: #ddd;
}

.logo {
  height: 40px;
  width: auto;
}
.pagination {
  padding-top: 15px;
  padding-right: 10px;
  display: block;
}
.top_setting {
  white-space: nowrap;
  color: #bfc8d9;
  font-size: 14px;
  text-align: right;
  .top_setting_col {
    display: inline-block;
    width: auto;
    height: 40px;
    line-height: 40px;
    margin-right: 12px;
    span {
      cursor: pointer;
    }
    /deep/ .patientWar {
      margin-top: 7px;
    }
  }
  .el-badge {
    line-height: 18px;
  }
}
.langSelect {
  color: #bfc8d9;
}
.cp {
  cursor: pointer;
}
.navSeondlist .el-menu .el-menu-item.is-active {
  color: #fff;
}
.header_logo {
  display: inline-block;
  height: 30px;
}
.header_logo img {
  height: 100%;
  width: auto;
}

.verticalMenu{
  width: 200px;
  position: absolute;
  top: 40px;
  height: calc(100% - 40px);
  background: #fff;
  text-align: left;
  /deep/ .el-menu{
    border-right: 0;
  }
}
.wid36{
  width: 40px;
  height: 40px;
  background: #007AFF;
  position: relative;
  display: inline-block;
  margin-left: -100%;right: 40px;
  float: left;
}
.workstation{
  width: 100%;
  float: left;
  font-size: 14px;
  background: #525658;
  color: #FFFFFF;
}
.triangle{
  float: left;
  margin-right:-10px;
  width: 0px;
  height: 0px;
  color: white;
  text-align: center;
  border-top: 20px solid transparent;
  border-left: 10px solid #525658;
  border-bottom: 20px solid transparent;
}
</style>
