<template>
  <el-dialog title="变异提示" :visible.sync="visibleFlag" append-to-body id="variation" width="500px">
    <el-row>
      <h3 class="textcenter">{{obj.typeName}}</h3>
      <h6 class="textcenter">{{obj.pathName}}</h6>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="5" class="textright">
        <span class="cRed">*</span>原因：
      </el-col>
      <el-col :span="14">
        <el-select v-model="reason" placeholder="请选择">
          <el-option
            v-for="item in superSelect"
            :key="item.reasonCode"
            :label="item.reasonName"
            :value="item.reasonCode"
          ></el-option>
        </el-select>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="5" class="textright">
        <span class="cRed">*</span>明细：
      </el-col>
      <el-col :span="14">
        <el-select v-model="detail" placeholder="请选择" :disabled="checked">
          <el-option
            v-for="item in Select"
            :key="item.detailCode"
            :label="item.detailName"
            :value="item.detailCode"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="5">
        <el-checkbox v-model="checked"></el-checkbox>其他
      </el-col>
    </el-row>
    <el-row :gutter="20" v-if="checked">
      <el-col :span="5" class="textright">
        <span class="cRed">*</span>其他明细：
      </el-col>
      <el-col :span="14">
        <el-input type="textarea" placeholder="请输入其他明细" v-model="others"></el-input>
      </el-col>
    </el-row>
    <div slot="footer">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="save">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import api from '@/inpatient/store/resident.js'
export default {

  data () {
    return {
      api,
      visibleFlag: false,
      checked: false,
      superSelect: [],
      Select: [],
      others: '',
      reason: '',
      detail: '',
      obj: {}
    }
  },
  methods: {
    close () {
      this.visibleFlag = false
    },
    open (obj) {
      this.visibleFlag = true
      this.init()
      this.obj = obj
    },
    init () {
      this.api.getPathwayAbnormalDictionarys().then(res => {
        this.superSelect = res.data
      })
    },
    async save () {
      if ((!this.reason || !this.detail) || (this.checked && !this.others)) {
        // this.$notify({
        //   title: '必填校验',
        //   type: 'warning',
        //   message: '请选择原因或明细'
        // })
        return this.$messageTips(this, 'warning', '请选择原因或明细', '必填校验')
      }
      let obj = {
        ...this.obj,
        reason: this.reason,
        detail: this.detail,
        others: this.others
      }
      this.superSelect.forEach(item => {
        if (obj.reason === item.reasonCode) {
          obj.reasonName = item.reasonName
        }
      })
      this.Select.forEach(item => {
        if (obj.detail === item.detailCode) {
          obj.detailName = item.detailName
        }
      })
      let res = await this.api.createAbnormalRecord(obj)
      if (res.head && res.head.errCode === 0) {
        // this.$notify({
        //   title: '提交成功',
        //   type: 'success',
        //   message: res.head && res.head.errMsg
        // })
        this.$messageTips(this, 'success', '提交成功', '提示')
        this.$emit('success', this.obj.type)
        this.close()
      }
    }
  },
  watch: {
    'reason': {
      handler (val) {
        this.superSelect.forEach(item => {
          if (val === item.reasonCode) {
            this.Select = item.abnormalDetailDtos
          }
        })
      },
      immediate: true
    }
  }
}
</script>
<style lang="scss" scoped>
#variation {
  h3,
  h6 {
    margin: 0;
  }
  .textcenter {
    text-align: center;
  }
  .textright {
    text-align: right;
  }
  .el-row {
    line-height: 50px;
  }
}
</style>

