<template>
<!--  <phr-total-detail :patientId="patientId"></phr-total-detail>-->
  <div class="phr-box">
    <iframe
      class="phr-iframe"
      ref="phrIframe"
      :src="'/web/phr/index.html#/phr/patientdetail?&fromType=crm&patientId=' + this.$route.params.patientId"
    ></iframe>
    <!--      :src="this.$ever.host + '/web/survey-pc/pc.html#/survey/list'"-->
  </div>
</template>

<script>
  import PhrTotalDetail from '@/components/phr/phrtotaldetail'
  export default {
    data () {
      return {
        patientId: this.$route.params.patientId
      }
    },
    components: {
      PhrTotalDetail
    }
  }
</script>
<style scoped>
  .phr-box{
    width: 100%;
    height: calc(100vh - 345px);
  }
  .phr-iframe {
    width: 100%;
    height: calc(100vh - 345px);
    border: none;
  }
</style>
