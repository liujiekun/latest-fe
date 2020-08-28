<template>
  <div v-loading="loading">
    <iframe :src="src" :style="defaultStyle" frameborder="0"></iframe>
  </div>
</template>
<script>
import urlMap from '@/systemset/urls'
import { request } from '@/util/req'

export default {
  props: {
    code: [String],
    extUrlParams: [Object],
    currentStyle: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      src: '',
      defaultStyle: '',
      loading: true
    }
  },
  created () {
    if (this.currentStyle === '') {
      this.defaultStyle = 'width: 100%;border:0:height: calc(100vh - 220px)'
    } else {
      this.defaultStyle = this.currentStyle
    }
    this.renderUrl()
  },
  watch: {
    'code' (val) {
      if (val) {
        this.renderUrl()
      }
    }
  },
  methods: {
    renderUrl () {
      request(urlMap.report.getByHisReportCode, {
        hisReportCode: this.$route.params.code || this.code
      }).then(res => {
        if (res.head.errCode === 0) {
          this.src = res.data.biReportUrlUser
          if (this.extUrlParams) {
            Object.keys(this.extUrlParams).forEach(val => {
              if (this.extUrlParams[val].includes('.') || this.extUrlParams[val].includes(',')) {
                this.src = this.src + ('&' + val + '=' + `"${this.extUrlParams[val]}"`)
              } else {
                this.src = this.src + '&' + val + '=' + `${this.extUrlParams[val]}`
              }
            })
          }
          console.log(this.src, '报表地址')
          this.$emit('getReportObj', res.data)
          this.loading = false
        } else {
          this.loading = false
        }
      })
    }
  }
}
</script>
<style scoped>
iframe{background:#f1f1f1}
</style>
