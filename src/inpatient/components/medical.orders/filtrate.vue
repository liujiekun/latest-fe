<template>
  <div class="filtrate">
    <div class="filtrate_tree">
      <el-tree 
      ref="tree"
      :data="classOptions" 
      :props="defaultProps" 
      :expand-on-click-node="false"
      :check-on-click-node="true"
      :highlight-current="true"
      node-key="id"
      @node-click="handleNodeClick"></el-tree>
    </div>
    <div class="filtrate_right">
      <div class="filtrate_search">
        <el-input v-model="searchName" :placeholder="$t('搜索项目')" clearable @input="searchChanges"></el-input>
      </div>
      <ul class="filtrate_service" v-loading="loading">
        <el-checkbox-group v-model="checkList">
          <template v-if="serviceData.length && isGetData">
            <li v-for="(item,index) in serviceData" :key="index" class="filtrate_service_item">
              <el-checkbox :label="item"></el-checkbox>
              <span class="service_name">{{item.name}}</span>
            </li>
          </template>
          <template v-if="!serviceData.length && isGetData">
            <p class="tempTxt">{{$t('暂无数据')}}</p>
          </template>
        </el-checkbox-group>
      </ul>
      <div>
        <el-button type="primary" @click="importService" :disabled="!checkList.length">提交</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import api from '@/inpatient/store/hospitalrecordapi'
import sysvalue from '@/warehouse/store/sysvalueapi'
import i18n from '@/assets/locals/index'
export default {
  data () {
    return {
      loading: false,
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      searchName: '',
      classOptions: [],
      serviceData: [],
      curClassify: {},
      isGetData: false,
      checkList: []
    }
  },
  props: ['visitSn'],
  async created () {
    this.classOptions = []
    this.serviceData = []
    await this.getClassOptions()
    // this.curClassify = {}
  },
  methods: {
    searchService () {
      this.loading = true
      let parms = {
        scene: 1,
        serviceClassificationList: !this.curClassify.parentId ? [this.curClassify.code] : [this.curClassify.parentId],
        threeServiceClassify: !this.curClassify.children && this.curClassify.parentId ? this.curClassify.code : '',
        isAdviceList: [11, 10],
        visitNumber: this.visitSn,
        pagesize: 30,
        offset: 1,
        name: this.searchName
      }
      api.searchForBrowser(parms).then((res) => {
        this.loading = false
        this.isGetData = true
        if (res && res.list && res.list.length) {
          this.serviceData = res.list
        } else {
          this.serviceData = []
        }
      })
    },
    searchChanges (value) {
      this.isGetData = false
      this.checkList = []
      this.searchService()
    },
    importService () {
      this.$emit('quote', this.checkList)
    },
    handleNodeClick (data) {
      if (data.id === this.curClassify.id) {
        return false
      }
      this.searchName = ''
      this.checkList = []
      this.isGetData = false
      this.curClassify = data
      this.searchService()
    },
    async getClassOptions () {
      let result = await sysvalue.listOnce('THC_WH_OBJECT_SUB_TYPE')
      result.forEach(item => {
        let flag = false
        this.classOptions.forEach(val => {
          if (item.parentId === val.id) {
            flag = true
            val.children.push({
              value: item.value || item.id,
              label: i18n.t(item.name),
              id: item.id,
              code: item.code,
              erpCode: item.erpCode,
              parentId: item.parentId.split('.')[1] ? item.parentId.split('.')[1] : item.parentId
            })
          }
        })
        if (!flag) {
          if (['800', '801', '802'].includes(item.code)) {
            this.classOptions.push({
              value: item.value || item.id,
              label: i18n.t(item.name),
              id: item.id,
              code: item.code,
              erpCode: item.erpCode,
              children: []
            })
          }
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .filtrate {
    overflow: hidden;
    display: flex;
    .filtrate_tree {
      width: 140px;
      padding: 10px 0 10px 5px;
      /deep/ .el-tree {
        width: 140px;
        .el-tree-node.is-current {
          .el-tree-node__content {
            color:#1C7BEF;
          }
          .el-tree-node__children {
            .el-tree-node__content {
              color: #000;
            }
          }
        }
      }
    }
    .filtrate_right {
      width: 340px;
      flex: 1;
      display: flex;
      flex-direction: column;
      border-left: 1px solid #ccc;
      padding: 10px;
      .filtrate_search {
        height: 35px;
        /deep/.el-input {
          .el-input__inner {
            height: 30px;
            line-height: 30px;
          }
        }
      }
      .filtrate_service {
        flex: 1;
        overflow: auto;
        padding-left: 0;
        margin: 5px 0;
        .filtrate_service_item {
          line-height: 25px;
          height: auto;
          font-size: 14px;
          display: flex;
          &:hover {
            color:#1C7BEF;
          }
          .service_name {
            width: 100%;
            display: inline-block;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            flex: 1;
          }
          /deep/ .el-checkbox {
            margin-right: 5px;
            .el-checkbox__label {
              display: none;
            }
          }
        }
        .tempTxt {
          text-align: center;
          margin-top: 50px;
          color: #999;
        }
      }
    }
  }
</style>

