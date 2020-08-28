<template>
  <el-container class="el-container_layout" id="app" style="height:100vh" direction="vertical">
    <el-header
      id="el-header"
      height="auto"
      v-if="showNav">
      <ever-nav></ever-nav>
    </el-header>
    <el-main class="layout_main_wrap" :class="{full: $route.meta.full, h: $route.meta.h}">
      <router-view></router-view>
      <ever-account-notice v-if="showNotice"></ever-account-notice>
      <update-tip v-show="showUpdateTip"></update-tip>
      <version-tip v-show="visible" :visible.sync="visible">
        <template slot="tip">
          <p>verHashPost:{{verHashPost}}</p>
          <p>verHashWin:{{verHashWin}}</p>
        </template>
      </version-tip>
    </el-main>
  </el-container>
</template>

<script>
import everNav from '@/components/nav'
import everAccountNotice from '@/login/page/accountnotice'
import updateTip from '@/login/page/update.tip'
import versionTip from '@/login/page/version.tip'
import nprogress from 'nprogress'
// import { detectOS } from '@/util/common'

export default {
  name: 'app',
  data () {
    return {
      showNav: true,
      showNotice: true,
      showUpdateTip: false,
      visible: false,
      content: '',
      verHashPost: '',
      verHashWin: ''
    }
  },
  watch: {
    '$route.path': {
      handler (val) {
        if (val === '/login' || val === '/reset' || val === '/forgot' || val === '/down') {
          this.showNav = false
          this.showNotice = false
        } else {
          this.showNav = true
          this.showNotice = true
        }
        if (val.indexOf('follow/task') > -1) {
          this.showNotice = false
        }
      },
      immediate: true
    },
    '$store.state.pending': function (num) {
      if (num > 0) {
        nprogress.start()
      }
      if (num === 0) {
        nprogress.done()
      }
    },
    '$store.state.updating' (num) {
      if (Number(num) === 1) {
        this.showUpdateTip = true
      } else {
        this.showUpdateTip = false
      }
    },
    '$store.state.versionHash' (val) {
      this.verHashPost = val
      this.verHashWin = window.version_info
      if (!val || !this.verHashWin) return // 阻止刷新闪现跳出
      if (val !== (this.verHashWin)) {
        if (this.timeout) return
        this.timeout = setTimeout(() => {
          this.visible = true
          clearTimeout(this.timeout)
          this.timeout = ''
        }, 30000) // 30秒后提示更新
      }
    }
  },
  components: {
    everNav,
    everAccountNotice,
    updateTip,
    versionTip
  }
}
</script>

<style scoped>
.el-container_layout {
  flex-direction: column;
}
/* z-index 没有规划，互相覆盖 todo 规范 */
.el-header {
  width: 100%;
  padding: 0;
  box-shadow: 0 5px 9px 0 rgba(0, 0, 0, 0.1);
  z-index: 1002;
  text-align: center;
}
</style>
