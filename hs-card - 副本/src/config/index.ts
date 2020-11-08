/** @format */

// export const API_ROOT = 'https://api.harsonserver.com'
// export const API_ROOT = 'http://192.168.111.23:18060' // 测试环境
// export const API_ROOT = 'http://192.168.122.63:18060' //韦顺境电脑
let apiRoot // 测试环境
let apiRootSub
let baseRoute
let loginApi
let clientSecret
let clientId = '6da855d8-557b-4bde-a24c-6a39a4acfda2'
let cardAppRoot
if (process.env.NODE_ENV === 'development') {
  // apiRoot = 'https://hscsf.dev.harsonserver.com'
  // apiRootSub = 'http://192.168.111.23:18060'
  // loginApi = 'https://hscsf.dev.harsonserver.com'
  // baseRoute = '/'
  // clientSecret = '9a28aaaa-da1a-4df4-8542-b6b1750bb7bb'

  // apiRoot = 'http://192.168.122.124'
  apiRoot = 'https://hscsf.dev.harsonserver.com'
  // apiRoot = 'https://hscsf.test.harsonserver.com'
  // apiRootSub = 'http://tapi.hszb.harsons.cns'
  // loginApi = 'http://192.168.122.124'
  loginApi = 'https://hscsf.dev.harsonserver.com'
  // loginApi = 'https://hscsf.test.harsonserver.com'
  baseRoute = '/'
  clientSecret = '9a28aaaa-da1a-4df4-8542-b6b1750bb7bb'
  // clientSecret = '93f9f226-ef20-473a-b867-ffeffbbe2aca'  // 生产
  cardAppRoot = 'http://localhost:3102'
}
if (process.env.NODE_ENV === 'dev') {
  apiRoot = 'https://hscsf.dev.harsonserver.com'
  apiRootSub = 'http://tapi.hszb.harsons.cn'
  loginApi = 'https://hscsf.dev.harsonserver.com'
  baseRoute = '/app/card-dev/'
  clientSecret = '9a28aaaa-da1a-4df4-8542-b6b1750bb7bb'
  cardAppRoot = 'http://tomato.harsons.cn/app/coupon-dev'
}
if (process.env.NODE_ENV === 'production') {
  apiRoot = 'https://hscsf.cloud.harsonserver.com'
  apiRootSub = 'https://api.harsonserver.com'
  loginApi = 'https://hscsf.cloud.harsonserver.com'
  baseRoute = '/app/card/'
  clientSecret = '93f9f226-ef20-473a-b867-ffeffbbe2aca'
  cardAppRoot = 'http://tomato.harsons.cn/app/coupon'
}
if (process.env.NODE_ENV === 'test') {
  apiRoot = 'https://hscsf.test.harsonserver.com'
  apiRootSub = 'http://tapi.hszb.harsons.cn'
  loginApi = 'https://hscsf.test.harsonserver.com'
  baseRoute = '/app/card-test/'
  clientSecret = '9a28aaaa-da1a-4df4-8542-b6b1750bb7bb'
  cardAppRoot = 'http://tomato.harsons.cn/app/coupon-test'
}

export const API_ROOT = apiRoot
export const BASE_ROUTE = baseRoute
export const LOGIN_API = loginApi
export const CLIENT_SECRET = clientSecret
export const API_ROOT_SUB = apiRootSub
export const CLIENTID = clientId
export const CARD_APP_ROOT = cardAppRoot

export const formLayout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 20,
  },
}
