import Rcm from '../page/rcm'
import Welcome from '@/login/page/welcome'
import SettlementList from '../page/settlementlist'
import GetInvoiceList from '../page/getinvoicelist'
import WeixinPay from '../page/weixinpay'
import ExportSettlementsInfo from '../page/exportsettlementsinfo'
import Helpmeds from '../page/helpmeds'
import ComInsuranceList from '../page/cominsurancelist'
import CostAccount from '../page/cost.account/layout'
import CostCompute from '../page/cost.account/compute'
import CostComputeDetail from '../page/cost.account/compute.detail'
import CostUpdate from '../page/cost.account/update'
import CostAccountParams from '../page/cost.account/settings/params'
import CostTransaction from '../page/cost.account/settings/transaction'
import CostPeriod from '../page/cost.account/settings/period'
// import DailySettle from '../page/income/dailySettlement'
import SettlementInfo from '../page/income/dailysettlement/settlementinfo'
import collectDailySettle from '@/rcm/page/income/dailySettlementCollect'
import MallSettlementInfo from '../page/income/dailysettlement/mallsettlementinfo.vue'
import DailySettleList from '../page/income/dailySettlementQuery'
import OutpatientIncomeForm from '../page/income/reportForms/outpatient'
import OutpatientIncomeSummary from '../page/income/reportForms/incomeSummary'
import accountCheck from '../page/account.check/list'
import accountCheckDetail from '../page/account.check/detail'
import receipt from '../page/receipt/receipt'
import receiptTabs from '../page/receipt/components/tabs'
import receiptDetail from '../page/receipt/components/receiptDetail'
import paymentDetail from '../page/receipt/components/paymentDetail'
import scanCodePayment from '../page/receipt/components/scanCodePayment'
// 财务基础1
// import PeriodSetup from '@/rcm/page/periodsetup'
// import PeriodSetupDetail from '@/rcm/page/periodsetupdetail'
import Coaaccount from '@/rcm/page/coaaccount'
import CoaaccountNew from '@/rcm/page/coaaccountnew'
import SubledgerList from '@/rcm/page/subledgerlist'
import Subledger from '@/rcm/page/subledger'
import SubledgerMapping from '@/rcm/page/subledgermapping'
import PeriodControlList from '@/rcm/page/periodcontrollist'
import PeriodControl from '@/rcm/page/periodcontrol'
import Vouchertemplate from '@/rcm/page/vouchertemplate'
import Basedata from '@/rcm/page/basedata'
import MappingSetupList from '@/rcm/page/mappingsetuplist'
import MappingSetup from '@/rcm/page/mappingsetup'

import settlepaymenthome from '@/rcm/page/outpatientSettlement/settlepaymenthome'
// 发票管理
import invoicemanage from '@/rcm/page/invoicemanage/invoicemanage'
import medicaretransaction from '@/rcm/page/medicaretransaction'
import landtaxmanage from '@/rcm/page/invoicemanage/landtaxmanage'
import billuse from '@/rcm/page/bill.manage/billuse/billuse'
// 支付方式
import PaymentMethod from '@/warehouse/page/payment/paymentmethod'
import Priority from '@/rcm/page/priority'
import CombinationConfig from '@/warehouse/page/payment/combinationconfig'
import DiscountProportion from '@/warehouse/page/payment/discountproportion'
import BizDict from '@/rcm/page/bizdict/bizdict'
import discountPerson from '../page/bizdict/discountperson'
import discountRemark from '../page/bizdict/discountremark'
import makeupfee from '../page/bizdict/makeupfee'
// 支付渠道配置
import paychannelconfig from '@/rcm/page/paychannelconfig/paychannelconfig'
import paychannel from '@/rcm/page/paychannelconfig/paychannellist'
import paychanneldetail from '@/rcm/page/paychannelconfig/paychanneldetail'
import PeriodSetup from '@/rcm/page/periodsetup'
import PeriodSetupDetail from '@/rcm/page/periodsetupdetail'
// 成本设置
import CostItems from '@/warehouse/page/costsetting/costitems'
import CostItemsAdd from '@/warehouse/page/costsetting/costitemsadd'
import ApportionmentType from '@/warehouse/page/costsetting/apportionmenttype'
import CostCorresponding from '@/warehouse/page/costsetting/costcorresponding'
import CostCorrespondence from '@/warehouse/page/costsetting/costcorrespondence'
// 统计分析
import BiRouter from '@/bi/router/index.js'
// 医保预结算
import outpatientMedicalManage from '@/rcm/otmdiscomponent/jlcc-medical-manage/jlcc-outpatient-medical-manage.vue'

// 财务分类映射关系
import FinancialControl from '@/rcm/page/financial.control'
import cssycs from '@/rcm/page/pay/cssycs'

