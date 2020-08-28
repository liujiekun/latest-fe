import { uniqBy } from 'lodash'
export default {
  methods: {
    saveUpdateTab (obj) {
      // console.log('保存更新tab', obj)
      this.tabs.map(item => {
        // 新建病历
        if ((obj.type === 'tpl') && (obj.type === item.type) && (item.formTemplateId === obj.formTemplateId)) {
          this.$set(item, 'id', obj.id)
          this.$set(item, 'isUpdate', obj.isUpdate)
          this.$set(item, 'type', 'bingli')
          this.$set(item, 'templateScopeId', obj.templateScopeId)
          this.$set(item, 'categoryId', obj.categoryId)
          this.$set(item, 'categoryName', obj.categoryName)
        } else if (item.id === obj.id) {
          this.$set(item, 'isUpdate', obj.isUpdate)
        }
      })
      // storage.setLocalStorage('recordTabs', JSON.stringify(this.tabs))
    },
    deleteUpdateTab (targetName) {
      // console.log('删除更新tab', targetName)
      this.tabs = this.tabs.filter(tab => tab.id !== targetName)
      // storage.setLocalStorage('recordTabs', JSON.stringify(this.tabs))
    },
    submitUpdateTab () {
      // console.log('提交更新tab')
      this.tabs.forEach(item => {
        if (item.id === this.curNode.id) {
          this.$set(item, 'status', 2)
        }
      })
      // storage.setLocalStorage('recordTabs', JSON.stringify(this.tabs))
    },
    updateUpdateTab (val, docItem) {
      // console.log('病历有更新', val, docItem)
      let saveRecordId = (docItem && docItem.id) || this.tabsValue
      this.tabs.map(item => {
        if (item.id === saveRecordId && item.type !== 'tpl') {
          this.$set(item, 'isUpdate', val)
        }
      })
      // storage.setLocalStorage('recordTabs', JSON.stringify(this.tabs))
    },
    getInstanceUpdateTab (id) {
      // console.log('更新病案首页实例', id)
      this.tabs.forEach(item => {
        if (item.code === this.binganCode) {
          this.$set(item, 'id', id)
        }
      })
      this.tabs = uniqBy(this.tabs, 'id')
      // storage.setLocalStorage('recordTabs', JSON.stringify(this.tabs))
    }
  }
}
