<template>
  <div id="basicinfo">
    <ever-form2
      v-model="queryObj"
      :schema="querySchema"
      :rules="formrules"
      ref="form"
      :span="12"
      class="diy-star"
    >
      <template slot="daterange">
        <ever-range-picker
          :start.sync="queryObj.startDate"
          :end.sync="queryObj.endDate"
          dateType="datetimerange"
          outformat="YYYY-MM-DD HH:mm:ss"
          startPlaceholder="_年_月_日 _时_分_秒"
          endPlaceholder="_年_月_日 _时_分_秒"
          :defaultTime="['00:00:00', '23:59:00']"
          autoWidth="true"
        ></ever-range-picker>
      </template>
      <template slot="canupdate">
        <el-checkbox v-model="queryObj.canupdate">下单可修改</el-checkbox>
      </template>
      <template slot="pictureUcloud">
        <el-col :span="24">
          <ever-upload1 v-model="queryObj.pictureUcloud" :limit="1" :tipsFlag="true"></ever-upload1>
        </el-col>
      </template>
      <template slot="serviceName" v-if="queryObj.categoryId === '06'">
        <el-form-item label="项目名称" style="margin-left: -120px;">
          <el-checkbox v-model="isServiceVisible">展示给患者套餐项目明细</el-checkbox>
        </el-form-item>
      </template>
       <template slot="adviceOrgId" v-if="queryObj.categoryId === '06'">
        <el-form-item label="执行机构" style="margin-left: -120px;">
          <ever-org-select v-model="queryObj.adviceOrgId" fields='id' placeholder="执行机构">展示给患者套餐项目明细</ever-org-select>
        </el-form-item>
      </template>
       <template slot="adviceDptId" v-if="queryObj.categoryId === '06'">
        <el-form-item label="执行科室" style="margin-left: -120px;">
          <ever-subject-select v-model="queryObj.adviceDptId" placeholder="执行科室"  type='select'
      fields='orgSubjectCode'></ever-subject-select>
        </el-form-item>
      </template>
       <template slot="adviceDoctorId" v-if="queryObj.categoryId === '06'">
        <el-form-item label="执行医生" style="margin-left: -120px;">
          <ever-staff-select v-model="queryObj.adviceDoctorId" placeholder="执行医生"></ever-staff-select>
        </el-form-item>
      </template>
      <template slot="default">
        <el-col>
          <el-form-item>
            <el-button
              v-if="!isGroupControl && (packageDetails && !packageDetails.isClinic)"
              type="primary"
              class="querybtn"
              @click="submit"
              :disabled="loading"
            >确定</el-button>
            <el-button class="querybtn" @click="cancel">返回</el-button>
          </el-form-item>
        </el-col>
      </template>
    </ever-form2>
  </div>
</template>
<script>
import api from '@/card/store/packagemanagement/api'
import { DISCOUNT_METHOD, debounce1 as debounce } from '@/util/common'
import { CATEGORYIDS_TYPE } from '@/card/util/cardcommon'

