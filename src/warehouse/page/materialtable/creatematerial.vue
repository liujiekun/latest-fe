<template>
<div>
  <ever-bread-crumb name="新建物资" path="/warehouse/materialtables" showTitle="true"></ever-bread-crumb>
  <div class="layout_inner">
    <div class="panel-body pos_re">
      <div class="hr title">
        <h2 class="alg_c">新建物资</h2>
      </div>
      <ever-form2 :schema="schema" v-model="obj" ref="form" :span="12" :rules="rules" @submit="submitForm()">
        <template slot="line">
          <div class="hr line"></div>
        </template>
        <div slot="default"></div>
      </ever-form2>
      <div class="newDrug" v-if="newDrug">
        <el-row class="box">
          <el-col :span="5">&nbsp;</el-col>
          <el-col :span="14">
            <p>我们拥有市面上几乎所有的药品信息，请先尝试搜索您需要的药品</p>
            <el-row>
              <el-col :span="24">
                <el-input size="large" style="width: 80%; margin-right: 10px" v-model="searchDrugName" placeholder="通用名／商品名／批准文号" @keyup.enter.native="query"></el-input>
                <el-button type="primary" size="large" @click="query">查询</el-button>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="5">&nbsp;</el-col>
        </el-row>
        <div class="druglist">
          <p v-if="totalCount">有<span class="font red"> {{totalCount}} </span>条结果符合条件</p>
          <div class="list-container" v-for="item in tableData" :key="item.id" :loading="loading">
            <div class="header" v-if="item.drugType != 3">
              <span class="byname">{{item.byname}}</span>
              <span v-if="item.name" class="goodsName">{{item.name}}</span>
              <span v-if="item.produceCompanyName" class="manufactureName">{{item.produceCompanyName}}</span>
              <span class="unit">{{setName(dosageFormArr, item.dosageForm, true)}}/{{item.packageInfo}}</span>
              <span class="registerNo">{{item.ratifyCode}}</span>
            </div>
            <div class="header" v-else>
              <span class="byname">{{item.byname}}</span>
            </div>
            <div class="body">
              <el-row>
                <el-col :span="20">
                  <div v-if="item.drugType != 3">
                    <el-radio v-model="radio" @change.native="handleRadioChange(item)" v-for="items in item.drugs" :key="items.id" :label="items.id">
                      <span>{{`${items.convertRatio}${setName(preparationUnitArray, items.preparationUnit, true)} / ${setName(preparationUnitArray, items.packageUnit, true)}`}}</span>
                    </el-radio>
                  </div>
                  <div v-else>
                    <el-radio v-model="radio" @change.native="handleRadioChange(item)" v-for="items in item.drugs" :key="items.id" :label="items.id">
                      <span>{{items.name}}&nbsp;&nbsp;{{setName(HERBALTYPE, items.herbalType, true)}}&nbsp;&nbsp;药效比:{{items.drugRatio}}&nbsp;&nbsp;<span v-if="items.specratio">{{items.specratio}}/</span>{{setName(unitArray, items.unit, true)}}&nbsp;&nbsp;{{items.produceCompanyName}}&nbsp;&nbsp;{{items.ratifyCode}}</span>
                    </el-radio>
                  </div>
                  <span>&nbsp;</span>
                </el-col>
                <el-col :span="4" v-if="item.drugType != 3"><el-button @click="handlePackageUnit(item)" type="text" style="float: right">添加新规格</el-button></el-col>
                <el-col :span="4" v-else><el-button @click="handlePackageUnit2(item)" type="text" style="float: right">添加新规格</el-button></el-col>
              </el-row>
            </div>
          </div>
          <!-- <el-row class="ever-row-01"  style="display: none">
            <el-col v-for="item in tableData" :key="item.id" :loading="loading">
              <el-card class="box-card">
                <el-row v-if="item.drugType != 3">
                  <el-col :span="16" class="druginfo">
                    <div class="info">
                      <el-form label-position="right"  label-width="100px">
                        <el-form-item label="通用名:">
                          <span>{{item.byname}}</span>
                        </el-form-item>
                        <el-form-item label="商品名:">
                          <span>{{item.name}}</span>
                        </el-form-item>
                        <el-form-item label="说明书规格:">
                          <span>{{item.chineseSpecification}}</span>
                        </el-form-item>
                        <el-form-item label="剂量:">
                          <span>{{item.specQuantity}}</span>
                        </el-form-item>
                        <el-form-item label="剂量单位:">
                          <span>{{item.enSpecUnit}}</span>
                        </el-form-item>
                        <el-form-item label="剂型:">
                          <span>{{item.formulation}}</span>
                        </el-form-item>
                        <el-form-item label="生产厂商:">
                          <span>{{item.produceCompanyName}}</span>
                        </el-form-item>
                        <el-form-item label="批准文号:">
                          <span>{{item.registerNo}}</span>
                        </el-form-item>
                      </el-form>
                    </div>
                  </el-col>
                  <el-col :span="8">
                    <div class="info">
                      <div class="position">
                      <div class="overflow">
                        <el-radio v-model="radio" @change.native="handleRadioChange(item)" v-for="items in item.drugs" :key="items.id" :label="items.id">
                          <el-tooltip class="item" :content="items.convertRatio + items.preparationUnitTxt + '/' + items.packageUnitTxt" placement="top">
                            <span>{{`${items.convertRatio}${items.preparationUnitTxt} / ${items.packageUnitTxt}`}}</span>
                          </el-tooltip>
                        </el-radio>
                        <el-button @click="handlePackageUnit(item)" type="text">添加新规格</el-button>
                      </div>
                      </div>
                    </div>
                  </el-col>
                </el-row>
                <el-row v-else>
                  <el-col :span="10" class="druginfo">
                    <div class="info">
                      <el-form label-position="right"  label-width="80px">
                        <el-form-item label="通用名:">
                          <span>{{item.byname}}</span>
                        </el-form-item>
                      </el-form>
                    </div>
                  </el-col>
                  <el-col :span="14">
                    <div class="info">
                      <div class="position">
                      <div class="overflow">
                        <el-radio v-model="radio" @change.native="handleRadioChange(item)" v-for="items in item.drugs" :key="items.id" :label="items.id">
                          <el-tooltip class="item" :content="setName(unitArray, items.unit, true) + '/' + setName(HERBALTYPE, items.herbalType)" placement="top">
                            <span>{{`${setName(unitArray, items.unit, true)} / ${setName(HERBALTYPE, items.herbalType)}`}}</span>
                          </el-tooltip>
                        </el-radio>
                        <el-button @click="handlePackageUnit2(item)" type="text">添加新规格</el-button>
                      </div>
                      </div>
                    </div>
                  </el-col>
                </el-row>
              </el-card>
            </el-col>
          </el-row> -->
          <div v-if="!tableData.length && flag">
            <ever-NoData></ever-NoData>
          </div>
        </div>
        <div class="page" v-if="totalCount != 0">
          <ever-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :pagesize="pagesize"
            :pageSizes="pageSizes"
            :totalCount="totalCount" :current="current">
          </ever-pagination>
        </div>
      </div>
      <el-button type="primary" @click="submitForm()" class="table-btn-ml">创建物资</el-button>
    </div>
  </div>
  <package-unit-dialog ref="packageunit" @close:query="updateQuery"></package-unit-dialog>
  <package-unit-dialog2 ref="packageunit2" @close:query="updateQuery"></package-unit-dialog2>
