/** @format */

import React from 'react'
import moment from 'moment'

const dateFormat = 'YYYY-MM-DD'

export const getDayRate = num => {
  var tdate = new Date()
  tdate.setDate(new Date().getDate() + num)
  return tdate.getFullYear() + '-' + (tdate.getMonth() + 1) + '-' + tdate.getDate()
}

export const changeDayRate = (type, form, callback = function() {}) => {
  switch (type) {
    case 'today':
      form.setFieldsValue({time: [moment(getDayRate(0), dateFormat), moment(getDayRate(0), dateFormat)]})
      form.setFieldsValue({beginDate: getDayRate(0), endDate: getDayRate(0)})
      break
    case 'yesterday':
      form.setFieldsValue({time: [moment(getDayRate(-1), dateFormat), moment(getDayRate(-1), dateFormat)]})
      form.setFieldsValue({beginDate: getDayRate(-1), endDate: getDayRate(-1)})
      break
    case '7day':
      form.setFieldsValue({time: [moment(getDayRate(-7), dateFormat), moment(getDayRate(0), dateFormat)]})
      form.setFieldsValue({beginDate: getDayRate(-7), endDate: getDayRate(0)})
      break
    case '30day':
      form.setFieldsValue({time: [moment(getDayRate(-30), dateFormat), moment(getDayRate(0), dateFormat)]})
      form.setFieldsValue({beginDate: getDayRate(-30), endDate: getDayRate(0)})
      break
    default:
      form.setFieldsValue({time: ['', '']})
      break
  }
  callback && callback()
}

//格式化 来源
export const cardTypeFormat = (a, row, key) => {
  if (row[key] === 1) {
    return <span>满减</span>
  } else if (row[key] === 2) {
    return <span>抵扣</span>
  } else if (row[key] === 3) {
    return <span>折扣</span>
  } else if (row[key] === 4) {
    return <span>兑换</span>
  } else {
    return <span>--</span>
  }
}

//卡券状态

export const cardStatusFormat = (a, row, key) => {
  if (row[key] === 1) {
    return <span>生效中</span>
  } else if (row[key] === 2) {
    return <span>已失效</span>
  } else if (row[key] === 0) {
    return <span>未生效</span>
  } else {
    return <span>--</span>
  }
}

//核销状态
export const veriStatusFormat = (a, row) => {
  if (row.veriStatus === 0) {
    return <span>未核销</span>
  } else if (row.veriStatus === 1) {
    return <span>已核销</span>
  } else {
    return <span>--</span>
  }
}

//核销方式
export const veriWayFormat = (a, row) => {
  if (row.veriWay === 1) {
    return <span>人工</span>
  } else if (row.veriWay === 2) {
    return <span>平台自动</span>
  } else {
    return <span>--</span>
  }
}

//项目工时配件
export const projectFormat = (a, row) => {
  if (row.itemType === '4') {
    return <span>项目</span>
  } else if (row.itemType === '2') {
    return <span>工时</span>
  } else if (row.itemType === '3') {
    return <span>配件</span>
  } else if (row.itemType === '1') {
    return <span>结算单</span>
  } else {
    return <span>--</span>
  }
}

export const shopFormat = (a, row) => {
  if (row.applyType === 1) {
    return <span>全部</span>
  } else if (row.applyType === 2) {
    return <span>部分</span>
  } else {
    return <span>--</span>
  }
}

export const channelNameFormat = (a, row) => {
  if (row.channelName) {
    return row.channelName
  } else {
    return <span>--</span>
  }
}

export const useCaseFormat = (a, row) => {
  if (row.useCase === 1) {
    return <span>全部</span>
  } else if (row.useCase === 2) {
    return <span>部分</span>
  } else {
    return <span>--</span>
  }
}
