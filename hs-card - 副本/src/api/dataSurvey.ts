/** @format */

import {request} from '../utils/request'

export const getConversionRate = params => request.get('/hsweb-crm/crm/data/conversionRate', {params}) //优惠券转化率
export const getSecuritiesAnalysis = params => request.get('/hsweb-crm/crm/data/securitiesAnalysis', {params}) //领劵行为分析
export const getXFAnalysis = params => request.get('/hsweb-crm/crm/data/orderChart', {params}) //客户用券的消费金额分析
export const getCardGetAnalysis = params => request.get('/hsweb-crm/crm/data/scsd', {params}) //统计券架领取情况
