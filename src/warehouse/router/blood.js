import Warehouse from '../page/warehouse'
import Home from '../page/blood/home'
import Entry from '../page/blood/entry'
import EntryList from '../page/blood/entry/entrylist'
import EntryBlood from '../page/blood/entry/entryblood'
import EntryBloodSee from '../page/blood/entry/entrybloodsee'
import Query from '../page/blood/query'
import Inventory from '../page/blood/query/inventory'
import configure from '../page/blood/configure'
import bloodWarning from '../page/blood/configure/bloodwarning'
import varietyCode from '../page/blood/configure/varietycode'
import bloodTypeCode from '../page/blood/configure/bloodtypecode'
import Manage from '../page/blood/manage'
import ManageList from '../page/blood/manage/managelist'
import BloodManageInfo from '../page/blood/manage/bloodmanageinfo'

export default [
  {
    path: '/blood',
    component: Warehouse,
    name: 'blood',
    children: [
      {
        path: 'home',
        name: 'bloodhome',
        component: Home,
        meta: {
          thirdActiveIndex: '/blood/home'
        }
      },
      {
        path: 'configure',
        name: 'bloodconfigure',
        component: configure,
        redirect: 'configure/bloodwarning',
        children: [
          {
            path: 'bloodwarning',
            name: 'bloodwarning',
            component: bloodWarning,
            meta: {
              secActiveIndex: '/blood/configure'
            }
          },
          {
            path: 'varietycode',
            name: 'varietycode',
            component: varietyCode,
            meta: {
              secActiveIndex: '/blood/configure'
            }
          },
          {
            path: 'bloodtypecode',
            name: 'bloodtypecode',
            component: bloodTypeCode,
            meta: {
              secActiveIndex: '/blood/configure'
            }
          }
        ]
      },
      {
        path: 'entry',
        name: 'bloodentry',
        component: Entry,
        redirect: 'entry/entrylist',
        children: [
          {
            path: 'entrylist',
            name: 'bloodentrylist',
            component: EntryList,
            meta: {
              thirdActiveIndex: '/blood/entry'
            }
          },
          {
            path: 'entryblood',
            name: 'entryblood',
            component: EntryBlood,
            meta: {
              thirdActiveIndex: '/blood/entry'
            }
          },
          {
            path: 'entrybloodsee/:id',
            name: 'entrybloodsee',
            component: EntryBloodSee,
            meta: {
              thirdActiveIndex: '/blood/entry'
            }
          }
        ]
      },
      {
        path: 'query',
        name: 'bloodquery',
        component: Query,
        redirect: 'query/bloodinventory',
        children: [
          {
            path: 'bloodinventory',
            name: 'bloodinventory',
            component: Inventory,
            meta: {
              secActiveIndex: '/blood/query'
            }
          },
          {
            path: 'expire',
            name: 'expire',
            component: Inventory,
            meta: {
              secActiveIndex: '/blood/query'
            }
          },
          {
            path: 'rhsearch',
            name: 'rhsearch',
            component: Inventory,
            meta: {
              secActiveIndex: '/blood/query'
            }
          }
        ]
      },
      {
        name: 'bloodmanage',
        path: 'manage',
        component: Manage,
        redirect: 'manage/applylist',
        children: [
          {
            path: 'matchinglist',
            name: 'matchinglist',
            component: ManageList,
            meta: {
              keepAlive: true,
              secActiveIndex: '/blood/manage'
            }
          },
          {
            path: 'crossmatching/:id',
            name: 'crossmatching',
            component: BloodManageInfo,
            meta: {
              thirdActiveIndex: '/blood/manage/matchinglist'
            }
          },
          {
            path: 'applylist',
            name: 'applylist',
            component: ManageList,
            meta: {
              keepAlive: true,
              secActiveIndex: '/blood/manage'
            }
          },
          {
            path: 'readyapply/:id',
            name: 'readyapply',
            component: BloodManageInfo,
            meta: {
              thirdActiveIndex: '/blood/manage/applylist'
            }
          }
        ]
      }
    ]
  }
]
