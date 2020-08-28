/*
 * @Author: renpengfei
 * @Date: 2018-08-13 18:51:18
 * @Last Modified by: renpengfei
 * @Last Modified time: 2018-10-29 18:47:49
 */
import fetch from './api'
import {diction} from '@/store/common'
const url = diction.api
const outpatientUrl = '/rcm/ar/settlement/'
export const queryMedicareTrade = (data) => {
  return fetch({
    url: url + outpatientUrl + 'queryMedicareTrade',
    method: 'post',
    data: data
  })
}
export const commitTradeStateAll = (data) => {
  return fetch({
    url: url + outpatientUrl + 'commitTradeStateAll',
    method: 'post',
    data: data
  })
}
