<template>
  <div class='bedContainer'>
    <p class='topSelect'>
        <span>请选择病区：</span>
        <el-select v-model="wardId" placeholder="请选择病区" @change='getBedList'>
          <el-option
            v-for="item in tableData"
            :key="item.id"
            :label="item.label"
            :value="item.id">
          </el-option>
        </el-select>
    </p>
    <box-list :patients="bedList" :isAdt="true"></box-list>
  </div>
</template>
<script>
import boxList from '@/inpatient/page/boxlist'
import api from '@/adt/store/register'
export default {
  components: {
    boxList
  },
  data () {
    return {
      wardId: '',
      tableData: [],
      bedList: []
    }
  },
  created () {
    this.getWardList()
  },
  methods: {
    getWardList () {
      api.getAdmitWardSelect({}).then(res => {
        if (res && res.head.errCode === 0) {
          res.data.forEach(item => {
            let obj = {}
            obj.id = item.id
            obj.label = item.sickAreaName
            this.tableData.push(obj)
          })
        }
      })
    },
    getBedList () {
      let params = {
        areaId: this.wardId
      }
      api.getBedList(params).then(res => {
        if (res && res.head.errCode === 0) {
          this.bedList = res.data
        }
      })
    }
  }
}
</script>
<style scoped>
.bedContainer {
  padding: 5px;
  background: #fff;
  overflow: auto;
}
</style>
