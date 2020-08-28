<template>
  <div class="ever_bg_01">
    <div class="ever_box ever_box_02">
      <pwd-form :type="type"></pwd-form>
    </div>
  </div>
</template>
<script>
import pwdForm from '@/login/page/password/form'

export default {
  data () {
    return {
      type: 1
    }
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
  height: 350px;
  padding: 60px;
  margin-left: -370px;
  margin-top: -255px;
}
</style>
