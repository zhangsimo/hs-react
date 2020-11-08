/** @format */

/**
 * 转化一棵树的vlaue field children 对应的字段
 * children 为空数组 则删除该字段
 */
type opt = {
  value?: string // 新字段
  oldValue: string //老字段
  field?: string
  oldField: string
  parentField: string //必要
  oldParentField: string //必要
}
export const getTreeDataFormat = (data, option: opt): Array<any> => {
  if (!(data && data.length)) {
    return []
  }
  if (!option) return data
  if (!(option.parentField && option.oldParentField)) return data
  for (var i = 0; i < data.length; i++) {
    if (option.value && option.oldValue) data[i][option.value] = data[i][option.oldValue]
    if (option.field && option.oldField) data[i][option.field] = data[i][option.oldField]
    if (data[i][option.oldParentField] && data[i][option.oldParentField].length) {
      data[i][option.parentField] = data[i][option.oldParentField]
      getTreeDataFormat(data[i][option.parentField], option)
    } else {
      delete data[i][option.oldParentField]
    }
  }
  // console.log('tree', data)
  // // if (option?.isShowAll) {
  // //   data.push({ [option.oldValue]: null, [option.oldField]: "全部", key: 0, pid: 0 })

  // // }
  return data
}

export const formatMobile = tel => {
  if (tel) {
    tel = '' + tel
    var reg = /(\d{3})\d{4}(\d{4})/
    return tel.replace(reg, '$1****$2')
  } else {
    return ''
  }
}

export const uniqueArr = (arr1, arr2, id) => {
  let arr3 = arr1 || []
  let arr4 = arr2 || []
  let c = [...arr3, ...arr4] //两个数组合并一个的简单方法
  let d = []
  let hash = {}
  d = c.reduce((item, next) => {
    let a = next[id]
    hash[a] ? '' : (hash[a] = true && item.push(next))
    return item
  }, [])
  return d
}
// 获取年月日 
export const yearMonthDay = (time: any) => {
  const t = new Date(time);
  const y = t.getFullYear();
  const m = t.getMonth() + 1;
  const d = t.getDate();
  return `${y}-${m >= 10 ? m : '0' + m}-${d >= 10 ? d : '0' + d}`
}

//规则类型
export const formatRuleType = (type) => {
  switch (type) {
    case 'TeamBuyRule':
      return '团购规则'
      break;
    case 'FullReduceRule':
      return '满减规则'
      break;
    case 'BuyGiveRule':
      return '买赠规则'
      break;
    case 'LimitBuyRule':
      return '限购规则'
      break;
    case 'UseCardRule':
      return '用券规则'
      break;
    case 'DiscountRule':
      return '折扣规则'
      break;
    case 'CommissionRule':
      return '佣金规则'
      break;
    default:
      return '--'
  }
}



//规则类型
export const formatApplyType = (type) => {
  switch (type) {
    case 1:
      return '主题活动'
      break;
    case 2:
      return '转介绍活动'
      break;
    case 3:
      return '秒杀活动'
      break;
    case 4:
      return '团购活动'
      break;
    case 5:
      return '分销活动'
      break;
    case 6:
      return '买赠活动'
      break;
    case 7:
      return '满减活动'
      break;
    case 8:
      return '折扣活动'
      break;
    case 99:
      return '通用'
      break;
    default:
      return '--'
  }
}


//订单状态
export const formatOrderStatus = (type) => {
  switch (type) {
    case 'OPS001':
      return '待付款'
      break;
    case 'OPS002':
      return '已付款'
      break;
    case 'OPS003':
      return '申请退'
      break;
    case 'OPS004':
      return '已退款'
      break;
    case 'OPS005':
      return '部分退款'
      break;
    case 'OPS006':
      return '已取消'
      break;
    case 'unknown':
      return '未知'
      break;
    default:
      return '--'
  }
}

//订单状态


export const formatCardType = (type) => {
  switch (type) {
    case 1:
      return '满减券'
      break;
    case 2:
      return '抵扣券'
      break;
    case 3:
      return '折扣券'
      break;
    case 4:
      return '兑换券'
      break;
    default:
      return '--'
  }
}
export const toDecimal2 = (x) => {
  var f = parseFloat(x);
  if (isNaN(f)) {
    return false;
  }
  var f = Math.round(x * 100) / 100;
  var s = f.toString();
  var rs = s.indexOf('.');
  if (rs < 0) {
    rs = s.length;
    s += '.';
  }
  while (s.length <= rs + 2) {
    s += '0';
  }

  if (s) {
    return s;
  } else {
    return '';
  }

}

