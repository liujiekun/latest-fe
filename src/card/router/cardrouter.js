import Card from '../page/card'
import Welcome from '@/login/page/welcome'
import CardBatchList from '../page/cardbatchlist'
import CreateCardBatch from '../page/createcardbatch'
import CardItem from '../page/carditem'
import SellCard from '../page/sellcard'
import ShareUser from '../page/shareusers'
// 优惠券
import Coupon from '@/card/page/coupon/coupon'
import GiftBatchList from '@/card/page/coupon/giftbatchlist'
import GiftBatchContent from '@/card/page/coupon/giftbatchcontent'
// import GiftBatchInfo from '@/card/page/coupon/giftbatchinfo'
import GiftBatchDetail from '@/card/page/coupon/giftbatchdetail'
import MallCoupon from '@/card/page/coupon/mallcoupon'
// 身份卡
import IdCardList from '@/card/page/idcardmanage/idcardlist'
import IdCardContent from '@/card/page/idcardmanage/idcardcontent'
// 自费折扣
import SelfTariffs from '../page/selftariffs'
import SelfTariffsAdd from '../page/selftariffsadd'
// 活动列表
import Activitys from '@/card/page/activitymanagement/activitylist'
import ActivityContent from '@/card/page/activitymanagement/activitycontent'
// 积分管理
import Creditlist from '../page/creditlist'
// 套餐管理
import packagemanage from '@/card/page/marketingpackage/packagemanagement'
import MarketingPackage from '@/card/page/marketingpackage/marketingpackagedetail'
import packOrderDetails from '@/crm/page/packagesale/orderdetails'// 订单详情
import UseDetailList from '@/crm/page/packagesale/usedetailsinfo'
import PackageInfo from '@/crm/page/packagesale/packageinfo'

// 商场路由 start
import OrderList from '@/mall/page/orderlist'
// import Frame from '@/mall/page/frame.vue'
import MallIndex from '@/mall/page/index.vue'
import MallDetails from '@/mall/page/details.vue'
import MyCarts from '@/mall/page/carts.vue'
import MyBuy from '@/mall/page/buy.vue'
import OrderDetail from '@/mall/page/orderdetail.vue'
import Recharge from '@/mall/page/recharge.vue'
import RechargeBuy from '@/mall/page/rechargebuy'
import GoodsCategories from '@/mall/page/goodscategories'
import GoodsSalling from '@/mall/page/goodssalling'
import GoodsForSall from '@/mall/page/goodsforsall'
import GoodsPublish from '@/mall/page/goodspublish'
import GoodsForsallEdit from '@/mall/page/goodsforsalledit'
import SaleService from '@/mall/page/saleservicelist'
import SaleServiceDetail from '@/mall/page/saleservicedetail'
import PackageSaleList from '@/crm/page/packagesale/packagesalelist'
import planList from '@/card/page/marketingpackage/guaranteeplan/planlist.vue'
import planDetails from '@/card/page/marketingpackage/guaranteeplan/plandetails.vue'
// end

