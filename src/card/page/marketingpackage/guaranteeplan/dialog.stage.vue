<template>
  <el-dialog
    title="阶段设置"
    width="700px"
    :visible.sync="dialogVisible"
    class="ui_dialog_02 stage"
    :close-on-click-modal="true"
    left
  >
    <ever-form2
      :schema="schema"
      v-model="obj"
      :span="24"
      :api="api"
      :rules="rules"
      :label-width="'70px'"
      ref="dptform">
      <div slot="default"></div>
      <template slot="isDynamicExecute">
          <el-radio v-model="obj.isDynamicExecute" :label="false">与计划任务一起启动</el-radio>
          <el-radio v-model="obj.isDynamicExecute" :label="true">动态启动</el-radio>
          <div v-if="obj.isDynamicExecute === true">
            距离
            <el-select v-model="obj.dependTaskId" class="mr5">
              <el-option
                v-for="item in stageSelect"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>阶段后
            <el-input class="wid40 ml20 mr5" v-model="obj.dependPeriod.day"></el-input>天
            <el-input class="wid40 mr5" v-model="obj.dependPeriod.hour"></el-input>时
            <el-input class="wid40 mr5" v-model="obj.dependPeriod.minute"></el-input>分
            <span class="ml20">启动</span>
          </div>
      </template>
    </ever-form2>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="save">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import api from '@/card/store/guaranteeplan/api.js'
let schema = [
  {
    name: 'name',
    label: '阶段名称'
  },
  {
    name: 'isDynamicExecute',
    label: '启动方式',
    comp: 'custom'
  }
]
export default {
  props: {
    packageId: {
      type: String,
      default: ''
    },
    packageName: {
      type: String,
      default: ''
    },
    detailId: {
      type: String,
      default: ''
    },
    parentId: {
      type: String,
      default: ''
    }
  },
  data () {
    let obj = this.$ever.createObjFromSchema(schema)
    obj.isDynamicExecute = false
    obj.dependTaskId = ''
    obj.dependPeriod = {
      day: 0,
      hour: 0,
      minute: 0
    }
    return {
      api,
      obj,
      schema,
      radio: '0',
      stageSelect: [],
      day: '',
      hour: '',
      minute: '',
      dialogVisible: false,
      rules: {}
    }
  },
  watch: {
    'obj.isDynamicExecute': {
      handler (val) {
        if (val) this.getByParentId()
      },
      deep: true
    }
  },
  created () {
  },
  methods: {
    open () {
      this.resetForm()
      if (this.detailId) this.getById()
      this.dialogVisible = true
    },
    resetForm () {
      this.obj.id = ''
      this.obj.name = ''
      this.obj.isDynamicExecute = false
      this.obj.dependTaskId = ''
      this.day = ''
      this.obj.dependPeriod = {
        day: 0,
        hour: 0,
        minute: 0
      }
    },
    save () {
      this.obj.businessTemplateId = this.packageId
      this.obj.businessTemplateName = this.packageName
      api.createOrModify(this.obj).then(rs => {
        if (rs.head.errCode === 0) {
          this.$parent.getDetails()
          this.dialogVisible = false
        }
      })
    },
    getById () {
      api.getById({
        id: this.detailId
      }).then(rs => {
        if (rs.head.errCode === 0) {
          this.obj = {...rs.data}
          this.obj.dependPeriod = rs.data.dependPeriod || {}
        }
      })
    },
    getByParentId () {
      api.getByParentId({
        businessTemplateId: this.packageId,
        parentId: this.parentId
      }).then(rs => {
        if (rs.head.errCode === 0) {
          if (this.obj.id) {
            rs.data.filter((item, index) => {
              item.id === this.obj.id && rs.data.splice(index, 1)
            })
          }
          this.stageSelect = rs.data || []
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.wid40{width: 60px;}
.stage{
  /deep/ .el-dialog__title{
    padding-left:10px !important;
  }
  /deep/ .el-form .el-form-item__label {
    justify-content: flex-start;
    padding: 0 0 0 10px;
    color:  #999999;
  }
}
</style>
