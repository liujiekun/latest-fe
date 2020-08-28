<template>
  <el-input class="small_font" clearable v-bind="$attrs" :value="value[prop]" @input="change" placeholder="—"></el-input>
</template>

<script>
export default {
  props: {
    value: {
      type: Object
    },
    prop: String,
    index: [String, Number]
  },
  methods: {
    change (val) {
      this.$emit('change', this.prop, val, this.index)
    }
  }
}
</script>
<style scoped lang="scss">
.small_font {
  font-size: 12px;
}
</style>