export default [
  {
    path: '/card',
    name: 'card',
    redirect: '/card/welcome',
    component: Card,
    children: [
      {
        path: 'welcome',
        meta: {
          full: true
        },
        component: Welcome
      },
      {
        path: 'selftariffs',
        component: SelfTariffs,
        meta: {
          thirdActiveIndex: '/card/selftariffs'
        }
      },
      {
        path: 'selftariffsadd',
        component: SelfTariffsAdd,
        meta: {
          thirdActiveIndex: '/card/selftariffs'
        }
      },
      {
        path: 'selftariffsedit/:id',
        component: SelfTariffsAdd,
        meta: {
          thirdActiveIndex: '/card/selftariffs'
        }
      },
      {
        path: 'cardbatchlist',
        component: CardBatchList,
        meta: {
          thirdActiveIndex: '/card/cardbatchlist'
        }
      },
      {
        path: 'createcardbatch',
        component: CreateCardBatch,
        meta: {
          thirdActiveIndex: '/card/cardbatchlist'
        }
      },
      {
        path: 'carditem',
        component: CardItem,
        meta: {
          thirdActiveIndex: '/card/carditem'
        }
      },
      {
        path: 'sellcard',
        component: SellCard,
        meta: {
          thirdActiveIndex: '/card/carditem'
        }
      },
      {
        path: 'shareuser',
        component: ShareUser,
        meta: {
          thirdActiveIndex: '/card/carditem'
        }
      },
      {
        path: 'giftbatchs',
        component: Coupon,
        redirect: '/card/giftbatchs/inhospital',
        meta: {
          thirdActiveIndex: '/card/giftbatchs'
        }
      },
      {
        path: 'giftbatchs/inhospital',
        component: GiftBatchList,
        meta: {
          thirdActiveIndex: '/card/giftbatchs/inhospital'
        }
      },
      {
        path: 'giftbatchadd',
        component: GiftBatchContent,
        meta: {
          thirdActiveIndex: '/card/giftbatchs/inhospital'
        }
      },
      {
        path: 'giftbatchedit/:code',
        component: GiftBatchContent,
        meta: {
          thirdActiveIndex: '/card/giftbatchs/inhospital'
        }
      },
      {
        path: 'giftbatch',
        component: GiftBatchContent,
        meta: {
          thirdActiveIndex: '/card/giftbatchs/inhospital'
        }
      },
      // {
      //   path: 'giftbatchinfo/:id/',
      //   component: GiftBatchInfo,
      //   meta: {
      //     thirdActiveIndex: '/card/giftbatchs'
      //   }
      // },
      {
        path: 'giftbatchdetail/:id/:money',
        component: GiftBatchDetail,
        meta: {
          thirdActiveIndex: '/card/giftbatchs/inhospital'
        }
      },
      {
        path: 'giftbatchs/titanmall',
        component: MallCoupon,
        meta: {
          thirdActiveIndex: '/card/giftbatchs/titanmall'
        }
      },
      {
        path: 'idcards',
        component: IdCardList,
        meta: {
          thirdActiveIndex: '/card/idcards'
        }
      },
      {
        name: 'idcard',
        path: '/card/idcard',
        component: IdCardContent,
        meta: {
          thirdActiveIndex: '/card/idcards'
        }
      },
      {
        path: '/card/idcardedit/:code',
        name: 'idcardedit',
        component: IdCardContent,
        meta: {
          thirdActiveIndex: '/card/idcards'
        }
      },
      {
        path: 'activitys',
        name: 'activitys',
        component: Activitys,
        meta: {
          thirdActiveIndex: '/card/activitys'
        }
      },
      {
        path: 'activityadd',
        name: 'activityadd',
        component: ActivityContent,
        meta: {
          thirdActiveIndex: '/card/activitys'
        }
      },
      {
        path: 'activitydetail/:code',
        name: 'activitydetail/:code',
        component: ActivityContent,
        meta: {
          thirdActiveIndex: '/card/activitys'
        }
      },
      {
        path: 'credits',
        component: Creditlist,
        meta: {
          thirdActiveIndex: '/card/credits'
        }
      },
      {
        path: 'packagemanage/list',
        component: packagemanage,
        meta: {
          thirdActiveIndex: '/card/packagemanage/list'
        }
      },
      {
        path: 'order',
        component: PackageSaleList,
        meta: {
          thirdActiveIndex: '/card/order'
        }
      },
      {
        path: 'packorderdetail/:id',
        component: packOrderDetails,
        meta: {
          thirdActiveIndex: '/card/order'
        }
      },
      {
        path: 'usedetails/:id/:setMealId',
        name: 'usedetails',
        component: UseDetailList
      },
      {
        path: 'packageinfo/:id/:setMealId',
        name: 'packageinfo',
        component: PackageInfo
      },
      {
        path: 'plan',
        name: 'plan',
        component: planList,
        meta: {
          thirdActiveIndex: '/card/plan'
        }
      },
      {
        path: 'plandetails/:id',
        name: 'plandetails',
        component: planDetails,
        meta: {
          thirdActiveIndex: '/card/package/plan'
        }
      },
      {
        path: 'marketingpackageadd',
        component: MarketingPackage,
        meta: {
          thirdActiveIndex: '/card/packagemanage',
          source: 'card',
          isAdd: 1
        }
      },
      {
        path: 'marketingpackageedit',
        component: MarketingPackage,
        meta: {
          thirdActiveIndex: '/card/packagemanage',
          source: 'card'
        }
      },
      // 商场路由 start
      {
        path: 'orderlist',
        name: 'orderlist',
        component: OrderList,
        meta: {
          thirdActiveIndex: '/card/orderlist'
        }
      },
      {
        path: 'saleservice',
        name: 'saleservice',
        component: SaleService,
        meta: {
          thirdActiveIndex: '/card/saleservice'
        }
      },
      {
        path: 'saleservicedetail/:id',
        name: 'saleservicedetail',
        component: SaleServiceDetail,
        meta: {
          thirdActiveIndex: '/card/saleservice'
        }
      },
      {
        path: 'goodscategories',
        name: 'goodscategories',
        component: GoodsCategories,
        meta: {
          thirdActiveIndex: '/card/goodscategories'
        }
      },
      {
        path: 'goodssalling',
        name: 'goodssalling',
        component: GoodsSalling,
        meta: {
          thirdActiveIndex: '/card/goodssalling'
        }
      },
      {
        path: 'goodsforsall',
        name: 'goodsforsall',
        component: GoodsForSall,
        meta: {
          thirdActiveIndex: '/card/goodsforsall'
        }
      },
      {
        path: 'goodsforsalledit/:id',
        name: 'goodsforsalledit',
        component: GoodsForsallEdit,
        meta: {
          thirdActiveIndex: '/card/goodsforsall'
        }
      },
      {
        path: 'goodspublish',
        name: 'goodspublish',
        component: GoodsPublish,
        meta: {
          thirdActiveIndex: '/card/goodspublish'
        }
      },
      {
        path: 'mallindex',
        name: 'mallindex',
        component: MallIndex,
        meta: {
          thirdActiveIndex: '/card/mallindex'
        }
      },
      {
        path: 'mallcarts',
        name: 'mallcarts',
        component: MyCarts,
        meta: {
          thirdActiveIndex: '/card/mallindex'
        }
      },
      {
        path: 'malldetails/:id',
        name: 'malldetails',
        component: MallDetails,
        meta: {
          thirdActiveIndex: '/card/mallindex'
        }
      },
      {
        path: 'recharge',
        name: 'recharge',
        component: Recharge
      },
      {
        path: 'rechargebuy/:id',
        name: 'rechargebuyedit',
        component: RechargeBuy
      },
      {
        path: 'rechargebuy',
        name: 'rechargebuy',
        component: RechargeBuy
      },
      {
        path: 'mallbuy/:ids',
        name: 'mallbuy',
        component: MyBuy,
        meta: {
          thirdActiveIndex: '/card/mallindex'
        }
      },
      {
        path: 'orderdetails/:id',
        name: 'orderdetails',
        component: OrderDetail,
        meta: {
          thirdActiveIndex: '/card/orderlist'
        }
      }
      // end
    ]
  }
]
