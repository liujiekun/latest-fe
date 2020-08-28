<template>
  <el-row :gutter="10" style="padding:0 5px;">
    <el-col v-for="n in maxNum" :key="n" :span="Math.floor(24 / maxNum)">
      <sys-cascader v-model="input[n-1]" :options="options" :filterable="true"></sys-cascader>
    </el-col>
  </el-row>
</template>

<script>
  export default {
    props: ['value', 'maxNum', 'options'],
    data () {
      return {
        input: this.value || []
      }
    },
    methods: {

    },
    watch: {
      value (val) {
        this.input = val || []
      },
      input: {
        handler (val) {
          val = val || []
          this.$emit('input', val)
        },
        deep: true
      }
    }
  }
</script>
