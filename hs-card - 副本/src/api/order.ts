/** @format */

import { request } from '../utils/request'
import { httpResponseList, httpResponse } from '../interface/common'
// 分页查询工单信息
export const getOrderPageList = (params): httpResponseList<any> =>
  request.get('/hsweb-crm/crm/order/mt/page/list', { params })

//工单详情
export const getOrderPageDetail = (params): httpResponseList<any> =>
  request.get(`/hsweb-crm/crm/order/mt/detail/${params}`, {})

//订单商品行
export const getOrderItemDetail = (params): httpResponseList<any> =>
  request.get('/hsweb-crm/crm/order/manage/order/item/detail', { params })

//订单商品申请退款
export const postOrderRefund = (params): httpResponseList<any> =>
  request.post('/hsweb-crm/crm/order/order/refund', params)
//分页查询订单
export const getOrderFindPage = (params): httpResponseList<any> =>
  request.get('/hsweb-crm/crm/order/findPage', { params })

//分页查询门店订单
export const getOrderProFindPage = (params): httpResponseList<any> =>
  request.get('/hsweb-crm/crm/order/product/findPage', { params })

//订单退款
export const getOrderRefund = (body): httpResponse<any> => request.post('/hsweb-crm/crm/order/refund', body)

//收款
export const getOrderReceipt = (body): httpResponse<any> => request.post('/hsweb-crm/crm/order/receipt', body)

//订单取消
export const getOrderCancel = (params): httpResponseList<any> => request.post(`/hsweb-crm/crm/order/cancel/${params.orderId}`, {})


//商品服务进度详情
export const getOrderOrderProductId = (params): httpResponseList<any> =>
  request.get(`/hsweb-crm/crm/order/product/service/detail/${params}`, {})

//客户-待服务订单列表
export const getOrderCustomerOrder = (params): httpResponseList<any> =>
  request.get(`/hsweb-crm/crm/order/manage/customer/item/order`, { params })

// 报价-配件列表查询
export const getOrderQueryPartList = (params): httpResponseList<any> =>
  request.get(`/hsweb-crm/crm/order/manage/query/part/list`, { params })

//报价-工时列表查询
export const getOrderProjectCustom = (params): httpResponseList<any> =>
  request.get(`/hsweb-crm/crm/order/manage/project/custom/item`, { params })

//商品列表
export const getOrderGoodQueryItemList = (params): httpResponseList<any> =>
  request.get(`/hsweb-crm/crm/goods/item/queryItemList`, { params })

//客户-待服务套餐列表
export const getOrderCustomerPackage = (params): httpResponseList<any> =>
  request.get(`/hsweb-crm/crm/order/manage/customer/package/order`, { params })

//维修工种列表
export const getOrderMainKindList = (params): httpResponseList<any> =>
  request.get(`/hsweb-crm/crm/order/manage/mainKindList`, { params })

//报价-商品列表
export const getOrderQueryGoodsPage = (params): httpResponseList<any> =>
  request.get(`/hsweb-crm/crm/order/manage/query/goods/page`, { params })

//报价-标准项目列表查询
export const getOrderQueryStdPackage = (params): httpResponseList<any> =>
  request.get(`/hsweb-crm/crm/order/manage/query/std/package`, { params })

//关联维保标准项目列表查询
export const getWbQueryStdPackage = (params): httpResponse<any> =>
  request.get(`/hsweb-crm/crm/goods/wb/project-template/page`, { params })

//订单-客户订单详情查询
export const getOrderDetailOrderId = (params): httpResponseList<any> =>
  request.get(`/hsweb-crm/crm/order/manage/detail/${params}`, {})


//订单-客户订单详情查询(微商城)
export const getOrderDetailMall = (params): httpResponseList<any> =>
  request.get(`/hsweb-crm/crm/order/manage/order/detail`, { params })


//客户已购买商品
export const getOrderDetailBuyProduct = (params): httpResponseList<any> =>
  request.get(`/hsweb-crm/crm/order/manage/customer/buy/product/${params.orderId}`, { params })

//查询班组列表
export const getOrderDetailClassList = (): httpResponseList<any> =>
  request.get(`/hsweb-common/erp/common/org/class/info/list`, {})

//根据班组查询班组人员
export const getOrderDetailClassMeberList = (params): httpResponseList<any> =>
  request.get(`/hsweb-common/erp/common/org/class/member/list`, { params })

// 派工接口
export const getOrderItemDispatch = (body): httpResponseList<any> =>
  request.post('/hsweb-crm/crm/order/mt/item/dispatch', body)

// 多人派工接口
export const getOrderItemDispatchHolds = (body): httpResponseList<any> =>
  request.post('/hsweb-crm/crm/order/mt/item/dispatch/holds', body)

//客户订单详情 删除套餐
export const delChildOrderIdProject = params =>
  request.delete(`/service/clerk/xm/v1-1/order/delete/child/order/${params}`, {})

//客户订单详情 服务项目删除
export const delChildOrderIdProduct = params =>
  request.delete(`/service/clerk/xm/v1-1/order/delete/order/product/${params}`, {})

// 报价-标准产品线分类//维修场景查询
export const getOrderFindClassification = (params): httpResponseList<any> =>
  request.get(`/hsweb-crm/crm/order/manage/findClassification/byName`, { params })

//客户-简单修改客户
export const getOrderCustomerUpdate = (body): httpResponseList<any> =>
  request.post('/hsweb-crm/crm/order/customer/update', body)

//客户-车牌\手机号\姓名搜索客户
export const getOrderSearchSimply = (params): httpResponseList<any> =>
  request.get(`/hsweb-crm/crm/order/customer/search/simply`, { params })

//通过车牌获取车辆详情
export const getByCarNoDetail = (params): httpResponseList<any> =>
  request.get(`/hsweb-crm/crm/order/car/getByCarNo`, { params })

//客户-创建简易客户
export const getOrderCustomerCreate = (body): httpResponseList<any> =>
  request.post('/hsweb-crm/crm/order/customer/create', body)

//订单详情-订单信息修改
export const getOrderUpdateInfo = (body): httpResponseList<any> =>
  request.put(`/hsweb-crm/crm/order/manage/update/info/${body.orderId}`, body)

//订单-核销
export const postOrderWriteOff = (params): httpResponseList<any> =>
  request.post('/hsweb-crm/crm/order/manage/order/write/off', params)
//退单详情
export const getOrderRefundDetail = (params): httpResponseList<any> =>
  request.get('/hsweb-crm/crm/order/manage/order/refund/detail', { params })
//退单列表
export const getOrderRefundPage = (params): httpResponseList<any> =>
  request.get('/hsweb-crm/crm/order/manage/page/refund', { params })
//C端订单详情订单列表商城详情 
export const getOrderMicroMallDetail = (params): httpResponseList<any> =>
  request.get('/hsweb-crm/crm/order/manage/order/detail', { params })