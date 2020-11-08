/** @format */

//选择区域
import React, { useEffect } from 'react'
import { getCompOrgListParams } from '@/api'
import { useRequest } from '@umijs/hooks'
import { Select } from 'antd'
import { SelectProps } from 'antd/lib/select'

interface IPorps extends SelectProps<string> {
  areaId?: string
  isShopName?: boolean
}

const selectComp: React.FC<IPorps> = ({ areaId, isShopName, ...props }) => {
  const { data, run } = useRequest(() => getCompOrgListParams({ areaId: areaId, cache: true }), { manual: true })
  useEffect(() => {
    console.log('区域ID:', areaId)
    console.log('props:', props)
    run()
  }, [areaId])

  return (
    <Select {...props}>
      {data?.data.map((item, i) => {
        return (isShopName ?
          <Select.Option key={i} value={item.shopCode + '|' + item.shopName}>
            {item.shopName}
          </Select.Option> :
          <Select.Option key={i} value={item.shopCode}>
            {item.shopName}
          </Select.Option>
        )
      })}
    </Select>
  )
}

selectComp.defaultProps = {
  style: { width: '150px' },
}

export default selectComp
