/** @format */

import { request } from '../utils/request'
import { hasStore, getStore, setStore, isStoreExpired } from '@/utils/store'
// const EXPIRED_TIME = 60 * 24 * 5 //5天过期

//获取区域 可缓存
export const getAreaList = async (params?) => {
  let cacheKey = 'areaList'
  if (params?.cache && hasStore(cacheKey) && !isStoreExpired(cacheKey)) {
    const res = getStore(cacheKey)
    return res
  } else {
    const res: any = await request.get('/service/common/areaComp/getAreaList')
    res.status === 'success' && setStore(cacheKey, res, 'session', 60) //60分钟过期
    return res
  }
}
//获取区域 可缓存
export const getCompList = async (params?) => {
  let cacheKey = 'compList-' + (params?.areaId || '')
  if (params?.cache && hasStore(cacheKey) && !isStoreExpired(cacheKey)) {
    const res = getStore(cacheKey)
    return res
  } else {
    const res: any = await request.get('/service/common/areaComp/getCompList', { params })
    res.status === 'success' && setStore(cacheKey, res, 'session', 60) //60分钟过期
    return res
  }
}

// //获取区域
// export const getAreaList = () => request.get('/service/common/areaComp/getAreaList')

// //获取门店
// export const getCompList = params => request.get('/service/common/areaComp/getCompList', {params})
//获取员工列表
export const getMemberList = params => request.get('/service/wx-pc/performance/get-member-list', { params })

//获取字典类型
export const getDictType = () => request.get('/hsweb-common/power/dict/type/page')

//获取字典类型值
export const getDictTypeVal = dictType => request.get('/hsweb-common/power/dict/data/list/' + dictType)

export const getCompTree = params => request.get('/service/clerk/v5/common/areaComp/getCompTreeList', { params })

export const getCompTreeNoParams = () => request.get('/service/clerk/v5/common/areaComp/getCompTreeList')

export const getCompOrgListParams = (params) => request.get('/hsweb-common/org/getCompList', { params })

// //获取权限
export const getRouteList = () => request.get('/hsweb-common/power/centre/user/permissions')
export const getBrandList = () => request.get('/hsweb-common/carmodel/brand')

//获取七牛 token   可缓存
export const getQNToken = async (params?) => {
  let cacheKey = 'QNToken'
  if (params?.cache && hasStore(cacheKey) && !isStoreExpired(cacheKey)) {
    const res = getStore(cacheKey)
    return res
  } else {
    const res: any = await request.get('/service/common/api/uploadToken')
    res.status === 'success' && setStore(cacheKey, res, 'session', 20) //20分钟过期
    return res
  }
}

//获取省 可缓存
export const getProvinceList = async (params?) => {
  let cacheKey = 'provinceList'
  if (params?.cache && hasStore(cacheKey) && !isStoreExpired(cacheKey)) {
    const res = getStore(cacheKey)
    return res
  } else {
    const res: any = await request.get('/hsweb-common/address/client/getToplevelAddr', { params })
    res.status === 'success' && setStore(cacheKey, res, 'session', 60) //60分钟过期
    return res
  }
}
//获取省下的市 可缓存
export const getCityList = async (params?) => {
  let cacheKey = 'provinceCityList-' + (params?.parentCode || '')
  if (params?.cache && hasStore(cacheKey) && !isStoreExpired(cacheKey)) {
    const res = getStore(cacheKey)
    return res
  } else {
    const res: any = await request.get('/hsweb-common/address/client/getAddrByParentCode', { params })
    res.status === 'success' && setStore(cacheKey, res, 'session', 60) //60分钟过期
    return res
  }
}
//获取市下的区可缓存
export const getCityAreaList = async (params?) => {
  let cacheKey = 'cityAreaList-' + (params?.parentCode || '')
  if (params?.cache && hasStore(cacheKey) && !isStoreExpired(cacheKey)) {
    const res = getStore(cacheKey)
    return res
  } else {
    const res: any = await request.get('/hsweb-common/address/client/getAddrByParentCode', { params })
    res.status === 'success' && setStore(cacheKey, res, 'session', 60) //60分钟过期
    return res
  }
}

