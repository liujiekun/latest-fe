import HistoryVisitinfo from '../phrinfo/page/historyvisitinfo'

export default [
  {
    path: '/patientinfo/',
    redirect: '/patientinfo/service'
  },
  {
    path: '/patientinfo/history',
    name: 'Historyvisitinfo',
    component: HistoryVisitinfo,
    children: []
  }
]
