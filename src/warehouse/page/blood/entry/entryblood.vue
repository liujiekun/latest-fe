<template>
  <div class="inventory-container">
    <div class="layout_inner">
      <div class="panel-body">
        <h2 class="alg_c">血液入库</h2>
        <div class="entryTitle">
          <h4>
            血源信息
            <span>请扫描或输入血袋上条码。若扫描失败，也可手动输入血源信息</span>
          </h4>
        </div>
        <el-row style="min-width: 1440px;">
          <el-col :span="5" class="entryRoomCode">
            <scan-code
              ref="scanCodeForm"
              :isScreeningCode="true"
              :formData="scanCodeForm"
              @scanCodeChange="scanCodeChange"
              @scanCodeSubmit="scanCodeSubmit"
            ></scan-code>
          </el-col>
          <el-col :span="14" class="entryInfo">
            <ever-form2 v-model="obj" :schema="schema" :rules="formRules" :span="12" ref="form">
              <template slot="bloodVolume">
                <el-input
                  placeholder="请输入血量"
                  style="width: 300px"
                  :disabled="disabledUnit"
                  v-model="obj.bloodVolume"
                  class="input-with-select"
                >
                  <el-select
                    class="unit_select"
                    style="width: 100px;"
                    :disabled="disabledUnit"
                    v-model="obj.unit"
                    slot="append"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="(item, index) in unit"
                      :key="index"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-input>
              </template>
              <div slot="default"></div>
            </ever-form2>
          </el-col>
        </el-row>
      </div>
      <!-- 需要选择SKU -->
      <el-dialog :visible.sync="notUseDialog" custom-class="ui_dialog_01" width="700px">
        <div style="min-height:160px; padding: 25px;text-align: center; font-size: 20px">
          <h4 style="font-size:16px;">
            {{setName(bloodTypes, returnObj.bloodTypes)}}{{setName(abo, returnObj.abo)}}{{setName(rh, returnObj.rh)}}
            <span
              style="font-size:14px;padding-left:20px;font-weight:normal"
            >已有以下规格，选择以下规格，该血袋的采购价同选中规格采购价</span>
          </h4>
          <p style="font-size: 16px; color: #000;">
            <el-radio-group style="width: 90%" v-model="obj.localMaterialId">
              <el-table :data="localMaterialIdList">
                <el-table-column width="50px">
                  <template slot-scope="scope">
                    <el-radio :label="scope.row.localMaterialId">{{scope.row.index}}</el-radio>
                  </template>
                </el-table-column>
                <el-table-column prop align="center" label="规格">
                  <template slot-scope="scope">{{scope.row.bloodVolume + scope.row.unitName}}</template>
                </el-table-column>
                <el-table-column prop="supplierName" align="center" label="供应商"></el-table-column>
                <el-table-column prop="price" align="right" label="价格">
                  <template slot-scope="scope">{{scope.row.price | formatToFinacial(4)}}</template>
                </el-table-column>
              </el-table>
            </el-radio-group>
          </p>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancelSkuPop" type="primary">取消</el-button>
          <el-button @click="handleInUseConfirm" type="primary">确认</el-button>
        </span>
      </el-dialog>
      <div class="hr"></div>
      <el-table :data="tableData">
        <el-table-column label="血源编码" prop="bloodSourceCode"></el-table-column>
        <el-table-column prop="varietiesCode" label="品种编码"></el-table-column>
        <el-table-column prop="bloodTypeCode" label="血型编码"></el-table-column>
        <el-table-column prop="validityCode" label="效期编码"></el-table-column>
        <el-table-column prop="bloodTypesName" label="血液品种"></el-table-column>
        <el-table-column width="90" label="血型">
          <template slot-scope="scope">{{scope.row.aboName + scope.row.rhName}}</template>
        </el-table-column>
        <el-table-column width="100" label="血量">
          <template slot-scope="scope">{{scope.row.bloodVolume + scope.row.unitName}}</template>
        </el-table-column>
        <el-table-column width="150" label="采血日期">
          <template slot-scope="scope">
            <span
              v-if="scope.row.drawBloodDate"
            >{{scope.row.drawBloodDate | formatDateByExp('YYYY-MM-DD HH:mm')}}</span>
          </template>
        </el-table-column>
        <el-table-column width="150" label="失效日期">
          <template slot-scope="scope">
            <span
              v-if="scope.row.bloodExpirationDate"
            >{{scope.row.bloodExpirationDate | formatDateByExp('YYYY-MM-DD HH:mm')}}</span>
          </template>
        </el-table-column>
        <el-table-column width="120" label="采购价(元)">
          <template slot-scope="scope">
            <el-input
              :class="scope.row.errorPrice ? '' : 'price_error'"
              type="number"
              min="0"
              v-model="scope.row.price"
            ></el-input>
          </template>
        </el-table-column>
        <!-- <el-table-column
        width="100"
        prop="bloodDonor"
        label="献血者姓名">
        </el-table-column>
        <el-table-column
        width="170"
        prop="bloodDonorId"
        label="献血者身份证号">
        </el-table-column>-->
        <el-table-column width="90" label="操作">
          <template slot-scope="scope">
            <el-button type="danger" @click="delList(scope.row.$index)" size="small" plain>删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row style="padding: 20px 0">
        <el-button v-if="tableData.length" type="primary" @click="entrySuccess">入库完成</el-button>
      </el-row>
    </div>
    <!-- 删除该条血 -->
    <tips-dialog :title="'删除'" ref="dialog" :content="'确认删除该条血制品？'" @clickBtn="popClickBtn"></tips-dialog>
  </div>
