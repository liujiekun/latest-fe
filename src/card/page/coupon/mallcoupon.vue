<template>
	<div class="mall">
		<iframe id="mallIframe"
		    class="mall-iframe"
		    :src="url">
		</iframe>
	</div>
</template>
<script>
export default {
  data () {
    return {
      url: ''
    }
  },
  created () {
    this.getUrl()
  },
  methods: {
    getUrl () {
      // 携带external方便商城判断隐藏导航
      this.url = `/web/titan-mall-backstage#/marketing/coupon?external`
    }
  }
}
</script>
<style scoped>
	.mall {
		height: 100%;
	}
	.mall-iframe {
		width: 100%;
		height: 100%;
    border-width: 0!important;
	}
	#mallIframe #app #headerWar {
		display: none;
	}
</style>
