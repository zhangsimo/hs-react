/** @format */

import { request } from '../utils/request'
import { httpResponseList } from '../interface/common'
// 分页查询分类列表，子类目嵌套
export const getCategorysNested = (params): httpResponseList<any> =>
    request.get('/hsweb-crm/crm/goods/dir/categorys-nested', { params })
	
// 查询标准项目分类
export const getDicBizType = (params): httpResponseList<any> =>
    request.get('/hsweb-crm/crm/goods/dic/biz-type/get', { params })
	
// 配置类型开关操作历史记录
export const getOperationSwitchLog = (params): httpResponseList<any> =>
    request.get('/hsweb-crm/commission/switch/operation/page', { params })
// 查看店铺下的配置类型开关的设置
export const getCommissionSwitch = compCode => request.get('/hsweb-crm/commission/switch/detail/' + compCode)
// 配置类型开关设置
export const postCommissionSwitchSave = (params): httpResponseList<any> =>
    request.post('/hsweb-crm/commission/switch/save', params)

// 批量提成设置
export const postCommissionConfigSetting = (params): httpResponseList<any> =>
    request.post('/hsweb-crm/commission/config/setting', params)
// 店铺下的提成配置操作记录
export const getCommissionConfigOperationPage = (params): httpResponseList<any> =>
    request.get('/hsweb-crm/commission/config/operation/page', { params })
// 查看店铺下该分类下提成的设置
export const getCommissionItemConfigPage = (params): httpResponseList<any> =>
    request.post('/hsweb-crm/commission/item/config/page', params)
// 获取通用配置下提成的配置
export const getCommissionCommonConfigPage = (params): httpResponseList<any> =>
    request.post('/hsweb-crm/commission/common/config/page', params)
	
// 获取公司列表
export const getOrgCompList = (params): httpResponseList<any> =>
    request.get('/hsweb-common/org/getCompList', { params })	
// 获取员工提成流水
export const postCommissionRecordPage = (params): httpResponseList<any> =>
    request.post('/hsweb-crm/commission/record/page', params)	
	
