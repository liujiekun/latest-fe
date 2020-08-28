import birthDoctors from '@/birth/page/index'

// 患者管理
import patientmgt from '@/inpatient/page/patient.mgt.vue'
import Treatment from '@/inpatient/page/open.vue'
import docswrapper from '@/inpatient/page/docswrapper'
import Path from '@/inpatient/components/path/path.vue'
import temperatureview from '@/inpatient/components/temperatureview.vue'

// 院感查询
import infectedquery from '@/inpatient/page/infectedquery.vue'

// 病区管理
import wardMgt from '@/inpatient/page/bed.vue'
export default [
  {
    name: 'birth_doctors',
    path: '/birth_doctors',
    meta: {
      space: 'birth_doctors',
      type: '3', // 1-门诊；2-急诊；3-住院
      role: '1' // 角色 护士 - '2' | 医生 - '1'
    },
    component: birthDoctors,
    redirect: '/birth_doctors/ward_mgt',
    children: [
      {
        // 患者管理
        name: 'patientmgt_resident',
        path: 'patientmgt',
        redirect: '/birth_doctors/patientmgt/open',
        component: patientmgt,
        meta: {
          fullscreen: true
        },
        children: [
          {
            // 住院登记
            name: 'open',
            path: 'open',
            component: Treatment,
            meta: {
              topType: 2,
              // active: '/resident/patient',
              secActiveIndex: '/birth_doctors/patientmgt'
            }
          },
          {
            path: 'docs/:id?/:dataId?/:code?',
            component: docswrapper,
            meta: {
              secActiveIndex: '/birth_doctors/patientmgt'
            }
          },
          {
            path: 'path',
            component: Path,
            meta: {
              secActiveIndex: '/birth_doctors/patientmgt'
            }
          },
          {
            path: 'temperatureview',
            component: temperatureview,
            meta: {
              secActiveIndex: '/birth_doctors/patientmgt'
            }
          }
        ]
      },
      {
        name: 'birth_doctors_patient_mgt',
        path: 'ward_mgt',
        component: wardMgt
      },
      {
        //  院内感染查询
        name: 'infectedquery',
        path: 'infectedquery',
        component: infectedquery,
        meta: {
          secActiveIndex: '/birth_doctors/infectedquery'
        }
      }
    ]
  }
]
