import { debounce } from 'lodash'
import checkform from '@/form/util/checkform.js'
export default {
  mixins: [checkform],
  created () {
    let autoConfig = this.$ever.getClinicConfig().AUTO_SAVE_MEDICAL_RECORD
    let autoSaveTime = autoConfig && autoConfig !== '0' && !isNaN(+autoConfig) ? +autoConfig : 2000
    this.contentUpdate = debounce(this.savePatientCase, autoSaveTime)
  },
  methods: {
    savePatientCase (autoType) {
      // 自动保存状态判断
      if (autoType) this.$bus.$emit('medicalAutoSave', false)
      if (this.disabled || this.dis) return
      let isAutoSaveDoc = autoType === 'doc'
      if (this.designerId === '2') {
        if (autoType && !isAutoSaveDoc) return
        this.saveDoc(isAutoSaveDoc)
        return
      }
      if (autoType && isAutoSaveDoc) return
      let isAutoSaveForm = autoType && autoType === 'form'
      if (isAutoSaveForm && !this.formObjUpdate) return
      if (!this.$refs.form) return
      if (!this.checkForm(this.$refs.form.$refs.form)) {
        this.focusErrorInput()
        return
      }
      this.$refs.form.validate(valid => {
        if (valid) {
          this.savePhrForm(isAutoSaveForm)
        } else {
          this.focusErrorInput()
        }
      })
    }
  }
}
