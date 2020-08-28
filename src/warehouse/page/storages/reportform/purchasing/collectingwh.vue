<template>
  <div>
    <!-- 领用报表 -->
    <report-view-iframe
      :code="collectingCode"
      :extUrlParams="extUrlParams"
      currentStyle="height:calc(100vh - 180px);width:100%;"
    ></report-view-iframe>
  </div>
</template>

<script>
import reportViewIframe from '@/bi/page/report.view.iframe'
import storage from '@/util/storage'

export default {
  data () {
    return {
      extUrlParams: { clinicId: storage.getStorageByClinic('CLINICID') || '',
        staffId: this.$store.state.currentUser.userId
      }, // 储存的当前机构ID
    }
  },
  computed: {
    collectingCode () {
      let code = ''
      if (this.$route.matched[0].path === '/bi') {
        code = 'thc_warehouse.JiTuanLingYongHuiZongBiao.jyf'
      } else {
        code = 'thc_warehouse.JiGouLingYongHuiZongBiao.jyf'
      }
      return code
    }
  },
  components: {
    reportViewIframe
  }
}

</script>
<style>
</style>
