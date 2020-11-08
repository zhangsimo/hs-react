/** @format */

import { request } from '../utils/request'
export const getCompanyList = params => request.get('/hsweb-crm/crm/company/queryPageData', { params })
export const updateStatus = params => request.post('/hsweb-crm/crm/company/updateStatus', params)
export const getCompDetails = params => request.get('/hsweb-crm/crm/company/detail', { params })
export const saveCompany = params => request.post('/hsweb-crm/crm/company/save', params)



