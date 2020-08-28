<template>
  <el-dialog
    title="取血"
    :visible.sync="dialogVisible"
    class="collect"
    width="50%">
    <code-search
      :api="api.getBloodTakeInfoByCode"
      :placeholder="'扫描或输入取血单条码'"
      :codeSearchVal="dialogVisible"
      :paramsCode="'code'"
      :showBtn="true"
      @returnData="patientData">
    </code-search>
    <bloodPatient
      v-if="patientInfo.patientId"
      :patientInfo="patientInfo"
      :source="source">
    </bloodPatient>
    <div class="matchingbox" v-if="patientInfo.patientId">
      <code-search
        :api="api.getBloodMatchingItemListByCode"
        :placeholder="'扫描或输入配血报告条码'"
        :paramsCode="'code'"
        :codeSearchVal="dialogVisible"
        :showBtn="true"
        :enterclear="true"
        @returnData="collTable">
      </code-search>
      <el-table
      class="colletable"
      :data="colleTableData"
      border>
        <el-table-column
        width="150"
        label="配血单号">
          <template slot-scope="scope">
            <thislist-icon :thisIndex="scope.row.thisIndex"></thislist-icon>
            {{scope.row.bloodMatchingCode}}
          </template>
        </el-table-column>
        <el-table-column
        width="130"
        label="血源编码">
          <template slot-scope="scope">
            {{scope.row.bloodSourceCode}}
          </template>
        </el-table-column>
        <el-table-column
        prop="bloodTypesName"
        label="血液品种">

        </el-table-column>
        <el-table-column
        width="100"
        label="血型">
          <template slot-scope="scope">
            {{scope.row.aboName}}{{scope.row.rhName}}
          </template>
        </el-table-column>
        <el-table-column
        width="80"
        label="血量">
          <template slot-scope="scope">
            {{scope.row.bloodVolume}}{{scope.row.unitName}}
          </template>
        </el-table-column>
        <el-table-column
        prop="drawBloodDate"
        label="采血日期">

        </el-table-column>
        <el-table-column
        prop="bloodExpirationDate"
        label="失效日期">

        </el-table-column>
        <el-table-column
        prop="matchingOperaterName"
        width="80"
        label="配血人">

        </el-table-column>
        <el-table-column
        width="80"
        label="操作">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.showDelete"
              type="danger"
              size="small" plain @click="deleteColleTable(scope.row, scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" :disabled="colleTableData.length ? false : true" @click="colleSuccess">取血完成</el-button>
    </span>
  </el-dialog>
</template>

<script>
import api from '../store/bloodmatchingapi'
import codeSearch from '../components/codesearch'
import bloodPatient from '../components/bloodpatient.info'
import thislistIcon from '../components/thislist.icon'
export default {
  props: [],
  created () {
  },
  data () {
    return {
      api,
      patientInfo: {},
      source: 'sampling',
      dialogVisible: false,
      colleTableData: [],
      listIndex: 0
    }
  },
  methods: {
    deleteColleTable (data, thisIndex) {
      let index = 0
      this.colleTableData.forEach(item => {
        if (item.matchingBatchId === data.matchingBatchId) {
          index++
        }
      })
      this.colleTableData.splice(thisIndex, index)
    },
    colleSuccess () {
      this.patientInfo.itemList = this.colleTableData
      this.api.updateBloodTake(this.patientInfo).then(res => {
        if (res.flag) {
          this.$messageTips(this, 'success', '取血完成')
          this.dialogVisible = false
        }
      })
    },
    patientData (v) {
      this.patientInfo = v
    },
    collTable (v) {
      let index = this.colleTableData.findIndex(item => {
        return item.matchingBatchId === v[0].matchingBatchId
      })
      if (index > -1) {
        return this.$messageTips(this, 'warning', '当前配血报告已在列表中')
      }
      if (v[0].patientId !== this.patientInfo.patientId) {
        return this.$messageTips(this, 'warning', '该配血报告与当前取血信息不符')
      }
      v[0].showDelete = true
      v.forEach(item => {
        item.thisIndex = this.listIndex
      })
      this.colleTableData = this.colleTableData.concat(v)
      this.listIndex++
    },
    open (v) {
      this.dialogVisible = true
    }
  },
  watch: {
    'dialogVisible' (v) {
      if (!v) {
        this.patientInfo = {}
        this.colleTableData = []
        this.listIndex = 0
      }
    },
    'patientInfo': {
      handler (v) {
        this.colleTableData = []
      },
      deep: true
    }
  },
  components: {
    codeSearch,
    bloodPatient,
    thislistIcon
  }
}
</script>

<style lang="scss" scoped>
.collect{
  /deep/ .el-dialog {
    overflow: hidden;
    .colletable{
      border: 1px solid #bbb!important;
      margin-top: 15px;
    }
  }
  /deep/ .el-dialog__footer {
    border-top: 1px solid #ccc;
  }
}
.matchingbox{
  width: 100%;
  padding: 0 5%;
  padding-top: 25px;
  margin-left: -5%;
  margin-right: -5%;
  background: #FFFFFF;
  box-shadow: 0 -5px 6px 0 rgba(0,0,0,0.1), inset 0 1px 0 0 #ccc;
}
</style>
