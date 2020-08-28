<template>
  <div class="layout_inner padding15" :class="source">
    <div class="patientli">
      <span class="patientname">{{patientInfo.patientName}}</span>
      <sys-value type="GBT.2261.1" style="margin-left:0" :code="patientInfo.sex + ''"></sys-value> {{patientInfo.age ? patientInfo.age + '岁' : ''}} {{patientInfo.birthday}}
      <span v-if="patientInfo.patientNumber">患者编号: </span>{{patientInfo.patientNumber}}
      <span v-if="patientInfo.areaName">病区: </span>{{patientInfo.areaName}}
      <span v-if="patientInfo.hospitalBedNum">床位号: </span>{{patientInfo.hospitalBedNum}}
      <span v-if="patientInfo.sampleCode">受者血样: </span>{{patientInfo.sampleCode}}
      <span v-if="patientInfo.bloodPreparationCode">备血单号: </span>{{patientInfo.bloodPreparationCode}}
      <i v-if="patientInfo.isPressing && !source" class="iconfont icon-jinji"></i>
    </div>
    <div class="patientli" v-if="!source">
      <span class="matchingst" v-if="!source"><i class="iconfont icon-peixue" style="margin-right: 10px"></i>{{routeName == 'readyapply' ? '备血交叉' : '配血交叉'}}</span>
      <span v-if="patientInfo.sectionName">科室: </span>{{patientInfo.sectionName}}
      <span v-if="patientInfo.doctorName">医生: </span>{{patientInfo.doctorName}}
      <span v-if="patientInfo.applyTime"><i class="iconfont icon-shijian"></i>申请时间: {{patientInfo.applyTime | formatDateByExp('YYYY-MM-DD HH:mm')}}</span>
      <span v-if="patientInfo.sampleOperationTime"><i class="iconfont icon-shijian"></i>采血时间: {{patientInfo.sampleOperationTime | formatDateByExp('YYYY-MM-DD HH:mm')}}</span>
      <span v-if="patientInfo.sampleReceiveTime"><i class="iconfont icon-shijian"></i>收样时间: {{patientInfo.sampleReceiveTime | formatDateByExp('YYYY-MM-DD HH:mm')}}</span>
    </div>
    <div class="bloodtypelist" v-if="!source">
      <span class="types" v-for="(item, index) in patientInfo.bloodPreparationItemList || patientInfo.bloodMatchingTypeItemList" :key="index">{{item.bloodTypeName}}<i>{{item.applyBloodNum}}{{item.applyBloodUnitName}}</i><i style="margin-left: 5px" v-if="item.ifSubNum" class="iconfont icon-que"></i></span>
      <span class="status" v-if="routeName == 'readyapply'"
        :class="patientInfo.status == bloodConfig.BLOOD_APPLY_STATUS[1].id ? 'statussuccess' : ''">
        <i class="iconfont"
        :class="patientInfo.status == bloodConfig.BLOOD_APPLY_STATUS[1].id ? 'icon-wancheng' : 'icon-dai1'"
        style="margin-right: 10px">
        </i>{{setName(bloodConfig.BLOOD_APPLY_STATUS, patientInfo.status)}}</span>
      <span class="status" v-else
        :class="patientInfo.status == bloodConfig.BLOOD_MATCHING_STATUS[3].id ? 'statussuccess' : ''">
        <i class="iconfont"
        :class="patientInfo.status == bloodConfig.BLOOD_MATCHING_STATUS[3].id ? 'icon-wancheng' : 'icon-dai1'"
        style="margin-right: 10px">
        </i>{{setName(bloodConfig.BLOOD_MATCHING_STATUS, patientInfo.status)}}</span>
      <el-button class="fr" type="text" @click="$refs.phrform.open()">输血申请</el-button>
    </div>
    <phrform ref="phrform" class="ui_dialog_02 bloodphr" :tplCode="'SHU_XUE_SHEN_QING_DAN'" :title="'输血申请'" :readonly="true" :baseInfo="{
      patientId: patientInfo.patientId,
      hospitalizedNumber: patientInfo.hospitalizedNumber,
      providerId: patientInfo.sectionId,
      areaId: patientInfo.areaId,
      dptId: '1',
      visitNumber: patientInfo.visitNumber}"></phrform>
  </div>
</template>

<script>
import bloodConfig from '../util/bloodconfig'
import setName from '@/util/setstatusname'
import phrform from '@/form/components/phrform.dialog.vue'
export default {
  mixins: [setName],
  props: ['source', 'patientInfo', 'routeName'],
  data () {
    return {
      bloodConfig
    }
  },
  components: {
    phrform
  }
}
</script>

<style lang="scss" scoped>
.padding15{
  padding: 5px 10px;
}
.patientli{
  border-bottom: 1px solid #ccc;
  line-height: 40px;
  height: 40px;
  font-size: 14px;
  position: relative;
  span {
    color: #666;
    margin-left: 15px;
    i.icon-shijian{
      color: #999;
      margin-right: 5px;
    }
  }
  span.patientname{
    font-size: 24px;
    color: #000;
    font-weight: bold;
    margin-left: 0;
    margin-right: 15px;
  }
  span.matchingst{
    margin-left: 0;
    color: #000;
    font-weight: bold;
    i.icon-peixue{
      color: #1C7BEF;
      font-weight: normal;
      margin-right: 5px;
    }
  }
  .icon-jinji{
    position:absolute;
    right: 10px;
    top: 20px;
    font-size: 70px;
    color: #EE4433;
  }
}
.bloodtypelist{
  height: 40px;
  line-height: 40px;
  .types{
    font-size: 18px;
    font-weight: bold;
    margin-right: 50px;
    i{
      color: #F3841C;
      font-style: normal;
      margin-left: 10px;
    }
    .icon-que{
      color: #EE4433;
    }
  }
  .status{
    font-size: 18px;
    color: #1C7BEF;
    font-weight: bold;
  }
  .statussuccess{
    color: #5CBC2C;
  }
}
.sampling{
  box-shadow: 0 0 0;
  background: #eee;
  margin-top: 30px;
  border-radius: 0;
  .patientli:nth-child(2){
    border: 0;
  }
}
.bloodphr{
  /deep/ .el-form .el-form-item__label{
    display: inline-block;
  }
}
</style>
