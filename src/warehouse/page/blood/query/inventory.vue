 <template>
  <div class="hospital-container">
    <!-- 血型品种 -->
    <el-container class="hospital-layout">
      <el-aside width="500px" style="padding:10px" class="inner high">
        <el-table
          ref="singleTable"
          v-loading.body="leftLoading"
          :data="leftTableData"
          highlight-current-row
          :height="'calc(100vh - 130px)'"
          @row-click="handleDetails"
          style="width: 100%; margin: 0">
          <el-table-column
            class-name="pointer"
            prop="codes"
            label="血液品种">
            <template slot-scope="scope">
              {{scope.row.bloodTypesName}}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="aboName"
            width="90"
            label="ABO血型">
          </el-table-column>
          <el-table-column
            align="center"
            prop="rhName"
            width="90"
            label="Rh(D)血型"
            >
          </el-table-column>
          <el-table-column
            align="center"
            label="血量">
            <template slot-scope="scope">
              {{scope.row.hsNum}}{{scope.row.unitName}}
            </template>
          </el-table-column>
        </el-table>
      </el-aside>
      <el-main class="inner ml10">
        <el-table
          border
          v-loading.body="rightLoading"
          :data="rightTableData"
          highlight-current-row
          :height="'calc(100vh - 130px)'"
          style="width: 100%; margin: 0">
          <el-table-column
            class-name="pointer"
            width="180"
            label="血源编码">
            <template slot-scope="scope">
              {{scope.row.bloodSourceCode}}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="bloodTypesName"
            label="血液品种"
            >
          </el-table-column>
          <el-table-column
            align="center"
            label="ABO血型"
            >
            <template slot-scope="scope">
              {{scope.row.aboName}}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="Rh(D)血型"
            >
            <template slot-scope="scope">
              {{scope.row.rhName}}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="血量"
            >
            <template slot-scope="scope">
              {{scope.row.bloodVolume}}{{scope.row.unitName}}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="drawBloodDate"
            width="160"
            label="采血日期"
            >
          </el-table-column>
          <el-table-column
            align="center"
            prop="bloodExpirationDate"
            width="160"
            label="失效日期"
            >
          </el-table-column>
          <el-table-column
            align="center"
            prop="inStockOperaterName"
            label="入库人"
            >
          </el-table-column>
          <el-table-column
            align="center"
            prop="createDate"
            width="160"
            label="入库日期"
            >
          </el-table-column>
        </el-table>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import api from '../store/inventoryapi'
import getstorage from '@/warehouse/page/storages/util/getstorage'
export default {
  mixins: [getstorage],
  data () {
    return {
      api,
      queryObj: {},
      leftTableData: [],
      rightTableData: [],
      thisBloodtypes: '',
      thisAbo: '',
      thisRh: '',
      leftLoading: true,
      rightLoading: true,
      routeName: this.$route.name
    }
  },
  created () {
    this.queryObj.storageRoomId = this.storageId
    this._routeName(this.$route.name)
  },
  methods: {
    _routeName (name) {
      if (name === 'bloodinventory') {
        this.queryObj.bloodExpirationStatus = 3
        if (this.queryObj.rh) {
          delete this.queryObj.rh
        }
      } else if (name === 'expire') {
        this.queryObj.bloodExpirationStatus = 2
        if (this.queryObj.rh) {
          delete this.queryObj.rh
        }
      } else if (name === 'rhsearch') {
        this.queryObj.rh = '66df3ff2-6cf3-482b-b9b0-ca224477d4bc'
        if (this.queryObj.bloodExpirationStatus) {
          delete this.queryObj.bloodExpirationStatus
        }
      }
      this.getLetftList()
      this.routeName = name
    },
    getLetftList () {
      this.leftLoading = true
      this.api.getBloodBankStockParentList(this.queryObj).then(res => {
        if (res) {
          this.rightTableData = []
          this.leftTableData = res
          this.$nextTick(_ => {
            if (this.$refs.singleTable.$el.querySelectorAll('.el-table__row')[0]) {
              this.$refs.singleTable.$el.querySelectorAll('.el-table__row')[0].click()
            }
          })
        }
        this.leftLoading = false
        if (!this.leftTableData.length) {
          this.rightLoading = false
        }
      })
    },
    handleDetails (data) {
      this.rightLoading = true
      this.thisBloodtypes = data.bloodTypes
      this.thisAbo = data.abo
      this.thisRh = data.rh
      let params = {
        bloodtypes: data.bloodTypes,
        abo: data.abo,
        rh: data.rh,
        storageRoomId: this.storageId
      }
      Object.assign(params, this.queryObj)
      this.api.getBloodBankStockList(params).then(res => {
        if (res) {
          this.rightTableData = res
        }
        this.rightLoading = false
      })
    }
  },
  watch: {
    '$route.name' (v) {
      this._routeName(v)
    }
  }
}
</script>
<style lang="scss" scoped>
.hospital-layout .high{
  height: calc(100vh - 105px);
}
</style>