</div>
</template>
<script>
import beHospitalizedApi from '@/warehouse/store/behospitalizedapi'
import drugApi from '@/warehouse/store/drugapi'
import sysvalue from '@/warehouse/store/sysvalueapi'
import {MATERIALTYPE_TYPE, delObjIsNull, HERBALTYPE} from '@/util/common'
import setname from '@/util/setstatusname'
import packageUnitDialog from '@/warehouse/page/drugbehospitalized/packageunit'
import packageUnitDialog2 from '@/warehouse/page/drugbehospitalized/packageunit2'
import manufacturerApi from '@/warehouse/store/manufacturerapi'
import materialApi from '@/warehouse/store/materialapi'
import equipmentApi from '@/warehouse/store/equipmengtapi'
let schema = [
  {
    name: 'type',
    label: '选择物资类型',
    comp: 'ever-select',
    props: {
      options: MATERIALTYPE_TYPE
    }
  },
  {
    name: 'line',
    label: '',
    comp: 'custom',
    span: 24
  }
]
let schemaOther = [
  {
    name: 'name',
    label: '商品名'
  },
  {
    name: 'namePy',
    label: '商品名拼音码'
  },
  {
    name: 'registerCode',
    label: '注册证号'
  },
  {
    name: 'model',
    label: '型号'
  },
  {
    name: 'produceCompanyId',
    label: '生产厂商',
    comp: 'ever-remoteMethod',
    props: {
      api: manufacturerApi,
      isSilentQuery: true
    }
  },
  {
    name: 'spec',
    label: '规格'
  },
  {
    name: 'packageUnitId',
    label: '包装单位',
    comp: 'sys-type',
    props: {
      code: 'THC_WAREHOUSE_OTHER_UNIT'
    }
  },
  {
    name: 'materialCode',
    label: '物料编码'
  }
]
export default {
  mixins: [setname],
  data () {
    let obj = this.$ever.createObjFromSchema(schema)
    return {
      spuId: '',
      materType: '',
      schema,
      obj,
      MATERIALTYPE_TYPE,
      newDrug: false,
      searchDrugName: '',
      tableData: [],
      selectCurrentData: {},
      radio: '',
      HERBALTYPE,
      offset: 0,
      pagesize: 5,
      totalCount: 0,
      loading: true,
      pageSizes: [5, 10, 20, 50, 100],
      pageLayout: 'total, sizes, prev, pager, next, jumper',
      current: Number(this.$route.query.page) || 1,
      unitArray: [],
      preparationUnitArray: [],
      dosageFormArr: [],
      drugTypeArr: [],
      flag: false,
      rules: {
        type: [
          { required: true, message: '必填项', trigger: 'blur', type: 'number' }
        ],
        packageUnitId: [
          { required: true, message: '必填项', trigger: 'change' }
        ],
        name: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        namePy: [
          { required: true, message: '必填项', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    sysvalue.listOnce('THC_WH_ZYCDW').then(res => {
      if (res) this.unitArray = res
    })
    sysvalue.listOnce('THC_WH_DOSE_UNIT').then(res => {
      if (res) this.preparationUnitArray = res
    })
    sysvalue.listOnce('THC_WH_OBJECT_SUB_TYPE').then(res => {
      if (res) this.drugTypeArr = res
    })
    sysvalue.listOnce('THC_WH_DRUG_FORM').then(res => {
      if (res) this.dosageFormArr = res
    })
  },
  methods: {
    handlePackageUnit (id) {
      this.$refs.packageunit.open(id)
    },
    handlePackageUnit2 (id) {
      this.$refs.packageunit2.open(id)
    },
    handleRadioChange (data) {
      let tempData = JSON.parse(JSON.stringify(data))
      // 新增supid mxx
      this.spuId = tempData.id
      delete tempData.drugs
      data.drugs.forEach(item => {
        if (item.id === this.radio) this.selectCurrentData = delObjIsNull(Object.assign(tempData, item))
      })
    },
    query () {
      this.handleCurrentChange(1)
    },
    list (refresh) {
      if (refresh) {
        this.offset = 0
      }
      this.flag = true
      var params = {}
      params.keyword = this.searchDrugName
      params.needSku = true
      params.offset = this.offset
      params.pagesize = this.pagesize
      beHospitalizedApi.list(params).then(res => {
        if (res.head.errCode === 0) {
          this.tableData = res.data.resultList
          this.totalCount = res.data.totalCount
        } else {
          this.tableData = []
        }
      })
    },
    handleSizeChange (val) {
      this.pagesize = val
      this.offset = (this.current - 1) * this.pagesize
      this.list()
    },
    handleCurrentChange (val) {
      this.current = val
      this.offset = (val - 1) * this.pagesize
      this.list()
      return this.pageAfter && this.pageAfter(this.pagesize)
    },
    updateQuery (data, curdata) {
      this.list()
      this.radio = data.data.id
      // 新增supid mxx
      this.spuId = curdata.id
      this.selectCurrentData = Object.assign({}, curdata, data.data)
    },
    submitForm () {
      this.$refs.form.$refs.form.validate(valid => {
        if (valid) {
          this.obj = delObjIsNull(this.obj)
          if (this.materType === MATERIALTYPE_TYPE[0].id) {
            // create drug
            if (this.selectCurrentData.id) {
              // 新增supid mxx
              this.selectCurrentData.spuId = this.spuId
              this.selectCurrentData.letterPy = this.selectCurrentData.initialTrade
              this.selectCurrentData = delObjIsNull(this.selectCurrentData)
              this.getInfoGlobalDrug(this.selectCurrentData)
            } else {
              this.$messageTips(this, 'warning', '请选择一个药品的包装单位')
            }
          } else if (this.materType === MATERIALTYPE_TYPE[1].id) {
            // create 医疗耗材
            this.obj.consumptiveType = 300
            this._consumptiveCreate(1)
          } else if (this.materType === MATERIALTYPE_TYPE[2].id) {
            // create 设备
            this.obj.equipmentType = 503
            equipmentApi.createOrUpdate(this.obj).then(result => {
              if (result && result.id) {
                this.$messageTips(this, 'success', MATERIALTYPE_TYPE[2].name + '创建成功', '提示')
                this.$router.push('/warehouse/materialtables/equipments')
              }
            })
          } else if (this.materType === MATERIALTYPE_TYPE[3].id) {
            // create 办公耗材
            this.obj.consumptiveType = 299
            this._consumptiveCreate(3)
          }
        }
      })
    },
    getInfoGlobalDrug (data) {
      drugApi.getInfoFromGlobalDrug(data).then(res => {
        if (res.id) {
          this.$messageTips(this, 'success', MATERIALTYPE_TYPE[0].name + '创建成功', '提示')
          this.$router.push('/warehouse/materialtables/drugs')
        }
      })
    },
    _consumptiveCreate (index) {
      materialApi.createOrUpdate(this.obj).then(result => {
        if (result && result.id) {
          this.$messageTips(this, 'success', MATERIALTYPE_TYPE[index].name + '创建成功', '提示')
          this.$router.push('/warehouse/materialtables/expandables')
        }
      })
    }
  },
  watch: {
    'obj.type' (v) {
      this.schema = schema
      this.materType = v
      if (v === this.MATERIALTYPE_TYPE[0].id) {
        this.newDrug = true
      } else if (v) {
        this.newDrug = false
        this.searchDrugName = ''
        this.schema = schema.concat(schemaOther)
      }
      if (!v) this.newDrug = false
      this.obj = this.$ever.createObjFromSchema(this.schema)
      this.obj.type = v
    }
  },
  components: {
    packageUnitDialog,
    packageUnitDialog2
  }
}
</script>
<style lang="scss" scoped>
.hr.title { border-bottom: 1px solid #ccc;}
.hr.line { margin-left: -120px; width: calc(100% + 120px)}
.newDrug { margin-top: -25px; margin-bottom: 20px;}
.box {background: #f4f4f4; padding: 20px; border-radius: 5px; }
.druglist {margin-top: 20px}
  .list-container {
    border-radius: 4px;
    border: 1px solid #ddd;
    margin-bottom: 20px;
  }
    .header {
      padding: 15px 20px;
      border-bottom: 1px solid #ddd;
      font-size: 14px;
      color: #000
    }
      span {
        margin-right: 20px
      }
      span:last-child {
        margin-right: 0
      }
      span.byname {
        font-size: 18px;
        font-weight: bold;
      }
      span.unit {
        color: #999
      }
      span.registerNo {
        float: right;
        color: #999
      }
    .body {
      padding: 10px 20px;
      background-color: #fcfcfc;
    }
</style>

