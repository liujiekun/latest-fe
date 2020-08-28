<template>
  <div>
    <ever-bread-crumb name="频次管理" :path="$route.meta.thirdActiveIndex"></ever-bread-crumb>
    <div class="layout_inner">
      <ever-form2
        :schema="schema"
        v-model="obj"
        ref="form"
        :span="11"
        :rules="rules"
        :nosubmit="true"
      >
        <template slot="frequencyItems">
          <time-picker
            v-model="obj.frequencyItems"
            :type="obj.type"
            :max-num="obj.num || 1"
            ref="timePicker"
          ></time-picker>
        </template>
      </ever-form2>
      <div class="form_handle">
        <el-button type="primary" @click="submitForm" :disabled="btnDisabled">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../../store/frequency'
import form from '@/util/form'
import timePicker from './time.picker'
export default {
  mixins: [form],
  data () {
    let schema = [
      {
        name: 'frequencyCode',
        label: '频次名称',
        comp: 'sys-type',
        props: {
          code: 'CV06.00.228'
        }
      },
      {
        name: 'num',
        label: '执行次数',
        comp: 'sys-text',
        props: {
          type: 'number',
          field: {
            min: 1,
            max: 999
          }
        }
      },
      {
        name: 'isValid',
        label: '状态',
        comp: 'sys-type',
        props: {
          code: 'THC_SOB_AVAILABLE_STATE',
          useValue: true,
          clearable: false
        }
      },
      {
        name: 'type',
        label: '执行模式',
        comp: 'sys-select',
        span: 24,
        props: {
          type: 'radio',
          options: [
            {
              id: '1',
              name: '日视图'
            },
            {
              id: '2',
              name: '周视图'
            }
          ]
        }
      },
      {
        name: 'frequencyItems',
        label: '执行时间',
        comp: 'custom',
        span: 20
      }
    ]
    let obj = this.$ever.createObjFromSchema(schema)
    obj.type = '1'
    obj.isValid = '1'
    return {
      api,
      obj,
      schema,
      objId: this.$route.params.id,
      btnDisabled: false,
      objDetail: {},
      rules: {
        frequencyCode: [
          { required: true, message: '必填项', trigger: 'change' }
        ],
        num: [
          { required: true, message: '必填项', trigger: 'change' }
        ],
        type: [
          { required: true, message: '必填项', trigger: 'change' }
        ],
        isValid: [
          { required: true, message: '必填项', trigger: 'change' }
        ],
        frequencyItems: [
          { required: true, message: '必填项', trigger: 'change' }
        ]
      }
    }
  },
  components: {
    timePicker
  },
  methods: {
    async submitForm () {
      this.btnDisabled = true
      this.$refs.form.$refs.form.validate(async valid => {
        if (valid) {
          if (!this.$refs.timePicker.validate()) {
            this.btnDisabled = false
            this.$messageTips(this, 'warning', '请选择正确的执行时间', '提示')
            return false
          }
          let data = JSON.parse(JSON.stringify(this.obj))
          if (data.frequencyItems && data.frequencyItems.length) {
            data.frequencyItems.map(item => {
              if (this.obj.type === '1') {
                item.time.sort()
                item.time = item.time.join('、')
              } else if (this.obj.type === '2') {
                let time = []
                item.time.map(sitem => {
                  sitem = sitem.join('/')
                  time.push(sitem)
                })
                item.time = time.join('、')
              }
              return item
            })
          }
          const res = await api.createOrUpdate(data)
          if (res && res.head && res.head.errCode === 0) {
            this.$messageTips(this, 'success', '保存成功！', '提示')
            this.$router.push(this.$route.meta.thirdActiveIndex)
          } else {
            this.btnDisabled = false
          }
        }
      })
    },
    cancel () {
      this.$router.push(this.$route.meta.thirdActiveIndex)
    }
  },
  watch: {
    'objDetail.frequencyItems': {
      handler (val) {
        if (val && val.length) {
          val.forEach((item, index) => {
            if (this.obj.type === '1') {
              this.obj.frequencyItems[index].time = item.time.split('、')
              this.$set(this.obj.frequencyItems, index, this.obj.frequencyItems[index])
            } else if (this.obj.type === '2') {
              let time = item.time.split('、')
              let stime = []
              time.forEach(sitem => {
                stime.push(sitem.split('/'))
              })
              let nItem = Object.assign({}, this.obj.frequencyItems[index], { time: stime })
              this.$nextTick(_ => {
                setTimeout(_ => {
                  this.$set(this.obj.frequencyItems, index, nItem)
                }, 500)
              })
            }
          })
        }
      }
    },
    'obj.num': {
      handler (val) {
        if (this.obj.frequencyItems.length) {
          this.obj.frequencyItems.map(item => {
            if (Array.isArray(item.time) && item.time.length > Number(val)) {
              item.time = item.time.slice(0, Number(val))
            }
          })
        }
      }
    },
    'objDetail': {
      handler (val) {
        // 编辑状态下，频次名称禁用，不允许修改
        if (val.frequencyCode) {
          this.$ever.getFieldFromSchema(this.schema, 'frequencyCode').props.disabled = true
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.form_handle {
  padding-left: 120px;
}
.layout_inner {
  /deep/ .el-form {
    .el-form-item--small .el-form-item__content {
      line-height: 32px;
      .el-select {
        .el-input {
          height: 32px;
        }
      }
    }
  }
}
</style>
