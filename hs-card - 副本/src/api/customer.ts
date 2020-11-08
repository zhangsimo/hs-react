/** @format */

import { request } from '../utils/request'
import { httpResponseList, httpResponse } from '../interface/common'

/**获取客户列表 */
export const getCumstomerList = (params): httpResponseList<any> =>
  request.get('/hsweb-crm/crm/customer/pageCrmCustomer', { params })

/**保存客户分组 */
export const saveCustomerGroup = (body): httpResponseList<any> =>
  request.post('/hsweb-crm/crm/customer/saveCrmCustomerGroup', body)
/**保存客户 */
export const saveCustomerInfo = (body): httpResponse<any> => request.post('/hsweb-crm/crm/customer/saveCustomer', body)
/**获取客户列表 */
export const getVipMemberList = (body): httpResponse<any> => request.post('/hsweb-crm/crm/member/backend/page', body)
// export const getVipMemberList = (body): httpResponse<any> =>
//   request.post('http://192.168.137.1:18070/hsweb-crm/crm/member/backend/page', body)
/**根据手机号查询客户信息*/
export const getCumstomerByMobile = (params): httpResponseList<any> =>
  request.get('/hsweb-crm/crm/customer/retrieveByMobile', { params })

/**发送短信验证码*/
export const getCumstomerSendSmsCode = (params): httpResponseList<any> =>
  request.get('/hsweb-crm/crm/customer/sendSmsCode', { params })
/*验证短信验证码并保存客户信息 */
export const getCumstomerValidateCodeSave = (params): httpResponseList<any> =>
  request.get('/hsweb-crm/crm/customer/validateCodeSave', { params })
/* 获取客户的所有车辆 */
export const getCumstomerCarList = (params): httpResponseList<any> =>
  request.get('/hsweb-crm/crm/car/list', { params })
/* 根据id获取客户详情*/
export const getCumstomerId = (params): httpResponseList<any> =>
  request.get('/hsweb-crm/crm/customer/getCustomer', { params })
/**客户车辆 */
export const getCumstomerCarlistView = (params): httpResponseList<any> =>
  request.get('/hsweb-crm/crm/car/listView', { params })
/**通过会员ID查找会员 */
export const getMemberId = (params): httpResponse<any> =>
  request.get('/hsweb-crm/crm/member/retrieve', { params })