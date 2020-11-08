/** @format */
//格式化请求接口的参数
/*
  tableParams : {
    sorter: {"column":{"title":"访客数","dataIndex":"visitorCount","align":"center"},"order":"ascend","field":"visitorCount"},
    filters: {},
    pageSize: 20,
    current: 1
  }

  params 为用户请求参数
  */
export const formatParams = (tableParams, params) => {
  let sortType
  if (tableParams?.sorter) {
    if (!tableParams.sorter.order) {
      sortType = null
    } else if (tableParams.sorter.order === 'ascend') {
      sortType = '0'
    } else if (tableParams.sorter.order === 'descend') {
      sortType = '1'
    }
  }
  return {
    ...tableParams, //可删除  留作参考
    ...params,
    sort: sortType,
    sortField: tableParams?.sorter?.field,
    page: tableParams?.current,
    pageSize: tableParams?.pageSize,
  }
}

/** form设置日期范围 */
export const setFormDateRange = (dateStrings, form, startField: string, endField: string) => {
  form.setFieldsValue({
    [startField]: dateStrings[0] ? dateStrings[0] + ' 00:00:00' : '',
    [endField]: dateStrings[1] ? dateStrings[1] + ' 23:59:59' : '',
  })
}
//
export const setFormDateRangeSimple = (dateStrings, form, startField: string, endField: string) => {
  form.setFieldsValue({
    [startField]: dateStrings[0] ? dateStrings[0] : '',
    [endField]: dateStrings[1] ? dateStrings[1] : '',
  })
}

/* 单个日期 */
export const setFormDateSigle = (dateStrings, form, startField: string) => {
  form.setFieldsValue({
    [startField]: dateStrings[0] ? dateStrings[0] + ' 00:00:00' : '',
  })
}
