<!-- 任务列表 -->
<template>
  <!-- 此空container必须存在， 设置flex用 -->
  <el-container>
    <el-container class="page_layout_full_hidden">
      <el-aside class="no-box-sha flex_column_full_hidden" :width="listWidth">
        <!-- 左侧列表查询组件 -->
        <search @query="queryHandler" :no-clear-search-value="true"></search>
        <!-- 患者列表组件 -->
        <list
          class="flex_scroll mt10"
          @aside-width="handlerAsideWidth"
          @row-click="handlerRowClick"
          name="getTaskVisitSn"
          :contain-obj="containObj"
          :query-obj="queryObj"
          :custom-params="customParams"
          :page-type="pageType"
          :notify-mark="notifyMark"
          :columns="listColumns"></list>
      </el-aside>
      <el-main class="page_layout_full_hidden main ml10">
        <el-container class="flex_column_full_hidden station_layout_wrap" v-loading="loading">
          <!-- 查询条件头组件 -->
          <check-group
            :showCommonComponent="!!dispenseObj"
            :process-config="processConfig"
            :report-data="reportData"
            :page-type="pageType"
            :prescription-prams="prescriptionPrams"
            :is-show-checked="true"
            @change="handlerChange"></check-group>
          <template v-if="dispenseObj">
            <el-main class="flex_scroll main showScroll">
              <!-- 患者头组件 -->
              <patient-header :patient-id="patientId" :visit-number="visitNumber" :code="patientCode"></patient-header>
              <template v-for="(lists, key) in dispenseObj">
                <div class="radius mt10" :key="key + visitNumber" v-if="lists">
                  <stateful :status="key"></stateful>
                  <template v-for="(data, index) in lists">
                    <medicine-list
                      ref="medicineList"
                      @delete-abnormally="abnormallyDeleteHandler"
                      @selection-change="selectionChangeHandler"
                      @save-after="saveAfterHandler"
                      @operator-func="operatorBtnFunc"
                      :contain-obj="containObj"
                      :key="index"
                      :page-type="pageType"
                      :show-checkbox="operateMode == 1"
                      :operate-mode="operateMode"
                      :parent-index="index"
                      :meta-data="data"
                      :meta-data-list="lists"
                      :storage-room-list="storageRoomList"
                      :table-data="data.taskDtoList"
                      :selectable="medicineSelectable"
                      :table-config-id="STORAGE_MEDICINE_CONFIG"
                      :columns="medicineColumns"></medicine-list>
                  </template>
                </div>
              </template>
              <template>
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
import MethodsMixin from '@/warehouse/views/drug/mixin/methods.mixin.js'
export default {
  mixins: [MethodsMixin],
  data () {
    return {
      pageType: 5,
      STORAGE_MEDICINE_CONFIG,
      name: 'getTaskInfo',
      customParams: {}
    }
  }
}
</script>
