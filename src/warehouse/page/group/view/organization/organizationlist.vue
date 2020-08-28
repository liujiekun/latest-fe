<template>
  <div>
    <div class="layout_inner">
      <el-tabs class="tabs" v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="集团架构" name="group">
          <div v-if="headStatus">
            <el-button class="f16" type="text" @click="handleInitial">&lsaquo;&lsaquo; 返回组织架构</el-button>
            <span
              v-if="headStatus == 'seeGroup'"
              class="from_title_text f14"
            >提示：在集团架构中，单个机构的内部组织结构只允许查看；如需修改，请进入该机构内进行修改。</span>
          </div>
          <div v-if="architectureType == FRAMEWORK[0]">
            <wh-tree
              ref="whtree"
              :FRAMEWORK="FRAMEWORK"
              @currentStatus="handleStatus"
              :architectureType="architectureType"
              :blockFlag="blockFlag"
              @handleCheckBlock="handleCheckBlock"
            ></wh-tree>
          </div>
        </el-tab-pane>
        <el-tab-pane label="自定义架构" name="custom">
          <div v-if="!customFlag && customDetails">
            <el-button class="f14 alg_l" type="text" @click="handleInitial">&lsaquo;&lsaquo; 返回架构列表</el-button>
          </div>
          <div v-if="customFlag">
            <div class="main-head pos_re">
              <ever-query-form :schema="querySchema" v-model="queryObj" @query="query"></ever-query-form>
              <div class="head-btn-right pos_ab">
                <el-button type="primary" @click="handleNewClinic">新建架构</el-button>
              </div>
            </div>
            <el-table :data="tableData" style="width: 100%" border>
              <el-table-column width="10"></el-table-column>
              <el-table-column prop label="架构名称">
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    @click="handleFramework(scope.row)"
                  >{{scope.row.architectureName}}</el-button>
                </template>
              </el-table-column>
              <el-table-column prop width="80" label>
                <template slot-scope="scope">
                  <el-button
                    size="small"
                    type="danger"
                    @click.native.prevent="handleCancle(scope.row)"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-row type="flex" justify="end">
              <ever-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :pagesize="pagesize"
                :totalCount="totalCount"
                :current="current"
              ></ever-pagination>
            </el-row>
          </div>
          <div v-else>
            <wh-tree
              :FRAMEWORK="FRAMEWORK"
              @currentStatus="handleStatus"
              :isCustom="customLook"
              :customArr="customArr"
              :customNewBulit="isNewBulit"
            ></wh-tree>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <tipDialog
      title="是否删除该架构"
      content="架构删除后不能恢复，请确认是否删除？"
      ref="dialog"
      :function="handleDeleteRow"
    ></tipDialog>
  </div>
</template>
<script>
import organizationApi from '@/warehouse/page/group/store/organizationapi'
import list from '@/util/list'
import { debounce } from '@/util/common'
import whTree from '@/warehouse/page/components/whtree'
import tipDialog from '@/warehouse/page/components/tipsdialog'

/**
 * FRAMEWORK 组织管理类型
 * {Number}}      121              集团架构
 * {Number}       122              自定义架构
 * {Number}       123              集团发药
 * **/
const FRAMEWORK = [121, 122, 123]
const FRAMEWORKNAME = [{ id: 122, name: '自定义架构' }] // , {id: 123, name: '集团发药'} 2019.3.29  笑语让俺暂时去掉
let querySchema = [
  {
    name: 'architectureType',
    label: '查看方式',
    type: 'select',
    options: FRAMEWORKNAME,
    clearable: false
  }
]
export default {
  mixins: [list],
  data () {
    let queryObj = this.$ever.createObjFromSchema(querySchema)
    return {
      organizationApi,
      api: '',
      FRAMEWORK,
      activeName: 'group',
      headStatus: '',
      customDetails: true,
      architectureType: FRAMEWORK[0],
      customFlag: true,
      customLook: 'see',
      customArr: {},
      removeCustom: {},
      isNewBulit: false,
      blockFlag: false,
      querySchema,
      queryObj
    }
  },
  created () {
    if (this.$route.name === 'organizegroup') {
      this.activeName = 'group'
    } else {
      this.activeName = 'custom'
      this.api = this.organizationApi
      this.queryObj.architectureType = FRAMEWORKNAME[0].id
      this.list()
    }
  },
  methods: {
    handleDeleteRow: debounce(function () {
      let params = {
        architectureName: this.removeCustom.name || this.removeCustom.architectureName,
        architectureType: this.removeCustom.architectureType,
        isDelete: 1,
        id: this.removeCustom.id
      }
      this.organizationApi.createCustom(params).then(res => {
        if (res) {
          this.customFlag = true
          this.list()
        }
      })
    }),
    handleCheckBlock () {
      this.blockFlag = false
    },
    handleCancle (data) {
      this.removeCustom = Object.assign({}, data)
      this.$refs.dialog.open()
    },
    handleFramework (data) {
      this.customFlag = false
      this.customLook = 'look'
      this.architectureType = data.architectureType
      this.customArr = {
        name: data.architectureName,
        id: data.id,
        architectureType: data.architectureType
      }
      this.isNewBulit = true
    },
    handleNewClinic () {
      this.customFlag = false
      this.customDetails = true
      this.customArr = {}
    },
    handleInitial () {
      if (Number(this.architectureType) !== this.FRAMEWORK[0]) {
        this.customFlag = true
        this.list()
      } else {
        this.headStatus = ''
        this.blockFlag = true
      }
    },
    handleStatus (type) {
      if (Number(this.architectureType) === this.FRAMEWORK[0]) {
        this.headStatus = type
      } else {
        type ? this.customDetails = false : this.customDetails = true
        if (type && type.id) {
          this.handleCancle(type)
        }
      }
    },
    handleClick: debounce(function (tab, e) {
      this.headStatus = ''
      this.customFlag = true
      if (tab.name === 'group') {
        this.architectureType = this.FRAMEWORK[0]
      } else {
        this.api = this.organizationApi
        this.architectureType = this.FRAMEWORK[1]
        this.queryObj.architectureType = FRAMEWORKNAME[0].id
        this.list()
      }
    })
  },
  components: {
    whTree,
    tipDialog
  }
}
</script>
<style lang="less" scoped>
.from_title_text {
  display: block;
  line-height: 22px;
  height: 22px;
  background-color: #f5f3c7;
  padding: 10px 20px;
  color: #000;
}
</style>
