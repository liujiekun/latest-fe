/*
 * @Author: renpengfei
 * @Date: 2019-08-12 11:21:51
 * @LastEditors: renpengfei
 * @LastEditTime: 2019-10-29 18:54:38
 */
import Financial from '../page/financial'
import claim from '../page/medicalinsurance/claim'
import claimedit from '../page/medicalinsurance/claimedit'
import claimapproval from '../page/medicalinsurance/claimapproval'
import newclaimapproval from '../page/medicalinsurance/newclaimapproval'
import claimapprovaldetail from '../page/medicalinsurance/claimapprovaldetail'
import beginclaimedit from '../page/medicalinsurance/beginclaimedit'
import creditmanagement from '../page/medicalinsurance/creditmanagement'
import creditdetail from '../page/medicalinsurance/creditdetail'
import insurrefund from '../page/medicalinsurance/insurrefund'
import protestmanagement from '../page/medicalinsurance/protestmanagement'
import protestdetail from '../page/medicalinsurance/protestdetail'
import ArPeriodMange from '../page/arperiodmange'
import reports from '../page/medicalinsurance/reports'
import FinAccount from '../page/income/account/finaccount'
import CertificateManage from '../page/income/account/certificateManage'
import CertificateList from '../page/income/account/certificateList'
import IncomeDetail from '../page/income/account/incomefindetail'
import InsuranceInfoManage from '../page/insuranceInfoManage'
import uploadInsuranceInfo from '../page/uploadInsuranceInfo'
import PayAbleInvoiceList from '../page/payableinvoicelist'
import Payment from '../page/payment'
import PaymentList from '../page/paymentlist'
import PayAbleInvoice from '../page/payableinvoice'
import ApPeriodmange from '../page/apperiodmange'
import PrePaymentList from '../page/prepaymentlist'
import PrePayment from '../page/prepayment'
import ApVerifactionList from '../page/apverifactionlist'
import SearchPrepayVerify from '../page/searchprepayverify'
import GetInvoiceList from '../page/getinvoicelist'
import CostCompute from '../page/cost.account/compute'
import CostComputeDetail from '../page/cost.account/compute.detail'
import CostUpdate from '../page/cost.account/update'
import CostAccountParams from '../page/cost.account/settings/params'
import CostTransaction from '../page/cost.account/settings/transaction'
import CostPeriod from '../page/cost.account/settings/period'
import SurvivingReport from '../page/cost.account/settings/survivingreport'

// 内部结算管理
import insideTradeManagement from '@/rcm/page/insidetrademanagement/insidetrademanagement'
import insideSettlement from '@/rcm/page/insidetrademanagement/insidesettlement'
import newInsideSettlement from '@/rcm/page/insidetrademanagement/newinsidesettlement'
import insideSettlementDetail from '@/rcm/page/insidetrademanagement/insidesettlementdetail'
import settlementApproval from '@/rcm/page/insidetrademanagement/settlementapproval'
import receivable from '@/rcm/page/insidetrademanagement/receivable'
import shouldpay from '@/rcm/page/insidetrademanagement/shouldpay'
import CrossAgencyAdvice from '@/rcm/page/insidetrademanagement/crossagencyadvice.vue'

// 核销
import ReceiptsVerificationShow from '../page/receiptsverificationshow'
import ReceiptsVerificationList from '../page/receiptsverificationlist'
// 票据管理
import BillStockList from '@/rcm/page/bill.manage/bill.stock.manage/bill.stock.list'
import BillStockDetail from '@/rcm/page/bill.manage/bill.stock.manage/bill.stock.detail'
import BillIssueList from '@/rcm/page/bill.manage/bill.issue.manage/bill.issue.list'
import BillIssueDetail from '@/rcm/page/bill.manage/bill.issue.manage/bill.issue.detail'
import BillUse from '@/rcm/page/bill.manage/billuse/billuse.vue'
// 日结缴款
import dailyPament from '@/rcm/page/dailypament/dailypament.vue'
import dailyPamentHistory from '@/rcm/page/dailypament/dailypamenthistory.vue'

