/** @format */

import { request } from '../utils/request'
import { httpResponseList, httpResponse } from '../interface/common'
import { hasStore, getStore, setStore, isStoreExpired } from '@/utils/store'
// const EXPIRED_TIME = 60 * 24 * 5 //5天过期

/**获取员工 */
// export const getMemberERP = (body): httpResponseList<any> => request.post('/hsweb-common/erp/common/page', body)

/**获取员工   可缓存  */
export const getMemberERP = async (body?) => {
  let cacheKey = 'memberList-' + (body?.compCode || '')
  if (body?.cache && hasStore(cacheKey) && !isStoreExpired(cacheKey)) {
    const res = getStore(cacheKey)
    return res
  } else {
    const res: any = await request.post('/hsweb-common/erp/common/page', body)
    res.code === 1 && setStore(cacheKey, res, 'session', 60 * 24) //1天过期
    return res
  }
}

/**通过门店编码compCode 获取分组列表 及组下成员 */
export const getCompGroupMember = (params): httpResponse<any> =>
  request.get('/hsweb-crm/client/crmEmployeeGroup/get-employee-group', { params })

/**保存员工分组 */
export const saveMemberGroup = (body): httpResponseList<any> =>
  request.post('/hsweb-crm/client/crmEmployeeGroup/save', body)

/**修改员工分组名称 */
export const updateMemberGroupName = params =>
  request.get('/hsweb-crm/client/crmEmployeeGroup/modify-employee-group', { params })

/**employeeCode 查询员工所在小组 */
export const getMemberInGroup = (params): httpResponse<any> =>
  request.get('/hsweb-crm/client/crmEmployeeGroup/get-employee-in-group', { params })


