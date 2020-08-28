/*
 * @Author: xiongzhiqing@everjiankang.com
 * @Date: 2020-05-07 12:36:25
 * @Last Modified by: xiongzhiqing@everjiankang.com
 * @Last Modified time: 2020-05-09 10:06:38
 * 医保管理  机构信息路由
 */
import Designated from '../../views/organization/designated.vue'
import Operation from '../../views/organization/operation.vue'
import Catalogue from '../../views/organization/catalogue.vue'
import CatalogueDownload from '../../views/organization/catalogue.download.vue'

export default [
  {
    path: 'designated',
    name: 'designated',
    component: Designated
  },
  {
    path: 'operation',
    name: 'operation',
    component: Operation
  },
  {
    path: 'catalogue',
    name: 'catalogue',
    component: Catalogue,
    meta: {
      full: true
    }
  },
  {
    path: 'cataloguedownload',
    name: 'cataloguedownload',
    component: CatalogueDownload,
    meta: {
      full: true
    }
  }
]
