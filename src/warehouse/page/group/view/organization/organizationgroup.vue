<template>
  <div>
    <div class="layout_inner">
      <div v-if="headStatus">
        <el-button class="f16" type="text" @click="handleInitial">&lsaquo;&lsaquo; 返回组织架构</el-button>
        <span
          v-if="headStatus == 'seeGroup'"
          class="from_title_text f14"
        >提示：在集团架构中，单个机构的内部组织结构只允许查看；如需修改，请进入该机构内进行修改。</span>
      </div>
      <div v-if="architectureType == FRAMEWORK[0]">
        <wh-tree
          ref="whtree"
          :FRAMEWORK="FRAMEWORK"
          @currentStatus="handleStatus"
          :architectureType="architectureType"
          :blockFlag="blockFlag"
          @handleCheckBlock="handleCheckBlock"
        ></wh-tree>
      </div>
    </div>
  </div>
</template>
<script>
import whTree from '@/warehouse/page/components/whtree'

/**
 * FRAMEWORK 组织管理类型
 * {Number}}      121              集团架构
 * {Number}       122              自定义架构
 * {Number}       123              集团发药
 * **/
const FRAMEWORK = [121, 122, 123]
export default {
  data () {
    return {
      FRAMEWORK,
      headStatus: '',
      architectureType: '',
      blockFlag: false
    }
  },
  activated () {
    this.architectureType = ''
    this.$nextTick(() => {
      this.architectureType = FRAMEWORK[0]
    })
  },
  methods: {
    handleCheckBlock () {
      this.blockFlag = false
    },
    handleInitial () {
      this.headStatus = ''
      this.blockFlag = true
    },
    handleStatus (type) {
      this.headStatus = type
    }
  },
  components: {
    whTree
  }
}
</script>
<style lang="less" scoped>
.from_title_text {
  display: block;
  line-height: 22px;
  height: 22px;
  background-color: #f5f3c7;
  padding: 10px 20px;
  color: #000;
}
</style>
