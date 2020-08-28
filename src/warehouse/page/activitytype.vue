<template>
  <div>
    <ever-bread-crumb name="事务管理类型" path="/global/activitytypes"></ever-bread-crumb>
    <div class="layout_inner">
      <div class="panel-body">
        <ever-form
          :schema="schema"
          v-model="obj"
          :api="api"
          :rules="rules"
          @objsaved="afterSave"
          label-position="right">
        </ever-form>
      </div>
    </div>
  </div>
</template>

<script>
  import api from '../store/activitytypeapi'
  import form from '@/util/form'
  var schema = [
    {
      name: 'activityId',
      label: '基本类型',
      type: 'systype',
      code: 'THE_WAREHOUSE_ACTIVITY_TYPE'
      // useValue: true
    },
    {
      name: 'activityName',
      label: '管理类型名称'
    },
    {
      name: 'ifEdit',
      label: '可否编辑',
      type: 'radio',
      options: [
        {id: 0, name: '否'},
        {id: 1, name: '是'}
      ]
    },
    {
      name: 'intro',
      span: 24,
      type: 'textarea',
      label: '说明'
    },
    {
      name: 'enableDate',
      type: 'date',
      label: '生效日期',
      outformat: 'YYYY-MM-DD HH:mm:ss'
    },
    {
      name: 'disableDate',
      type: 'date',
      label: '失效日期',
      outformat: 'YYYY-MM-DD HH:mm:ss'
    }
  ]

  export default {
    mixins: [form],
    data () {
      var obj = this.createObjFromSchema(schema)
      return {
        schema,
        obj: obj,
        api: api,
        rules: {
          name: [
            { required: true, message: '请输入品牌名称', trigger: 'blur' },
            { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      afterSave () {
        this.$router.push('/global/brands')
      }
    },
    beforeCreate () {
      this.api = api
    }
  }
</script>
