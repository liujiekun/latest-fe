<template>
  <div id="">
    <ever-bread-crumb name="业务处理" showTitle="true" path="/group/handlebusiness"></ever-bread-crumb>
    <div class="homePage">
      <el-row :gutter="20">
        <el-col :span="12">
          <update-material-list></update-material-list>
        </el-col>
        <el-col :span="12">
          <update-templet-list></update-templet-list>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import updateMaterialList from './updatemateriallist'
import updateTempletList from './updatetempletlist'
export default {
  data () {
    return {
    }
  },
  components: {
    updateMaterialList,
    updateTempletList
  }
}
</script>
<style lang="scss" scoped>
.main-option {line-height: 36px;}
.main-option h4 { margin: 0;float: left;}
</style>
