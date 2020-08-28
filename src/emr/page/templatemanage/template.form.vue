<template>
  <form-schema
    ref="formSchema"
    :breadHidden="true"
    :saveHidden="true"
    :templateId="editorObj.formTemplateId"
    :formDataId="editorObj.formDataId"
    :templateName="editorObj.name"
    @fromTpl="getFromTpl"
    @formObj="getFormObj">
    <template slot="saveBtn">
      <el-button @click="saveTpl"
                  style="float:right">保存模版</el-button>
    </template>
  </form-schema>
</template>
<script>
import formSchema from '@/form/page/formschema'
import update from '@/emr/mixins/update.js'// vuex存储数据
export default {
  name: 'template_form',
  components: {
    formSchema,
  },
  mixins: [update],
  props: {
    workshop: {
      type: String
    }
  },
  data () {
    return {
      formTpl: {}, // 保存表单模版需要的一坨参数
      formUpdate: false
    }
  },
  methods: {
    saveTpl () {
      this.$parent.saveTpl()
    },
    getFormInfo () {
      return {
        formTpl: this.formTpl,
        formData: this.$refs.formSchema.obj
      }
    },
    getFromTpl (val, isUpdate) { // 模版发生更新回调
      this.formTpl = val
      console.log('模版更新', isUpdate)
      this.setChange(isUpdate)
    },
    getFormObj (isUpdate) { // 数据发生更新
      console.log('表单数据更新', isUpdate)
      this.setChange(isUpdate)
    }
  }
}
</script>
