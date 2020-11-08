/** @format */

// /** @format */

import {IBase} from './common'

// 应用App
export interface IApp extends IBase {
  id?: number // ID,添加时可以没有id
  clientSecret: number | null //父级Id
  clientName: string //卡券名称
  clientId: string
}
