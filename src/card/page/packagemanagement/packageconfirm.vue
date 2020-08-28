<template>
  <el-popover
    placement="bottom"
    trigger="manual"
    popper-class="ever_popover_confirm"
    v-model="visible">
    <p class="confirm_txt"><i class="iconfont icon-sales-zhuyi"></i><span>{{msg}}</span></p>
    <div style="text-align: center; margin: 0">
      <el-button size="mini" @click="visible = false">取消</el-button>
      <el-button type="primary" size="mini" @click="confirm()">确定</el-button>
    </div>
    <template slot="reference">
      <i class="f16 iconfont icon-sales-cuowu cGray" @click="visible = !visible" v-if="iconType == 1"></i>
      <i class="icon iconred el-icon-circle-close" @click="visible = !visible" v-else-if="iconType == 2"></i>
      <el-button :disabled="disabled" :type="type" :plain="plain" size="small" @click="visible = !visible" v-else-if="iconType == 0">{{buttonVal}}</el-button>
    </template>
  </el-popover>
</template>
<script>
export default {
  // iconType 0表示使用按钮，1表示使用灰色删除16*16背景图片，2表示红色删除
  // props: ['msg', 'iconType', 'buttonVal', 'type', 'plain'],
  props: {
    msg: {
      type: String,
      default: ''
    },
    iconType: {
      type: Number,
      default: ''
    },
    buttonVal: {
      type: String,
      default: '删除'
    },
    type: {
      type: String,
      default: 'danger'
    },
    plain: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      visible: false
    }
  },
  methods: {
    confirm () {
      this.visible = false
      this.$emit('confirm')
    }
  }
}
</script>
<style scoped>
.icon{
  margin-left:5px;
  height: 36px;
  line-height: 36px;
}
i.deleteicon{
  display: inline-block;
  width:16px;
  height:16px;
  background: url('../../assets/shanchu.png');
  cursor: pointer;
}
i.iconred{color:red;}
el-button{
  cursor: pointer;
}
</style>
