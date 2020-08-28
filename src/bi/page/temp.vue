<template>
  <div class="layout_inner">
    <div class="main-head">
      <ever-form2
        v-model="queryObj"
        ref="form"
        :schema="querySchema"
        :inline="true"
        :is-query="true">
        <template slot="visitStartDate">
          <ever-range-picker
            width="260px"
            dateType="daterange"
            :autoWidth="false"
            :clearable="true"
            :start.sync="queryObj.startTime"
            :end.sync="queryObj.endTime"
            :outformat="`YYYY-MM-DD HH:mm:ss`"
            :default-time="['00:00:00', '23:59:59']"
          ></ever-range-picker>
        </template>
        <template slot="default">
          <el-form-item>
            <el-button type="primary" @click="list">查询</el-button>
          </el-form-item>
        </template>
      </ever-form2>
    </div>
    <div class="box-iframe">
      <iframe
        :src="url"
        style="width:100%;height:85vh;margin: 0 auto;"
        frameborder="0"
        :key="key"
        v-if="show">
      </iframe>
      <ever-no-data tipTxt="暂无记录" v-else></ever-no-data>
    </div>
  </div>
</template>

<script>
import reportViewIframe from '@/bi/page/report.view.iframe'
import storage from '@/util/storage'
import { MATERIA_TYPE_OPTIONS } from '@/util/common'

let singleSchema = [
  {
    name: 'orgId',
    comp: 'ever-org-select',
    label: '机构名称',
    props: {
      type: 'select',
      fields: 'id',
      props: {
        clearable: false
      },
      params: {
        everQueryType: 'isLogin'
      }
    }
  },
  {
    name: 'deptId',
    label: '科室',
    comp: 'ever-subject-select',
    props: {
      params: {
      },
      type: 'select',
      fields: 'id'
    }
  },
  {
    name: 'doctorId',
    label: '医生',
    comp: 'ever-staff-select',
    props: {
      useCache: false,
      params: {
        everQueryType: 'out',
        typeCodeList: ['DOCTOR'],
      }
    }
  },
  {
    name: 'storageRoomId',
    label: '库房',
    comp: 'everStorageroomSelect',
    props: {
      params: {
        clinicIds: [storage.getLocalStorage('CLINICID')]
      }
    }
  },
  {
    name: 'orderString',
    comp: 'select',
    label: '排序',
    props: {
      options: [
        {
          id: 'quantity',
          name: '数量'
        },
        {
          id: 'totalMoney',
          name: '金额'
        }
      ]
    }
  },
  {
    name: 'itemType',
    comp: 'select',
    label: '分类',
    props: {
      options: MATERIA_TYPE_OPTIONS.filter(item => !['299', '300', '10008'].includes(item.id))
    }
  },
  {
    name: 'visitStartDate',
    label: '日期时间',
    comp: 'custom'
  },
]
export default {
  props: ['code', 'pageObject'],
  data () {
    let schema = this.pageObject.schema || []
    let querySchema = []
    schema.forEach(item => {
      if (item instanceof Object) {
        querySchema.push(item)
      } else {
        const thisItem = singleSchema.find(child => child.name === item)
        thisItem && querySchema.push(thisItem)
      }
    })
    let queryObj = this.$ever.createObjFromSchema(querySchema)
    queryObj = Object.assign(queryObj, this.pageObject.defaultQueryObj || {})
    return {
      queryObj,
      querySchema,
      style: 'width:100%;height:85vh;',
      key: 0,
      show: false,
      url: `${this.$ever.api}/report-engine/reportJsp/showReportRedefine.jsp?rpx=${this.code}.rpx&x-access-token=`
    }
  },
  watch: {
    // 需要跟机构联动的数据
    'queryObj.orgId' (val) {
      this.$ever.getFieldFromSchema(this.querySchema, 'deptId') && (this.$ever.getFieldFromSchema(this.querySchema, 'deptId').props.params.orgIdList = [val])
      this.$ever.getFieldFromSchema(this.querySchema, 'doctorId') && (this.$ever.getFieldFromSchema(this.querySchema, 'doctorId').props.params.orgIdList = [val])
      this.$ever.getFieldFromSchema(this.querySchema, 'storageRoomId') && (this.$ever.getFieldFromSchema(this.querySchema, 'storageRoomId').props.params.clinicIds = [val])
      this.querySchema = JSON.parse(JSON.stringify(this.querySchema))
    },
    queryObj: {
      handler (val) {
        this.defaultSearch(val)
      },
      deep: true
    }
  },
  methods: {
    list () {
      this.key++
    },
    defaultSearch (val) {
      for (let key in val) {
        if (val[key] == null) {
          val[key] = ''
        }
        if (Array.isArray(val[key])) {
          val[key] = val[key].join(',')
        }
      }
      this.key++
      this.mergeURL()
    },
    mergeURL () {
      this.show = false
      this.url = this._url
      Object.keys(this.queryObj).forEach(val => {
        if (val === 'visitStartDate') return
        if (this.queryObj[val].includes('.') || this.queryObj[val].includes(',')) {
          this.url = this.url + ('&' + val + '=' + `${this.queryObj[val]}`)
        } else {
          this.url = this.url + '&' + val + '=' + `${this.queryObj[val]}`
        }
      })
      this.show = true
    }
  },
  components: {
    reportViewIframe
  },
  async created () {
    this.url += `${storage.getLocalStorage('TOKEN')}`
    this._url = this.url
    this.defaultSearch(this.queryObj)
  },
  mounted () {
  }
}
</script>

<style lang="less" scoped>
.box-iframe {
  position: relative;
}
</style>
