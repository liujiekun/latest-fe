<template>
  <div class="survey-box">
    <iframe
      class="survey-iframe"
      ref="surveyIframe"
      :src="this.$ever.host + '/web/survey-pc/pc.html#/survey/list'"
    ></iframe>
    <!--      :src="this.$ever.host + '/web/survey-pc/pc.html#/survey/list'"-->
  </div>
</template>
<script>
  export default {}
</script>
<style scoped>
  .survey-box{
    width: 100%;
    height: 100%;
  }
  .survey-iframe {
    width: 100%;
    height: 100%;
    border: none;
  }
</style>
