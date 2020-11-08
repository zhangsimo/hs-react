/** @format */

import {request} from '../utils/request'
import {httpResponse} from '../interface/common'
import {IUser} from '../interface/system'
import {LOGIN_API} from '../config'
export interface ILoginDTO {
  username: string
  password: string
}

// export interface O {
//   user: IUser
//   token: string
//   /** 权限列表 */
//   permissionList: any
// }
export const loginApi = (body: {loginName: string; password: string}): httpResponse<string> =>
  request.post(LOGIN_API + '/service/clerk/v5-3/common/open/login', body)
export const getUserInfo = (): httpResponse<IUser> => request.get(LOGIN_API + '/service/clerk/v5-3/common/userInfo')

// export const loginApi = (data: ILoginDTO): httpResponse<string> => request.post('/api-open/auth/tenant-login', data)
// export const getUserInfo = (): httpResponse<IUser> => request.get('/api2/auth/info')
