import Reportsets from '@/bi/page/reportlist'
import ReportView from '@/bi/page/report-view'
import ReportDetailsList from '@/bi/page/reportdetails/reportdetailslist'

let RouterArr = function (opt = {
  editMode: false,  // 是否可以编辑 (控制行内是否出现删除和编辑)
  moduleSelect: false,  // 是否可以选择模块搜索，配合某些业务内只查询一个模块下的报表的需求
  searchMode: false,  // 是否有查询和新增区域 某些页面纯表格展示，不需要搜索条件区域
  addMode: false, // 是否显示添加按钮
  thirdActiveIndex: '', // 菜单高亮补丁
  secActiveIndex: '',  // 菜单高亮补丁
}) {
  return [
    {
      path: 'reportlist/:code?',
      name: 'reportsets',
      component: Reportsets,
      meta: {
        editMode: opt.editMode,
        moduleSelect: opt.moduleSelect,
        searchMode: opt.searchMode,
        secActiveIndex: opt.secActiveIndex,
        addMode: opt.addMode
      }
    },
    {
      path: 'reportdetail/view/:code?',
      name: 'ReportView',
      component: ReportView,
      meta: {
        thirdActiveIndex: opt.thirdActiveIndex
      }
    },
    {
      path: 'reportdetail/:moduleName/:id',
      name: 'rcmReportDetails',
      component: ReportDetailsList,
      meta: {
        thirdActiveIndex: opt.thirdActiveIndex
      }
    }
  ]
}

export default RouterArr
