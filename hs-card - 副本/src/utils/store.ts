/** @format */

import {isEmpty} from './validate'

const keyName = 'YC-'
const defaultPosition = 'session'

interface IStore {
  dataType: 'string' | 'number' | 'bigint' | 'boolean' | 'symbol' | 'undefined' | 'object' | 'function'
  content: any
  type: 'session' | 'local'
  datetime: number
  expired?: number
}

/**
 * 存储localStorage
 * expired 过期时间 (分钟)
 */
export const setStore = (name: string, content: any, type: 'session' | 'local' = defaultPosition, expired?: number) => {
  name = keyName + name
  const obj: IStore = {
    dataType: typeof content,
    content: content,
    type: type,
    datetime: new Date().getTime(),
    expired: expired ? Date.now() + 1000 * 60 * expired : Infinity,
  }
  if (type === 'session') window.sessionStorage.setItem(name, JSON.stringify(obj))
  else window.localStorage.setItem(name, JSON.stringify(obj))
}

/**
 *判断缓存是否过期 过期则清除缓存 过期返回true 否则返回false
 */
export const isStoreExpired = (name: string, type: 'session' | 'local' = defaultPosition) => {
  name = keyName + name
  let data
  let obj: IStore
  if (type === 'session') {
    data = window.sessionStorage.getItem(name)
  } else {
    data = window.localStorage.getItem(name)
  }
  if (isEmpty(data)) return true
  obj = JSON.parse(data)
  if (Date.now() > (obj?.expired || Date.now() + 2)) {
    console.log(name, '缓存过期了')
    removeStore(name, type)
    return true
  } else {
    return false
  }
}

/**
 * 获取localStorage
 */
export const getStore = (name: string, type: 'session' | 'local' = defaultPosition) => {
  name = keyName + name
  let data
  let obj: IStore
  let content
  if (type === 'session') {
    data = window.sessionStorage.getItem(name)
  } else {
    data = window.localStorage.getItem(name)
  }

  if (isEmpty(data)) return
  try {
    obj = JSON.parse(data)
  } catch (e) {
    return data
  }

  if (obj.dataType === 'string') {
    content = obj.content
  } else if (obj.dataType === 'number') {
    content = Number(obj.content)
  } else if (obj.dataType === 'boolean') {
    content = eval(obj.content)
  } else if (obj.dataType === 'object') {
    content = obj.content
  }
  return content
}

export const hasStore = (name: string) => {
  name = keyName + name
  let data = window.sessionStorage.getItem(name)
  if (isEmpty(data)) data = window.localStorage.getItem(name)
  return !!data
}

/**
 * 删除localStorage
 */
export const removeStore = (name: string, type: 'session' | 'local' = defaultPosition) => {
  name = keyName + name
  if (type === 'session') {
    window.sessionStorage.removeItem(name)
  } else {
    window.localStorage.removeItem(name)
  }
}

/**
 * 获取全部localStorage
 */
export const getAllStore = (type: 'session' | 'local' = defaultPosition) => {
  const list: any[] = []
  if (type === 'session') {
    for (let i = 0; i <= window.sessionStorage.length; i++) {
      list.push({
        name: window.sessionStorage.key(i),
        content: getStore(window.sessionStorage.key(i)!),
      })
    }
  } else {
    for (let i = 0; i <= window.localStorage.length; i++) {
      list.push({
        name: window.localStorage.key(i),
        content: getStore(window.localStorage.key(i)!),
      })
    }
  }
  return list
}

/**
 * 清空全部localStorage
 */
export const clearStore = (type: 'session' | 'local' = defaultPosition) => {
  if (type === 'session') {
    window.sessionStorage.clear()
  } else {
    window.localStorage.clear()
  }
}
