<template>
  <div class="layout_inner">
    <ever-query-form :schema="querySchema" v-model="queryObj" @query="query" ref="form" >
      <template slot="patientId">
        <el-select
        v-model="queryObj.patientId"
        filterable
        clearable
        remote
        :default-first-option="true"
        :placeholder="'患者姓名'"
        :remote-method="remoteMethod"
        >
          <el-option
            v-for="item in patients"
            :key="item.id"
            :label="item.name"
            :value="item.id || item.name">
          </el-option>
        </el-select>
      </template>
      <template slot="sectionIds">
        <ever-departmentCascader
          v-model="queryObj.sectionIds"
          :initOptions="sectionIdoptions"
          :clearable="true"
          :placeholder="'科室'"
        ></ever-departmentCascader>
      </template>
      <template slot="dayst">
        <span>显示<el-input min="1" max="999" type="number" @keydown.native="daysFn($event, 'down')" @keyup.native="daysFn($event, 'up')" style="width: 50px; margin: 0 5px" v-model="queryObj.days"></el-input>天内</span>
      </template>
    </ever-query-form>
    <el-table
    v-loading.body="loading"
    :data="tableData">
      <el-table-column
      width="280"
      :label="routName == 'applylist' ? '备血单号' : '配血单号'">
        <template slot-scope="scope">
          <a @click="$router.push(routeUrl + scope.row.id)">{{scope.row.code}}</a>
          <i v-if="$moment($moment().format('YYYY-MM-DD')).isBefore(scope.row.applyTime)" class="iconfont icon-today"></i>
          <i v-if="scope.row.sampleOperation" class="iconfont icon-yicaiji"></i>
          <i v-if="scope.row.ifPass" class="iconfont icon-yi"></i>
          <i v-if="scope.row.isPressing" class="iconfont icon-werehouse_ji"></i>
        </template>
      </el-table-column>
      <el-table-column
      prop="patientName"
      label="姓名">
      </el-table-column>
      <el-table-column
      prop="birthday"
      width="100"
      label="出生日期">
      </el-table-column>
      <el-table-column
      prop=""
      label="血型">
        <template slot-scope="scope">
          {{scope.row.aboName}}{{scope.row.rhName}}
        </template>
      </el-table-column>
      <el-table-column
      prop="sectionName"
      label="开单科室">
      </el-table-column>
      <el-table-column
      label="血液品种">
        <template slot-scope="scope">
          <span v-for="(item, index) in scope.row.bloodPreparationItemList || scope.row.bloodMatchingTypeItemList" :key="index">
            {{item.bloodTypeName}}
          </span>
        </template>
      </el-table-column>
      <el-table-column
      label="申请血量">
        <template slot-scope="scope">
          <span v-for="(item, index) in scope.row.bloodPreparationItemList || scope.row.bloodMatchingTypeItemList" :key="index">
            {{item.applyBloodNum}}{{item.applyBloodUnitName}}<i v-if="item.ifSubNum" class="iconfont icon-que"></i>
          </span>
        </template>
      </el-table-column>
      <el-table-column
      prop="doctorName"
      width="100"
      label="申请医生">
      </el-table-column>
      <el-table-column
      prop="hospitalBedNum"
      width="80"
      label="床号">
      </el-table-column>
      <el-table-column
      prop="applyTime"
      width="160"
      label="申请时间">
      </el-table-column>
      <el-table-column
      label="状态">
        <template slot-scope="scope">
          <span v-if="routName == 'applylist'">{{setName(bloodConfig.BLOOD_APPLY_STATUS, scope.row.status)}}</span>
          <span v-else>{{setName(bloodConfig.BLOOD_MATCHING_STATUS, scope.row.status)}}</span>
        </template>
      </el-table-column>
      <el-table-column
      width="80"
      label="已配">
        <template slot-scope="scope">
          <span v-for="(item, index) in scope.row.bloodPreparationItemList || scope.row.bloodMatchingTypeItemList" :key="index">
            {{item.hasMatchingNum}}{{item.applyBloodUnitName}}
          </span>
        </template>
      </el-table-column>
      <el-table-column
      prop="hasTakeNum"
      width="80"
      label="已取">
        <template slot-scope="scope">
          <span v-for="(item, index) in scope.row.bloodPreparationItemList || scope.row.bloodMatchingTypeItemList" :key="index">
            {{item.hasTakeNum}}{{item.applyBloodUnitName}}
          </span>
        </template>
      </el-table-column>
      <el-table-column
      prop="sampleCode"
      width="120"
      label="受者血样">
      </el-table-column>
      <el-table-column
      prop="sampleOperation"
      width="160"
      label="采样人">
        <template slot-scope="scope">
          {{scope.row.sampleOperation}}<br />{{scope.row.sampleOperationTime}}
        </template>
      </el-table-column>
    </el-table>
    <el-row type="flex" justify="end">
      <ever-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :pagesize="pagesize"
        :totalCount="totalCount" :current="current">
      </ever-pagination>
    </el-row>
  </div>
</template>

