<template>
  <div class="station_layout_wrap hospital_wrap" :class="{full: $route.matched[1] && $route.matched[1].meta.fullscreen}">
    <router-view class="station_layout_wrap" :key="key" type="zy" :from='from' v-if='key'></router-view>
    <dialog-packed-bed ref='packed' @success='success'></dialog-packed-bed>
    <dialog-change-bed ref='change' @success='success'></dialog-change-bed>
    <indepart-drag ref='indepartdrag' @success='success'></indepart-drag>
    <newborn ref='newborn' @success='success'></newborn>
    <out-of ref='outof' @success='success'></out-of>
    <el-dialog
      title="选择病区"
      :visible.sync="dialogVisible"
      :close-on-click-modal='false'
      :close-on-press-escape='false'
      :show-close='false'
      width="400px">
      <div class="clearfix" style="lineHeight:40px">
        <span style="float:left">选择病区 </span>
        <switchward ref='switchward1' @close='close' :from='from'></switchward>
      </div>
    </el-dialog>
    <div class="switchWardRightBar" :class="openss ? 'switchWardRightBaractive':''" ref='switchWardRightBar' @mousedown='mousedown($event,"switchWardRightBar")'>
      <div class="rbl" @click='clickRight'>
        切换病区
      </div>
      <div class="clearfix">
        <span style="float:left">选择病区 </span>
        <switchward ref='switchward2' @close='close2' :from='from'></switchward>
      </div>
    </div>
  </div>
</template>

<script>
  // import Hospitalnav from './hospitalnav.vue'
  import session from '../../util/session'
  import storage from '@/util/storage.js'
  import switchward from '@/inpatient/components/switch.ward'
  import {domClickHandle} from '@/util/common'
  // 公共组件 bus 调用
  import dialogPackedBed from '@/inpatient/components/dialog-packed-bed' // 包床
  import dialogChangeBed from '@/inpatient/components/dialog-change-bed' // 换床
  import indepartDrag from '@/inpatient/components/dialog-indepart-drag' // 患者入科
  import outOf from '@/inpatient/components/out.of' // 出科
  import newborn from '@/workspace/components/dialog-newborn-registration.vue' // 新生儿登记
  import mousemove from '@/util/mousemove'
  export default {
    components: {
      dialogPackedBed,
      dialogChangeBed,
      indepartDrag,
      switchward,
      outOf,
      newborn
    },
    mixins: [session, mousemove],
    watch: {
      '$route.path': {
        handler (val) {
          this.$store.commit('setWorkbenchFlag', this.$route.path.split('/')[1])
          // console.log(this.$store.state.workbenchFlag)
          this.from = this.$route.path.indexOf('birth_doctors') > -1 ? 'birth_doctors' : 'birth_nurse'
          if (!storage.getSessionStorage('birthSpaceId')) {
            this.dialogVisible = true
          }
        },
        immediate: true
      }
    },
    mounted () {
      this.mousedownInit('switchWardRightBar')
    },
    data () {
      return {
        options: [],
        value: '',
        dialogVisible: false,
        openss: false,
        key: 0,
        from: ''
      }
    },
    created () {
      this.from = this.$route.path.indexOf('birth_doctors') > -1 ? 'birth_doctors' : 'birth_nurse'
      domClickHandle('switchWardRightBar', _ => {
        this.openss = false
      })
      if (!storage.getSessionStorage('birthSpaceId')) {
        this.dialogVisible = true
      } else {
        this.key = storage.getSessionStorage('birthSpaceId')
      }
    },
    methods: {
      clickRight () {
        if (this.moved) return
        this.openss = !this.openss
        this.$refs.switchward2.init()
      },
      success () {
        this.key = this.key + 1
      },
      keys (key) {
        this.$router.push({
          path: this.$route.path
        })
        this.key = key
      },
      close (key) {
        this.dialogVisible = false
        this.keys(key)
      },
      close2 (key) {
        this.openss = false
        this.keys(key)
      }
    }
  }
</script>
