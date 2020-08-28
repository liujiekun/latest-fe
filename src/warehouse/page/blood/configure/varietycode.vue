<template>
  <div>
    <div class="layout_inner" style="padding:0">
      <div class="panel-body">
        <el-table
        style="width: 60%; margin-bottom: 0; border-bottom: 0"
        :data="tableData">
          <el-table-column
          prop="bloodVarietyName"
          label="血液品种">

          </el-table-column>
          <el-table-column
          align="right"
          label="品种编码">
            <template slot-scope="scope">
              <span v-if="!scope.row.isedit">{{scope.row.bloodVarietyCode}}</span>
              <div
                v-else
                v-for="(item, index) in scope.row.varietyCode" :key="index">
                  <el-input class="alg_c" v-model="item.variety" style="width: 80px; margin-right:10px"></el-input>
                  <el-button type="text" @click="addVarietyCode(scope.row)"><i class="el-icon-plus f16"></i></el-button>
                  <el-button type="text" @click="remoteVarieCode(scope.row.varietyCode, item)"><i class="f16 el-icon-delete"></i></el-button>
              </div>
            </template>
          </el-table-column>
          <el-table-column
          align="right"
          label="效期">
            <template slot-scope="scope">
              <div v-if="scope.row.isedit">
                <ever-select :options="EXPIRATION_DATE" v-model="thisDay" class="fr" :width="'20%'" placeholder=""></ever-select>
                <el-input class="alg_c fr" v-model="scope.row.effectiveTime" style="width: 80px; margin-right:10px"></el-input>
              </div>
              <span v-else>{{scope.row.effectiveTime}} {{scope.row.effectiveTimeType | formateValueToFnt({list: EXPIRATION_DATE})}}</span>
            </template>
          </el-table-column>
          <el-table-column
          align="center"
          label="操作">
            <template slot-scope="scope">
              <el-button v-if="scope.row.isedit === 0" @click="editbloodbank(scope.row)" type="text">编辑</el-button>
              <!-- <el-button v-if="scope.row.isedit === 0" @click="editbloodbank(scope.row)" type="text">删除</el-button> -->
              <el-button v-if="scope.row.isedit !== 0" type="primary" @click="updatebloodbank(scope.row)">保存</el-button>
              <el-button v-if="scope.row.isedit !== 0" @click="handlercancel(scope.row)">取消</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-row class="addvariety">
          <el-col v-if="showAddSchema">
            <!-- <el-button @click="showAddSchema = !showAddSchema" type="text">+创建</el-button> -->
          </el-col>
          <el-col v-else>
            <el-form :inline="true" :model="formInline" ref="addrariety" class="demo-form-inline">
              <el-form-item label="血液品种">
                <el-select v-model="formInline.bloodVarietyId" placeholder="请选择血液品种">
                  <el-option v-for="(item, index) in bloodOptions" :key="index" :label="item.name" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="品种编码">
                <el-input v-model="formInline.bloodVarietyCode" placeholder="请填写品种编码"></el-input>
              </el-form-item>
              <el-form-item label="效期">
                <el-input type="number" style="width: 100px;margin-right: 5px;" v-model="formInline.effectiveTime" placeholder="请填写效期"></el-input>天
              </el-form-item>
              <el-form-item>
                <el-button type="primary" plain @click="showAddSchema = !showAddSchema">取消</el-button>
                <el-button type="primary" @click="onSubmit('addrariety')">保存</el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../store/bloodwarningapi'
import bloodConfig from '../util/bloodconfig'
const EXPIRATION_DATE = [{id: 1, name: '天'}, {id: 2, name: '年'}] // 效期对应的时间单位
export default {
  data () {
    return {
      api: api,
      EXPIRATION_DATE,
      bloodConfig,
      thisDay: 0,
      tableData: [],
      formInline: {
        bloodVarietyId: '',
        bloodVarietyCode: '',
        effectiveTime: ''
      },
      showAddSchema: true,
      bloodOptions: []
    }
  },
  created () {
    bloodConfig.BLOOD_TYPE().then(result => {
      this.bloodOptions = result
    })
    this.list()
  },
  methods: {
    handlercancel (data) {
      data.isedit = 0
    },
    remoteVarieCode (data, item) {
      if (data.length === 1) return
      let index = data.indexOf(item)
      if (index > -1) {
        data.splice(index, 1)
      }
    },
    addVarietyCode (data) {
      data.varietyCode.push({
        variety: '',
        key: Date.now()
      })
    },
    list () {
      this.api.getBloodVarietyConfigList().then(result => {
        if (result) {
          result.forEach(item => {
            item['isedit'] = 0
          })
          result.forEach(item => {
            item.varietyCode = []
            let arr = item.bloodVarietyCode.split(',')
            arr.forEach(childitem => {
              item.varietyCode.push({
                variety: childitem
              })
            })
          })
          this.tableData = result
        }
      })
    },
    onSubmit (formName) {
      let data = this.formInline
      if (!data.bloodVarietyId || !data.bloodVarietyCode || !data.effectiveTime) {
        return this.$messageTips(this, 'danger', '请完善信息')
      }
      api.createBloodVarietyConfig(data).then(res => {
        if (res) {
          this.$messageTips(this, 'success', '创建成功')
          for (let key in this.formInline) {
            this.formInline[key] = ''
          }
          this.showAddSchema = true
          this.list()
        }
      })
    },
    editbloodbank (data) {
      data.isedit = 1
      this.thisDay = data.effectiveTimeType
    },
    updatebloodbank (data) {
      let str = []
      // 过滤掉没有填写内容的编码输入框
      data.varietyCode = data.varietyCode.filter(item => {
        return item.variety !== ''
      })
      data.varietyCode.forEach(item => {
        str.push(item.variety)
      })
      data.bloodVarietyCode = str.join(',')
      let params = Object.assign({}, data)
      params.effectiveTimeType = this.thisDay
      this.api.updateBloodVarietyConfig(params).then(result => {
        if (result) {
          data.effectiveTimeType = this.thisDay
          data.isedit = 0
          this.$messageTips(this, 'success', '修改成功')
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.addvariety{
  border:1px solid #ccc;
  border-top: 0;
  padding: 5px 10px;
  width: 60%;
}
</style>
