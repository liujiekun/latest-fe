<template>
  <el-dialog
    title="配血"
    :visible.sync="dialogVisible"
    class="popmatching"
    width="1000px">
    <div>
      <el-row class="patientinfo">
        <el-col :span="10">
          <p><span class="username">{{patientInfo.patientName}}</span> 男 {{patientInfo.patientAge}}岁 {{patientInfo.birthday}}</p>
          <p><span>病区：{{patientInfo.areaName}}</span>床位：{{patientInfo.hospitalBedNum}}</p>
        </el-col>
        <el-col :span="8" class="colorcc">
          <p><b class="mr15">初检血型</b><span>ABO:<i>{{reportList[0] && reportList[0].aboName}}</i></span><span>Rh(D):<i>{{reportList[0] && reportList[0].rhName}}</i></span></p>
          <p><b class="mr15">复检血型</b><span>ABO:<i>{{reportList[1] && reportList[1].aboName}}</i></span><span>Rh(D):<i>{{reportList[1] && reportList[1].rhName}}</i></span></p>
        </el-col>
        <el-col :span="6">
          <p>&nbsp;</p>
          <p>
            <el-checkbox v-model="checklist.matchingForwardTyping">正定</el-checkbox>
            <el-checkbox v-model="checklist.matchingReverseTyping">反定</el-checkbox>
          </p>
        </el-col>
      </el-row>
      <el-row style="padding-top: 15px;">
        <el-col :span="4">
          <img class="bloodimg" src="../../../../assets/img/bloodcode.png" alt="">
        </el-col>
        <el-col :span="6" style="padding-right: 30px; padding-top: 30px;">
          <el-col><b>血源编码</b></el-col>
          <el-col style="padding-top: 15px">
            <code-search
              :placeholder="'扫描或输入条码'"
              :api="matchingapi.scanBloodBankCode"
              :showBtn="false"
              :paramsCode="'bloodSourceCode'"
              :width="true"
              :enterclear="true"
              :codeSearchVal="dialogVisible"
              @returnData="returnData">
            </code-search>
          </el-col>
        </el-col>
        <el-col :span="14" style=" padding-top: 30px;">
          <el-col class="chelist">
            <el-col class="chetitle" :span="3">配血实验</el-col>
            <el-col :span="21">
              <el-checkbox-group
                v-model="check1">
                <el-checkbox v-for="(city, index) in check1list" :label="city" :key="index">{{city.name}}</el-checkbox>
              </el-checkbox-group>
            </el-col>
          </el-col>
          <el-col class="chelist">
            <el-col class="chetitle" :span="3">其它检查</el-col>
            <el-col :span="21">
              <el-checkbox-group
                v-model="check2">
                <el-checkbox v-for="(city, index) in check2list" :label="city" :key="index">{{city.name}}</el-checkbox>
              </el-checkbox-group>
            </el-col>
          </el-col>
          <el-col class="chelist">
            <el-col class="chetitle" :span="3">配血结果</el-col>
            <el-col :span="21">
              <el-radio v-model="checklist.isDecohesion" label="1">无凝聚</el-radio>
            </el-col>
          </el-col>
        </el-col>
      </el-row>
      <el-table
      style="width: 100%"
      :data="popTableData">
        <el-table-column
        prop="bloodSourceCode"
        label="血源编码">

        </el-table-column>
        <el-table-column
        prop="bloodTypesName"
        label="血液品种">

        </el-table-column>
        <el-table-column
        label="血型">
          <template slot-scope="scope">
            {{scope.row.aboName}}{{scope.row.rhName}}
          </template>
        </el-table-column>
        <el-table-column
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
        label="配血试验">
          <template slot-scope="scope">
            <el-col v-for="(item, index) in scope.row.check1" :key="index">{{item.name}}</el-col>
          </template>
        </el-table-column>
        <el-table-column
        label="其他检查">
          <template slot-scope="scope">
            <el-col v-for="(item, index) in scope.row.check2" :key="index">{{item.name}}</el-col>
          </template>
        </el-table-column>
        <el-table-column
        label="配血结果">
          <template slot-scope="scope">
            {{scope.row.isDecohesion ? '无凝聚' : ''}}
          </template>
        </el-table-column>
        <el-table-column
        label="操作">
          <template slot-scope="scope">
            <el-button type="danger" plain @click="popTableData.splice(scope.$index, 1)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button :disabled="popTableData.length ? false : true" type="primary" @click="saveMatchingData">保存</el-button>
    </span>
  </el-dialog>
