<template>
  <div id="opd">
    <el-container class="hospital-container">
      <dispen-search placeholder="处方单号/患者姓名" router="/storages/dispensingclinic/clinicquery"></dispen-search>
    </el-container>
    <div class="dispense_container pos_re">
      <!-- 患者信息 -->
      <!-- v-if="currentVisitPatientId" -->
      <div class="pos_re">
        <patient-header
          :patientId="currentVisitPatientId"
          :visitNumber="currentVisitNumber"
          :code="PATIENT_HEAD"
        ></patient-header>
        <!-- <history-btn @getLogList="getLogList"></history-btn> -->
      </div>
      <!-- 检查信息 -->
      <check-information></check-information>
      <!-- 诊断基本信息 -->
      <div class="patient_prescription">
        <div class="patient_title">
          备药单号：
          W1801150003
        </div>
        <div class="patient_list">
          <div v-for="item in [1, 2, 3]" :key="item">
            <el-row type="flex" align="middle" justify="start" class="table_title">
              <el-col :span="24">
                <span>处方单号：F1246789876789</span>
                <span class="ml20">2019-01-01 22:30</span>
                <el-button size="small" type="primary" class="is-plain">标记异常</el-button>
              </el-col>
            </el-row>
            <el-table :data.sync="tablePatientData" style="width: 100%" border>
              <el-table-column min-width="300" label="药品名称">
                <template slot-scope="scope">
                  <div>
                    <div
                      v-if="scope.row.outpatientDispenseItem.isMine"
                      style="display: inline-block;"
                    >
                      <span class="f12" v-if="scope.row.outpatientDispenseItem.isMine == 1">┏</span>
                      <span
                        class="f12"
                        v-if="scope.$index == mineIndex && scope.row.outpatientDispenseItem.isMine == 2"
                      >┗</span>
                      <span class="f12" v-else-if="scope.row.outpatientDispenseItem.isMine == 2">┣</span>
                    </div>
                    <span v-if="scope.row.localSetting">
                      <wh-code-to-name
                        :patchObj="{
                          code: SEARCH_CODE,
                          list: scope.row.localSetting.materialSkuObject.materialPropertys,
                          isInfo: false
                        }"
                      ></wh-code-to-name>
                    </span>
                  </div>
                  <p class="red" v-if="scope.row.outpatientDispenseItem.cdssResult">
                    <i class="f12 iconfont icon-wodebaojing red mr10"></i>
                    {{scope.row.outpatientDispenseItem.cdssResult}}
                  </p>
                  <p
                    class="red"
                    v-if="scope.row.outpatientDispenseItem.identification"
                  >{{`异常原因：${scope.row.outpatientDispenseItem.exceptionCause}`}}</p>
                </template>
              </el-table-column>
              <el-table-column width="160" label="规格">
                <template slot-scope="scope">
                  <span v-if="scope.row.localSetting">
                    <wh-code-to-name
                      :showIcon="false"
                      :patchObj="{
                        code: [SPU_SPEC_CODE],
                        list: scope.row.localSetting.materialSkuObject.materialPropertys,
                        isInfo: false
                      }"
                    ></wh-code-to-name>
                  </span>
                </template>
              </el-table-column>
              <el-table-column width="100" label="剂型">
                <template slot-scope="scope">
                  <wh-single-code-to-name
                    v-if="scope.row.localSetting"
                    :patchObj="{
                      list: scope.row.localSetting.materialSkuObject.materialPropertys,
                      code: DOSAGE
                    }"
                  ></wh-single-code-to-name>
                </template>
              </el-table-column>
              <el-table-column width="100" label="每次用量">
                <template
                  slot-scope="scope"
                >{{scope.row.outpatientDispenseItem.measure}}{{scope.row.outpatientDispenseItem.measureUnitName}}</template>
              </el-table-column>
              <el-table-column width="100" label="频次">
                <template slot-scope="scope">
                  <span>{{scope.row.outpatientDispenseItem.useFreqTxt}}</span>
                </template>
              </el-table-column>
              <el-table-column width="100" label="天数">
                <template slot-scope="scope">
                  <span>{{`${scope.row.outpatientDispenseItem.totalUseDay}天`}}</span>
                </template>
              </el-table-column>
              <el-table-column width="100" label="途径">
                <template slot-scope="scope">
                  <span>
                    {{scope.row.outpatientDispenseItem.employtxt}}
                    <sys-value
                      type="THC_CPOE_DropRate"
                      v-if="scope.row.outpatientDispenseItem.dropSpeed"
                      :code="scope.row.outpatientDispenseItem.dropSpeed"
                    ></sys-value>
                  </span>
                </template>
              </el-table-column>
              <el-table-column width="80" label="数量">
                <template slot-scope="scope">
                  <span>{{scope.row.outpatientDispenseItem.num}}</span>
                  <span
                    v-if="scope.row.localSetting"
                    class="light-gray"
                  >{{findBasesourceCode({arr: scope.row.localSetting.materialSkuObject.materialPropertys})}}</span>
                </template>
              </el-table-column>
              <el-table-column width="120" label="货位号">
                <template slot-scope="scope">
                  <span
                    v-if="scope.row.outpatientDispenseItem && scope.row.outpatientDispenseItem.containerId"
                  >{{JSON.parse(scope.row.outpatientDispenseItem.containerId)[0]}}</span>
                </template>
              </el-table-column>
              <el-table-column width="80">
                <template slot-scope="scope">
                  <div>
                    <el-button
                      v-if="scope.row.outpatientDispenseItem.isMine >= 1"
                      @click="handelMakeUpdebounce({data: mineArr, types: curTypes, curMine: scope.row.outpatientDispenseItem.isMine, isSingle: true, curAdviceType})"
                      type="text"
                    >补打标签</el-button>
                    <el-button
                      v-if="!scope.row.outpatientDispenseItem.isMine"
                      @click="handelMakeUpdebounce({data: scope.row, types: curTypes, isSingle: true, curAdviceType})"
                      type="text"
                    >补打标签</el-button>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div class="patient_title danger">以下为备药单中异常的处方</div>
        <div class="patient_info danger">
          刘毛毛（产科） 腰部损伤
          <el-button
            v-if="$hasPermission('Auth_menu_treasury_outpatientmedicine_treatmentrecord')"
            style="margin-left: 10px !important;"
            type="text"
            @click="taskGoSendCrm(item[0])"
          >诊疗记录</el-button>
          <el-button
            v-if="$hasPermission('Auth_menu_treasury_outpatientmedicine_inspection')"
            style="margin-left: 10px !important;"
            type="text"
            @click="reportOpen(item[0])"
          >检查检验报告</el-button>
        </div>
        <div class="patient_list">
          <div v-for="item in [1, 2, 3]" :key="item">
            <el-row type="flex" align="middle" justify="start" class="table_title">
              <el-col :span="24">
                <span>处方单号：F1246789876789</span>
                <span class="ml20">2019-01-01 22:30</span>
                <el-button size="small" type="primary" class="is-plain">标记异常</el-button>
              </el-col>
            </el-row>
            <el-table :data.sync="tablePatientData" style="width: 100%" border>
              <el-table-column min-width="300" label="药品名称">
                <template slot-scope="scope">
                  <div>
                    <div
                      v-if="scope.row.outpatientDispenseItem.isMine"
                      style="display: inline-block;"
                    >
                      <span class="f12" v-if="scope.row.outpatientDispenseItem.isMine == 1">┏</span>
                      <span
                        class="f12"
                        v-if="scope.$index == mineIndex && scope.row.outpatientDispenseItem.isMine == 2"
                      >┗</span>
                      <span class="f12" v-else-if="scope.row.outpatientDispenseItem.isMine == 2">┣</span>
                    </div>
                    <span v-if="scope.row.localSetting">
                      <wh-code-to-name
                        :patchObj="{
                          code: SEARCH_CODE,
                          list: scope.row.localSetting.materialSkuObject.materialPropertys,
                          isInfo: false
                        }"
                      ></wh-code-to-name>
                    </span>
                  </div>
                  <p class="red" v-if="scope.row.outpatientDispenseItem.cdssResult">
                    <i class="f12 iconfont icon-wodebaojing red mr10"></i>
                    {{scope.row.outpatientDispenseItem.cdssResult}}
                  </p>
                  <p
                    class="red"
                    v-if="scope.row.outpatientDispenseItem.identification"
                  >{{`异常原因：${scope.row.outpatientDispenseItem.exceptionCause}`}}</p>
                </template>
              </el-table-column>
              <el-table-column width="160" label="规格">
                <template slot-scope="scope">
                  <span v-if="scope.row.localSetting">
                    <wh-code-to-name
                      :showIcon="false"
                      :patchObj="{
                        code: [SPU_SPEC_CODE],
                        list: scope.row.localSetting.materialSkuObject.materialPropertys,
                        isInfo: false
                      }"
                    ></wh-code-to-name>
                  </span>
                </template>
              </el-table-column>
              <el-table-column width="100" label="剂型">
                <template slot-scope="scope">
                  <wh-single-code-to-name
                    v-if="scope.row.localSetting"
                    :patchObj="{
                      list: scope.row.localSetting.materialSkuObject.materialPropertys,
                      code: DOSAGE
                    }"
                  ></wh-single-code-to-name>
                </template>
              </el-table-column>
              <el-table-column width="100" label="每次用量">
                <template
                  slot-scope="scope"
                >{{scope.row.outpatientDispenseItem.measure}}{{scope.row.outpatientDispenseItem.measureUnitName}}</template>
              </el-table-column>
              <el-table-column width="100" label="频次">
                <template slot-scope="scope">
                  <span>{{scope.row.outpatientDispenseItem.useFreqTxt}}</span>
                </template>
              </el-table-column>
              <el-table-column width="100" label="天数">
                <template slot-scope="scope">
                  <span>{{`${scope.row.outpatientDispenseItem.totalUseDay}天`}}</span>
                </template>
              </el-table-column>
              <el-table-column width="100" label="途径">
                <template slot-scope="scope">
                  <span>
                    {{scope.row.outpatientDispenseItem.employtxt}}
                    <sys-value
                      type="THC_CPOE_DropRate"
                      v-if="scope.row.outpatientDispenseItem.dropSpeed"
                      :code="scope.row.outpatientDispenseItem.dropSpeed"
                    ></sys-value>
                  </span>
                </template>
              </el-table-column>
              <el-table-column width="80" label="数量">
                <template slot-scope="scope">
                  <span>{{scope.row.outpatientDispenseItem.num}}</span>
                  <span
                    v-if="scope.row.localSetting"
                    class="light-gray"
                  >{{findBasesourceCode({arr: scope.row.localSetting.materialSkuObject.materialPropertys})}}</span>
                </template>
              </el-table-column>
              <el-table-column width="120" label="货位号">
                <template slot-scope="scope">
                  <span
                    v-if="scope.row.outpatientDispenseItem && scope.row.outpatientDispenseItem.containerId"
                  >{{JSON.parse(scope.row.outpatientDispenseItem.containerId)[0]}}</span>
                </template>
              </el-table-column>
              <el-table-column width="80">
                <template slot-scope="scope">
                  <div>
                    <el-button
                      v-if="scope.row.outpatientDispenseItem.isMine >= 1"
                      @click="handelMakeUpdebounce({data: mineArr, types: curTypes, curMine: scope.row.outpatientDispenseItem.isMine, isSingle: true, curAdviceType})"
                      type="text"
                    >补打标签</el-button>
                    <el-button
                      v-if="!scope.row.outpatientDispenseItem.isMine"
                      @click="handelMakeUpdebounce({data: scope.row, types: curTypes, isSingle: true, curAdviceType})"
                      type="text"
                    >补打标签</el-button>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div class="patient_footer">
          <el-button type="primary" class="patient_btn_width">重打备药单</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// 数据查询
import dispenSearch from '@/warehouse/page/storages/components/dispensearch'
import patientHeader from '@/inpatient/components/common.head.js'
import historyBtn from '@/warehouse/page/storages/components/history.vue'
import checkInformation from '../components/check.information'
import { PATIENT_HEAD } from '@/util/common'
import './index.scss'
export default {
  data () {
    return {
      currentVisitPatientId: '', // 当前选中患者patientId
      currentVisitNumber: '', // 当前门诊号
      tablePatientData: [],
      PATIENT_HEAD
    }
  },
  methods: {
    getLogList () { }
  },
  components: {
    dispenSearch,
    patientHeader,
    checkInformation,
    historyBtn
  }
}
</script>

<style scoped>
</style>
