<template>
  <div class="tech_select">
      <el-button @click='turn("800")'>检查</el-button>
      <el-button @click='turn("801")'>检验</el-button>
      <el-button @click='turn("802")'>治疗</el-button>
  </div>
</template>
<script>

export default {
  data () {
    return {
        // visitNumber=OP20190000003257&adviceType=800&patientId=hs5jQUDSFaRuvcH2nPU
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    turn (type) {
      this.$emit('open')
      // this.$router.push({
      //   name: 'tech_main',
      //   params: {type},
      //   query: {
      //     visitNumber: 'OP20190000003257',
      //     patientId: 'hs5jQUDSFaRuvcH2nPU'
      //   }})
    },
    init () {

    }
  },
  watch: {

  }
}
</script>
<style lang="scss" scoped>
.tech_select{

}
</style>
