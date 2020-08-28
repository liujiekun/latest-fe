<template>
  <div>
    <ever-bread-crumb name="检验项目管理" path="/warehouse/inspects"></ever-bread-crumb>
    <div class="layout_inner">
      <div class="panel-body">
        <ever-form-model
          ref="form"
          :schema="schema"
          v-model="obj"
          :api="api"
          :rules="rules"
          @objsaved="afterSave"
          label-position="right">
          <template slot="type" slot-scope="scope">
            <span>
              <el-radio-group v-model="obj.type">
                <el-radio class="radio" label="1">定量</el-radio>
                <el-radio class="radio" label="2">定性</el-radio>
              </el-radio-group>
              <ration-item v-if="obj.type === '1'" v-model="obj"></ration-item>
            </span>
          </template>
          <el-form-item>
            <el-button type="primary" @click="submitForm('form')" v-if="!objId">创建</el-button>
            <el-button type="primary" @click="submitForm('form')" v-if="objId">保存</el-button>
            <el-button @click="resetForm('form')" v-if="!objId">重置</el-button>
          </el-form-item>
        </ever-form-model>
      </div>
    </div>
  </div>
</template>
<script>
  import api from '../store/inspect'
  import form from '@/util/form'
  import rationItem from '@/components/rationitem'

  var schema = [
    {
      name: 'name',
      span: 24,
      label: '检验项目名称',
      type: 'text',
      min: 1,
      max: 40
    },
    {
      name: 'shortName',
      span: 24,
      label: '英文缩写',
      type: 'text',
      min: 1,
      max: 40
    },
    {
      name: 'type',
      span: 12,
      type: 'custom',
      label: '数据类型'
    }
  ]

  export default {
    mixins: [form],
    data () {
      var validateUnit = (rule, value, callback) => {
        if (value) {
          if (value === '2') {
            callback()
          } else if (value === '1') {
            if (!obj.unit) {
              callback(new Error('清输入单位'))
            } else {
              callback()
            }
          }
        }
      }
      var obj = this.$ever.createObjFromSchema(schema)
      obj.type = '1'
      obj.unit = ''
      obj.refValue = ''
      return {
        schema,
        obj: obj,
        api: api,
        objId: this.$route.params.id === '-1' ? null : this.$route.params.id,
        rules: {
          name: [
            { required: true, message: '必填项', trigger: 'blur' },
            { min: 1, max: 40, message: '长度在 1 到 40 个字符', trigger: 'blur' }
          ],
          shortName: [
            { required: true, message: '必填项', trigger: 'blur' },
            { min: 1, max: 40, message: '长度在 1 到 40 个字符', trigger: 'blur' }
          ],
          type: [
            {trigger: 'blur', validator: validateUnit}
          ]
        },
        baseObj: {}
      }
    },
    methods: {
      afterSave () {
        this.$router.push('/warehouse/inspects')
      },
      resetForm () {
        this.obj.name = ''
        this.obj.shortName = ''
        this.obj.unit = ''
        this.obj.refValue = ''
      }
    },
    watch: {
      'obj.type' (val) {
        if (val === '2') {
          this.obj.unit = ''
          this.obj.refValue = ''
        }
      }
    },
    components: {
      rationItem
    }
  }
</script>