<script>
import reparationapi from '../store/bloodpreparationapi'
import matchingapi from '../store/bloodmatchingapi'
import list from '@/util/list'
import bloodConfig from '../util/bloodconfig'
// import inhospitalApi from '@/workspace/store/inhospital'
import residentApi from '@/inpatient/store/resident'
import getstorage from '@/warehouse/page/storages/util/getstorage'
import setName from '@/util/setstatusname'
import { passport } from '@/card/store/passportapi'
import { SPACE_RELATION_TYPE } from '@/util/common'
import selectInquireList from '@/warehouse/util/selectinquirelist'
let querySchema = [
  {
    name: 'patientId',
    label: '患者姓名',
    type: 'patientselect',
    placeholder: '请输入患者姓名',
    options: []
  },
  {
    name: 'sectionIds',
    label: '科室',
    type: 'custom'
  },
  {
    name: 'areaId',
    label: '病区',
    type: 'select',
    clearable: true,
    filterable: true,
    options: []
  },
  {
    name: 'hospitalBedNum',
    label: '床号',
    clearable: true
  },
  {
    name: 'bloodAboId',
    label: '血型',
    type: 'select',
    clearable: true,
    options: []
  },
  {
    name: 'bloodRhId',
    type: 'select',
    clearable: true,
    options: []
  },
  {
    name: 'status',
    label: '状态',
    type: 'select',
    clearable: true,
    options: []
  },
  {
    name: 'dayst',
    type: 'custom'
  },
  {
    name: 'isPressing',
    type: 'checkbox',
    options: [
      {
        id: 1,
        name: '紧急'
      }
    ]
  }
]
export default {
  mixins: [list, setName, getstorage, selectInquireList],
  data () {
    let queryObj = this.$ever.createObjFromSchema(querySchema)
    queryObj.storageRoomId = this.storageId
    queryObj.days = '3'
    return {
      api: {},
      querySchema,
      queryObj,
      bloodConfig,
      routeUrl: '',
      tableData: [],
      patients: [],
      sectionIdoptions: [],
      routName: this.$route.name
    }
  },
  created () {
    bloodConfig.BLOOD_ABO().then(result => {
      this.querySchema.forEach(item => {
        if (item.name === 'bloodAboId') {
          item.options = result
        }
      })
    })
    bloodConfig.BLOOD_RH().then(result => {
      this.querySchema.forEach(item => {
        if (item.name === 'bloodRhId') {
          item.options = result
        }
      })
    })
    this._sentenceSpaceSelect({ relationType: SPACE_RELATION_TYPE[0].id }).then(res => {
      this.sectionIdoptions = res
    })
    residentApi.getSpaceRecordVoListForService().then(result => {
      this.querySchema.forEach(item => {
        if (item.name === 'areaId') {
          item.options = result.data
        }
      })
    })
    this._route(this.$route.name)
  },
  methods: {
    daysFn (e, type) {
      if (e.keyCode === 190 || e.keyCode === 189 || e.keyCode === 109 || e.keyCode === 110) {
        e.preventDefault()
      } else {
        if (type === 'up') this.list()
      }
    },
    remoteMethod (query) {
      query = query && String(query).trim() || this.patientName
      return passport.get('patient/searchFuzzy', {
        params: {
          keyword: query,
          offset: 0,
          pagesize: 20
        }
      }).then(results => {
        if (results.data.resultList && results.data.resultList.length) {
          this.patients = results.data.resultList
        } else if (this.visitType === 3) {
          this.patients = [{
            name: query,
            id: query
          }]
        } else {
          this.patients = []
        }
        return this.patients
      })
    },
    _initQueryObj () {
      for (let key in this.queryObj) {
        if (!['offset', 'pagesize', 'storageRoomId', 'materialType'].includes(key)) {
          this.queryObj[key] = ''
        }
      }
      this.queryObj.days = '3'
      this.queryObj.offset = 0
      this.queryObj.pagesize = 20
      this.list()
    },
    statusSwhit () {
      this.querySchema.forEach(item => {
        if (item.name === 'status') {
          if (this.routName === 'applylist') {
            if (bloodConfig.BLOOD_APPLY_STATUS.length > 3) {
              let statusArr = bloodConfig.BLOOD_APPLY_STATUS.filter(item => {
                if (![bloodConfig.BLOOD_APPLY_STATUS[2].id, bloodConfig.BLOOD_APPLY_STATUS[4].id].includes(item.id)) {
                  return item
                }
              })
              item.options = statusArr
            } else {
              item.options = bloodConfig.BLOOD_APPLY_STATUS
            }
          } else {
            item.options = [bloodConfig.BLOOD_MATCHING_STATUS[1], bloodConfig.BLOOD_MATCHING_STATUS[3]]
          }
        }
      })
      this._initQueryObj()
    },
    _route (v) {
      this.routName = v
      if (v === 'applylist') {
        this.api = reparationapi
        this.routeUrl = '/blood/manage/readyapply/'
      } else {
        this.api = matchingapi
        this.routeUrl = '/blood/manage/crossmatching/'
      }
      this.statusSwhit()
    }
  },
  watch: {
    '$route.name' (v) {
      this._route(v)
    },
    'queryObj.patientId' (v) {
      this.list()
    },
    'queryObj.hospitalBedNum' (v) {
      this.list()
    },
    'queryObj.isPressing' (v) {
      this.list()
    },
    'queryObj.sectionIds' (v) {
      this.list()
    }
  },
  components: {
  }
}
</script>

<style scoped lang="scss">
.icon-que {
  color: #ee4433;
  margin-left: 5px;
}
.icon-yi {
  color: #ee4433;
  margin-left: 5px;
}
.icon-today {
  color: #1c7bef;
  margin-left: 5px;
}
.icon-yicaiji {
  color: #f3841c;
  margin-left: 5px;
}
.icon-werehouse_ji {
  color: #ee4433;
  margin-left: 5px;
}
</style>
