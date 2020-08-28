<template>
  <div id="setting">
    <search-header :show-first-dept="true" @query="setParams" @selectTemplate="setTemplate" @getOrgan="setOrgan" @getDept="setDept">
      <el-button type="primary" slot="afther" @click="checkArrange">生成排班</el-button>
    </search-header>
    <div class="body">
      <el-row type="flex">
        <el-col class="fl">
          <table cellpadding="0" cellspacing="0">
            <thead>
              <tr>
                <th width="80" style="min-width:80px">{{dept.deptName}}</th>
                <th width="160" style="min-width:160px">医生</th>
              </tr>
            </thead>
          </table>
          <div class="leftbody" ref="left">
            <table cellpadding="0" cellspacing="0" ref="lefttable">
              <tbody>
                <tr v-for="(item, i) in list" :key="i">
                  <td width="80" style="min-width:80px" :style="{height: (itemsHeight[i] - 1) + 'px', lineHeight: (itemsHeight[i] - 1) + 'px'}" align="center">
                    <span>{{i+1}}</span>
                    <div class="mask" v-if="!item.isValid"></div>
                  </td>
                  <td width="160" style="min-width:160px" :style="{height: (itemsHeight[i] - 1) + 'px', lineHeight: (itemsHeight[i] - 1) + 'px'}" align="center">
                    <span>{{item.resourceName}}</span>
                    <div class="mask" v-if="!item.isValid"></div>
                  </td>
                </tr>
                <tr>
                  <td width="80" align="center">{{list.length + 1}}</td>
                  <td width="160" align="center">
                    <add-doctor :organ-id="organ.organId" :resource-list="list" :code="template.resourceTypeCode" :template-id="template.id" :dept-id="dept.deptId" @success="getArrangeList"></add-doctor>
                  </td>                
                </tr>
              </tbody>
            </table>
          </div>
        </el-col>
        <el-col class="fl">
          <table cellpadding="0" cellspacing="0">
            <thead>
              <tr>
                <th class="weektd">星期日</th>
                <th class="weektd">星期一</th>
                <th class="weektd">星期二</th>
                <th class="weektd">星期三</th>
                <th class="weektd">星期四</th>
                <th class="weektd">星期五</th>
                <th class="weektd">星期六</th>
                <th width="160">操作</th>
              </tr>
            </thead>
          </table>
          <div class="rightbody" @scroll="handleScroll">
            <table cellpadding="0" cellspacing="0" ref="maintable">
              <tbody>
                <tr v-for="(item, i) in list" :key="i">
                  <td v-for="j of 7" :key="j" class="weektd">
                    <div class="wrap" v-if="item.weekResourceArrangeMap">
                      <template v-for="(res, k) in item.weekResourceArrangeMap[j]">
                        <time-trunk v-if="item.weekResourceArrangeMap[j]" :resource="item" :dept="dept" :templet-id="template.id"  :timetrunk="res" :key="k" @del="getArrangeList"></time-trunk>
                      </template>
                    </div>
                    <add-arrange class="add" :week="j" :filters="item.weekResourceArrangeMap ? item.weekResourceArrangeMap[j] : ''" :week-resource-id="item.id" :params="{deptIds: [dept.deptId], organId: organ.organId, timeTrunkType: template.timeTrunkType}" @success="getArrangeList" v-if="item.isValid"></add-arrange>
                    <div class="mask" v-if="!item.isValid"></div>
                  </td>
                  <td align="center" width="161" :class="{back: !item.isValid}">
                    <el-button size="small" type="danger" plain @click="delWeekResource(item)">删除</el-button>
                    <el-button size="small" type="warning" plain @click="setValid(item)" v-if="item.isValid === 1">停用</el-button>
                    <el-button size="small" type="success" plain @click="setValid(item)" v-else>启用</el-button>
                  </td>
                </tr>
                <tr>
                  <td v-for="j of 7" :key="j" class="weektd">
                  </td>
                  <td width="161"></td>
                </tr>          
              </tbody>
            </table>
          </div>          
        </el-col>
      </el-row>
    </div>
    <weeks-arrange ref="weeksarrange" :searchinfo="params"></weeks-arrange>
  </div>
