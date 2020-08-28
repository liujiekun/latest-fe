import tableListColumn from '@/warehouse/page/storages/column/tablle.list.column.js'
import inAndOutFunctional from '@/warehouse/page/storages/column/inandout.functional.js'
import { tableDefaultCellValue } from '@/warehouse/views/util/constant.js'

let staffSchema = [
  {
    name: 'applicantName',
    label: '申请人',
    comp: 'readonlyitem',
    span: 6
  },
  {
    name: 'relatedPartyName',
    label: '发货库房',
    comp: 'readonlyitem',
    span: 6
  },
]

export default {
  data () {
    return {
      tableListColumn,
      tableColumns: [],
      staffSchema,
      tableDefaultCellValue,
      commoditylocation: this.$hasPermission('Auth_menu_treasury_businessmanagement_commoditylocation'),
    }
  },
  components: {
    inAndOutFunctional
  },
  computed: {
    // 计算需要合并单元格的物资，记录物资 下标和length old
    hanlderItems () {
      let tableData = this.obj.outStockItemList ? this.obj.outStockItemList : this.obj.inStockItemList[0].item
      return tableData.map((item, index) => {
        let childIndex = tableData.findIndex(child => child.localMaterialId === item.localMaterialId)
        const thisArr = tableData.filter(child => child.localMaterialId === item.localMaterialId)
        // 当前物资第一次出现的下标
        item.thisTableIndex = childIndex
        // 当前物资存在几条
        item.thisTableCount = thisArr.length
        // 当前物资的最后一条打上标记  last 需要显示添加批号按钮
        item.last = index === childIndex + thisArr.length - 1
        return item
      })
    },
    renderColumns () {
      return this.tableListColumn.filter(item => (item.render || item.slot))
    }
  },
  methods: {
    // 合并表格
    arraySpanMethod ({ row, column, rowIndex, columnIndex }) {
      let tableData = this.obj.outStockItemList ? this.obj.outStockItemList : this.obj.inStockItemList[0].item
      if (this.columnIndes.includes(columnIndex) && tableData.length > 1) {
        if (((rowIndex - (row.thisTableIndex + row.thisTableCount)) % row.thisTableCount) === 0) {
          return {
            rowspan: row.thisTableCount,
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    },
  }
}
