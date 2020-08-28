import sysvalue from '@/warehouse/store/sysvalueapi'
import api from '../managesapi'

var component = {
  props: {
    routeType: {
      /**
       * prescription - 医嘱项管理
       * stack - 组套管理
       */
      type: String,
      default: 'prescription'
    }
  },
  data () {
    return {
      tableData: [],
      projectType: [],
      searchName: '',
      prescription: '0',
      charge: '0',
      outward: '0',
      jumpPage: null,
      typeOptions: [],
      loading: false,
      listTotal: 0,
      curPage: 0,
      isCreate: false,
      isEditor: false,
      activeId: ''
    }
  },
  created () {
    this.init()
  },
  computed: {
    currentUser () {
      return this.$store.state.currentUser
    }
  },
  methods: {
    init () {
      this.list = api.list(this.routeType)
      this.getClassOptions()
      this.querySearch(true)
      if (this.currentUser) {
        this.getCreatOrEditPermission()
      }
    },
    getCreatOrEditPermission () {
      api.getTreeNodes({
        outOrgGetOrgListByConditionReqDTO: {idList: [this.currentUser.organizationId]}
      }).then(res => {
        if (res.length) {
          this.isEditor = res[0].parentCode === '0'
          if (res[0].parentCode === '0') {
            return true
          }
        }
        return false
      }).then(res => {
        if (res) {
          this.isCreate = true
        } else {
          // 机构是否具有创建权限
          api.getClinicManageConfigForRecord({
            type: this.routeType === 'stack' ? 118 : 117
          }).then(res => {
            this.isCreate = !res.isConfig
          })
        }
      })
    },
    pageChange (val) {
      this.curPage = val
      this.querySearch(true)
    },
    jump () {
      this.curPage = this.jumpPage
      this.jumpPage = null
    },
    // 获取选择类型的option
    getClassOptions () {
      sysvalue.cascade(
        'THC_WH_OBJECT_TYPE', ['798']).then(options => {
          if (options[0] && options[0].children) {
            let typeOptionsArr = []
            options[0].children.forEach((item) => {
              if (item.name !== '协定方' || this.routeType === 'stack') {
                typeOptionsArr.push(item)
              }
            })
            this.typeOptions = typeOptionsArr
          }
        })
    },
    getServiceInfo (info) {
      this.activeId = info.id
      this.$emit('getRowInfo', info)
      if (this.$route.meta.thirdActiveIndex.indexOf('concise') !== -1) {
        this.$router.push({path: `${this.routeType}concise/editor/${info.id}`, query: { type: 1 }})
      }
    },
    handleRowClass ({row}) {
      if (row.id === this.activeId) {
        return 'row-actived'
      } else {
        return ''
      }
    },
    // 获取医嘱项列表
    querySearch (type) {
      this.loading = true
      let params = {
        pagesize: 20,
        managerPermission: 1,
        filterMaterial: true
      }
      if (this.projectType.length) {
        params.serviceClassificationList = this.projectType
      }
      if (this.projectType.length > 1) {
        params.threeServiceClassify = this.projectType[this.projectType.length - 1]
      }
      if (this.searchName) {
        params.name = this.searchName
      }
      if (this.routeType === 'prescription') {
        let code = +(this.prescription + this.charge)
        if (code) {
          params.isAdviceList = [code]
          if (code !== 11) {
            params.isAdviceList.push(11)
          }
        }
      }
      if (Number(this.outward)) {
        params.outwardDeliveryFlag = Number(this.outward)
      }
      if (type) {
        params.offset = (this.curPage - 1) * 20
      } else {
        this.curPage = 1
      }
      this.list(params).then(res => {
        this.tableData = res.data
        this.listTotal = res.totalCount
        if (res.data.length) {
          this.activeId = res.data[0].id
          this.$emit('getRowInfo', res.data[0])
        }
        this.loading = false
      }).catch(() => {
        this.tableData = []
        this.listTotal = 0
        this.loading = false
      })
    }
  },
  watch: {
    'currentUser' (val) {
      this.getCreatOrEditPermission()
    }
  }
}

export default component
