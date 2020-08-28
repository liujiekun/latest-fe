<template>
  <div>
    <ever-bread-crumb name="厂商管理" path="/warehouse/manufacturers"></ever-bread-crumb>
    <div class="layout_inner">
      <ever-form
        :schema="schema"
        v-model="obj"
        :api="api"
        :rules="rules"
        @objsaved="afterSave" label-position="right" label-width="160px">
      </ever-form>
    </div>
  </div>
</template>
<script>
  import manufacturer from '../store/manufacturerapi'
  import {validater, validatePhone, validateEmail, validateTelautogram} from '@/util/validate'

  var schema = [
    {
      name: 'name',
      type: 'text',
      label: '厂商名称',
      min: 1,
      max: 40
    },
    {
      name: 'shortName',
      type: 'text',
      label: '厂商简称',
      min: 1,
      max: 40
    },
    {
      name: 'type',
      type: 'systype',
      code: 'THC_WH_MANUFACTURER_TYPE',
      label: '厂商类型'
    },
    {
      name: 'status',
      type: 'systype',
      code: 'THC_WH_MANUFACTURER_STATUS',
      label: '状态'
    },
    // {
    //   name: 'grade',
    //   type: 'systype',
    //   code: 'THC_WH_MANUFACTURER_LEVEL',
    //   label: '评级'
    // },
    {
      name: 'creditCode',
      type: 'text',
      label: '社会统一信用代码',
      min: 1,
      max: 40
    },
    // {
    //   name: 'licenceCode',
    //   type: 'text',
    //   label: '药品经营许可证号'
    // },
    {
      name: 'contact',
      type: 'text',
      label: '联系人姓名',
      max: 40
    },
    {
      name: 'phone',
      type: 'text',
      label: '电话',
      max: 11
    },
    {
      name: 'email',
      type: 'text',
      label: '邮箱',
      max: 40
    },
    {
      name: 'fax',
      type: 'text',
      label: '传真',
      max: 40
    },
    // {
    //   name: 'registerCapital',
    //   type: 'text',
    //   label: '注册资金',
    //   placeholder: '单位：万'
    // },
    // {
    //   name: 'industryStatus',
    //   type: 'systype',
    //   code: 'THC_WH_MANUFACTURER_TITLE',
    //   label: '行业地位'
    // },
    {
      name: 'enableDate',
      label: '生效日期',
      type: 'date',
      outformat: 'yyyy-MM-dd HH:mm:ss'
    },
    {
      name: 'disableDate',
      label: '失效日期',
      type: 'date',
      outformat: 'yyyy-MM-dd HH:mm:ss'
    },
    {
      name: 'description',
      label: '说明',
      type: 'textarea',
      span: 24
    }
  ]

  export default {
    data () {
      var obj = this.$ever.createObjFromSchema(schema)
      var _this = this
      var validateCreditCode = (rule, value, callback) => {
        validater(_this, value, 'creditCode', '您输入的统一信用代码重复，请重新输入', manufacturer, callback)
      }
      return {
        schema,
        obj: obj,
        api: manufacturer,
        objId: this.$route.params.id,
        rules: {
          name: [
            { required: true, message: '必填项', trigger: 'blur' },
            { min: 1, max: 40, message: '长度在 1 到 40 个字符', trigger: 'blur' }
          ],
          shortName: [
            { required: true, message: '必填项', trigger: 'blur' },
            { min: 1, max: 40, message: '长度在 1 到 40 个字符', trigger: 'blur' }
          ],
          creditCode: [
            { required: true, validator: validateCreditCode, trigger: 'blur' },
            { min: 1, max: 40, message: '长度在 1 到 40 个字符', trigger: 'blur' }
          ],
          contact: [
            { min: 2, max: 40, message: '长度在 2 到 40 个字符', trigger: 'blur' }
          ],
          phone: [
            { validator: validatePhone, trigger: 'blur' }
          ],
          email: [
            { validator: validateEmail, trigger: 'blur' }
          ],
          fax: [
            { validator: validateTelautogram, trigger: 'blur' }
          ]
        }
      }
    },
    mounted () {
      this.$watch('obj.creditCode', (val, oldVal) => {
        if (oldVal === '' && this.oldCreditCode === undefined) {
          this.oldCreditCode = val
        }
      })
    },
    methods: {
      afterSave () {
        this.$router.push('/warehouse/manufacturers')
      }
    },
    created () {
      // storageroom.list().then(results => {
      //   this.$ever.getFieldFromSchema(this.schema, 'storageRoomId').options = results
      // })
    }
  }
</script>
