/** @format */

import { request } from '../utils/request'
import { httpResponseList } from '../interface/common'
import { ICardDetail } from '../interface'
import { message } from 'antd'
import { API_ROOT } from '../config'
import { getStore } from '@/utils/store'

export const getCardList = (params): httpResponseList<ICardDetail> =>
  request.get('/hsweb-crm/crm/card/info/findPage', { params })
//上架
export const setUpper = params => request.get('/hsweb-crm/crm/card/info/upLine', { params })

//下架
export const setLower = params => request.get('/hsweb-crm/crm/card/info/downLine', { params })

//优惠券架-下架
export const getCardsshelvesDown = params => request.get('/hsweb-crm/crm/cardsshelves/down', { params })
//优惠券架-上架
export const getCardsshelvesUpper = params => request.get('/hsweb-crm/crm/cardsshelves/upper', { params })

//获取上架符合条件
export const getUpperNum = params => request.get('/hsweb-crm/crm/card/info/upLineList', { params })

//获取上架符合条件
export const getCardDetails = params => request.get('/hsweb-crm/crm/card/info/findById', { params })

//保存基本信息
export const saveCardInfo = params => request.put('/hsweb-crm/crm/card/install/saveCardInfo', params)

//已选 项目
export const getCardItem = params => request.get('/hsweb-crm/crm/card/install/findCardItem/' + params.cardId, { params })
//已选 商品
export const getCardGood = params => request.get('/hsweb-crm/crm/card/install/goodsByIds/' + params.cardId, { params })
//已选 商品分类
export const getCardGoodType = params => request.get('/hsweb-crm/crm/card/install/treeGoodsType', { params })

//获取项目
export const getFindPkgs = params => request.get('/hsweb-crm/crm/card/install/findPkgs', { params })

//获取工时
export const getFindHours = params => request.get('/hsweb-crm/crm/card/install/findHours', { params })

//获取配件
export const getFindParts = params => request.get('/hsweb-crm/crm/card/install/findParts', { params })

//获取商品列表
export const getCommoditySelectList = params => request.get('/hsweb-crm/crm/card/install/goods', { params })

//批量删除项目
export const delBatchCardItem = params =>
  request.delete('/hsweb-crm/crm/card/install/batchDelCardItem/' + params.cardId, { params })

//批量删除项目
export const delCardItem = params =>
  request.delete('/hsweb-crm/crm/card/install/delCardItem/' + params.cardId + '/' + params.itemCode, { params })

//获取领取卡券列表
export const getcardGetList = params =>
  request.get('/hsweb-crm/crm/card/info/cardReceiveList/' + params.cardCode, { params })

//领券渠道列表
export const getCardShopList = params => request.get('/hsweb-crm/crm/card/info/compList/' + params.cardId, { params })

//领券门店列表
export const getCardChannelList = params =>
  request.get('/hsweb-crm/crm/card/info/channelList/' + params.cardId, { params })

//批量添加项目
export const saveCardItem = params => request.post('/hsweb-crm/crm/card/install/addCardItem', params)

//批量添加渠道
export const saveCardChannel = params => request.post('/hsweb-crm/crm/card/install/addCardChannel', params)

//获取门店列表
export const getShopData = params => request.get('/hsweb-crm/crm/card/install/store/' + params.cardId, params)

//保存门店
export const saveShopList = params => request.post('/hsweb-crm/crm/card/install/store', params)

//核销前查看使用总数
export const getVeriTotal = params => request.post('/hsweb-crm/crm/card/record/sum/' + params.cardCode, params)

//核销卡券
export const veriCard = params => request.post('/hsweb-crm/crm/card/record/veri', params)

//客户核销
export const clientVeriCard = params => request.post('/hsweb-crm/crm/card/record/batchUse', params)

//获取日志列表
export const getLogList = params => request.get('/hsweb-crm/crm/card/info/logPageList', { params })

//获取领取明细列表
export const getCardListPage = params => request.get('/hsweb-crm/crm/card/record/findPage', { params })

// 导出
// export const importClientData = params => request.get(API_ROOT + '/hsweb-crm/crm/card/record/export', {params})
export const importClientData = API_ROOT + '/hsweb-crm/crm/card/record/export'


// 老客户分享明细导出
export const oldCustomersShare = API_ROOT + '/hsweb-crm/crm/export/export-ocs'

// 新客户领取明细导出
export const newCustomerReceives = API_ROOT + '/hsweb-crm/crm/export/export-ncr'

// 老客户领取明细表
export const oldCustomerReceives = API_ROOT + '/hsweb-crm/crm/export/export-ocr'

//导出函数
const ExportUrl = {
  importClientData,
  oldCustomersShare,
  newCustomerReceives,
  oldCustomerReceives
}
export const exportData = (exportUrlName: string, formData) => {
  const params = new URLSearchParams()
  const token = getStore('token')

  if (!exportUrlName || !ExportUrl[exportUrlName]) {
    message.warning('无效链接地址')
    return
  }
  console.log(API_ROOT)
  formData.accessToken = token
  for (var key in formData) {
    console.log(formData)
    if (formData[key]) {
      params.set(key, formData[key])
    }
  }

  window.open(ExportUrl[exportUrlName] + '?' + params.toString())
  console.log('ExportUrl', ExportUrl[exportUrlName] + '?' + params.toString())
}
