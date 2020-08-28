<template>
  <div class="addbox mt10">
    <div>
      <material-select
        :params="queryParams"
        style="width: 760px; height: 32px"
        ref="remoteselect"
        :needObjFlag="true"
        :apiName="'getStockLocalSettingListAndBatchNum'"
        @change="handleSelect">
      </material-select>
    </div>
    <add-listdata
      v-if="stockContainerList && stockContainerList.length"
      :classifyId="classifyId"
      :dataList="stockContainerList"
      @dataUpdate="selectListData">
    </add-listdata>
    <div class="mt15">
      <el-button type="primary" :disabled="!stockContainerList || !stockContainerList.length" @click="addThisListData">添加</el-button>
    </div>
    <div class="beCareful">
      {{ inventoryRange === '2' ? '注：按物资盘点单据仅支持添加本次盘点单中收录的物资生产批次，如需添加新的物资请重新创建盘点单。' : '注：全库盘点仅支持添加已存在过入库记录的物资生产批次，新的物资及批次请走正规采购入库流程。'}}
    </div>
  </div>
</template>

<script>
import api from '@/warehouse/store/drugstocktakingapi'
import { debounce } from '@/util/common'
import addListdata from './addlistdata'
import remoteSelect from '../../joinstorage/remoteselect'
export default {
  props: ['storageRoomId', 'inventoryTakingId', 'inventoryRange'],
  data () {
    return {
      api,
      objss: '',
      thisLocalData: {},
      stockContainerList: [],
      classifyId: '',
      queryParams: {
        storageRoomId: this.storageRoomId,
        name: '',
        inventoryTakingId: this.inventoryTakingId,
        inventoryRange: this.inventoryRange
      },
      listdata: []
    }
  },
  methods: {
    async handleSelect (v) {
      if (v.localMaterialId) {
        this.thisLocalData = v
        this.stockContainerList = v.stockContainerList
        this.classifyId = v.classifyId
        if (!v) return
        if (!v.stockContainerList || v.stockContainerList.length === 0) {
          this.$messageTips(this, 'error', '当前物资没有可以添加的生产批号')
        }
      }
    },
    selectListData (v) {
      this.listdata = v
    },
    addThisListData: debounce(function () {
      if (this.listdata.length) {
        if (this.listdata.some(item => item.num === 0 || !item.num && item.stockNum === 0)) {
          return this.$messageTips(this, 'error', '请输入当前物资的实物数量')
        }
        this.api.addInventoryTakingItem({ inventoryTakingId: this.inventoryTakingId, itemList: this.listdata }).then(res => {
          if (!res.length) {
            return this.$messageTips(this, 'error', '当前物资的实物数量不能为0或者为空')
          }
          if (res) {
            this.$emit('addUpdateSuccess', res)
            this.thisLocalData = {}
            this.stockContainerList = []
            this.classifyId = ''
            this.$refs.remoteselect.select = {}
            this.$messageTips(this, 'success', '添加漏盘物资成功')
          }
        })
      } else {
        this.$messageTips(this, 'error', '请先添加物资信息')
      }
    })
  },
  components: {
    remoteSelect,
    addListdata
  }
}
</script>

<style scoped lang="less">
.addbox{
  background: #EEEEEE;
  border-radius: 4px;
  padding: 10px;
}
.beCareful{
  margin-top: 7px;
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #666666;
}
</style>
