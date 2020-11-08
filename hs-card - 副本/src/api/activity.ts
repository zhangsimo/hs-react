/** @format */

import { request } from '../utils/request'
// import {httpResponseList} from '../interface/common'

//获取活动列表
export const getActivityThemeList = params => request.get('/hsweb-crm/market/activity/page', { params })

//保存活动
export const saveActivityTheme = params => request.post('/hsweb-crm/market/activity/save', params)

//删除活动
export const delActivityTheme = params => request.get('/hsweb-crm/market/activity/remove', { params })

//获取活动详情
export const getActivityThemeDetails = params => request.get('/hsweb-crm/market/activity/get', { params })

//获取活动列表
export const getActivityCardList = params => request.get('/hsweb-crm/crm/cardsshelves/page', { params })

//获取卡券类型列表
//报错的老接口地址/hsweb-crm/market/cardsshelves/pageCardChannel
export const getActivityCardTypeList = params => request.get('/hsweb-crm/crm/cardsshelves/pageCardChannel', { params })

//优惠券架-渠道卡券列表
export const getCrmCardsshelvesPageCardChannel = params => request.get('/hsweb-crm/crm/cardsshelves/pageCardChannel', { params })

//获取卡券类型明细
export const getActivityCardTypeDetailsList = params =>
  request.get('/hsweb-crm/crm/cardsshelves/pageCardDetails', { params })

//获取券架详情
export const getActivityCardDetails = params => request.get('/hsweb-crm/crm/cardsshelves/get', { params })

//删除卡券架
export const delActivityCard = params => request.get('/hsweb-crm/crm/cardsshelves/remove', { params })

//删除卡券架明细
export const delActivityCardDetails = params => request.get('/hsweb-crm/crm/cardsshelves/removeDetail', { params })

//保存券架
export const saveActivityCard = params => request.post('/hsweb-crm/crm/cardsshelves/save', params)

// 获取新、老客户的活动卡券
export const getActivityCard = params => request.get('/hsweb-crm/market/activity/cards', { params })

// 发布活动
export const releaseActivity = params => request.get('/hsweb-crm/market/activity/issue', { params })

// 活动下架、使失效
export const unpublish = params => request.get('/hsweb-crm/market/activity/off', { params })

//活动删除(根据ID)
export const delActivity = params => request.get('/hsweb-crm/market/activity/remove', { params })
// 获取活动链接
export const getActiveLinks = id => request.get('/hsweb-crm/market/activity/links?type=1&id=' + id)


// 活动信息总览
export const overviewActivityInformation = params => request.get('/hsweb-crm/crm/report/form/count', { params })

// 老客户分享明细
export const oldCustomersShareDetails = params => request.get('/hsweb-crm/crm/report/form/page-ocs', { params })

// 新客户领取明细
export const newCustomersReceiveDetails = params => request.get('/hsweb-crm/crm/report/form/page-ncr', { params })

// 老客户领取明细表
export const oldCustomersReceiveDetails = params => request.get('/hsweb-crm/crm/report/form/page-ocr', { params })


// 获取活动商品
export const getActivityGoodsList = params => request.get('/hsweb-crm/market/activity/goods', { params })
// 获取活动规则（根据活动ID）
export const getActivityRuleList = params => request.get('/hsweb-crm/market/activity/rule', { params })
// 获取活动规则
export const getAllRuleList = params => request.post('/hsweb-crm/market/rule/page', params)
// 获取活动规则详情
export const getRuleDetails = params => request.get('/hsweb-crm/market/rule/get', { params })

// 获取活动门店（根据ID）
export const getShopList = params => request.get('/hsweb-crm/market/activity/shop', { params })


//活动保存
export const saveActivty = params => request.post('/hsweb-crm/market/activity/save', params)

//活动下架
export const offActivty = params => request.get('/hsweb-crm/market/activity/off', { params })

//活动统计
export const getStatisticsData = params => request.get('/hsweb-crm/market/activity/statistics', { params })

//团购列表
export const getTeamBuyList = params => request.get('/hsweb-crm/market/teambuy/page', { params })


//团购列表-使成功
export const setTeamBuySuccess = params => request.get('/hsweb-crm/market/teambuy/success', { params })
//团购列表-使失败
export const setTeamBuyFail = params => request.get('/hsweb-crm/market/teambuy/fail', { params })
//活动管理 - 活动订单
export const getTeamBuyOrder = params => request.get('/hsweb-crm/market/activity/order', { params })


//活动删除(根据ID)
// export const delActivity = params => request.get('/hsweb-crm/market/activity/remove', { params })


/*------------------------------------营销规则  ====================================*/
export const getMarketRuleList = params => request.post('/hsweb-crm/market/rule/page', params)
export const enableMarketRule = params => request.get('/hsweb-crm/market/rule/enable', { params })
export const disableMarketRule = params => request.get('/hsweb-crm/market/rule/disable', { params })
export const getMarketRuleDetails = params => request.get('/hsweb-crm/market/rule/get', { params })
export const saveMarketRule = params => request.post('/hsweb-crm/market/rule/save', params)
//营销规则-选择卡券
export const getRuleSelectUseCard = params => request.get('/hsweb-crm/market/rule/selectUseCard', { params })

