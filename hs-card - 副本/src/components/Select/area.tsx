/** @format */

//选择区域
import React from 'react'
import {getAreaList} from '@/api'
import {useRequest} from '@umijs/hooks'
import {Select} from 'antd'
import {SelectProps} from 'antd/lib/select'

const selectArea: React.FC<SelectProps<string>> = props => {
  const {data} = useRequest(() => getAreaList({cache: true}))

  return (
    <Select {...props}>
      {data?.data.map((item, i) => {
        return (
          <Select.Option key={i} value={item.areaId}>
            {item.areaName}
          </Select.Option>
        )
      })}
    </Select>
  )
}

selectArea.defaultProps = {
  style: {width: '150px'},
}

export default selectArea
