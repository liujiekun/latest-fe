<template>
  <div class="ever_bg_01">
    <div class="ever_box ever_box_02">
      <pwd-form :type="1" flag="reset"></pwd-form>
    </div>
  </div>
</template>
<script>
import pwdForm from '@/login/page/password/form'

export default {
  data () {
    return {}
  },
  components: {
    pwdForm
  }
}
</script>
<style scoped>
.ever_box_02 {
  position: fixed;
  width: 600px;
  height: 480px;
  padding: 60px;
  margin-left: -370px;
  margin-top: -335px;
}
</style>
