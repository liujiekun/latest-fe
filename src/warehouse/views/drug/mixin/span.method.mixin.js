import {
  checkboxWidth,
  IS_REPRINT
} from '@/warehouse/views/util/constant'
export default {
  data () {
    return {
      checkboxWidth
    }
  },
  computed: {
    mailGroupIds () {
      const obj = new Map()
      if ((this.operateMode === 1)) {
        let prev = 0 // 上一条父子医嘱数据数量
        !(this.pageType === 1 ? this.table : this.metaData.taskDtoList).forEach(task => {
          const { mainGroupId, mainFlag } = task.taskItemList[0]
          // 父子医嘱id + 同状态 + 创建时间 => 同一个医嘱多次撤销 (多次提交)  (多个父子医嘱会被收集为一个同状态的父子医嘱 bug)
          const compose = mainGroupId + task.createTime
          if (mainFlag > 0) {
            if (!obj.has(compose)) {
              obj.set(compose, {
                list: [task],
                prev,
                len: 1
              })
            } else {
              const map = obj.get(compose)
              map.list.push(task)
              map.len = map.list.length
            }
          }
          prev++
        })
        return obj
      }
      return obj
    }
  },
  methods: {
    objectSpanMethod ({ row, column, rowIndex, columnIndex }) {
      const { mainFlag, mainGroupId } = row.taskItemList[0]
      // 父子医嘱id + 同状态 + 创建时间
      const compose = mainGroupId + row.createTime
      const mapMainGroup = this.mailGroupIds.get(compose)
      let _columns = [0, 1]
      // 发药记录页面自取数据不需要合并前两列（checkobx 、标识）
      if (this.metaData && this.metaData.delivery === 0 && this.pageType === 4) {
        _columns = []
      }
      // 中药和西药操作打印列(补打)所在的columnIndex不一致，获取补打操作的 columnIndex
      if (column.property === IS_REPRINT) {
        _columns = _columns.concat(columnIndex)
      }
      // 审核时， 只有第一列checkbox框需要合并，其他处方明细需要合并checkbox和异常编辑修改列
      // 缺货页面， 不合并表格列
      if (
        this.pageType !== 3 &&
        this.operateMode === 1 &&
        _columns.includes(columnIndex) &&
        mapMainGroup &&
        mainFlag > 0
      ) {
        const { len: adviceLength, prev } = mapMainGroup
        if (adviceLength === 1) return
        if (((rowIndex - prev) % adviceLength) === 0) {
          return {
            rowspan: adviceLength,
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