// 内部交易价
import InsideTariffs from '@/rcm/page/tariffs/insidetariffs/insidetariffslist'
import InsideTariffsAdd from '@/rcm/page/tariffs/insidetariffs/insidetariffsadd'

// 授权管理
import AuthMain from '@/rcm/page/auth.manage/auth.main.vue'
import UserMain from '@/rcm/page/auth.manage/user.main.vue'
import AuthRecord from '@/rcm/page/auth.manage/auth.record.vue'
// 纠纷退费查询
import disputeRefund from '@/rcm/page/query/dispute-refund.vue'

// 黑龙江医保预警
import prewarning from '@/rcm/otmdiscomponent/hljmedical/prewarning.vue'
let RcmRouterArr = [
  {
    path: '/rcm/',
    name: 'outpatientfee',
    component: Rcm,
    redirect: '/rcm/reconstruct'
  },
  {
    path: '/cost',
    component: CostAccount,
    children: [
      {
        path: '',
        redirect: '/cost/compute'
      },
      {
        path: 'compute',
        component: CostCompute
      },
      {
        path: 'compute/:id',
        component: CostComputeDetail
      },
      {
        path: 'update',
        component: CostUpdate
      },
      {
        path: 'params',
        component: CostAccountParams
      },
      {
        path: 'transaction',
        component: CostTransaction
      },
      {
        path: 'period',
        component: CostPeriod
      },
    ]
  },
  {
    path: '/rcm',
    name: 'rcm',
    component: Rcm,
    children: [
      ...BiRouter({
        editMode: false,
        moduleSelect: false,
        searchMode: false,
        secActiveIndex: '/rcm/comins'
      }),
      {
        path: 'welcome',
        meta: {
          full: true
        },
        component: Welcome
      },
      {
        path: 'invoicemanage',
        component: invoicemanage
      },
      {
        path: 'cssycs',
        component: cssycs
      },
      {
        path: 'billuse',
        component: billuse,
        meta: {
          disabled: true
        },
      },
      {
        path: 'landtaxmanage',
        component: landtaxmanage
      },
      {
        path: 'paymenthome',
        component: settlepaymenthome
      },
      {
        path: 'medicaretransaction',
        component: medicaretransaction
      },
      {
        path: 'exportsettlementsinfo',
        component: ExportSettlementsInfo
      },
      {
        path: 'weixinpay',
        component: WeixinPay
      },
      {
        path: 'settlements',
        component: SettlementList
      },
      {
        path: 'getinvoicelist/:id',
        component: GetInvoiceList
      },
      {
        path: 'daily/settlement/:feeType',
        component: SettlementInfo,
        meta: {
          space: 'dailysettlement'
        }
      },
      {
        path: 'daily/collectSettlement',
        component: collectDailySettle
      },
      {
        path: 'daily/rcmSettlement',
        component: MallSettlementInfo
      },
      {
        path: 'daily/rcmSettlement/:id',
        component: MallSettlementInfo,
        meta: {
          space: 'dailysettlement'
        }
      },
      {
        path: 'daily/settlement/:feeType/:id',
        component: SettlementInfo
      },
      {
        path: 'dailysettlement/list',
        component: DailySettleList
      },
      {
        path: 'dailysettlement/list/:feeType',
        component: DailySettleList
      },
      {
        path: 'outpatient/form',
        component: OutpatientIncomeForm
      },
      {
        path: 'outpatient/summary',
        component: OutpatientIncomeSummary
      },
      {
        path: 'outpatient/disputeRefund',
        component: disputeRefund
      },
      {
        path: 'account/check',
        component: accountCheck
      },
      {
        path: 'account/check/:id',
        component: accountCheckDetail,
        meta: {
          thirdActiveIndex: '/rcm/account/check'
        }
      },
      {
        path: 'helpmeds',
        component: Helpmeds
      },
      {
        path: 'comins',
        component: ComInsuranceList
      },
      {
        path: 'receipt',
        component: receipt,
        redirect: 'receipt/tabs/0',
        children: [
          {
            path: 'tabs/:status',
            component: receiptTabs,
            meta: {
              thirdActiveIndex: '/rcm/receipt/tabs/0'
            }
          }
        ]
      },
      {
        path: 'receiptDetail',
        component: receiptDetail,
        meta: {
          thirdActiveIndex: '/rcm/receipt/tabs/0'
        }
      },
      {
        path: 'paymentDetail',
        component: paymentDetail,
        meta: {
          thirdActiveIndex: '/rcm/receipt/tabs/0'
        }
      },
      {
        path: 'scanCodePayment',
        component: scanCodePayment
      },
      {
        path: 'outpatientMedicalManage',
        component: outpatientMedicalManage
      },
      // 黑龙江预警管理
      {
        path: 'prewarning',
        component: prewarning
      }
    ]
  },
  {
    path: '/financeistall',
    component: Rcm,
    children: [
      {
        path: 'authmain',
        component: AuthMain
      },
      {
        path: 'usermain',
        component: UserMain
      },
      {
        path: 'authrecord',
        component: AuthRecord
      },
      {
        path: 'costitems',
        component: CostItems
      },
      {
        path: 'costitemsadd',
        component: CostItemsAdd
      },
      {
        path: 'costitemsedit/:id',
        component: CostItemsAdd
      },
      {
        path: 'apportionmenttype',
        component: ApportionmentType
      },
      {
        path: 'costcorresponding',
        component: CostCorresponding
      },
      {
        path: 'costcorrespondence',
        component: CostCorrespondence
      },
      {
        path: 'mappingsetupadd',
        component: MappingSetup
      },
      {
        path: 'mappingsetup/:id',
        component: MappingSetup
      },
      {
        path: 'mappingsetups',
        component: MappingSetupList
      },
      {
        path: 'vouchertemplate',
        component: Vouchertemplate
      },
      {
        path: 'basedata',
        component: Basedata
      },
      {
        path: 'periodcontrol',
        component: PeriodControl,
        meta: {
          thirdActiveIndex: '/financeistall/periodcontrols'
        }
      },
      {
        path: 'periodcontrols',
        component: PeriodControlList
      },
      {
        path: 'subledgeradd',
        component: Subledger,
        meta: {
          thirdActiveIndex: '/financeistall/subledgers'
        }
      },
      {
        path: 'subledgermapping/:setid/:accid',
        component: SubledgerMapping
      },
      {
        path: 'subledger/:id',
        component: Subledger,
        meta: {
          thirdActiveIndex: '/financeistall/subledgers'
        }
      },
      {
        path: 'subledgers',
        component: SubledgerList
      },
      {
        path: 'coaaccounts',
        component: Coaaccount
      },
      {
        path: 'coaaccountadd',
        component: CoaaccountNew,
        meta: {
          thirdActiveIndex: '/financeistall/coaaccounts'
        }
      },
      {
        path: 'coaaccount/:id',
        component: CoaaccountNew,
        meta: {
          thirdActiveIndex: '/financeistall/coaaccounts'
        }
      },
      {
        path: 'periodsetups',
        component: PeriodSetup
      },
      {
        path: 'periodadd',
        component: PeriodSetupDetail,
        meta: {
          thirdActiveIndex: '/financeistall/periodsetups'
        }
      },
      {
        path: 'periodsetupdetail/:id',
        component: PeriodSetupDetail,
        meta: {
          thirdActiveIndex: '/financeistall/periodsetups'
        }
      },
      {
        path: 'paymentmethod',
        component: PaymentMethod
      },
      {
        path: 'combinationconfig',
        component: CombinationConfig
      },
      {
        path: 'priority',
        component: Priority
      },
      {
        path: 'financialcontrol',
        component: FinancialControl
      },

      {
        path: 'insidetariffs',
        component: InsideTariffs
      },
      {
        path: 'insidetariffsadd',
        component: InsideTariffsAdd,
        meta: {
          thirdActiveIndex: '/financeistall/insidetariffs'
        }
      },
      {
        path: 'insidetariffsedit/:id',
        component: InsideTariffsAdd,
        meta: {
          thirdActiveIndex: '/financeistall/insidetariffs'
        }
      },
      {
        path: 'discountproportion',
        component: DiscountProportion
      },
      {
        path: 'bizdict',
        component: BizDict,
        redirect: 'bizdict/discountperson',
        children: [
          {
            path: 'discountperson',
            component: discountPerson,
            meta: {
              thirdActiveIndex: '/financeistall/bizdict'
            }
          },
          {
            path: 'discountRemark',
            component: discountRemark,
            meta: {
              thirdActiveIndex: '/financeistall/bizdict'
            }
          },
          {
            path: 'makeupfee',
            component: makeupfee,
            meta: {
              thirdActiveIndex: '/financeistall/bizdict'
            }
          }
        ]
      },
      {
        path: 'paychannelconfig',
        component: paychannelconfig,
        redirect: 'paychannelconfig/paychannel',
        children: [{
          path: 'paychannel',
          component: paychannel,
          meta: {
            thirdActiveIndex: '/financeistall/paychannelconfig'
          }
        },
        {
          name: 'paychanneladd',
          path: 'paychanneladd',
          component: paychanneldetail,
          meta: {
            thirdActiveIndex: '/financeistall/paychannelconfig'
          }
        },
        {
          path: 'paychannel/:id',
          component: paychanneldetail,
          meta: {
            thirdActiveIndex: '/financeistall/paychannelconfig'
          }
        }]
      }
    ]
  }
]

export default RcmRouterArr
