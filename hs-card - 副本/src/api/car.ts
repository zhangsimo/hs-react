/** @format */

import {request} from '../utils/request'
import {hasStore, getStore, setStore, isStoreExpired} from '@/utils/store'
import {httpResponseList, httpResponse} from '../interface/common'
// 分页查询车辆信息
export const getCatSelectPageCar = (params): httpResponseList<any> =>
  request.get('/hsweb-crm/crm/backend/car/selectPageCar', {params})

// 创建/更新车辆档案
export const saveOrUpdateCar = (body): httpResponse<any> =>
  request.post('/hsweb-crm/crm/backend/car/saveOrUpdateCar', body)

// 查看单个车辆信息
export const getOneCarDetail = (params): httpResponseList<any> =>
  request.get('/hsweb-crm/crm/backend/car/getOneCar', {params})

// 绑定客户和车辆
export const saveOrUpdateCustomerCar = (body): httpResponse<any> =>
  request.post('/hsweb-crm/crm/backend/car/saveOrUpdateCustomerCar', body)

// 查询车辆详情
export const getCarQueryCarInfo = (params): httpResponseList<any> =>
  request.get('/hsweb-crm/crm/backend/car/queryCarInfo', {params})

// 绑定客户
export const getCustomerQuerySimCustomers = (params): httpResponseList<any> =>
  request.get('/hsweb-crm/crm/customer/querySimCustomers', {params})

// 检验 VIN
export const getCarmodelbyvin = (params): httpResponseList<any> =>
  request.get('service/clerk/common/getCarmodelbyvin', {params})

// 车牌变更申请
export const applyChangeCarNo = (body): httpResponseList<any> =>
  request.post('/hsweb-crm/crm/backend/car/applyChangeCarNo', body)

// 车牌变更审核
export const confirmChangeCarNo = (body): httpResponseList<any> =>
  request.post('/hsweb-crm/crm/backend/car/confirmChangeCarNo', body)

//车牌变更分页查询
export const getCatBackendSelectPageCar = (body): httpResponseList<any> =>
  request.post('/hsweb-crm/crm/backend/car/selectPage', body)

//车牌变更详情
export const getCatBackendCarDetail = (params): httpResponseList<any> =>
  request.get(`/hsweb-crm/crm/backend/car/change-record/${params}`, {})

// //销售车型-根据条件查询销售(品牌+车系+车型)
// export const getSaleBrandLineModel = params =>
//   request.get(`/hsweb-common/carmodel/sale/query/saleBrandLineModelByParam`, {params})

//获取销售车型-根据条件查询销售(品牌+车系+车型)   可缓存
export const getSaleBrandLineModel = async (params?) => {
  let cacheKey = params.cacheKey
  if (params?.cacheKey && hasStore(cacheKey) && !isStoreExpired(cacheKey)) {
    const res = getStore(cacheKey)
    return res
  } else {
    const res: any = await request.get('/hsweb-common/carmodel/sale/query/saleBrandLineModelByParam', {params})
    res.status === 'success' && setStore(cacheKey, res, 'session', 60 * 24 * 3) //3天过期
    return res
  }
}
