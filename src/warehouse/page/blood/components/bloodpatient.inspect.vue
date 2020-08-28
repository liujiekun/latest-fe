<template>
  <div>
    <el-table
    border
    :cell-class-name="changeCellStyle"
    :data="tableList">
      <el-table-column
      v-for="(item, index) in tableList[0].labels"
      :key="index"
      align="center"
      :label="item.inspectUnitName">
        <template slot-scope="scope">
          {{item.qualityValue}}
        </template>
      </el-table-column>
      <!-- <el-table-column
      align="center"
      label="不规则抗体筛查">
        <template slot-scope="scope">
          {{scope.row.bgz || scope.row.rhName}}
        </template>
      </el-table-column>
      <el-table-column
      align="center"
      label="ABO血型正反定型">
        <template slot-scope="scope">
          {{scope.row.aboName}}
        </template>
      </el-table-column>
      <el-table-column
      align="center"
      label="抗D">
        <template slot-scope="scope">
          {{scope.row.kd}}
        </template>
      </el-table-column>
      <el-table-column
      align="center"
      label="抗C">
        <template slot-scope="scope">
          {{scope.row.kc}}
        </template>
      </el-table-column>
      <el-table-column
      align="center"
      label="抗E">
        <template slot-scope="scope">
          {{scope.row.ke}}
        </template>
      </el-table-column>
      <el-table-column
      align="center"
      label="受者血样">
        <template slot-scope="scope">
          {{scope.row.sampleCode}}
        </template>
      </el-table-column>
      <el-table-column
      align="center"
      label="采血人">
        <template slot-scope="scope">
          {{scope.row.sampleOperation}}<span class="ml10">{{scope.row.sampleOperationTime}}</span>
        </template>
      </el-table-column>
      <el-table-column
      align="center"
      label="收样人">
        <template slot-scope="scope">
          {{scope.row.sampleReceive}}<span class="ml10">{{scope.row.sampleReceiveTime}}</span>
        </template>
      </el-table-column> -->
    </el-table>
  </div>
</template>

<script>
export default {
  props: ['tableData'],
  computed: {
    tableList () {
      return [{labels: [...this.tableData]}]
    }
  },
  data () {
    return {
    }
  },
  methods: {
    changeCellStyle ({row, column, rowIndex, columnIndex}) {
      // if (rowIndex === 1 && columnIndex === 1 && row.rhName !== this.tableData[0].rhName) {
      //   return 'errorhanld'
      // }
      // if (rowIndex === 1 && columnIndex === 2 && row.aboName !== this.tableData[0].aboName) {
      //   return 'errorhanld'
      // }
      // if (rowIndex === 1 && columnIndex === 3 && row.rhName !== row.kd) {
      //   return 'warninghanld'
      // }
      // if (rowIndex === 1 && columnIndex === 4 && row.rhName !== row.kc) {
      //   return 'warninghanld'
      // }
      // if (rowIndex === 1 && columnIndex === 4 && row.rhName !== row.ke) {
      //   return 'warninghanld'
      // }
    }
  }
}
</script>

<style lang="scss" scoped>
.layout_box .el-table--border {
  border-bottom: 0;
  border-right: 0;
  /deep/ th{
    border-right: 1px solid #ccc!important;
    border-bottom: 1px solid #ccc!important;
  }
  /deep/ td{
    border-right: 1px solid #ccc!important;
    border-bottom: 1px solid #ccc!important;
  }
  /deep/ td.lefthanld {
    background: #eee;
    color: #000;
    font-weight: bold;
  }
  /deep/ td.errorhanld {
    background: #EE4433;
    color: #fff;
  }
  /deep/ td.warninghanld{
    background: #FDE7E4;
    color: #EE4433;
  }
}
</style>
