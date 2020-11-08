/** @format */

import {request} from '../utils/request'

//角色模块
export const getAppList = params => request.get('/hsweb-common/power/centre/client/list', {params})
export const saveApp = params => request.post('/hsweb-common/power/centre/edit/role', params)
export const delApp = roleId => request.delete('/hsweb-common/power/centre/delete/role/' + roleId)
