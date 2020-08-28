<template>
  <div>
    <ever-bread-crumb name="预警管理" path="/warehouse/stockamounts"></ever-bread-crumb>
    <div class="layout_inner">
      <ever-form
        :schema="schema"
        v-model="obj"
        :span=14
        :api="api"
        :rules="rules"
        @objsaved="afterSave" label-position="right">
      </ever-form>
    </div>
  </div>
</template>
<script>
  import api from '../store/stockamountapi'
  import storageroom from '../store/storageroomapi'
  import localdrug from '../store/localdrugsettingapi'
  import {setDisabled, unDisabled} from '@/util/common'
  window.STORAGEROOM_TYPE = 0
  var flag = false
  var schema = [
    {
      name: 'storageRoomId',
      type: 'select',
      options: [],
      label: '发药库房'
    },
    {
      name: 'localMaterialId',
      type: 'remote',
      options: [],
      placeholder: '请先选择库房，然后输入名称或编码',
      label: '商品名称',
      loading: false,
      funs: function (query) {
        if (window.STORAGEROOM_TYPE === 0) {
          return
        }
        if (this.$route.params.id || query === '') return
        localdrug.listfor({name: query, materialType: window.STORAGEROOM_TYPE}).then(results => {
          for (let key of results) {
            if (key.drugObject) {
              key.name = key.drugObject.name
            } else if (key.consumptiveMaterialObject) {
              key.name = key.consumptiveMaterialObject.name
            } else if (key.equipmentObject) {
              key.name = key.equipmentObject.name
            }
          }
          this.$ever.getFieldFromSchema(schema, 'localMaterialId').options = results
        })
      }
    },
    {
      name: 'max',
      type: 'text',
      label: '最大库存预警值',
      max: 28
    },
    {
      name: 'min',
      type: 'text',
      label: '最小库存预警值',
      max: 28
    },
    {
      name: 'safe',
      type: 'text',
      label: '安全库存量',
      max: 28
    },
    {
      name: 'reasonable',
      type: 'text',
      label: '补货数量',
      max: 28
    },
    {
      name: 'enableDate',
      label: '生效日期',
      type: 'date',
      outformat: 'YYYY-MM-DD HH:mm:ss'
    },
    {
      name: 'disableDate',
      label: '失效日期',
      type: 'date',
      outformat: 'YYYY-MM-DD HH:mm:ss'
    },
    {
      name: 'description',
      label: '备注',
      type: 'textarea',
      span: 24
    }
  ]

  export default {
    data () {
      let arr = ['localMaterialId', 'storageRoomId']
      if (this.$route.params.id) {
        setDisabled(arr, schema)
      } else {
        unDisabled(arr, schema)
      }
      var obj = this.$ever.createObjFromSchema(schema)
      obj.materialType = window.STORAGEROOM_TYPE
      return {
        schema,
        obj: obj,
        api: api,
        rules: {
          storageRoomId: [
            { required: true, message: '必填项', trigger: 'blur', type: 'number' }
          ],
          localMaterialId: [
            { required: true, message: '必填项', trigger: 'blur', type: 'number' }
          ],
          enableDate: [
            { required: true, message: '必填项', trigger: 'blur', type: 'number' }
          ]
        }
      }
    },
    methods: {
      afterSave () {
        this.$router.push('/warehouse/stockamounts')
      },
      getDruglist (params) {
        localdrug.listfor(params).then(results => {
          for (let key of results) {
            if (key.drugObject) {
              key.name = key.drugObject.name
            } else if (key.consumptiveMaterialObject) {
              key.name = key.consumptiveMaterialObject.name
            } else if (key.equipmentObject) {
              key.name = key.equipmentObject.name
            }
          }
          this.$ever.getFieldFromSchema(this.schema, 'localMaterialId').options = results
        })
      }
    },
    created () {
      storageroom.list({isInvented: 0}).then(results => {
        this.$ever.getFieldFromSchema(this.schema, 'storageRoomId').options = results.list
        this.storageRoomList = results.list
        this.$watch('obj.storageRoomId', (newVal, val) => {
          let index = this.storageRoomList.findIndex(item => {
            return item.id === newVal
          })
          if (index !== -1) {
            this.obj.materialType = window.STORAGEROOM_TYPE = this.storageRoomList[index].materialType
            // this.getDruglist({materialType: window.STORAGEROOM_TYPE})
          }
          this.obj.localMaterialId = ''
          this.$ever.getFieldFromSchema(this.schema, 'localMaterialId').options = []
        })
        setTimeout(() => {
          let index = this.storageRoomList.findIndex(item => {
            return item.id === this.obj.storageRoomId
          })
          if (index !== -1) {
            this.obj.materialType = window.STORAGEROOM_TYPE = this.storageRoomList[index].materialType
            if (this.$route.params.id) {
              flag = true
              this.getDruglist({localMaterialId: this.obj.localMaterialId, materialType: window.STORAGEROOM_TYPE})
            }
          }
        }, 300)
      })
    },
    watch: {
      'obj.localMaterialId' (newVal, val) {
        if (this.$route.params.id && newVal !== '' && window.STORAGEROOM_TYPE !== 0 && !flag) {
          this.getDruglist({localMaterialId: newVal, materialType: window.STORAGEROOM_TYPE})
        }
      }
    }
  }
</script>
