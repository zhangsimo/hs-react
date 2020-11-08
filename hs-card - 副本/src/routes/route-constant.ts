/**
 * 页面数据，临时提供缓存页面使用
 * React.lazy引入缓存不生效
 *
 * @format
 */
import { lazy } from 'react';

// const CardList = lazy(() => const( '@/views/cardConfig/index'
const CardList = lazy(() => import('@/views/cardConfig/index'));

const AddCard = lazy(() => import('@/views/cardConfig/addCard'));

const GetCardList = lazy(() => import('@/views/cardConfig/getCardList'));
const CustomerList = lazy(() => import('@/views/customer'));
const CustomerAdd = lazy(() => import('@/views/customer/add'));
const CustomerDetail = lazy(() => import('@/views/customer/detail'));
const VipmemberList = lazy(() => import('@/views/vipmember/list'));
const VipmemberDetail = lazy(() => import('@/views/vipmember/detail'));
const MemberList = lazy(() => import('@/views/member/list'));
const CarmanageList = lazy(() => import('@/views/carmanage/list'));
const CarmanageAdd = lazy(() => import('@/views/carmanage/add'));
const CarmanageAddcustomer = lazy(() => import('@/views/carmanage/addcustomer'));
const CarmanageDetail = lazy(() => import('@/views/carmanage/detail'));

const CarmanageChangcarplate = lazy(() => import('@/views/carmanage/changcarplate'));
const CarmanageauditList = lazy(() => import('@/views/carmanageaudit/list'));
const CarmanageauditDetail = lazy(() => import('@/views/carmanageaudit/detail'))
const SystemRole = lazy(() => import('@/views/system/role'))
const SystemUser = lazy(() => import('@/views/system/user'))
const SystemMenu = lazy(() => import('@/views/system/menu'))
const SystemDict = lazy(() => import('@/views/system/dict'))
const DataDataSurvey = lazy(() => import('@/views/dataSurvey'))
const AppIndex = lazy(() => import('@/views/app/appList/index'))
const AppAppConfig = lazy(() => import('@/views/app/appConfig'))
const ActivityCard = lazy(() => import('@/views/activity/card'))
const ActivityTheme = lazy(() => import('@/views/marketCenter/themeActivity/index'))
const ActivityDetails = lazy(() => import('@/views/marketCenter/themeActivity/details'))
const DataStatistics = lazy(() => import('@/views/marketCenter/themeActivity/statistics'))

const MarketActivity = lazy(() => import('@/views/marketCenter/marketActivity/index'))
const AddMarketActivity = lazy(() => import('@/views/marketCenter/marketActivity/add'))
const marketStatistics = lazy(() => import('@/views/marketCenter/marketActivity/statistics'))
const MarketDetails = lazy(() => import('@/views/marketCenter/marketActivity/details'))

const ThemeDetails = lazy(() => import('@/views/marketCenter/themeActivity/themeDetails'))
const ThemeStape = lazy(() => import('@/views/marketCenter/themeActivity/add'))
const AddThemeActivity = lazy(() => import('@/views/marketCenter/themeActivity/add'))

//营销中心--促销活动

const PromotionActivity = lazy(() => import('@/views/marketCenter/promotionActivity/index'))
const AddPromotionActivity = lazy(() => import('@/views/marketCenter/promotionActivity/add'))
const PromotionStatistics = lazy(() => import('@/views/marketCenter/promotionActivity/statistics'))
const PromotionDetails = lazy(() => import('@/views/marketCenter/promotionActivity/details'))

//营销中心--营销规则

const MarketRule = lazy(() => import('@/views/marketCenter/marketRule/index'))
const AddMrketRule = lazy(() => import('@/views/marketCenter/marketRule/add'))
//门店管理

const CompanyList = lazy(() => import('@/views/company/index'))
const CompanyDetails = lazy(() => import('@/views/company/details'))

const CardDetails = lazy(() => import('@/views/activity/cardDetails'))
const ShopCategory = lazy(() => import('@/views/shop/category/Index'))
const ShopList = lazy(() => import('@/views/shop/list/Index'))
const ShopAdd = lazy(() => import('@/views/shop/add/Index'))
const ShopEdit = lazy(() => import('@/views/shop/edit/Index'))
const ShopHeadList = lazy(() => import('@/views/shop/headList/Index'))
const OrdermanageList = lazy(() => import('@/views/ordermanage/order/index'))
const OrdermanageWorklist = lazy(() => import('@/views/ordermanage/work/list'))
const OrdermanageWorkDetail = lazy(() => import('@/views//ordermanage/work/detail'))
const OrdermanageOrderDetail = lazy(() => import('@/views/ordermanage/order/detail'))
const OrdermanageStorelist = lazy(() => import('@/views/ordermanage/store/list'))
const OrdermanageAdd = lazy(() => import('@/views/ordermanage/order/add'))
const OrderSubList = lazy(() => import('@/views/ordermanage/orderSub/index'))

const UserCenterHead = lazy(() => import('@/views/userCenter/head'))
const UserCenterStore = lazy(() => import('@/views/userCenter/store'))
const UserCenterCommission = lazy(() => import('@/views/userCenter/commission'))

//客户退单
const OrderChargeback = lazy(() => import('@/views/ordermanage/chargeback/index'))
const OrderChargebackDetail = lazy(() => import('@/views/ordermanage/chargeback/detail'))

