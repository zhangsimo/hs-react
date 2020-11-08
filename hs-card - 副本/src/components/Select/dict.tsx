/** @format */

import React, {useState, useEffect} from 'react'
import {Select} from 'antd'
import {IDict} from '@/interface/system'
import * as api from '@/api'
import {SelectProps} from 'antd/lib/select'

const Option = Select.Option
type IProps = SelectProps<'string'> & {
  type: string
}

const Dict: React.FC<IProps> = ({type, ...props}) => {
  const [list, setList] = useState<IDict[]>([])

  useEffect(() => {
    let isUnmounted = false
    api.getDictTypeVal(type).then(res => {
      if (!isUnmounted) {
        setList(res.data)
      }
    })
    return () => {
      isUnmounted = true
    }
  }, [type])

  return (
    <Select {...props}>
      {list.map(item => (
        <Option value={item.dictValue} key={item.dictValue}>
          {item.dictLabel}
        </Option>
      ))}
    </Select>
  )
}

export default Dict
