<template>
  <div>
    <ever-bread-crumb :name="'入库'" :title="'入库'" :showTitle="true" path="/blood/entry/entrylist"></ever-bread-crumb>
    <div class="inventory-container">
      <div class="layout_inner">
        <div class="panel-body">
          <!-- <h2 class="alg_c">血液入库</h2> -->
          <div class="entryTitle">
            <h4>基本信息</h4>
          </div>
          <el-form label-width="100px">
            <el-row style="padding-top: 25px">
              <el-col :span="12">
                <el-form-item label="入库单号：" :span="12">
                  <span>{{obj.code}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="入库类型：" :span="12">
                  <span>{{setName(FULL_IN_OUT_TYPE.intype, obj.type, true)}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="入库人：" :span="12">
                  <span>{{obj.staffObject ? obj.staffObject.name : ''}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="入库时间：">
                  <span>{{obj.inDate}}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div class="hr"></div>
        <div class="panel-body">
          <!-- <h2 class="alg_c">血液入库</h2> -->
          <div class="entryTitle">
            <h4>血液入库明细</h4>
          </div>
        </div>
        <el-table :data="tableData">
          <el-table-column label="血源编码" prop="bloodSourceCode"></el-table-column>
          <el-table-column prop="varietiesCode" label="品种编码"></el-table-column>
          <el-table-column prop="bloodTypeCode" label="血型编码"></el-table-column>
          <el-table-column prop="validityCode" label="效期编码"></el-table-column>
          <el-table-column prop="bloodTypesName" label="血液品种"></el-table-column>
          <el-table-column width="90" prop="slei" label="血型">
            <template slot-scope="scope">{{scope.row.aboName + scope.row.rhName}}</template>
          </el-table-column>
          <el-table-column width="100" prop="bloodL" label="血量">
            <template slot-scope="scope">{{scope.row.bloodVolume + scope.row.unitName}}</template>
          </el-table-column>
          <el-table-column width="150" label="采血日期">
            <template slot-scope="scope">
              <span
                v-if="scope.row.drawBloodDate"
              >{{scope.row.drawBloodDate | formatDateByExp('YYYY-MM-DD HH:mm')}}</span>
            </template>
          </el-table-column>
          <el-table-column width="150" label="失效日期">
            <template slot-scope="scope">
              <span
                v-if="scope.row.bloodExpirationDate"
              >{{scope.row.bloodExpirationDate | formatDateByExp('YYYY-MM-DD HH:mm')}}</span>
            </template>
          </el-table-column>
          <el-table-column width="120" prop="price" label="采购价(元)"></el-table-column>
          <el-table-column width="100" prop="bloodDonor" label="献血者姓名"></el-table-column>
          <el-table-column width="170" prop="bloodDonorId" label="献血者身份证号"></el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../store/entrylistapi'
import setName from '@/util/setstatusname'
import { FULL_IN_OUT_TYPE } from '@/util/common'

export default {
  mixins: [setName],
  data () {
    return {
      obj: {},
      tableData: [],
      api: api,
      FULL_IN_OUT_TYPE,
      objId: this.$route.params.id
    }
  },
  created () {
    this.api.getById({ id: this.objId }).then(result => {
      if (result) {
        this.tableData = result.bloodBankList
        this.obj = Object.assign({}, result)
      }
    })
  }
}
</script>

<style scoped>
.entryInfo {
  margin-top: 15px;
}
.entryRoomCode {
  margin-top: 15px;
  border-right: 1px solid #ddd;
  padding-right: 15px;
}
.entryTitle h4 {
  border-left: 4px solid #1c7bef;
  font-size: 16px;
  padding-left: 10px;
  margin: 0;
  margin-left: -14px;
}
.entryTitle h6 {
  margin: 0;
  padding: 10px 0 0 14px;
  font-weight: normal;
  font-size: 14px;
  color: #666;
}
</style>
