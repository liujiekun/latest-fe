<template>
  <div class="pos_re" @click="chienseEdit(task)" :class="{red: (taskData.identification || taskData.examineFlag == 1 || task.shortage == 23 || task.status == 4) && !isAuditPage, showEdit: (isEdit && pageType != 4 && task.source != 4)}">
    <div class="pos_ab" v-if="task.status == 4" style="left: -15px">
      <span class="markIcon backgroundRed"> &nbsp;无法到货&nbsp; </span>
    </div>
    <el-popover
      :key="taskData.id"
      v-if="taskData.identification  && !isAuditPage"
      placement="bottom"
      title="异常原因:"
      width="300"
      trigger="hover">
        <template>
          <span class="red" v-html="abnormalReason"></span>
          <div class="alg_c mt5" v-if="(task.status === 2  || (isEdit && (task.status < 3 || task.status == 12)))">
            <el-button size="mini" type="primary" @click="deleteHandler">删除</el-button>
          </div>
        </template>
        <span slot="reference" class="pointer">
          <svg class="icon f18" aria-hidden="true">
            <use v-if="taskData.identification" xlink:href="#icon-yi"></use>
          </svg>
        </span>
    </el-popover>
    <svg class="icon f18" v-else aria-hidden="true"></svg>
    <svg class="icon f18" aria-hidden="true">
      <use xlink:href="#icon-que2" v-if="task.shortage == 23 && !isAuditPage"></use>
    </svg>
    <span v-if="isEdit && pageType != 4 && task.status != 4 && task.source != 4" class="blue cur edit" title="点击修改"><i class="iconfont icon-xiugai"></i></span>
    <span v-if="task.source == 4" style="width: 15px" class="inline-block">&nbsp;</span>
    <!-- :showSourceValue="taskData.source" 自备药属性 -->
    <!-- <wh-code-to-name
      v-if="taskData.localSettingObject"
      class="f_bold m0"
      :isExt="true"
      :patchObj="{
        code: GENERAL_CODE,
        list: taskData.localSettingObject.materialSkuObject.ext,
        isInfo: false
      }">
    </wh-code-to-name> -->
    <material-show-name
      :materialName="taskData.materialName"
      :icons="taskData.icons">
    </material-show-name>
    <!-- 护士补费发药 不展示 -->
    <span class="pos_re up_down" v-if="task.source != 4">
      <!-- measure:每次用量 、 measureUnitId：每次用量单位 -->
      <sub class="subs pos_ab" v-if="taskData.measure">{{numberOfMedicine}}<sys-value type="THC_WH_DOSE_UNIT" :code="taskData.unitId"></sys-value></sub>
      <!-- decoction:煎法 -->
      <sup v-if="taskData.decoction" class="sups pos_ab">(<sys-value type="THC_SYS_DECOCTINGMETHOD" :code="taskData.decoction"></sys-value>)</sup>
      <!-- 新版 -->
      <sup v-if="taskData.footnote" class="sups pos_ab">(<sys-value type="THC_SYS_DECOCTINGMETHOD" :code="taskData.footnote"></sys-value>)</sup>
      </span>
    <span v-else class="pl5">
      {{taskData.num}}<sys-value type="THC_WH_DOSE_UNIT" :code="taskData.unitId"></sys-value>
    </span>
    <div class="ml10 pos_re tips">
      <el-popover
        class="pos_ab"
        :key="taskData.id + taskData.examineFlag "
        v-if="taskData.examineFlag == 1 && (isAuditPage || notCurrentMark)"
        placement="right"
        title="驳回原因:"
        width="300"
        trigger="hover">
          <template>
            <span class="cOrange" v-html="abnormalReason"></span>
            <div class="alg_c mt5">
              <el-button size="mini" type="primary" @click="deleteHandler">删除</el-button>
            </div>
          </template>
          <span slot="reference" class="pointer">
            <span class="markIcon backgroundRed">驳回</span>
          </span>
      </el-popover>
      <el-popover
        class="pos_ab"
        :key="taskData.id + task.description"
        v-if="task.description"
        placement="right"
        title="医生说明:"
        width="300"
        trigger="hover">
          <template>
            <span class="cBlue" v-html="task.description"></span>
          </template>
          <span slot="reference" class="pointer">
            <span class="markIcon backgroundBlue">说明</span>
          </span>
      </el-popover>
    </div>
  </div>
</template>

<script>
import { GENERAL_CODE, objGet, floatTool } from '@/util/common'
import { setUpClassifyName } from '@/util/formcustom'
import { localToFixed } from '@/warehouse/views/util/index'
export default {
  props: {
    notCurrentMark: Boolean, // 标记审核驳回是否能删除
    pageType: Number,
    taskData: {
      type: Object,
      default: () => ({})
    },
    task: Object,
    isEdit: Boolean,
    multiLibrary: {  // 门诊多库房操作 -  1：门诊 2： 住院
      type: Number,
      default: 0
    },
    tableData: { // 整个中药包明细
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      GENERAL_CODE,
      setUpClassifyName
    }
  },
  computed: {
    isAuditPage () {
      return this.$route.path.indexOf('audit') > -1
    },
    cdssResult () {
      return this.taskData.taskItemList ? objGet(this.taskData, 'taskItemList[0].cdssResult', '') : this.taskData
    },
    abnormalReason () {
      const { rejectionReasons, exceptionCause } = this.taskData
      return exceptionCause || rejectionReasons
    },
    numberOfMedicine () {
      const { num, measure } = this.taskData
      return floatTool.divide(+localToFixed(num), +localToFixed(measure))
    },
    hasIdentification () { // 所有明细中存在异常数据
      return this.tableData.some(d => d.identification)
    }
  },
  methods: {
    deleteHandler () {
      if (this.isEdit && this.multiLibrary === 0) { // 住院udd才会存在 isEdit
        return this.$bus.$emit('hospital:delete-exception-cause', this.taskData, this.task) // // 派发删除异常信息
      }
      if (this.multiLibrary === 1) { // 门诊多库房统一发药 删除异常信息
        return this.$bus.$emit('outpatient:delete-exception-cause', this.task, this.taskData) // // 派发删除异常信息
      }
      // 删除驳回原因 | 异常原因
      // examineFlag：0 删除异常 | 1 删除驳回
      this.$emit('delete-reject', this.task, this.taskData.examineFlag === 1 ? 1 : 0)
    },
    chienseEdit ({ status, source }) {
      if (this.isEdit && this.pageType !== 4 && status !== 4 && source !== 4) {
        this.$bus.$emit('notify-chinese-medicine-edit', this.taskData, this.task) // 通知udd.list 组件进行修改操作
      }
    }
  }
}
</script>

<style lang="less" scoped>
.up_down {
  left: -5px;
  min-width: 60px;
  display: inline-block;
}
.sups {
  top: -1em;
}
.subs {
  bottom: -0.1em;
}
.pr10 {
  padding-right: 5px;
}
.m0 {margin: 0}
.tips {
  display: inline;
  .pos_ab {
    .markIcon {
      &:last-child {
        top: 10px
      }
      width: 40px;
      display: block;
      height: 14px;

      line-height: 14px;
    }
    &:last-child {
      top: 10px
    }
    left: 0;
    top: -6px
  }
}
.backgroundBlue {
  background: #1c78ef;
}
.backgroundOrg {
  background: #eb9e05;
}
.backgroundRed {
  background: #ee4433;
}
.showEdit {
  &:hover {
    color: #1c78ef;
    cursor: pointer;
    .edit {
      visibility: inherit
    }
  }
  .edit {
    visibility: hidden;
  }
}
</style>
