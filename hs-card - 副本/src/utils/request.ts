/** @format */

import axios from 'axios'
import { API_ROOT, BASE_ROUTE, CLIENT_SECRET } from '../config'
import { message } from 'antd'
import { getStore } from './store'
// import MD5 from 'crypto-js/md5'
import md5 from 'md5'
import { getUrlParams } from './index'
// import Qs from 'qs'
export const request = axios.create({
  baseURL: API_ROOT,
  timeout: 20000,
  // headers: {
  //   'Content-Type': 'application/x-www-form-urlencoded',
  // },
})

const whiteList = ['/login']

request.interceptors.request.use(
  req => {
    // console.log(req)
    if (!req.params) {
      req.params = {}
    }
    req.params.timestamp = new Date().getTime()
    req.params.platform = 45

    if (!whiteList.find(item => (req as any).url.indexOf(item) > -1)) {
      const token = getStore('token')
      req.params.accessToken = token
    }

    // if (!config.noTokenUrl.find(item => req.url!.indexOf(item) !== -1)) {
    //   req.params.accessToken = sessionStorage.getItem('TOKEN')
    // }
    for (const key in req.params) {
      if (req.params[key] === null || req.params[key] === undefined || req.params[key] === '' || JSON.stringify(req.params[key]) == '{}') {
        delete req.params[key]
      }
    }

    const clientId = '6da855d8-557b-4bde-a24c-6a39a4acfda2'
    const clientSecret = CLIENT_SECRET
    let signCode
    // console.log('req.param', req.params)
    if (req.method === 'get' || req.method === 'delete') {
      const a = {}
      for (const key in req.params) {
        if (req.params.hasOwnProperty(key)) {
          a[key] = typeof req.params[key] === 'object' ? JSON.stringify(req.params[key]) : req.params[key]
        }
      }
      const paramsStr = `${getUrlParams(a)}`
      // console.log('paramsStr', a, paramsStr)
      signCode = md5(paramsStr)
    } else {
      console.log(req)
      const data = req.data
      console.log('+++++++++++++')

      if (data.clientSecret) {
        data.clientSecret = md5(data.clientSecret)
        const paramsStr = `${getUrlParams(req.params)}+${JSON.stringify({
          ...data,
        })}+${clientSecret}`
        // console.log('***********')
        // console.log('paramsStr', paramsStr)
        signCode = md5(paramsStr)
      } else {
        console.log(data)
        const paramsStr = `${getUrlParams(req.params)}+${JSON.stringify(data)}`
        // console.log('***********')
        //console.log('paramsStr', paramsStr)
        signCode = md5(paramsStr)
      }
    }

    req.headers['signCode'] = signCode
    req.headers['clientId'] = clientId

    return req
  },
  error => {
    Promise.reject(error)
  },
)

// request.interceptors.request.use(
//   config => {
//     if (!config.params) {
//       config.params = {}
//     }
//     config.params.timestamp = new Date().getTime()
//     config.params.platform = 45
//     for (const key in config.params) {
//       if (config.params[key] == null || config.params[key] == undefined) {
//         delete config.params[key]
//       }
//     }

//     if (!whiteList.find(item => (config as any).url.indexOf(item) > -1)) {
//       const token = getStore('token')
//       config.params.access_token = token
//     }
//     const clientId = '6da855d8-557b-4bde-a24c-6a39a4acfda2'
//     let signCode
//     if (config.method === 'get') {
//       const paramsStr = `${stringify(config.params)}`
//       console.log('paramsStr', paramsStr)
//       signCode = md5(paramsStr)
//     } else {
//       const paramsStr = `${stringify(config.params)}+${JSON.stringify({
//         ...config.data,
//       })}`
//       console.log('paramsStr', paramsStr)
//       signCode = md5(paramsStr)
//     }
//     config.headers['signCode'] = signCode
//     config.headers['clientId'] = clientId

//     return config
//   },
//   error => {
//     Promise.reject(error)
//   },
// )
request.interceptors.response.use(
  response => {
    // if ((response.status === 200 || response.status == 'success') && response.data.code !== 1 && response.data.msg) {
    //   message.error(response.data.msg)
    // }
    return response.data
  },
  error => {
    console.log(error)
    message.error(error.response.data.msg)
    console.log(error.response)
    if (error.response.status === 401) {
      window.location.href = `${BASE_ROUTE}#/register/login`
      // window.location.href = '#/register/login'
    }
    return Promise.reject(error)
  },
)
