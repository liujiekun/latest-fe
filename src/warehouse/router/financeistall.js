import Warehouse from '../page/warehouse'
// 支付方式
import PaymentMethod from '../page/payment/paymentmethod'
import CombinationConfig from '../page/payment/combinationconfig'
import DiscountProportion from '../page/payment/discountproportion'
export default [
  {
    path: '/financeistall',
    component: Warehouse,
    children: [
      {
        path: 'paymentmethod',
        component: PaymentMethod
      },
      {
        path: 'combinationconfig',
        component: CombinationConfig
      },
      {
        path: 'discountproportion',
        component: DiscountProportion
      }
    ]
  }
]
