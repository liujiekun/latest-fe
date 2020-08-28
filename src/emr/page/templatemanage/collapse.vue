<template>
    <div class="collapse_wrap" :class="{'dpt_collapse':businessType===3}">
        <el-collapse v-model="activeNames">
        <el-collapse-item :title="item.name" :name="item.id" v-for='item in collapse' :key='item.id'>
            <el-tree
              :data="treeData[item.id]"
              :props="defaultProps"
              @node-contextmenu="getNode"
              @node-click="handleNodeClick"
              default-expand-all
              highlight-current	>
                <span class="custom-tree-node" slot-scope="{node, data}">
                    <i 
                      class="icon iconfont icon-bingli-muban1" 
                      :class="{default_color:data.categoryDepts&&data.categoryDepts.length>0}"
                      v-if="data.isTemplate"
                      ></i>
                    <i class="icon iconfont icon-bingli-leixing" v-else></i>
                    <span>{{ node.label }}</span>
                </span>
            </el-tree>
        </el-collapse-item>
        </el-collapse>
        <contextmenu
          :businessType="businessType"
          :class-name="className" 
          :menu="menuList" 
          @select="handleOperate"></contextmenu>
    </div>
</template>
<script>
import contextmenu from '@/emr/components/tree.contextmenu'
import confirm from '@/util/confirm'
import update from '@/emr/mixins/update.js'// vuex存储数据
let menuList = [
  {
    name: '新建',
    id: 'create',
    disabled: false,
    operate: 'create'
  },
  {
    name: '刷新',
    id: 'refresh',
    disabled: false,
    border: true,
    operate: 'refresh'
  },
  {
    name: '编辑',
    id: 'edit',
    disabled: false,
    border: false,
    operate: 'edit'
  },
  {
    name: '删除',
    id: 'delete',
    disabled: false,
    border: true,
    operate: 'delete'
  },
  {
    name: '上移',
    id: 'up',
    disabled: false,
    border: false,
    operate: 'up'
  },
  {
    name: '下移',
    id: 'down',
    disabled: false,
    border: false,
    operate: 'down'
  },
]
export default{
  name: 'collapse',
  components: {
    contextmenu
  },
  mixins: [update],
  props: {
    collapse: Array,
    businessType: [String, Number], // 模版类型
    treeData: {// 完整的树
      type: Object,
      default () {
        return {}
      }
    },
    showTpl: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      parent: null,
      tpl_icon: '#icon-bingli-muban1', // 模版图标
      type_icon: '#icon-bingli-leixing', // 病历类型图标
      className: 'el-tree-node__content',
      curNode: {},
      menuList,
      activeNames: [],
      defaultProps: {
        children: 'nodes',
        label: 'name'
      }
    }
  },
  created () {
    this.parent = this.getParent(this.$parent)
  },
  methods: {
    getParent (root) {
      if (!root) return console.error('使用此组建请设置组件名称')
      const parentNames = ['templatemanage', 'infusion_editor']
      let parent = root
      if (parentNames.includes(parent.$options.name)) {
        return parent
      } else {
        parent = parent.$parent
        return this.getParent(parent)
      }
    },
    async handleNodeClick (data) { // 点击左键触发
      console.log(this.parent.$options.name)
      if (!data.isTemplate) return false
      if (this.templateChange) {
        confirm(this, {
          confirmCallBack: () => {
            this.parent.saveTpl()
            // this.$emit('saveTpl')
          },
          cancelCallBack: () => {
            this.parent.editTpl(data)// 此处需要考虑一下是否应该是编辑
            this.setAsyncChange(false)
          }
        })
      } else {
        this.parent.editTpl(data)
      }
    },
    handleOperate (obj) {
      let setOperate = (operateType) => {
        const operations = {
          'create': this.parent.contextmenuAdd,
          'refresh': this.parent.contextmenuRefresh,
          'edit': this.parent.contextmenuEdit,
          'delete': this.parent.contextmenuRemove,
          'up': this.parent.contextmenuUpOrDown,
          'down': this.parent.contextmenuUpOrDown
        }
        const upDown = {
          'up': 1,
          'down': 2
        }
        operations[operateType](this.curNode, upDown[operateType])
      }

      if (this.templateChange && ['create', 'edit'].includes(obj.operate)) {
        confirm(this, {
          confirmCallBack: () => {
            this.parent.saveTpl()
          },
          cancelCallBack: () => {
            // 调用了父级的initUpdate
            // this.parent.initUpDate()
            this.setAsyncChange(false)
            setOperate(obj.operate)
          }
        })
      } else {
        setOperate(obj.operate)
        return false
      }
    },
    getNode (event, data, node, cur) {
      if (data.isTemplate) {
        this.menuList.map((item, index) => {
          if (index === 1 || index === 2 || index === 3) {
            this.$set(item, 'disabled', false)
          } else {
            this.$set(item, 'disabled', true)
          }
        })
      } else {
        this.menuList.map((item, index) => {
          if (index === 0 || index === 1 || index === 4 || index === 5) {
            this.$set(item, 'disabled', false)
          } else {
            this.$set(item, 'disabled', true)
          }
        })
      }
      this.curNode = data
    }
  }
}
</script>
<style lang="scss" scoped>
.default_color{
  color:rgb(0, 26, 255);
}
.br{
  border-right:1px solid #ccc;
}
.collapse_wrap{
  background: #F9F9F9;
}
.el-collapse /deep/.el-collapse-item__header{
  padding-left: 14px;
}
.el-collapse /deep/.el-collapse-item__header.is-active{
  border-bottom:1px solid #ccc;
}
.dpt_collapse .el-collapse /deep/.el-collapse-item__header, .dpt_collapse  .el-collapse /deep/.el-collapse-item__wrap{
  padding-left: 28px;
}
.el-collapse /deep/.el-collapse-item__wrap{
  border-bottom:1px solid #ccc;
}
// .el-collapse /deep/.el-icon-caret-right:before{
//   content:'1'
// }
</style>
