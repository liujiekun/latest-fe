import phr from '../page/index'
import main from '../page/main/index'
import datacontrol from '../page/datacontrol/index'
import dataswitch from '../page/dataswitch/index'
import datachannel from '../page/dataswitch/datachannel'
import analysis from '../page/analysis/index'
import groupDiagnosis from '../page/analysis/group_diagnosis'
import organDiagnosis from '../page/analysis/organ_diagnosis'
import outpatientDiagnosis from '../page/analysis/outpatient_diagnosis'
import hospitalDiagnosis from '../page/analysis/hospital_diagnosis'
import departmentGroup from '../page/analysis/department_group'
// import patientlist from '../page/patientlist/index'
import searchindex from '@/phr/page/patientlist/searchindex'
import patientdetailChild from './patientdetail'
import patientdetail from '@/phr/page/patientdetail/index'
import datainterface from '@/phr/page/datainterface'
export default [
  {
    path: '/phr',
    name: 'phr',
    redirect: '/phr/main',
    component: phr,
    children: [
      {
        path: 'main',
        component: main
      },
      {
        path: 'dataswitch',
        component: dataswitch
      },
      {
        path: 'datachannel',
        component: datachannel
      },
      {
        path: 'datainterface',
        component: datainterface
      },
      {
        path: 'datacontrol',
        component: datacontrol
      },
      {
        path: 'analysis',
        component: analysis,
        children: [
          {
            path: 'group_diagnosis',
            component: groupDiagnosis,
          },
          {
            path: 'organ_diagnosis',
            component: organDiagnosis,
          },
          {
            path: 'outpatient_diagnosis',
            component: outpatientDiagnosis,
            meta: {
              thirdActiveIndex: '/phr/analysis/organ_diagnosis'
            }
          },
          {
            path: 'hospital_diagnosis',
            component: hospitalDiagnosis,
            meta: {
              thirdActiveIndex: '/phr/analysis/organ_diagnosis'
            }
          },
          {
            path: 'department_group',
            component: departmentGroup,
            meta: {
              thirdActiveIndex: '/phr/analysis/organ_diagnosis'
            }
          }
        ]
      },
      {
        path: 'patientlist',
        component: searchindex
      },
      {
        path: 'patientdetail',
        component: patientdetail,
        children: [
          ...patientdetailChild
        ]
      }
    ]
  }
]
