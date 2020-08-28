<!-- 门诊 任务审核 -->
<template>
  <!-- 此空container必须存在， 设置flex用 -->
  <el-container>
    <el-container class="page_layout_full_hidden">
      <el-aside class="no-box-sha flex_column_full_hidden" :width="listWidth" v-if="!auditData">
        <!-- 左侧列表查询组件 -->
        <search @query="queryHandler" :no-clear-search-value="true" :is-audit="true"></search>
        <!-- 患者列表组件 -->
        <list
          class="flex_scroll mt10"
          @aside-width="handlerAsideWidth"
          @row-click="handlerRowClick"
          name="getAuditVisitSn"
          :page-type="pageType"
          :custom-params="customParams"
          :query-obj="queryObj"
          :notify-mark="notifyMark"
          :columns="filterColumns"></list>
      </el-aside>
      <el-main class="page_layout_full_hidden main" :class="{ml10: !auditData}">
        <el-container class="flex_column_full_hidden station_layout_wrap" v-loading="loading">
          <template v-if="auditObj">
            <el-main class="flex_scroll main">
              <!-- 患者头组件 -->
              <patient-header v-if="!auditData" :patient-id="patientId" :visit-number="visitNumber" :code="patientCode"></patient-header>
              <template v-for="(lists, key) in auditObj">
                <div class="radius" :class="[auditData && ((Object.keys(auditObj).length > 1 && key == 0) || Object.keys(auditObj).length == 1) ? 'mt5' : 'mt10']" :key="key">
                  <template v-for="(data, index) in lists">
                    <medicine-list
                      v-if="data"
                      @delete-abnormally="rejectDeleteHandler"
                      @save-after="saveAfterHandler"
                      @operator-func="operatorBtnFunc"
                      :contain-obj="containObj"
                      :audit-data="auditObj[1]"
                      :has-reject="!!(auditObj[0] && auditObj[0].length)"
                      :key="index"
                      :page-type="pageType"
                      :not-current-mark="notCurrentMark"
                      :type="Number(key)"
                      :is-coloumn="true"
                      :show-checkbox="false"
                      :operate-mode="2"
                      :parent-index="index"
                      :meta-data="data"
                      :table-data="data.taskDtoList"
                      :selectable="medicineSelectable"
                      :table-config-id="STORAGE_MEDICINE_CONFIG"
                      :columns="medicineColumns"></medicine-list>
                  </template>
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
  </el-container>
</template>

<script>
import { STORAGE_MEDICINE_CONFIG } from '@/util/table-config'
import dispenseApi from '@/warehouse/views/drug/api/dispenseapi.js'
import MethodsMixin from '@/warehouse/views/drug/mixin/methods.mixin.js'
const dataType = 1 // 审核
export default {
  mixins: [MethodsMixin],
  props: {
    notCurrentMark: Boolean,
    pageType: {
      type: Number,
      default: 1
    },
    auditData: Object // 收方发药传递过来数据
  },
  watch: {
    auditData: {
      handler (v) {
        if (!v) return
        // 如果从收方发药中传入了数据， 直接使用
        this.auditObj = Object.assign({}, v)
      },
      deep: true,
      immediate: true
    }
  },
  data () {
    return {
      STORAGE_MEDICINE_CONFIG,
      customParams: {
        examineFlag: 0,
        status: 2
      },
      auditObj: null, // 审核数据 0：待审核，1：驳回，2：已审核
      funcMap: {
        resolve: this.resolveHandler,
        reject: this.rejectHandler,
      }
    }
  },
  computed: {
    filterColumns () {
      return this.listColumns.slice(1)
    }
  },
  created () {
    // 因为审核只会展示处方维度数据，审核展示模式固定为2 处方（整单）此处固定操作模式
    this.operateMode = 2
  },
  methods: {
    rejectDeleteHandler (row, index, subIndex, dataType) { // 删除驳回
      const { id } = row.taskItemList[0]
      this.cancelFunc(id, dataType, _ => {
        // this.auditObj[1] 驳回数据 [0:待审核、1:驳回、2:已审核]
        this.$messageTips(this, 'success', '驳回原因删除成功')
        this.fetchList()
        // 通知收方发药审核通过，进行后续操作
        this.$emit('notify-receive')
        // this.$set(this.auditObj[1][index].taskDtoList[subIndex].taskItemList[0], 'rejectionReasons', '')
      })
    },
    fetchList (clear) {
      // clear: 当左侧列表没有查到数据时，默认清空右侧所有数据
      if (clear) return (this.auditObj = null)
      const { id: processConfigurationId } = this.$store.state.processConfig.thisStorageroomProcessConfig
      // get data 根据条件查询发药列表-区分自备/邮寄/自取
      const params = {
        visitSn: this.visitNumber,
        processConfigurationId,
        type: 1
      }
      this.loading = true
      // get data 任务审核-查询该患者名下的任务
      dispenseApi.getTaskAuditInfo(Object.assign(params, this.queryObj)).then(res => {
        if (res && res.finally) {
          return (this.auditObj = null)
        }
        const { 0: zero, 1: one, 2: two } = res
        // 手动把后端返回的数据状态更改为 0：驳回，1：待审核，2：审核通过
        this.auditObj = {
          0: one,
          1: zero,
          2: two,
        }
      }).finally(_ => {
        this.loading = false
        // 当该患者数据不存在待审核 和 驳回数据时，删除该患者
        if (!this.auditObj || (!this.auditObj[0] && !this.auditObj[1])) {
          // notifyMark 通知list.vue 组件 修改患者异常标记信息 del: 删除患者
          this.notifyMark = {
            patientId: this.patientId,
            del: true
          }
        }
      })
    },
    resolveHandler () {
      // 审核通过是所有待审核处方一起审核
      const ids = this.auditObj[1].map(audit => audit.taskDtoList.map(task => task.id)).flat()
      const params = {
        ids,
        dataType
      }
      this.commentHandler(params)
    },
    rejectHandler (obj, parentIndex, fullAdd, fullDelete) {
      // 驳回是展示所有未审核处方明细列表标记驳回原因
      // 驳回没有删除驳回原因操作，取所有新添加的数据就可以了
      const params = this.theParamsUpdateChange(obj, fullAdd)
      this.commentHandler(params)
    },
    async operatorBtnFunc (ids, delivery, type) {
      // 检测type：因为所有操作通过一个方法emit出来，所以通过检测type类型来确定调用那类型的接口
      // 审核通过、审核驳回
      this.funcMap[type]()
    },
    commentHandler (params) {
      // 审核 和 驳回接口   params.recipeCommentDetailList为空 => 没有添加驳回数据即审核通过
      dispenseApi.comment(params).then(res => {
        if (res && res.finally) {
          // 通知收方发药审核通过，进行后续操作
          this.$emit('notify-receive')
          const has = params.hasOwnProperty('recipeCommentDetailList')
          if (!has) {
            // notifyMark 通知list.vue 组件 修改患者异常标记信息 del: 删除患者
            this.notifyMark = {
              patientId: this.patientId,
              del: true
            }
          } else {
            this.auditObj = null
          }
          this.fetchList(!has)
          this.$messageTips(this, 'success', has ? '处方驳回成功' : '处方审核通过')
        }
      })
    },
    saveAfterHandler (obj, singleAdd, fullAdd, fullDelete, parentIndex, currentData, currentIndex) {
      // this.fullSaveHandler(obj, parentIndex, fullAdd, fullDelete)
      this.funcMap.reject(obj, parentIndex, fullAdd, fullDelete)
    }
  }
}
</script>
