<template>
  <div>
    <ever-bread-crumb
      name="未关联药理分类的药品"
      path="/group/pharmacologys"
      :showTitle="true"
      :pathTo="true"
    ></ever-bread-crumb>
    <div class="layout_inner">
      <div v-if="objId" class="mb20">
        <span>当前药品:</span>
        <span class="ml5">{{drugName}}</span>
      </div>
      <ever-form2
        :schema="querySchema"
        v-model="queryObj"
        ref="form"
        :inline="true"
        :is-query="true"
        @query="handelGetId"
      >
        <template slot="classifyId">
          <pharma-cology-cascader
            style="width: 400px;"
            v-model="queryObj.materialSpuId"
            :customApi="pharmacologyApi"
            :isValueArr="true"
          ></pharma-cology-cascader>
        </template>
      </ever-form2>
      <div v-if="!objId">
        <span class="f16" v-if="totalCount">未关联药理分类的药品 {{totalCount || 0}} 个</span>
        <el-table v-loading.fullscreen.lock="loading" :data="tableData" style="width: 100%" border>
          <el-table-column width="10"></el-table-column>
          <el-table-column show-overflow-tooltip label="物资名称" prop>
            <template slot-scope="scope">
              <el-button type="text" @click="$router.push('')">
                <wh-code-to-name
                  :patchObj="{
                    list: scope.row.materialDictPropertys || scope.row.materialPropertys
                  }"
                ></wh-code-to-name>
              </el-button>
            </template>
          </el-table-column>
          <el-table-column label="适应症" prop>
            <template slot-scope="scope">
              <wh-code-to-name
                :showIcon="false"
                :patchObj="{
                    code: [INDICATION],
                    list: scope.row.materialPropertys,
                    isInfo: false
                  }"
              ></wh-code-to-name>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100" align="center" prop>
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="small"
                @click="$router.push('/group/fastpharmacologyadd/' + scope.row.id + '?addId=' + scope.row.id)"
              >关联分类</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-row type="flex" justify="end">
          <ever-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current="current"
            :totalCount="totalCount"
          ></ever-pagination>
        </el-row>
      </div>
      <div v-else>
        <classification-tree
          :customApi="pharmacologyApi"
          :customClassifyId="materialSpuArr"
          :showCheckBox="true"
          @checkChange="handelCheckChange"
        ></classification-tree>
        <div class="mt10">
          <el-button type="primary" @click="handelCreateFast()">关联</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { patch, INDICATION, DRUGTYPE, debounce } from '@/util/common'
import list from '@/util/list'
import pharmaCologyCascader from '@/warehouse/page/components/pharmacologycascader'
import classificationTree from '@/warehouse/page/components/classificationtree'
import materialdictSpuApi from '@/warehouse/page/groupmaterial/store/materialdictspuapi'
import associationdrugApi from '@/warehouse/page/group/store/associationdrugapi'
import pharmacologyApi from '@/warehouse/page/group/store/pharmacologyapi'
let querySchema = []
let textSchema = [
  {
    name: 'materialSpuId',
    label: '',
    comp: 'everRemoteMethod',
    props: {
      placeholder: '通用名或商品名',
      showKeys: true,
      api: materialdictSpuApi,
      isLocalSettingSearch: true,
      isMaterialPropertys: 'materialPropertys',
      apiName: 'spuList',
      params: { classifyId: DRUGTYPE }
    },
    style: 'width: 300px;'
  }
]
let selectSchema = [
  {
    name: 'classifyId',
    label: '',
    comp: 'custom'
  }
]
export default {
  mixins: [list],
  data () {
    querySchema = this.createObject().querySchema
    let obj = this.createObject().queryObj
    return {
      api: this.$route.params.id ? pharmacologyApi : associationdrugApi,
      pharmacologyApi,
      querySchema,
      queryObj: obj,
      objId: this.$route.params.id,
      INDICATION,
      listApiName: !this.$route.params.id ? 'spuNotlist' : '',
      ids: [],
      materialSpuArr: [],
      drugName: ''
    }
  },
  created () {
    // 药品
    if (this.listApiName) {
      this.queryObj.classifyId = DRUGTYPE
    }
  },
  methods: {
    handleById (id) {
      materialdictSpuApi.getById(id, 'edit').then(res => {
        if (res && res.id) {
          this.drugName = this._resetMaterialName({ rows: res.materialPropertys })
        }
      })
    },
    handelGetId () {
      this.materialSpuArr = this.queryObj.materialSpuId
    },
    createObject () {
      this.objId ? querySchema = selectSchema : querySchema = textSchema
      return {
        querySchema,
        queryObj: this.$ever.createObjFromSchema(querySchema)
      }
    },
    handelCheckChange (arr) {
      let ids = []
      arr.forEach(item => {
        ids.push(item.id)
      })
      this.ids = ids
    },
    handelCreateFast: debounce(function () {
      let params = { materialSpuId: this.objId, pharmacologyCategoryIds: this.ids }
      associationdrugApi.notUpdateOrCreate(params).then(res => {
        if (res) {
          this.$messageTips(this, 'success', '关联成功')
          this.$router.push('/group/pharmacologys/')
        }
      })
    }),
    ...patch
  },
  watch: {
    '$route' (val) {
      if (val.query.addId) this.objId = val.query.addId
      if (this.objId) {
        this.querySchema = this.createObject().querySchema
        this.queryObj = this.createObject().queryObj
        this.api = pharmacologyApi
        this.listApiName = ''
        this.handleById(this.objId)
      }
    }
  },
  components: {
    pharmaCologyCascader,
    classificationTree
  }
}
</script>
<style lang="less" scoped>
</style>
