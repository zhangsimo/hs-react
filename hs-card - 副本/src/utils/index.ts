/** @format */

/**
 * 递归数据
 * @todo 这个递归树写的不好，有时间用尾递归优化
 * @param data
 * @param pid
 * @param key
 * @example
 *
 *
 * ```ts
 *  var a = [{id: 1, pid: 0, name: '22'}, {}]
 *  var b = treeDate(a)
 * ```
 */

export const toTreeDate = <T>(
  data: any[],
  pid: number,
  key: {id: string; pid: string; children: string; cb?: (item: any) => boolean} = {
    id: 'id',
    pid: 'pid',
    children: 'children',
  },
): T[] => {
  data = JSON.parse(JSON.stringify(data))
  const result: any = []
  for (const i in data) {
    const a = key.cb ? key.cb(data[i]) : 1
    if (data[i][key.pid] === pid && a) {
      result.push(data[i])
      const temp = toTreeDate(data, data[i][key.id], key)
      if (temp.length > 0) {
        data[i][key.children] = temp
      }
    }
  }
  return result
}

export const getUrlParams = (params: object) => {
  const paramsStr: string[] = []
  var reg = new RegExp('%20', 'g') //浏览器默认把空格转化为%20  后台接受 +   所以手动转化为 +
  for (var key in params) {
    paramsStr.push(`${key}=${encodeURI(params[key]).replace(reg, '+')}`)
  }
  return paramsStr.join('&')
}