let codeCheck = (rule, value, callback) => {
  let res = /^([0-9a-zA-Z]){1,10}$/
  if (!res.test(value)) {
    callback(new Error('编码格式不正确'))
  } else {
    callback()
  }
}
let querySchema = [
  {
    label: '套餐编码',
    name: 'code',
    props: {
      placeholder: '请输入套餐编码'
    }
  },
  {
    label: '套餐名称',
    name: 'name',
    comp: 'sys-text',
    props: {
      maxlength: 20,
      placeholder: '请输入套餐名称'
    }
  },
  {
    label: '套餐分类',
    name: 'categoryId',
    comp: 'sys-type',
    props: {
      placeholder: '请选择套餐所属分类',
      code: 'THC_MEAL_CLASSIFY_CODE'
    }
  },
  {
    label: '折扣方式',
    name: 'discountSet',
    comp: 'ever-select',
    props: {
      placeholder: '请选择折扣方式',
      options: []
    }
  },
  {
    name: 'serviceName',
    comp: 'custom'
  },
  {
    name: 'curDptranges',
    label: '适用科室',
    comp: 'ever-subject-select',
    props: {
      params: {
        type1CodeList: [CATEGORYIDS_TYPE[0].id]
      },
      props: {
        'check-strictly': true,
      },
      ref: 'ess',
      type: 'tree',
      // multiple: true,
      fields: 'orgSubjectCode'
    },
    span: 24
  },
  {
    label: '可售有效期',
    name: 'daterange',
    comp: 'custom'
  },
  {
    label: '最低起售数量',
    name: 'minCount',
    comp: 'ever-price',
    props: {
      placeholder: '请输入最低起售数量',
      append: '次'
    }
  },
  {
    label: '使用有效期',
    name: 'validPeriod',
    comp: 'ever-price',
    props: {
      placeholder: '自下单之日起',
      append: '个月',
      max: 9999
    },
    newRow: true,
    span: 10
  },
  {
    // 是否下单可修改
    label: '',
    name: 'canupdate',
    comp: 'custom',
    span: 2,
    labelWidth: '10px',
  },
  {
    label: '套餐图片',
    name: 'pictureUcloud',
    comp: 'custom',
    span: 24
  },
  {
    label: '使用说明',
    name: 'instructions',
    comp: 'textarea',
    span: 24,
    props: {
      disabled: false,
      placeholder: '使用说明',
      maxlength: 64
    }
  },
  {
    name: 'adviceOrgId',
    comp: 'custom',
  },
  {
    name: 'adviceDptId',
    comp: 'custom',
  },
  {
    name: 'adviceDoctorId',
    comp: 'custom',
  },
  // {
  //   label: '执行科室',
  //   name: 'adviceDptId',
  //   comp: 'ever-subject-select',
  //   span: 12,
  //   props: {
  //     type: 'select',
  //     fields: 'orgSubjectCode',
  //     placeholder: '执行科室'
  //   }
  // },
  // {
  //   label: '执行医生',
  //   name: 'adviceDoctorId',
  //   comp: 'ever-staff-select',
  //   span: 12,
  //   props: {
  //     placeholder: '执行医生'
  //   }
  // }
]
let formrules = {
  code: [{
    required: 'true',
    validator: codeCheck,
    trigger: 'blur'
  }],
  name: [{
    required: 'true',
    message: '请填入套餐名称',
    trigger: 'blur'
  }],
  categoryId: [{
    required: 'true',
    message: '请选择所属分类',
    trigger: ['blur', 'change']
  }],
  discountSet: [{
    required: 'true',
    message: '请选择折扣方式',
    trigger: ['blur', 'change']
  }],
  curDptranges: [{
    required: 'true',
    message: '请选择适用科室',
    trigger: ['blur', 'change']
  }],
  validPeriod: [{
    required: 'true',
    message: '请填入套餐使用有效期',
    trigger: 'blur'
  }]
}
export default {
  props: ['packageDetails', 'isGroupControl'],
  data () {
    let queryObj = this.$ever.createObjFromSchema(querySchema)
    queryObj.startDate = ''
    queryObj.endDate = ''
    queryObj.id = undefined
    queryObj.canupdate = true
    return {
      querySchema,
      queryObj,
      formrules,
      loading: false,
      fitOrigIdsDic: {}, // 定义数组存储机构的id与名字键值对，方便科室的时候查
      pictureName: '',
      imageArr: [], // 定义回显图片的数组
      isGroup: this.$route.matched[0].meta.manage ? 1 : 0,
      packageDetailsArr: [],
      isServiceVisible: true
    }
  },
  async created () {
    this.$ever.getFieldFromSchema(this.querySchema, 'discountSet').props.options = DISCOUNT_METHOD
  },
  methods: {
    submit: debounce(function () {
      this.$refs.form.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          let params = Object.assign({}, this.queryObj)
          params.canupdate = Number(this.queryObj.canupdate)
          params.pictureName = this.pictureName
          params.isGroup = this.isGroup
          params.isServiceVisible = this.isServiceVisible
          let arrs = []
          params.curDptranges.map(item => { arrs.push({ rangeId: item, rangeCode: item }) })
          params['fitDptIds'] = arrs
          api.createOrUpdate(params).then(result => {
            this.$messageTips(this, 'success', '套餐保存成功')
            if (result && result.data) {
              this.queryObj.id = result.data.id
              this.$router.replace({
                path: this.$route.path,
                query: { ...this.$route.query, packageId: this.queryObj.id, categoryId: result.data.categoryId }
              })
              this.$bus.$emit('package-tab', { name: '2' })
              this.$emit('updateInfo', this.queryObj.id)
              // this.$bus.$emit('refresh:AdviceAfterQuote')
            }
            this.loading = false
          }).catch(
            this.loading = false
          )
        } else {
          console.log('基本信息校验失败')
        }
      })
    }, 500),
    refreshAfterEdit (data) {
      let resData = JSON.parse(JSON.stringify(data))
      if (resData.adviceOrgId) resData.adviceOrgId = resData.adviceOrgId.toString() // 机构Number => String
      this.imageArr = []
      let initDptranges = resData.fitDptIds || [] // 回显科室
      let dptranges = []
      initDptranges.map(item => { dptranges.push(item.rangeCode) })
      resData.curDptranges = dptranges
      delete resData.setMealCatalogs
      if (!resData.startDate) resData.startDate = ''
      if (!resData.endDate) resData.endDate = ''
      Object.assign(this.queryObj, resData)
      this.queryObj.canupdate = Boolean(this.queryObj.canupdate)
      if (resData.pictureName) this.pictureName = resData.pictureName
      this.isServiceVisible = resData.isServiceVisible
    },
    cancel () {
      this.$router.go(-1)
    }
  },
  watch: {
    'packageDetails': {
      handler: function (val) {
        if (val) {
          this.refreshAfterEdit(val)
        } else {
          // 新建时套餐默认套餐有效使用期从配置项读取
          api.getValueByCode({ code: 'setmeal_expiry_date' }).then(result => {
            this.queryObj.validPeriod = result.data
          })
        }
      },
      immediate: true,
      deep: true
    }
  }
}
</script>