</template>

<script>
import matchingapi from '@/warehouse/page/blood/store/bloodmatchingapi'
import codeSearch from '../components/codesearch'
const checklist = {
  isPolyMatching: 1,
  isBrineMatching: 0,
  isGelMatching: 0,
  isCoombsMatching: 0,
  isFnhtr: 1,
  isIrradiation: 1,
  isDecohesion: '1',
  matchingForwardTyping: true,
  matchingReverseTyping: true
}
const check1list = [
  {
    value: 'isPolyMatching',
    name: '凝聚胺法'
  },
  {
    value: 'isBrineMatching',
    name: '盐酸介质法'
  },
  {
    value: 'isGelMatching',
    name: '微柱凝胶法'
  },
  {
    value: 'isCoombsMatching',
    name: '抗球蛋白法'
  }
]
const check2list = [
  {
    value: 'isFnhtr',
    name: '滤白'
  },
  {
    value: 'isIrradiation',
    name: '辐照'
  }
]
export default {
  props: ['id', 'routeName', 'patientInfo', 'reportList'],
  components: {
    codeSearch
  },
  data () {
    return {
      matchingapi,
      checklist,
      check1list,
      check2list,
      check1: [],
      check2: [],
      dialogVisible: false,
      source: 'sampling',
      popTableData: []
    }
  },
  created () {
    this.check1list.forEach((item, index) => {
      if (index === 0) {
        this.check1.push(item)
      }
    })
    this.check2list.forEach((item, index) => {
      if (index === 0 || index === 1) {
        this.check2.push(item)
      }
    })
  },
  methods: {
    saveMatchingData () {
      let params = {
        itemlist: this.popTableData
      }
      if (this.routeName === 'readyapply') {
        params.bloodPreparationId = this.id
      } else {
        params.id = this.id
      }
      matchingapi.createBloodMatching(params).then(res => {
        if (res) {
          this.dialogVisible = false
          this.popTableData = []
          this.$emit('updateTableData', true)
        }
      })
    },
    returnData (v) {
      v.forEach(item => {
        let index = this.popTableData.findIndex(data => {
          return item.id === data.id
        })
        if (index > -1) {
          return this.$messageTips(this, 'warning', '当前血袋已在列表中')
        } else {
          item.check1 = this.check1
          item.check2 = this.check2
          Object.assign(item, checklist)
          this.popTableData.push(item)
        }
      })
    },
    open (v) {
      this.dialogVisible = true
    }
  },
  watch: {
    'check1' (v) {
      this.check1list.forEach(item => {
        this.checklist[item.value] = 0
      })
      v.forEach(item => {
        this.checklist[item.value] = 1
      })
    },
    'check2' (v) {
      this.check2list.forEach(item => {
        this.checklist[item.value] = 0
      })
      v.forEach(item => {
        this.checklist[item.value] = 1
      })
    }
  }
}
</script>

<style scoped lang="scss">
.bloodimg {
  width: 140px;
}
.popmatching {
  /deep/ .el-dialog__body{
    padding: 10px 20px;
  }
  /deep/ .el-dialog__footer {
    border-top: 1px solid #ccc;
  }
}
.patientinfo{
  background: #eee;
  border: 1px solid #ccc;
  padding: 5px 10px 10px 10px;
  p{
    line-height: 20px;
    margin-block-start: 0;
    margin-block-end: 0;
    padding-top: 10px;
    span{
      margin-right: 15px;
      i{
        font-style: normal;
        color: #000;
        padding-left: 10px;
      }
    }
    .username{
      font-size: 24px;
      font-weight: bold;
    }
  }
  .colorcc{
    span{
      color: #666;
    }
  }
}
.chelist{
  padding-top: 10px;
  .chetitle{
    font-weight: bold;
  }
}
</style>
