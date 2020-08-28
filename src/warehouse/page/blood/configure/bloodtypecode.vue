<template>
  <div>
    <div class="layout_inner" style="padding:0">
      <div class="panel-body">
        <el-table style="width: 60%" :data="tableData">
          <el-table-column label="血型">
            <template
              slot-scope="scope"
            >{{scope.row.bloodTypesName}}{{scope.row.bloodTypeAttachName}}</template>
          </el-table-column>
          <el-table-column align="right" label="血型编码">
            <template slot-scope="scope">
              <span v-if="!scope.row.isedit">{{scope.row.bloodTypesCode}}</span>
              <div v-for="(item, index) in scope.row.varietyCode" :key="index" v-else>
                <el-input
                  class="alg_c"
                  v-model="item.variety"
                  style="width: 80px; margin-right:10px"
                ></el-input>
                <el-button type="text" @click="addVarietyCode(scope.row)">
                  <i class="el-icon-plus f16"></i>
                </el-button>
                <el-button type="text" @click="remoteVarieCode(scope.row.varietyCode, item)">
                  <i class="f16 el-icon-delete"></i>
                </el-button>
              </div>
              <!-- <el-input v-if="scope.row.isedit" class="alg_c" v-model="thisDay" style="width: 80px; margin-right:10px"></el-input> -->
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.isedit === 0"
                @click="editbloodbank(scope.row)"
                type="text"
              >编辑</el-button>
              <el-button
                v-if="scope.row.isedit !== 0"
                type="primary"
                @click="updatebloodbank(scope.row)"
              >保存</el-button>
              <el-button v-if="scope.row.isedit !== 0" @click="scope.row.isedit = 0">取消</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../store/bloodwarningapi'
export default {
  data () {
    return {
      api: api,
      thisDay: 0,
      tableData: []
    }
  },
  created () {
    this.api.getBloodTypeConfigList().then(result => {
      if (result) {
        result.forEach(item => {
          item['isedit'] = 0
        })
        result.forEach(item => {
          item.varietyCode = []
          let arr = item.bloodTypesCode.split(',')
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
  methods: {
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
    editbloodbank (data) {
      data.isedit = 1
    },
    updatebloodbank (data) {
      // 过滤掉没有填写内容的编码输入框
      data.varietyCode = data.varietyCode.filter(item => {
        return item.variety !== ''
      })
      let str = []
      data.varietyCode.forEach(item => {
        str.push(item.variety)
      })
      data.bloodTypesCode = str.join(',')
      let params = Object.assign({}, data)
      this.api.updateBloodTypeConfig(params).then(result => {
        if (result) {
          // data.nearTheDeadline = result.nearTheDeadline
          console.log(result)
          data.isedit = 0
          this.$messageTips(this, 'success', '修改成功')
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.output-container {
  .outputmenu {
    background-color: #fff;
    font-family: PingFangSC-Semibold;
    font-size: 14px;
    color: #000;
    background-color: #f4f4f4;
    border-radius: 4px 4px 0 0;
    border-bottom: 1px solid #ddd;
    padding: 0 15px;
    .el-menu-item {
      height: 40px;
      line-height: 40px;
      color: #666;
      display: inline-block;
    }
    .el-menu-item:focus,
    .el-menu-item:hover {
      background-color: #f4f4f4;
    }
    .el-menu-item.is-active {
      color: #000;
      border-bottom: 3px solid #1c7bef;
    }
  }
}
</style>
