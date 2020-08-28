<template>
  <div>
    <ever-bread-crumb name="资源管理" path="/crm/source"></ever-bread-crumb>
    <div class="layout_inner">
      <div class="panel-body">
        <ever-form2
        class="form"
        :schema="schema"
        v-model="obj"
        :api="api"
        ref="form"
        :rules="rules"
        :inline="false"
        label-position="center">
        <template slot="resourceType">
          <el-select v-model="obj.resourceType" filterable clearable placeholder="请选择">
            <el-option
              v-for="item in resourceTypeArr"
              :key="item.code"
              :label="item.name"
              :value="item.code">
              </el-option>
            </el-select>
          </template>
          <template slot="form">
            <el-form :model="obj.form"  class="department" ref="department">
              <department v-for='(temp, index) in obj.form.department' ref="temp" :temp="temp" :key="index" :lgth="obj.form.department.length" :num="index" @addrow="addrow" @delrow="delrow"></department>
            </el-form>
          </template>
          <div slot="default"></div>
        </ever-form2>
      </div>
      <div class="panel-footer table-btn-ml">
        <el-button type="primary" @click="saveCaseTemplate" v-ever-click-once="disabled" :disabled="disabled">保存</el-button>
        <el-button @click="prevBack">取消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/arrange/store/sourceapi'
import department from '@/arrange/page/source/department'

let schema = [
  {
    name: 'resourceName',
    label: '资源名称',
    comp: 'el-input',
    span: 24,
    props: {
      disabled: false
    }
  },
  {
    name: 'resourceType',
    label: '资源类型',
    span: 24,
    comp: 'custom'
  },
  {
    name: 'form',
    label: '部门',
    span: 24,
    comp: 'custom'
  },
  {
    name: 'isValid',
    label: '状态',
    span: 24,
    comp: 'el-select',
    props: {
      filterable: true,
      clearable: true,
      valueKey: 'name',
      options: [
        { id: '1', name: '有效' },
        { id: '0', name: '无效' }
      ]
    }
  }
]

export default {
  name: 'sourceDetail',
  data () {
    var obj = this.$ever.createObjFromSchema(schema)
    obj.form = {
      department: [
        {
          scene: '',
          sourceName: {},
          sourceArr: [],
          serviceTimeSlice: '',
          sliceVolume: ''
        }
      ]
    }
    return {
      api,
      obj,
      schema,
      disabled: false,
      sourceId: this.$route.params.id === '-1' ? null : this.$route.params.id,
      rules: {
        resourceName: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        resourceType: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        form: [
          { required: true, message: '必填项', trigger: 'blur', type: 'object' }
        ],
        isValid: [
          { required: true, message: '必填项', trigger: 'change' }
        ]
      },
      dynamicTags: ['标签一', '标签二', '标签三'],
      inputVisible: false,
      inputValue: '',
      sourceCode: 'arrange',
      resourceTypeArr: []
    }
  },
  created () {
    this.getSubResourceType()
    if (this.sourceId) {
      this.getById(this.sourceId)
    }
  },
  watch: {
    'sourceId' (val) {
    }
  },
  methods: {
    getSubResourceType () {
      this.api.getSubResourceType().then(rs => {
        if (rs && rs.data && rs.data.length > 0) {
          this.resourceTypeArr = rs.data
        }
      })
    },
    getById (param) {
      this.api.getById(param).then(rs => {
        if (rs && rs.data) {
          this.obj.resourceName = rs.data.resourceName
          this.obj.resourceType = rs.data.resourceType
          this.obj.isValid = String(rs.data.isValid)
          if (rs && rs.data && rs.data.resourceScopes && rs.data.resourceScopes[0]) {
            this.obj.form.department = rs.data.resourceScopes.map(v => {
              let obj = Object.assign({}, v)
              let tmp = Object.assign({}, {
                deptId: v.deptId,
                deptName: v.deptName,
                deptType: v.deptType
              })
              obj.sourceName = tmp
              return obj
            })
          }
        }
      })
    },
    getDeptList () {
      this.api.getDeptList().then(rs => {
        this.sourceArr = rs
      })
    },
    saveCaseTemplate () {
      let option1 = {
        resourceName: this.obj.resourceName,
        resourceType: this.obj.resourceType,
        sourceCode: 'arrange',
        description: '备注',
        isValid: this.obj.isValid
      }
      option1.resourceScopes = []
      let object = {}
      this.obj.form.department.map(v => {
        object.scene = v.scene
        object.serviceTimeSlice = v.serviceTimeSlice
        object.sliceVolume = v.sliceVolume
        object.deptType = v.sourceName.deptType
        object.deptId = v.sourceName.deptId
        object.deptName = v.sourceName.deptName
        option1.resourceScopes.push(object)
        object = {}
      })
      this.$refs.form.$refs.form.validate(valid => {
        this.$refs.temp.map(v => {
          v.$refs.temp.validate(validate => {
            if (!validate) {
              return
            }
          })
        })
        if (valid) {
          if (!this.sourceId) {
            this.api.create(option1).then(rs => {
              if (rs.head.errCode === 0) {
                this.$notify({
                  title: '成功',
                  message: rs.head.errMsg,
                  type: 'success'
                })
                this.$router.push('/crm/source')
              } else {
                this.$notify({
                  title: '失败',
                  message: '创建失败',
                  type: 'warning'
                })
              }
            })
          } else {
            option1.id = this.sourceId
            this.api.update(option1).then(rs => {
              if (rs.head.errCode === 0) {
                this.$notify({
                  title: '成功',
                  message: rs.head.errMsg,
                  type: 'success'
                })
                this.$router.push('/crm/source')
              } else {
                this.$notify({
                  title: '失败',
                  message: '更新失败',
                  type: 'warning'
                })
              }
            })
          }
        }
      })
    },
    prevBack () {
      window.history.go(-1)
    },
    addrow () {
      this.obj.form.department.push({
        scene: '',
        sourceName: {},
        sourceArr: [],
        serviceTimeSlice: '',
        sliceVolume: ''
      })
    },
    delrow (index) {
      if (index === 0 && this.obj.form.department.length === 1) {
        this.clearItem()
      } else {
        this.obj.form.department.splice(index, 1)
      }
    },
    clearItem () {
      this.obj.form.department = [{
        scene: '',
        sourceName: {},
        sourceArr: [],
        serviceTimeSlice: '',
        sliceVolume: ''
      }]
    },
    handleClose (tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1)
    },
    showInput () {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleInputConfirm () {
      let inputValue = this.inputValue
      if (inputValue) {
        this.dynamicTags.push(inputValue)
      }
      this.inputVisible = false
      this.inputValue = ''
    }
  },
  components: {
    department
  }
}
</script>