//商城设置
//商城图片管理
const mallSetImgManage = lazy(() => import('@/views/mallSet/imgManage/list'))
const routeList = [
  {
    path: '/card/cardList',
    component: CardList,
    isCache: false,
  },
  {
    path: '/card/addCard',
    component: AddCard,
  },
  {
    path: '/card/getCardList',
    component: GetCardList,
    isCache: false,
  },
  {
    path: '/customer/list',
    component: CustomerList,
  },
  {
    path: '/customer/add',
    component: CustomerAdd,
  },
  {
    path: '/customer/detail',
    component: CustomerDetail,
  },
  {
    path: '/vipmember/list',
    component: VipmemberList,
  },
  {
    path: '/vipmember/detail',
    component: VipmemberDetail,
  },
  {
    path: '/member/list',
    component: MemberList,
  },
  {
    path: '/carmanage/list',
    component: CarmanageList,
  },
  {
    path: '/carmanage/add',
    component: CarmanageAdd,
  },
  {
    path: '/carmanage/detail',
    component: CarmanageDetail,
  },
  {
    path: '/carmanage/addcustomer',
    component: CarmanageAddcustomer,
  },
  {
    path: '/carmanage/changcarplate',
    component: CarmanageChangcarplate,
  },
  {
    path: '/carmanageaudit/List',
    component: CarmanageauditList,
  },
  {
    path: '/carmanageaudit/detail',
    component: CarmanageauditDetail,
  },

  {
    path: '/system/role',
    component: SystemRole,
  },
  {
    path: '/system/user',
    component: SystemUser,
  },
  {
    path: '/system/menu',
    component: SystemMenu,
  },
  {
    path: '/system/dict',
    component: SystemDict,
  },
  {
    path: '/data/dataSurvey',
    component: DataDataSurvey,
  },
  {
    path: '/app/index',
    component: AppIndex,
  },
  {
    path: '/app/appConfig',
    component: AppAppConfig,
  },
  {
    path: '/activity/card',
    component: ActivityCard,
  },
  {
    path: '/activity/theme',
    component: ActivityTheme,
  },
  {
    path: '/activity/activityDetails',
    component: ActivityDetails,
    isCache: false,
  },
  {
    path: '/activity/themeDetails',
    component: ThemeDetails,
  },
  {
    path: '/activity/themeStape',
    component: ThemeStape,
  },
  {
    path: '/activity/newActivity',
    component: ThemeStape,
  },
  {
    path: '/activity/activityDataStatistics',
    component: DataStatistics,
  },
  {
    path: '/activity/marketStatistics',
    component: marketStatistics,
  },
  {
    path: '/activity/cardDetails',
    component: CardDetails,
  },
  {
    path: '/ordermanage/List',
    component: OrdermanageList,
  },
  {
    path: '/ordermanage/worklist',
    component: OrdermanageWorklist,
  },
  {
    path: '/ordermanage/workldetail',
    component: OrdermanageWorkDetail,
  },
  {
    path: '/ordermanage/orderdetail',
    component: OrdermanageOrderDetail,
  },
  {
    path: '/ordermanage/storelist',
    component: OrdermanageStorelist,
  },
  {
    path: '/ordermanage/add',
    component: OrdermanageAdd,
    isCache: false,
  },
  {
    path: '/ordermanage/orderSub/list',
    component: OrderSubList,
  },
  {
    path: '/shop/category',
    component: ShopCategory,
  },
  {
    path: '/shop/list',
    component: ShopList,
  },
  {
    path: '/shop/add',
    component: ShopAdd,
    isCache: false,
  },
  {
    path: '/shop/edit',
    component: ShopEdit,
    isCache: false,
  },
  {
    path: '/shop/headList',
    component: ShopHeadList,
  },
  {
    path: '/userCenter/head',
    component: UserCenterHead,
  },
  {
    path: '/userCenter/store',
    component: UserCenterStore,
    isCache: false,
  },
  {
    path: '/userCenter/commission',
    component: UserCenterCommission,
  },
  {
    path: '/marketCenter/marketActivity',
    component: MarketActivity,
  },
  {
    path: '/marketCenter/addMarketActivity',
    component: AddMarketActivity,
  },
  {
    path: '/marketCenter/addThemeActivity',
    component: AddThemeActivity,
  },

  {
    path: '/marketCenter/promotionActivity',
    component: PromotionActivity,
  },
  {
    path: '/marketCenter/addPromotionActivity',
    component: AddPromotionActivity,
  },
  {
    path: '/marketCenter/promotionStatistics',
    component: PromotionStatistics,
  },
  {
    path: '/marketCenter/marketDetails',
    component: MarketDetails,
  },
  {
    path: '/marketCenter/promotionDetails',
    component: PromotionDetails,
  },
  {
    path: '/marketCenter/marketRule',
    component: MarketRule,
  },
  {
    path: '/marketCenter/addMrketRule',
    component: AddMrketRule,
  },
  {
    path: '/company/index',
    component: CompanyList,
  },
  {
    path: '/company/details',
    component: CompanyDetails,
  },
  {
    path: '/mallSet/imgManage',
    component: mallSetImgManage,
  },
  {
    path: '/ordermanage/chargeback',
    component: OrderChargeback,
  },
  {
    path: '/ordermanage/chargebackdetail',
    component: OrderChargebackDetail,
  },
]




export default routeList
