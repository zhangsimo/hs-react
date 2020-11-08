/** @format */

import { request } from '../utils/request'
import { httpResponse } from '../interface/common'
import { IGoodDetailHead } from '@/interface'
export const getShopCategoryList = params => request.post('/hsweb-crm/crm/goods/dir/getCategorys', params)
export const getShopCategoryListNested = params => request.get('/hsweb-crm/crm/goods/dir/categorys-nested', { params })
export const createShopCategory = params => request.post('/hsweb-crm/crm/goods/dir/addCategory', params)
export const getShopCategoryDetail = params => request.get('/hsweb-crm/crm/goods/dir/getCategoryDetail', { params })
export const updateShopCategory = params => request.post('/hsweb-crm/crm/goods/dir/updateCategory', params)
export const delShopCategory = params => request.post('/hsweb-crm/crm/goods/dir/deleteCategory', params)

export const getGoodsList = params => request.post('/hsweb-crm/crm/goods/item/queryItemList', params)
export const getGoodsDetail = params => request.post('/hsweb-crm/crm/goods/item/queryItemUpdateDetail', params)
export const goodsDetail = params => request.post('/hsweb-crm/crm/goods/item/selectItemDetail', params)
export const goodsDetailHead = (params): httpResponse<IGoodDetailHead> =>
  request.get('/hsweb-crm/crm/goods/item/queryHeadItemDetailMgt', { params }) //总部详情
export const createGoods = params => request.post('/hsweb-crm/crm/goods/item/saveOrUpdate', params)
export const updateGoods = params => request.post('/hsweb-crm/crm/goods/item/updateItemStatus', params)
export const addGoodComp = params => request.post('/hsweb-crm/crm/goods/item/addShopItem', params) //添加商品绑定门店

export const getGongshiList = params => request.get('/hsweb-crm/crm/goods/wb/hour-template/page', { params })
export const getPenjianTempList = params => request.post('/hsweb-crm/crm/goods/wb/parts-template/page', { params })
export const getPenjianList = params => request.get('/hsweb-crm/crm/goods/wb/parts/page', { params })
export const getwbPenjianList = params => request.get('/hsweb-crm/crm/goods/wb/parts-template/page', { params }) //维保配件

export const getProjectTemplateList = params => request.get('/hsweb-crm/crm/goods/wb/project-template/page', { params })

export const getDictBiz = (params?) => request.get('/hsweb-crm/crm/goods/dic/biz-type/get', { params })
export const getDictdic = (params?) => request.get('/hsweb-crm/crm/goods/dic/dic/list', { params })
export const getDictMaintenance = (params?) => request.get('/hsweb-crm/crm/goods/dic/maintenance/list', { params })
export const getDictPartsBrand = (params?) => request.get('/hsweb-crm/crm/goods/dic/parts-brand/get', { params })
export const getMarketGoodsList = params => request.post('/hsweb-crm/market/activity/select/goods', params)
