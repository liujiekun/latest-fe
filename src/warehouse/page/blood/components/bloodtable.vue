<template>
  <div>
    <el-checkbox-group
    v-model="checklist">
      <el-table
      v-if="bloodData.length"
      :data="bloodData">
        <el-table-column
        width="25">
          <template slot-scope="scope">
            <el-checkbox :label="scope.row"></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column
        width="150"
        label="血源编码">
          <template slot-scope="scope">
            <thislist-icon :thisIndex="scope.row.thisIndex"></thislist-icon>
            {{scope.row.bloodSourceCode}}
          </template>
        </el-table-column>
        <el-table-column
        label="血液品种">
          <template slot-scope="scope">
            {{scope.row.bloodTypesName}}
          </template>
        </el-table-column>
        <el-table-column
        width="100"
        label="血型">
          <template slot-scope="scope">
            {{scope.row.aboName}}{{scope.row.rhName}}
          </template>
        </el-table-column>
        <el-table-column
        width="100"
        label="血量">
          <template slot-scope="scope">
            {{scope.row.bloodVolume}}{{scope.row.unitName}}
          </template>
        </el-table-column>
        <el-table-column
        label="采血日期">
          <template slot-scope="scope">
            <span v-if="scope.row.drawBloodDate">{{scope.row.drawBloodDate | formatDateByExp('YYYY-MM-DD')}}</span>
          </template>
        </el-table-column>
        <el-table-column
        label="失效日期">
          <template slot-scope="scope">
            <span v-if="scope.row.bloodExpirationDate">{{scope.row.bloodExpirationDate | formatDateByExp('YYYY-MM-DD')}}</span>
          </template>
        </el-table-column>
        <el-table-column
        label="配血人">
          <template slot-scope="scope">
            {{scope.row.matchingOperaterName}}<br /><span v-if="scope.row.createtime">{{scope.row.createtime | formatDateByExp('YYYY-MM-DD HH:mm')}}</span>
          </template>
        </el-table-column>
        <el-table-column
        label="配血单号">
          <template slot-scope="scope">
            {{scope.row.bloodMatchingCode}}
          </template>
        </el-table-column>
        <el-table-column
        label="取血单号">
          <template slot-scope="scope">
            {{scope.row.bloodTakeCode}}
          </template>
        </el-table-column>
        <el-table-column
        label="取血人">
          <template slot-scope="scope">
            {{scope.row.bloodCollectionOpreater}}<br /><span v-if="scope.row.bloodCollectionTime">{{scope.row.bloodCollectionTime | formatDateByExp('YYYY-MM-DD HH:mm')}}</span>
          </template>
        </el-table-column>
        <el-table-column
        label="发血人">
          <template slot-scope="scope">
            {{scope.row.bloodTakeOpreater}}<br /><span v-if="scope.row.bloodTakeTime">{{scope.row.bloodTakeTime | formatDateByExp('YYYY-MM-DD HH:mm')}}</span>
          </template>
        </el-table-column>
        <el-table-column
        width="80"
        label="操作">
          <template slot-scope="scope">
            <el-button v-if="!scope.row.bloodTakeCode" type="danger" size="small" plain @click="deleteListData(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-checkbox-group>
  </div>
</template>

<script>
import api from '../store/bloodmatchingapi'
import thislistIcon from './thislist.icon'
import bloodCommonFn from '../util/bloodcommonfn'
export default {
  mixins: [bloodCommonFn],
  props: {
    bloodTableData: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      api,
      checklist: []
    }
  },
  computed: {
    bloodData () {
      return this.bloodTablefindArr(this.bloodTableData)
    }
  },
  methods: {
    deleteListData (data) {
      this.api.updateBloodMatchingItem({id: data.id}).then(res => {
        if (res) {
          this.$messageTips(this, 'success', '删除成功')
          this.$emit('updateTableData', true)
        }
      })
    }
  },
  watch: {
    'checklist' (v) {
      this.$emit('checkChange', v)
    }
  },
  components: {
    thislistIcon
  }
}
</script>

<style scoped lang="scss">
.el-checkbox__label{
  font-size: 0;
}
</style>
