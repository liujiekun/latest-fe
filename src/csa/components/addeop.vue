<template>
  <div></div>
</template>
<script>

export default {
  props: [],
  data () {
    return {

    }
  },
  watch: {

  },
  mounted () {

  },
  methods: {

  },
  components: {
    // eoptime
  }
}
</script>

<style scoped lang='scss'>
.form-required {
  /deep/ .el-form-item__content {
    background: #fef5be;
    border-radius: 4px;
    border: 1px solid #bbb;
    padding-left: 5px;
    line-height: 36px;
    height: 36px;
  }
}
.appoint /deep/ .el-dialog__body {
  padding-top: 0;
}
.appoint /deep/ .el-table__body {
  cursor: pointer;
}
.appoint /deep/ .el-dialog__headerbtn {
  top: 15px;
}
.line {
  border-right: 1px solid #ddd;
}
.header {
  margin: 20px 0;
}
.header strong.title {
  padding-left: 6px;
  border-left: 3px solid #1c7bef;
  font-size: 16px;
  color: #000;
}
.blue {
  color: #1c7bef;
}
.green {
  color: #61a812;
}
.orange {
  color: #e38748;
}
.violet {
  color: #bd10e0;
}
.gray {
  color: #666666;
}
.deepblue {
  color: #366298;
}
.title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 20px;
  position: relative;
}
.title .el-icon-close {
  position: absolute;
  right: 0;
  top: 0;
  font-size: 20px;
  cursor: pointer;
}
.el-form-item {
  margin-bottom: 15px;
}
.footer {
  padding: 15px 0 4px;
  border-top: 1px solid #ddd;
}
.footer .el-button {
  width: 120px;
}
.el-form /deep/ .el-radio + .el-radio,
.el-form /deep/ .el-checkbox + .el-checkbox {
  margin-left: 10px;
}
</style>
