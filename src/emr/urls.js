// 电子病历相关的接口
const prefix = {
  templateManage: 'medical-record/doctor/',
  formEngine: 'form-engine/'
}
export default{
  // 模版管理
  templateManage: {
    getTemplateTree: { url: 'medicalRecordCategory/getTemplateTree', prefix: prefix.templateManage },
    upOrDown: { url: 'medicalRecordCategory/upOrDown', prefix: prefix.templateManage },
    checkName: { url: 'templateScope/checkName', prefix: prefix.templateManage },
    getTplList: { url: 'templateScope/superiorSearch', prefix: prefix.templateManage },
    getFormDataById: {url: 'formData/getFormDataById', isStatic: false, prefix: prefix.formEngine},
    getOldTplList: { url: 'FormTemplate/queryTemplate', prefix: prefix.formEngine },
    saveTpl: { url: 'templateScope/create', prefix: prefix.templateManage },
    updateTpl: { url: 'templateScope/update', prefix: prefix.templateManage },
    delTpl: { url: 'templateScope/delete', isStatic: false, prefix: prefix.templateManage },
    getOrgTree: {url: 'templateScope/getOrgTree', prefix: prefix.templateManage},
    getCategoryId: {url: 'medicalRecordCategory/getByCode', prefix: prefix.templateManage},
    getsystemConfigDisabled: {url: 'systemConfigParent/isDisabled', prefix: prefix.templateManage}
  },
  // 病案管理
  recordManage: {
    getCategoryTreeExistMedical: {url: 'medicalRecordCategory/getCategoryTreeExistMedical', prefix: prefix.templateManage},
    batchPrint: {url: 'medicalRecord/findPrintContinueRecords', prefix: prefix.templateManage},
    getPrintContinueRecords: {url: '/medicalRecord/getPrintContinueRecords', prefix: prefix.templateManage}
  },
  // 表单相关
  form: {
    // 体温单查询数据和模版接口
    getTmpData: {url: 'medicalRecord/getTemperatureByVisitId', prefix: prefix.templateManage},
    create: {url: 'medicalRecord/create', prefix: prefix.templateManage}
  },
  // 体温单
  temperature: {
    getChartData: {url: 'temperatureRecord/getChartData', prefix: prefix.templateManage}
  }
}
