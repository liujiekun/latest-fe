<template>
  <div class="bloodsearchbox">
    <el-input v-model="code" :clearable="true" class="mr15" ref="inputfocus" :class="!width ? 'width300' : ''" :placeholder="placeholder" @keyup.enter.native="searchFn"></el-input>
    <el-button v-if="showBtn" type="primary" @click="searchFn">查询</el-button>
  </div>
</template>

<script>
export default {
  props: ['placeholder', 'api', 'codeSearchVal', 'showBtn', 'width', 'paramsCode', 'enterclear'],
  data () {
    return {
      code: ''
    }
  },
  created () {
    this.$nextTick(_ => {
      if (this.$refs.inputfocus) {
        this.$refs.inputfocus.focus()
      }
    })
  },
  methods: {
    searchFn () {
      if (!this.code) {
        return this.$messageTips(this, 'danger', '请输入条码')
      } else {
        let params = {}
        params[this.paramsCode] = this.code
        this.api(params).then(res => {
          if (res) {
            this.$emit('returnData', res)
            if (this.enterclear) {
              this.code = ''
            }
          }
        })
      }
    }
  },
  watch: {
    'codeSearchVal': {
      handler (v) {
        if (v) {
          this.code = ''
          this.$nextTick(_ => {
            if (this.$refs.inputfocus) {
              this.$refs.inputfocus.focus()
            }
          })
        }
      },
      deep: true
    }
  }
}
</script>

<style scoped lang="scss">
.bloodsearchbox{
  text-align: center
}
.width300{
  width: 50%;
}
</style>