let router = [
  {
    path: '/financial/',
    redirect: '/financial/claimapproval'
  },
  {
    path: '/financial',
    name: 'financial',
    component: Financial,
    children: [
      {
        path: 'receiptsverificationshow/:receiptCode/:id',
        component: ReceiptsVerificationShow,
        meta: {
          thirdActiveIndex: '/financial/receipts'
        }
      },
      {
        path: 'receiptsverifications',
        component: ReceiptsVerificationList
      },
      {
        path: 'claim',
        component: claim,
        meta: {
          type: 1
        }
      },
      // 大客户
      {
        path: 'claimcustomer',
        component: claim,
        meta: { type: 2 }
      },
      {
        path: 'claimedit',
        component: claimedit,
        meta: {
          thirdActiveIndex: '/financial/claim',
          type: 1
        }
      },
      {
        path: 'claimeditcustomer',
        component: claimedit,
        meta: {
          thirdActiveIndex: '/financial/claimcustomer',
          type: 2
        }
      },
      {
        path: 'claimapproval',
        component: claimapproval,
        meta: { type: 1 }
      },
      // 大客户
      {
        path: 'claimapprovalcustomer',
        component: claimapproval,
        meta: { type: 2 }
      },
      {
        path: 'newclaimapproval',
        component: newclaimapproval,
        meta: {
          thirdActiveIndex: '/financial/claimapproval',
          type: 1
        }
      },
      {
        path: 'newclaimapprovalcustomer',
        component: newclaimapproval,
        meta: {
          thirdActiveIndex: '/financial/claimapprovalcustomer',
          type: 2
        }
      },
      {
        path: 'claimapprovaldetail',
        component: claimapprovaldetail,
        meta: {
          thirdActiveIndex: '/financial/claimapproval',
          type: 1
        }
      },
      {
        path: 'claimapprovaldetailcustomer',
        component: claimapprovaldetail,
        meta: {
          thirdActiveIndex: '/financial/claimapprovalcustomer',
          type: 2
        }
      },
      {
        path: 'beginclaimedit',
        component: beginclaimedit,
        meta: {
          thirdActiveIndex: '/financial/claim',
          type: 1
        }
      },
      {
        path: 'beginclaimeditcustomer',
        component: beginclaimedit,
        meta: {
          thirdActiveIndex: '/financial/claimcustomer',
          type: 2
        }
      },
      {
        path: 'creditmanagement',
        component: creditmanagement,
        meta: { type: 1 }
      },
      // 大客户
      {
        path: 'creditmanagementcustomer',
        component: creditmanagement,
        meta: { type: 2 }
      },
      {
        path: 'creditdetail',
        component: creditdetail,
        meta: {
          thirdActiveIndex: '/financial/creditmanagement',
          type: 1
        }
      },
      {
        path: 'creditdetailcustomer',
        component: creditdetail,
        meta: {
          thirdActiveIndex: '/financial/creditmanagementcustomer',
          type: 2
        }
      },
      {
        path: 'insurrefund',
        component: insurrefund,
        meta: {
          thirdActiveIndex: '/financial/creditmanagement',
          type: 1
        }
      },
      {
        path: 'insurrefundcustomer',
        component: insurrefund,
        meta: {
          thirdActiveIndex: '/financial/creditmanagementcustomer',
          type: 2
        }
      },
      {
        path: 'protestmanagement',
        component: protestmanagement,
        meta: { type: 1 }
      },
      // 大客户
      {
        path: 'protestmanagementcustomer',
        component: protestmanagement,
        meta: { type: 2 }
      },
      {
        path: 'protestdetail',
        component: protestdetail,
        meta: {
          thirdActiveIndex: '/financial/protestmanagement',
          type: 1
        }
      },
      {
        path: 'protestdetailcustomer',
        component: protestdetail,
        meta: {
          thirdActiveIndex: '/financial/protestmanagementcustomer',
          type: 2
        }
      },
      {
        path: 'arperiodmange',
        component: ArPeriodMange
      },
      {
        path: 'reports',
        component: reports
      },
      {
        path: 'finaccount',
        component: FinAccount
      },
      {
        path: 'certificateManage',
        component: CertificateManage
      },
      {
        path: 'certificateList',
        component: CertificateList
      },
      {
        path: 'incomeDetail',
        component: IncomeDetail
      },
      {
        path: 'insuranceInfoManage',
        component: InsuranceInfoManage
      },
      {
        path: 'uploadInsuranceInfo',
        component: uploadInsuranceInfo,
        meta: {
          thirdActiveIndex: '/financial/insuranceInfoManage'
        }
      },
      {
        path: 'uploadInsuranceInfo/:id',
        component: uploadInsuranceInfo,
        meta: {
          thirdActiveIndex: '/financial/insuranceInfoManage'
        }
      },
      {
        path: 'payableinvoices',
        component: PayAbleInvoiceList
      },
      {
        path: 'payments/invoice/:id',
        component: Payment,
        meta: {
          thirdActiveIndex: '/financial/payments'
        }
      },
      {
        path: 'payments/prepayment/:id',
        component: Payment,
        meta: {
          thirdActiveIndex: '/financial/payments'
        }
      },
      {
        path: 'payments',
        component: PaymentList
      },
      {
        path: 'paymentsverify',
        component: PaymentList
      },
      {
        path: 'paymentsverify/invoice/:id',
        component: Payment
      },
      {
        path: 'paymentsverify/prepayment/:id',
        component: Payment
      },
      {
        path: 'paymentsconfirm',
        component: PaymentList
      },
      {
        path: 'paymentsconfirm/invoice/:id',
        component: Payment
      },
      {
        path: 'paymentsconfirm/prepayment/:id',
        component: Payment
      },
      {
        path: 'payableinvoice/:code/:id',
        component: PayAbleInvoice,
        meta: {
          thirdActiveIndex: '/financial/payableinvoices'
        }
      },
      {
        path: 'payableinvoices/:id',
        component: PayAbleInvoice,
        meta: {
          thirdActiveIndex: '/financial/payableinvoices'
        }
      },
      {
        path: 'prepayments',
        component: PrePaymentList
      },
      {
        path: 'prepayment/:id',
        component: PrePayment,
        meta: {
          thirdActiveIndex: '/financial/payments'
        }
      },
      {
        path: 'prepayments/:id',
        component: PrePayment,
        meta: {
          thirdActiveIndex: '/financial/prepayments'
        }
      },
      {
        path: 'apverifactions',
        component: ApVerifactionList
      },
      {
        path: 'apperiodmange',
        component: ApPeriodmange
      },
      {
        path: 'searchprepayverify/:id',
        component: SearchPrepayVerify,
        meta: {
          thirdActiveIndex: '/financial/apverifactions'
        }
      },
      {
        path: 'getinvoicelist/:id',
        component: GetInvoiceList
      },
      // {
      //   path: 'reportmoduleview/:moduleName',
      //   component: ReportModuleView
      // },
      // {
      //   path: 'reportmoduleview/:moduleName/:id',
      //   component: ReportView
      // },
      {
        path: 'compute',
        component: CostCompute
      },
      {
        path: 'compute/:id',
        component: CostComputeDetail,
        meta: {
          thirdActiveIndex: '/financial/compute'
        }
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
      {
        path: 'survivingreport',
        component: SurvivingReport
      },
      {
        path: 'insideTradeManagement',
        component: insideTradeManagement,
        redirect: 'insideTradeManagement/insideSettlement',
        children: [{
          path: 'insideSettlement',
          component: insideSettlement
        },
        {
          path: 'insideSettlement/:id',
          component: insideSettlementDetail,
          meta: {
            thirdActiveIndex: '/financial/insideTradeManagement/insideSettlement'
          }
        },
        {
          path: 'newInsideSettlement',
          component: newInsideSettlement,
          meta: {
            thirdActiveIndex: '/financial/insideTradeManagement/insideSettlement'
          }
        },
        {
          path: 'settlementApproval',
          component: settlementApproval
        },
        {
          path: 'settlementApproval/:id',
          component: insideSettlementDetail,
          meta: {
            thirdActiveIndex: '/financial/insideTradeManagement/settlementApproval'
          }
        },
        {
          path: 'receivable',
          component: receivable
        },
        {
          path: 'shouldpay',
          component: shouldpay
        },
        {
          path: 'CrossAgencyAdvice',
          component: CrossAgencyAdvice
        }]
      },
      {
        path: 'billstocklist',
        component: BillStockList
      },
      {
        path: 'billstockdetail',
        component: BillStockDetail,
        meta: {
          thirdActiveIndex: '/financial/billstocklist'
        }
      },
      {
        path: 'billissuelist',
        component: BillIssueList
      },
      {
        path: 'billissuedetail',
        component: BillIssueDetail,
        meta: {
          thirdActiveIndex: '/financial/billissuelist'
        }
      },
      {
        path: 'billuse',
        component: BillUse
      },
      {
        path: 'dailyPayment',
        component: dailyPament,
        meta: {
          thirdActiveIndex: '/financial/dailyPayment'
        }
      },
      {
        path: 'dailyPayment/:feeType',
        component: dailyPament,
        meta: {
          thirdActiveIndex: '/financial/dailyPayment'
        }
      },
      {
        path: 'dailyPamentHistory',
        component: dailyPamentHistory,
        meta: {
          thirdActiveIndex: '/financial/dailyPamentHistory'
        }
      },
      {
        path: 'dailyPamentHistory/:feeType',
        component: dailyPamentHistory,
        meta: {
          thirdActiveIndex: '/financial/dailyPamentHistory'
        }
      }
    ]
  }
]
export default router
