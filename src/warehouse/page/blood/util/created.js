import Vue from 'vue'

let compMap = {
  'input': 'el-input',
  'text': 'el-input',
  'select': 'el-select',
  'textarea': 'el-input',
  'date': 'el-date-picker',
  'checkbox': 'el-checkbox-group',
  'radio': 'el-radio-group'
}

function createEle (obj, el, createElement) {
  // let name = el.name || ''
  let comp = el.comp || 'text'
  let props = el.props || {}
  let comp1 = compMap[comp] || comp
  let slots = []
  if (comp1 === 'el-select' && props.options) {
    slots = props.options.map(option => {
      return createElement('el-option', {
        props: {
          key: option.id || option.value,
          label: option.name || option.label,
          value: option.id || option.value
        }
      })
    })
  }
  console.log(obj, slots)
  return comp1
}

function createFormItems (schema, obj, createElement, form) {
  return schema.filter(v => {
    if (v.if && obj) {
      return v.if(obj)
    }
    return true
  }).map(v => {
    let name = v.name
    let comp = v.comp
    let ele
    if (form.readonly) {
      ele = obj[name]
    } else {
      if (comp === 'custom') {

      } else {
        ele = createEle(obj, v, createElement)
      }
    }
    console.log(ele)
  })
}

export default Vue.component('created', {
  render: function (createElement) {
    let obj = this.value
    let formItems = createFormItems(this.leval, obj, createElement, this)
    return createElement(
      'el-form',
      {
        props: {
          ref: 'form'
        }
      },
      formItems
    )
  },
  props: ['leval', 'value'],
  data () {
    return {

    }
  }
})