</template>

<script>
import api from '../store/entrybloodapi'
import scanCode from '../components/scancode'
import bloodConfig from '../util/bloodconfig'
import setname from '@/util/setstatusname'
import getstorage from '@/warehouse/page/storages/util/getstorage'
import tipsDialog from '@/warehouse/page/components/tipsdialog'

let widthInput = 'width: 300px'
let schema = [
  // {
  //   name: 'bloodDonor',
  //   label: '献血者姓名',
  //   style: widthInput
  // },
  // {
  //   name: 'bloodDonorId',
  //   label: '献血者身份证号',
  //   style: widthInput
  // },
  {
    name: 'price',
    label: '采购价',
    attrs: {
      min: '0'
    },
    props: {
      type: 'number',
      placeholder: '请输入采购价格'
    },
    span: 24,
    style: widthInput
  },
  {
    name: 'bloodTypes',
    label: '血液品种',
    comp: 'select',
    clearable: true,
    props: {
      filterable: true,
      options: []
    },
    style: widthInput
  },
  {
    name: 'bloodVolume',
    label: '血量',
    comp: 'custom',
    style: widthInput
  },
  {
    name: 'abo',
    label: 'ABO血型',
    comp: 'select',
    clearable: true,
    props: {
      filterable: true,
      options: []
    },
    style: widthInput
  },
  {
    name: 'rh',
    label: 'Rh(D)血型',
    comp: 'select',
    clearable: true,
    props: {
      filterable: true,
      options: []
    },
    style: widthInput
  },
  {
    name: 'drawBloodDate',
    label: '采血日期',
    comp: 'datePicker',
    props: {
      type: 'datetime',
      outformat: 'yyyy-MM-dd HH:mm:ss'
    },
    style: widthInput
  },
  {
    name: 'bloodExpirationDate',
    label: '失效日期',
    comp: 'datePicker',
    props: {
      type: 'datetime',
      outformat: 'yyyy-MM-dd HH:mm:ss'
    },
    style: widthInput
  }
]
let scanCodeForm = {
  bloodSourceCode: '',
  varietiesCode: '',
  bloodTypeCode: '',
  validityCode: ''
}
export default {
  mixins: [setname, getstorage],
  data () {
    var validatePass1 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请选择采血日期'))
      } else if (this.$moment(this.obj.bloodExpirationDate).valueOf() < this.$moment(value).valueOf()) {
        callback(new Error('采血日期不能大于失效日期'))
      } else {
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请选择失效日期'))
      } else if (this.$moment(this.obj.drawBloodDate).valueOf() > this.$moment(value).valueOf()) {
        callback(new Error('失效日期不能小于采血日期'))
      } else {
        callback()
      }
    }
    var validatePass3 = (rule, value, callback) => {
      if (this.validatePrice(this.obj.price)) {
        callback(new Error('录入内容格式有误，请录入正数，支持保留2位小数。'))
      } else {
        callback()
      }
    }
    let obj = this.$ever.createObjFromSchema(schema)
    obj.unit = ''
    return {
      api: api,
      schema,
      formRules: {
        bloodTypes: [
          {
            required: true,
            message: '请选择血液品种'
          }
        ],
        bloodVolume: [
          {
            required: true,
            message: '请输入血量'
          }
        ],
        abo: [
          {
            required: true,
            message: '请选择血型'
          }
        ],
        rh: [
          {
            required: true,
            message: '请选择血型'
          }
        ],
        drawBloodDate: [
          {
            required: true,
            validator: validatePass1,
            trigger: 'blur'
          }
        ],
        bloodExpirationDate: [
          {
            required: true,
            validator: validatePass2,
            trigger: 'blur'
          }
        ],
        price: [
          {
            required: false,
            validator: validatePass3,
            trigger: 'blur'
          }
        ],
        skuSelect: [
          {
            required: true,
            message: '请选择SKU'
          }
        ]
      },
      obj,
      tableData: [],
      scanCodeForm,
      rh: [],
      bloodTypes: [],
      abo: [],
      unit: [],
      disabledUnit: false,
      localMaterialIdList: [],
      notUseDialog: false,
      returnObj: {},
      deleteIndex: 0
    }
  },
  created () {
    this.obj.storageRoomId = this.storageId
    bloodConfig.BLOOD_TYPE().then(result => {
      this.schema.forEach(item => {
        if (item.name === 'bloodTypes') {
          item.props.options = result
        }
      })
      this.bloodTypes = result
    })
    bloodConfig.BLOOD_ABO().then(result => {
      this.schema.forEach(item => {
        if (item.name === 'abo') {
          item.props.options = result
        }
      })
      this.abo = result
    })
    bloodConfig.BLOOD_RH().then(result => {
      this.schema.forEach(item => {
        if (item.name === 'rh') {
          item.props.options = result
        }
      })
      this.rh = result
    })
    bloodConfig.BLOOD_UNIT().then(result => {
      this.unit = result
      result.forEach(item => {
        if (item.name === 'U') {
          this.obj.unit = item.id
        }
      })
      this.$nextTick(() => {
        this.$refs['form'].$refs['form'].clearValidate()
      })
    })
    for (let val in this.scanCodeForm) {
      this.scanCodeForm[val] = ''
    }
    this.obj = Object.assign(this.obj, this.scanCodeForm)
  },
  methods: {
    popClickBtn (v) {
      this.tableData.splice(this.deleteIndex, 1)
    },
    handleInUseConfirm () {
      if (this.localMaterialIdList !== '' && this.obj.localMaterialId.length) {
        this.createBloodRoom()
        this.notUseDialog = false
      } else {
        this.$messageTips(this, 'error', '请先选择一个规格')
      }
    },
    cancelSkuPop () {
      delete this.obj.localMaterialId
      this.notUseDialog = false
    },
    createBloodRoom () {
      this.$refs['scanCodeForm'].$refs['scanCodeForm'].validate(val => {
        if (val) {
          this.$refs['form'].$refs['form'].validate(val => {
            if (val) {
              let parmas = Object.assign({}, this.obj)
              if (parmas.price === '') parmas.price = 0
              this.api.getScancodeInfo(parmas).then(result => {
                if (result) {
                  if (!result.localMaterialId && result.skuList.length) {
                    this.$set(this.obj, 'localMaterialId', '')
                    this.returnObj = result
                    this.localMaterialIdList = result.skuList
                    this.notUseDialog = true
                    return
                  }
                  result['errorPrice'] = true
                  this.tableData.push(result)
                  this.$refs['scanCodeForm'].$refs['scanCodeForm'].resetFields()
                  this.$refs['form'].$refs['form'].resetFields()
                  this._schemaDisabled({ Disabled: false })
                  this.disabledUnit = false
                  delete this.obj.localMaterialId
                  this.localMaterialIdList = []
                }
              })
            }
          })
        }
      })
    },
    scanCodeChange (v) {
      // 是否是扫码出来的数据
      if (v && typeof v.bloodTypes !== 'undefined') {
        let index = this.screeningName(v.bloodTypes, this.bloodTypes)
        this.obj.bloodTypes = this.bloodTypes[index] ? this.bloodTypes[index].id : ''
      }
      if (v && typeof v.abo !== 'undefined') {
        this.obj.abo = this.abo[this.screeningName(v.abo, this.abo)] ? this.abo[this.screeningName(v.abo, this.abo)].id : ''
      }
      if (v && typeof v.rh !== 'undefined') {
        this.obj.rh = this.rh[this.screeningName(v.rh, this.rh)] ? this.rh[this.screeningName(v.rh, this.rh)].id : ''
      }
      if (v && typeof v.drawBloodDate !== 'undefined') {
        this.obj.drawBloodDate = v.drawBloodDate
      }
      if (v && typeof v.drawBloodDate !== 'undefined') {
        this.obj.bloodExpirationDate = v.bloodExpirationDate
      }
    },
    screeningName (name, arr) {
      let index = arr.findIndex(item => {
        return item.name === name
      })
      return index
    },
    scanCodeSubmit (v) {
      if (v) {
        this.createBloodRoom()
      }
    },
    delList (index) {
      this.deleteIndex = index
      this.$refs.dialog.open()
    },
    entrySuccess () {
      if (this.tableData.length) {
        let flag = true
        this.tableData.forEach(v => {
          v.errorPrice = true
          if (this.validatePrice(v.price)) {
            flag = false
            v.errorPrice = false
          }
        })
        if (flag) {
          this.api.create({ storageRoomId: this.obj.storageRoomId, itemList: this.tableData }).then(result => {
            if (result) {
              this.$notify({
                type: 'success',
                message: '保存成功',
                duration: 2000
              })
              this.$router.push('/blood/entry/entrylist')
            }
          })
        } else {
          this.$notify.error({
            message: '录入内容格式有误，请录入正数，支持保留2位小数。'
          })
        }
      }
    },
    validatePrice (price) { // 校验价格格式
      return Number(price) < 0 || isNaN(Number(price)) || (price && String(price).includes('.') && String(price).split('.')[1].length > 2)
    },
    _schemaDisabled ({ item, v, Disabled }) {
      this.schema.forEach(e => {
        if ((item === e.name && v[item] !== '') || !Disabled) {
          if (e['props']) {
            e['props']['disabled'] = Disabled
          } else {
            e['props'] = {
              disabled: Disabled
            }
          }
          if (item === 'bloodVolume' && v[item] !== '') this.disabledUnit = true
        }
      })
    },
    filterSelete (id, obje) {
      let names = ''
      obje.forEach(item => {
        if (item.id === id) {
          names = item.name
        }
      })
      return names
    }
  },
  components: {
    scanCode,
    tipsDialog
  },
  watch: {
    'scanCodeForm': {
      handler: function (v) {
        Object.assign(this.obj, v)
      },
      deep: true
    },
    'tableData' (v) {
      let num = v.length - 1
      for (let item in v[num]) {
        if (this[item]) {
          v[num][item + 'Name'] = this.filterSelete(v[num][item], this[item])
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">
.entryInfo {
  margin-top: 25px;
  padding-top: 20px;
}
.entryRoomCode {
  margin-top: 25px;
}
.entryTitle h4 {
  border-left: 4px solid #1c7bef;
  font-size: 16px;
  padding-left: 10px;
  margin: 0;
}
.entryTitle span {
  margin: 0;
  padding: 10px 0 0 14px;
  font-weight: normal;
  font-size: 14px;
  color: #666;
}
.unit_select /deep/ input.el-input__inner {
  height: 34px;
  /* border-left: 1px solid #ccc !important; */
  margin-left: 10px;
  width: 80px;
}
.deleteui /deep/ .w_01 {
  width: 360px;
}
.deleteui /deep/ .el-dialog__footer {
  text-align: center;
}
.unit_select /deep/ .el-input-group__append {
  .el-select {
    margin: 0!important
  }
}
.unit_select /deep/ .el-input__suffix-inner {
  margin-right: 10px!important;
}
.price_error /deep/ .el-input__inner {
  border-color: #f56c6c;
}
</style>
