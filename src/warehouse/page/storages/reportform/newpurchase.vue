<template>
  <div class="ever-tab flex_column_full_hidden">
    <div v-if="$route.name == 'outpatient'" class="settle_inner">
      <el-row>
        <el-col :span="24">
          <el-menu class="settlemenu">
            <el-menu-item @click="$router.push(`${path}/reportform/outpatient`)" :class="$route.params.status ? 'is-inactive' : 'is-active'" index="t.b.d">
              采购入库汇总表
            </el-menu-item>
            <el-menu-item @click="$router.push(`${path}/reportform/outpatient/11`)" :class="$route.params.status == 11 ? 'is-active' : 'is-inactive'" index="completed">
              采购入库明细表
            </el-menu-item>
            <el-menu-item @click="$router.push(`${path}/reportform/outpatient/12`)" :class="$route.params.status == 12 ? 'is-active' : 'is-inactive'" index="return">
              采购退货汇总表
            </el-menu-item>
            <el-menu-item @click="$router.push(`${path}/reportform/outpatient/13`)" :class="$route.params.status == 13 ? 'is-active' : 'is-inactive'" index="summary">
              采购退货明细表
            </el-menu-item>
            <el-menu-item @click="$router.push(`${path}/reportform/outpatient/14`)" :class="$route.params.status == 14 ? 'is-active' : 'is-inactive'" index="suppliers">
              供应商往来汇总表
            </el-menu-item>
            <el-menu-item @click="$router.push(`${path}/reportform/outpatient/15`)" :class="$route.params.status == 15 ? 'is-active' : 'is-inactive'" index="dealings">
              供应商往来明细表
            </el-menu-item>
          </el-menu>
        </el-col>
      </el-row>
    </div>
    <div v-else-if="$route.name == 'hospitalization'" class="settle_inner">
      <el-row>
        <el-col :span="24">
          <el-menu class="settlemenu">
            <el-menu-item @click="$router.push(`${path}/reportform/hospitalization`)" :class="$route.params.status ? 'is-inactive' : 'is-active'" index="dispensemedicinecount">
              发货汇总表
            </el-menu-item>
            <el-menu-item @click="$router.push(`${path}/reportform/hospitalization/17`)" :class="$route.params.status == 17 ? 'is-active' : 'is-inactive'" index="dispensemedicinedetail">
              发货明细表
            </el-menu-item>
            <el-menu-item @click="$router.push(`${path}/reportform/hospitalization/18`)" :class="$route.params.status == 18 ? 'is-active' : 'is-inactive'" index="returnmedicinecount">
              退货汇总表
            </el-menu-item>
            <el-menu-item @click="$router.push(`${path}/reportform/hospitalization/19`)" :class="$route.params.status == 19 ? 'is-active' : 'is-inactive'" index="returnmedicinedetail">
              退货明细表
            </el-menu-item>
          </el-menu>
        </el-col>
      </el-row>
    </div>
    <div v-else-if="$route.name == 'inventory'" class="settle_inner">
      <el-row>
        <el-col :span="24">
          <el-menu class="settlemenu">
            <el-menu-item @click="$router.push(`${path}/reportform/inventory`)" :class="$route.params.status ? 'is-inactive' : 'is-active'" index="depot_depot_library">
              在库物品表
            </el-menu-item>
            <el-menu-item @click="$router.push(`${path}/reportform/inventory/20`)" :class="$route.params.status == 20 ? 'is-active' : 'is-inactive'" index="depot_depot_stock_batch">
              在库物品批次查询表
            </el-menu-item>
            <el-menu-item @click="$router.push(`${path}/reportform/inventory/21`)" :class="$route.params.status == 21 ? 'is-active' : 'is-inactive'" index="depot_depot_summary">
              出入库业务汇总
            </el-menu-item>
            <el-menu-item @click="$router.push(`${path}/reportform/inventory/22`)" :class="$route.params.status == 22 ? 'is-active' : 'is-inactive'" index="depot_depot_stream">
              出入库业务流水
            </el-menu-item>
            <el-menu-item @click="$router.push(`${path}/reportform/inventory/25`)" :class="$route.params.status == 25 ? 'is-active' : 'is-inactive'" index="collecting_summary">
              领用汇总表
            </el-menu-item>
            <el-menu-item @click="$router.push(`${path}/reportform/inventory/23`)" :class="$route.params.status == 23 ? 'is-active' : 'is-inactive'" index="charged_but_not_released">
              已收费未发货报表
            </el-menu-item>
            <el-menu-item @click="$router.push(`${path}/reportform/inventory/24`)" :class="$route.params.status == 24 ? 'is-active' : 'is-inactive'" index="inventory">
              进销存报表
            </el-menu-item>
          </el-menu>
        </el-col>
      </el-row>
    </div>
    <router-view></router-view>
  </div>
</template>
<script>
import getstorage from '@/warehouse/page/storages/util/getstorage'
export default {
  mixins: [getstorage],
  data () {
    return {
      path: this.$route.matched[0].path
    }
  },
}
</script>
<style lang="scss" scoped>
.settle_inner .settlemenu {background-color: #fff; font-family: PingFangSC-Semibold; font-size: 16px; color: #000; line-height: 16px;  border-bottom: 1px solid #eee; border-radius: 4px 4px 0 0; padding: 0 20px;}
.settlemenu .el-menu-item { padding: 0 15px; background-color: #fff; font-size: 16px;}
.settlemenu .el-menu-item { height: 50px; line-height: 50px; border-bottom: 3px solid transparent;display:inline-block; }
.settlemenu .el-menu-item:hover, .settlemenu .el-menu-item.is-active { border-bottom: 3px solid #1c7bef; }
.settlemenu /deep/ .el-menu-item.is-inactive {border-bottom: none !important;}
.layout_inner_reminder {padding: 20px; margin: 0 20px; border-radius: 4px; background: #fff; box-shadow: 0 0 8px rgba(0, 0, 0, 0.1); width: 90%; height: 80%; position: absolute; background-color: #fff;}
.reminder { position: absolute; left: 40%; top: 40%; font-size: 20px; }
</style>
