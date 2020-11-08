import { request } from '../utils/request'
//import { httpResponseList } from '../interface/common'

//商城图片管理-分页列表
export const getMarketRpicPage = params => request.get('/hsweb-crm/market/rpic/page', { params })
//商城图片管理-删除
export const getMarketRpicDelete = params => request.get('/hsweb-crm/market/rpic/delete', { params })
//商城图片管理-新增-编辑
export const postMarkeRpicSave = params => request.post('/hsweb-crm/market/rpic/save', params)