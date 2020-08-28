import Vuex from 'vuex'
import Vue from 'vue'
import dispensing from './modules/dispensing'
import processConfig from './modules/process.config'
import medicalrecord from './modules/medicalrecord'
import {deepClone, deepCompare} from '@/util/fns'
Vue.use(Vuex)

var state = {
  currentUser: {},
  currentOrg: {},
  resources: [],
  mobile: '',
  pending: 0,
  clientlength: 1,
  obj: null,
  preObj: null,
  csaIsScheduling: 1, // 用于区分手术麻醉患者列表排班情况
  csaOrAna: '', // 手麻路径跳转时候区分是医生还是护士
  deviceType: '101', // 终端管理visitType标识
  isNeonate: '', // 用于区分病区有没有新生儿登记接口
  workbenchFlag: '', // 用于区分不同工作台
  bindPatient: {}, // 预约信息
  macAddress: '', // 医保使用收费电脑的mac地址
  phrPatientActive: {}, // phr当前患者当天看诊日期对象
  cacheData: {},
  updating: false,
  versionHash: ''
}

var mutations = {
  setUpdating (state, value) {
    state.updating = value
  },
  setVersionHash (state, value) {
    state.versionHash = value
  },
  setPhrPatientActive (state, value) {
    state.phrPatientActive = value
  },
  setWorkbenchFlag (state, value) {
    state.workbenchFlag = value
  },
  setIsNeonate (state, value) {
    state.isNeonate = value
  },
  setCsaOrAna (state, value) {
    state.csaOrAna = value
  },
  setUser (state, user) {
    state.currentUser = user
  },
  setOrg (state, org) {
    state.currentOrg = org
  },
  setCsaIsScheduling (state, csaIsScheduling) {
    state.csaIsScheduling = csaIsScheduling
  },
  setResources (state, resources) {
    state.resources = resources
  },
  setMobile (state, mobile) {
    state.mobile = mobile
  },
  setPending (state, num) {
    state.pending += num
  },
  setClilength (state, len) {
    state.clientlength = len
  },
  setDocState (state, data) {
    state.obj = data.obj
    state.preObj = data.preObj
  },
  setDevice (state, type) {
    state.deviceType = type
  },
  setPatient (state, data) {
    state.bindPatient = data
  },
  setMacAddress (state, data) {
    state.macAddress = data
  },
  setAxiosCache (state, data) {
    if (state.cacheData[data.url]) {
      const existCache = state.cacheData[data.url].find(item => deepCompare(deepClone(item.params, true), deepClone(data.params, true)))
      if (existCache) {
        // 若能找到对应的缓存数据，则更新result
        existCache.result = data.result
      } else {
        // 否则，加入新的缓存
        state.cacheData = {
          ...state.cacheData,
          [data.url]: [...state.cacheData[data.url], {
            params: data.params,
            result: data.result,
          }]
        }
      }
    } else {
      state.cacheData = {
        ...state.cacheData,
        [data.url]: [{
          params: data.params,
          result: data.result,
        }]
      }
    }
  },
}

var actions = {
  setUser (context) {
    context.commit('setUser')
  }
}

const store = new Vuex.Store({
  state,
  mutations,
  actions,
  modules: {
    dispensing,
    processConfig,
    medicalrecord
  },
})

export default store
