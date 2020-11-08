/** @format */

//选择区域
import React, {useEffect} from 'react'
import {getMemberERP} from '@/api'
import {useRequest} from '@umijs/hooks'
import {Select} from 'antd'
import {SelectProps} from 'antd/lib/select'

interface IPorps extends SelectProps<string> {
  compCode?: string
  memberName?: string
}

const selectMember: React.FC<IPorps> = ({compCode, memberName, ...props}) => {
  const {data, run, loading} = useRequest(
    () =>
      getMemberERP({
        compCode: compCode,
        employeeName: memberName,
        page: 1,
        pageSize: 200,
        cache: true, //缓存 1天
      }).then(res => res.data.items),
    {manual: true},
  )
  // const changeMember = (val, option) => {
  //   memberName = val
  //   console.log(val, option, '00a0a000a0')
  // }
  useEffect(() => {
    if (compCode) {
      run()
    }
    if (memberName) {
      run()
    }
  }, [compCode])

  return (
    <Select {...props} loading={loading}>
      {data?.map((item, i) => {
        return (
          <Select.Option key={i} value={item.employeeCode}>
            {item.employeeName}
          </Select.Option>
        )
      })}
    </Select>
  )
}

selectMember.defaultProps = {
  style: {width: '150px'},
}

export default selectMember