</template>

<script>
  import api from '@/arrange/store/settingapi'
  import addArrange from '@/arrange/page/setting/addarrange.vue'
  import searchHeader from '@/arrange/page/scheduling/search.vue'
  import addDoctor from '@/arrange/page/setting/adddoctor.vue'
  import timeTrunk from '@/arrange/page/setting/timetrunk.vue'
  import weeksArrange from '@/arrange/page/setting/weeks-arrange.vue'
  export default {
    data () {
      return {
        api,
        row: 12,
        template: '',
        organ: '',
        dept: '',
        list: [],
        itemsHeight: [],
        params: {
          deptId: '',
          organId: '',
          templetId: '',
          resourceName: ''
        }
      }
    },
    watch: {
      params: {
        handler (val) {
          if (val.organId && val.templetId && val.deptId) {
            this.getArrangeList()
          }
        },
        deep: true
      }
    },
    methods: {
      checkArrange (e) {
        this.$refs.weeksarrange.dialogVisible = true
      },
      setParams (val) {
        this.params = val
      },
      setTemplate (val) {
        this.template = val
        this.params.templetId = val.id
      },
      setOrgan (val) {
        this.organ = val
        this.params.organId = val.organId
      },
      setDept (val) {
        if (val) {
          this.dept = val
          this.params.deptId = val.deptId
        }
      },
      getArrangeList () {
        this.api.getDeptWeekArrange(this.params).then(rs => {
          if (rs.head.errCode || !rs.data[0]) {
            this.list = []
            return false
          }
          this.list = rs.data[0].resourceVOList
          this.$nextTick(() => {
            this.itemsHeight = this.getItemsHeight()
          })
        })
      },
      delWeekResource (val) {
        this.$confirm('您确定要删除该资源下所有排班吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(_ => {
          this.api.delWeekResource({id: val.id}).then(rs => {
            if (rs.head.errCode) {
              return false
            }
            this.$notify({
              title: '提示',
              type: 'success',
              message: '资源已删除成功',
              duration: 2000
            })
            this.getArrangeList()
          })
        })
      },
      setValid (val) {
        this.api.setValidWeekResource({id: val.id, isValid: val.isValid ? 0 : 1}).then(rs => {
          this.getArrangeList()
        })
      },
      getItemsHeight () {
        let items = Array.from(this.$refs.maintable.querySelectorAll('tr'))
        let arr = []
        items.map(item => {
          arr.push(item.clientHeight)
        })
        return arr
      },
      handleScroll (e) {
        // let X = e.target.scrollLeft
        let Y = e.target.scrollTop
        // this.$refs.header.scrollLeft = X
        this.$refs.left.scrollTop = Y
      }
    },
    components: {
      addArrange,
      searchHeader,
      addDoctor,
      timeTrunk,
      weeksArrange
    }
  }
</script>
<style scoped>
  #setting{padding: 10px; background: #fff; height: calc(100% - 40px); overflow: auto;}
  #setting .fl{width: auto;}
  #setting .leftbody{height: 680px; overflow: hidden;}
  #setting .rightbody{height: 680px; overflow: auto;margin-left: -1px;}
  #setting table tr td,
  #setting table tr th {border-left: 1px solid #ddd; border-bottom: 1px solid #ddd; height: 40px; font-size: 14px; position: relative;}
  #setting table{border-right: 1px solid #ddd;}
  #setting table tr th {border-top: 1px solid #ddd; background: #ccc; font-size: 14px;}
  #setting table tr td {cursor: pointer;}
  #setting table tr td.back{background: rgba(100,100,100,0.1);}
  #setting .weektd{min-width: 209px; position: relative;}
  #setting .weektd .wrap{padding: 5px 40px 5px 5px;}
  #setting .weektd .add{position: absolute; right: 0; top: 0; bottom: 0; width: 40px; z-index: 1000; text-align: center; display: none;}
  #setting .weektd:hover .add{display: block;}
  #setting .mask {position: absolute; left: 0; right: 0; top: 0; bottom: 0; background: rgba(100,100,100,0.1); z-index: 999;}
</style>
