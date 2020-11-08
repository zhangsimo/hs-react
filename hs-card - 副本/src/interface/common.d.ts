/** @format */

import {AxiosResponse} from 'axios'

/**
 * 请求入参基本模型
 */
export interface Params<> {
  pageSize: number
  pageNum: number
  orderByColumn: string
  isAsc: 'desc' | 'asc'
}

export type IEditType = 'create' | 'update'

export interface ITableResult<T> {
  total: number
  data: T[]
}

export interface IBase {
  create_by?: string
  create_time?: Date | string
  update_by?: string
  update_time?: Date | string
}

/**
 * api接口响应体的泛型
 * T： 返回的数据格式接口
 */
type httpResponse<T> = Promise<{code: number; total: number; mssage?: string; msg?: string; status: number; data: T}>

type httpResponseList<T> = Promise<{
  code: number
  mssage?: string
  msg?: string
  data: {
    fromPage: number
    items: T[]
    maxPage: number
    offset: number
    page: number
    pageSize: number
    toPage: number
    total: number
  }
}>
