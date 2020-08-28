<template>
  <el-container>
    <!-- 搜索 查询 -->
    <div>
      <ever-form2
        onsubmit="return false;"
        :schema="querySchema"
        v-model="queryObj"
        ref="form"
        :inline="true"
        :is-query="true"
        :input-query="true">
        <template slot="sourceCode">
          <el-input v-model="inputSourceCode" @clear="list" :placeholder="inputPlaceholder" :clearable="true" @keyup.enter.native="list"></el-input>
        </template>
        <template slot="default">
          <el-form-item class="ml10">
            <el-button size="small" type="primary" @keyup.enter.native="list" @click="list">查询</el-button>
          </el-form-item>
        </template>
      </ever-form2>
    </div>
    <el-container class="page_layout_full_hidden">
      <!-- 左侧列表 -->
      <el-aside class="no-box-sha flex_column_full_hidden mt10" :width="source === 28 ? '380px' : '525px'">
        <back-list
          class="flex_scroll"
          ref="backlist"
          :searchSwit="searchSwit"
          @row-click="handlerRowClick"
          name="getOrderBy"
          :query-obj="queryObj"
          :custom-params="customParams"
          :columns="filterColumns">
        </back-list>
      </el-aside>
      <!-- 右侧 详情数据 -->
      <el-main class="page_layout_full_hidden main ml10 mt10">
        <el-container class="flex_column_full_hidden station_layout_wrap" v-loading="loading">
          <template v-if="dispenseObj">
            <el-main class="flex_scroll main">
              <!-- 患者头组件 -->
              <patient-header :patient-id="patientId" :visit-number="visitNumber" :key="visitNumber" :code="patientCode"></patient-header>
              <!-- 右侧列表数据 -->
              <template v-for="(lists, key) in dispenseObj">
                <div class="radius mt10" :key="key" v-if="lists">
                  <stateful :status="key"></stateful>
                  <div v-for="(data, index) in lists" :key="index">
                    <back-medicine-list
                      @selection-change="selectionChangeHandler"
                      :type="Number(key)"
                      :meta-data="data"
                      :table-data="data.taskDtoList"
                      :parent-index="index"
                      :columns="BackRightColumn"
                      :source="source"
                      :selectable="medicineSelectable"
                      :table-config-id="STORAGE_MEDICINE_CONFIG"
                      :operate-mode="1">
                    </back-medicine-list>
                    <!-- 操作按钮 -->
                    <back-action-btn
                      :toExamine="toExamine"
                      ref="backBtnbox"
                      @back-action-btn="backActionBtn"
                      :tableData="data.taskDtoList"
                      :selection-table="selectableList[Number(key)]"
                      :key="index"
                      :isInvented="isInvented"
                      :type="Number(key)">
                    </back-action-btn>
                  </div>
                </div>
              </template>
            </el-main>
          </template>
          <template v-else>
            <ever-no-data :tip-txt="noDataTip"></ever-no-data>
          </template>
        </el-container>
      </el-main>
    </el-container>
    <!-- 驳回/拒收 弹窗 -->
    <el-dialog :title="backErrorTitle" :visible.sync="centerDialogVisible" width="400px" center>
      <el-input type="textarea" :rows="2" :placeholder="`请输入${backErrorTitle}原因`" v-model="backErrorTextarea"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="backErrorFn" :disabled="!backErrorTextarea.length" size="small">{{backErrorTitle.substring(2, 4)}}</el-button>
      </span>
    </el-dialog>
  </el-container>
</template>

<script>
import { STORAGE_MEDICINE_CONFIG } from '@/util/table-config'
import BackMethodsMixin from '@/warehouse/views/drug/mixin/back.methods.mixin.js'
import { REMOTE_METHODS_WIDTH } from '@/warehouse/views/util/constant'
let querySchema = [
  {
    name: 'patientId',
    label: '患者',
    comp: 'ever-patient-select',
    props: {
      placeholder: '输入患者姓名、患者编号、就诊卡号',
      clearable: true
    },
    parentClass: 'inline-form-item'
  },
  {
    name: 'localMaterialId',
    label: '物资名称',
    comp: 'material-select',
    props: {
      params: { materialType: '' }
    },
    style: REMOTE_METHODS_WIDTH,
  },
  {
    label: '处方号/业务单号',
    name: 'sourceCode',
    comp: 'custom',
  },
  {
    label: '状态',
    name: 'status',
    comp: 'select',
    props: {
      options: [
        {
          id: 0,
          name: '全部'
        },
        {
          id: 1,
          name: '待处理'
        },
        {
          id: 2,
          name: '已处理'
        },
      ],
      clearable: false
    }
  }
]
export default {
  mixins: [BackMethodsMixin],
  props: {
    source: {
      type: Number,
      default: 28
    }
  },
  data () {
    const queryObj = this.$ever.createObjFromSchema(querySchema)
    return {
      querySchema,
      queryObj,
      STORAGE_MEDICINE_CONFIG,
      name: 'getBackStocksList',
      inputSourceCode: '',
      inputPlaceholder: '处方号/业务单号',
      searchSwit: false,
      customParams: {
        source: this.source
      }
    }
  },
  created () {
    this.$nextTick(_ => {
      this.queryObj.status = 0
      this.searchSwit = true
    })
    let index = this.querySchema.findIndex(item => item.name === 'sourceCode')
    if (this.source === 29) {
      if (~index) this.querySchema.splice(index, 1)
    } else {
      if (!~index) {
        this.querySchema.splice(this.querySchema.length - 1, 0, {
          label: '处方号/业务单号',
          name: 'sourceCode',
          comp: 'custom',
          parentClass: 'inline-form-item'
        })
      }
    }
  },
  computed: {
    filterColumns () {
      return this.backListColumns[this.source].slice(0)
    }
  },
  methods: {
    list () {
      this.queryObj = Object.assign({}, this.queryObj, { sourceCode: this.inputSourceCode })
    }
  },
}
</script>

<style scopd lang="scss">
.el-form /deep/ .inline-form-item{
  width: 350px;
  .el-form-item__content{
    width: 280px;
  }
}
</style>
