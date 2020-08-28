<template>
  <div>
    <!-- <div v-if="$route.name == 'bloodwarning'" class="output-container">
      <el-row>
        <el-col :span="24">
          <el-menu class="outputmenu">
            <el-menu-item @click="$router.push('/blood/bloodwarning')" :class="$route.name === 'bloodwarning' ? 'is-active' : 'is-inactive'" index="bloodwarning">
              预警配置
            </el-menu-item>
          </el-menu>
        </el-col>
      </el-row>
    </div>-->
    <div class="layout_inner" style="padding:0">
      <div class="panel-body">
        <el-table style="width: 60%" :data="tableData">
          <el-table-column prop="bloodTypesName" label="血液品种"></el-table-column>
          <el-table-column align="right" label="临期预警设置">
            <template slot-scope="scope">
              <el-input
                v-if="scope.row.isedit"
                class="alg_c"
                v-model="thisDay"
                style="width: 80px; margin-right:10px"
              ></el-input>
              <span v-else>{{scope.row.nearTheDeadline}}</span>
              天
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
    this.api.getBloodBankConfigList().then(result => {
      if (result) {
        result.forEach(item => {
          item['isedit'] = 0
        })
        this.tableData = result
      }
    })
  },
  methods: {
    editbloodbank (data) {
      data.isedit = 1
      this.thisDay = data.nearTheDeadline
    },
    updatebloodbank (data) {
      let params = Object.assign({}, data)
      params.nearTheDeadline = this.thisDay
      this.api.updateBloodBankConfig(params).then(result => {
        if (result) {
          data.nearTheDeadline = result.nearTheDeadline
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
