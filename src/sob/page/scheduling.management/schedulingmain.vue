<template>
  <el-tabs v-model="activeName">
    <el-tab-pane name="first" label="业务配置">
      <business></business>
    </el-tab-pane>
    <el-tab-pane name="second" label="规则配置">
      <rule></rule>
    </el-tab-pane>
  </el-tabs>
</template>
<script>
import business from './business.vue'
import rule from './rule.vue'
export default {
  data () {
    return {
      activeName: 'first'
    }
  },
  components: {
    business,
    rule
  }
}
</script>
<style scoped>
</style>
