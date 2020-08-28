<template>
  <div class="register_content" id="content">
    <el-tabs class="flex_column_full_hidden" v-model="activeName" @tab-click="changeTab">
      <el-tab-pane label="历史诊断" name="lszd">
        <diagnosis-list class="flex_column_full_hidden" :init-patient="patient" :reset="reset" @getDiagnosis="setDiagnosis"></diagnosis-list>
      </el-tab-pane>
      <el-tab-pane label="挂号查询" name="ghcx">
        <dialog-number class="flex_column_full_hidden" :init-patient="patient" :reset="reset" @selectNumber="selectNumber"></dialog-number>
      </el-tab-pane>
      <el-tab-pane label="就诊排队" name="jzpd">
        <queue-list class="flex_column_full_hidden" v-model="source" :reset="reset"></queue-list>
      </el-tab-pane>
      <el-tab-pane label="号源查询" name="hycx">
        <numbersource
          v-model="source"
          class="flex_column_full_hidden"
          :appoint="selectAppoint"
          :patient="patient"
          :hide-title="true"
          :init-dept="selectDept"
          :reset="reset"
        ></numbersource>
      </el-tab-pane>
      <el-tab-pane label="排班查询" name="pbcx">
        <arrange-calendar class="flex_column_full_hidden" :operate="0" :appoint-type="1" :popover="true" @select="setSource" :reset="reset"></arrange-calendar>
      </el-tab-pane>
      <el-tab-pane label="加号记录" name="jhjl">
        <add-number-list class="flex_column_full_hidden" :reset="reset"></add-number-list>
      </el-tab-pane>
      <el-tab-pane label="补本收费记录" name="bkbb">
        <dialog-card class="flex_column_full_hidden" :init-patient="patient" :reset="reset"></dialog-card>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import diagnosisList from '@/arrange/page/hyregister/diagnosislist'
import dialogNumber from '@/arrange/page/hyregister/numberlist.vue'
import numbersource from '@/arrange/page/register/numbersource.vue'
import dialogCard from '@/arrange/page/register/dialog-cardlist.vue'
import queueList from '@/arrange/page/hyregister/queuelist.vue'
import addNumberList from '@/arrange/page/hyregister/addnumberlist.vue'
import arrangeCalendar from '@/arrange/page/register/arrange-calendar.vue'
export default {
  props: ['patient', 'appoint'],
  data () {
    return {
      activeName: 'hycx',
      source: '',
      selectAppoint: '',
      selectDept: '',
      reset: ''
    }
  },
  watch: {
    'source' (val) {
      this.$emit('getSource', val)
    },
    'appoint' (val) {
      this.selectAppoint = val
    }
  },
  created () {
    this.$bus.$off('changeDept')
    this.$bus.$on('changeDept', val => {
      this.selectDept = val
    })
    this.$bus.$on('appoint:success', val => {
      if (val) {
        this.reset = new Date().getTime()
        this.activeName = 'hycx'
      }
    })
  },
  methods: {
    setSource (val) {
      this.source = {
        date: val.date,
        deptId: val.deptId,
        deptName: val.deptName,
        resourceId: val.resourceId,
        resourceName: val.resourceName,
        resourceType: val.resourceType,
        serviceId: val.serviceId,
        serviceName: val.serviceName,
        serviceTimesliceDto: ''
      }
    },
    selectNumber (val) {
      this.$emit('selectNumber', val)
    },
    setDiagnosis (val) {
      this.$emit('getDiagnosis', val)
    },
    changeTab (val) {
      this.$bus.$emit('changetab', this.activeName)
    }
  },
  components: {
    diagnosisList,
    dialogNumber,
    numbersource,
    dialogCard,
    arrangeCalendar,
    queueList,
    addNumberList
  }
}
</script>
<style scoped lang="scss">
  .register_content {
    height: 100%;
    background: #fff;
    .el-tabs{
      /deep/.el-tabs__content{
        padding: 10px;
      }
      /deep/.el-tabs__nav-wrap{
        padding: 0 10px;
      }
      /deep/ .el-tab-pane{
        min-height: 100px;
      }
    }
  }
</style>
