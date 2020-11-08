/** @format */

import {request} from '../utils/request'
import {httpResponseList, httpResponse} from '../interface/common'
import {IDictCategoryType, IDictType} from '@/interface/system'

// import {httpResponseList} from '../interface/common'
// import {ICardDetail} from '../interface'

//菜单模块
export const getMenuListAll = () => request.get('/hsweb-common/power/centre/menu/treeList')
export const getMenuList = params => request.get('/hsweb-common/power/centre/menu/treeList', {params})
export const saveMenu = params => request.post('/hsweb-common/power/centre/edit/menu', params)
export const delMenu = menuId => request.delete('/hsweb-common/power/centre/delete/menu/' + menuId)

//用户模块
export const getUserList = params => request.get('/hsweb-common/power/centre/user/list', {params})
export const saveUser = params => request.post('/hsweb-common/power/centre/edit/user', params)
export const delUser = userId => request.delete('/hsweb-common/power/centre/delete/user/' + userId)
export const getErpUserList = params => request.get('/hsweb-common/erp/common/member/list', {params})

//角色模块
export const getRoleList = () => request.get('/hsweb-common/power/centre/role/list')
export const getRoleListPage = params => request.get('/hsweb-common/power/centre/role/pageList', {params})
export const saveRole = params => request.post('/hsweb-common/power/centre/edit/role', params)
export const delRole = roleId => request.delete('/hsweb-common/power/centre/delete/role/' + roleId)

/** 获取字典类型列表 */
export const getDictCategoryList = (params): httpResponseList<IDictCategoryType> =>
  request.get('/hsweb-common/power/dict/type/page', {params})
/** 更新字典类型列表 */
export const updateDictCategory = (body): httpResponse<any> => request.put('/hsweb-common/power/dict/edittype', body)
/** 添加字典类型列表 */
export const createDictCategory = (body): httpResponse<any> => request.post('/hsweb-common/power/dict/addtype', body)

/** 获取字典类型列表 */
export const getDictList = (params): httpResponse<IDictType[]> =>
  request.get('/hsweb-common/power/dict/data/list/' + params.dictType, {params})

/** 获取字典类型列表TREE */
export const getDictTreeList = (): httpResponse<IDictType[]> => request.get('/hsweb-common/power/dict/type/tree')

/** 获取字典类型详情 */
export const getDictTypeDetails = (dictId): httpResponseList<IDictType> =>
  request.get('/hsweb-common/power/dict/get/type/detail/' + dictId)
/** 更新字典类型列表 */
export const updateDict = (body): httpResponse<any> => request.put('/hsweb-common/power/dict/editdata', body)
/** 添加字典类型列表 */
export const createDict = (body): httpResponse<any> => request.post('/hsweb-common/power/dict/adddata', body)
export const delDictType = dictId => request.delete('/hsweb-common/power/dict/delete/type/' + dictId)
export const delDictData = dictCode => request.delete('/hsweb-common/power/dict/delete/data/' + dictCode)
