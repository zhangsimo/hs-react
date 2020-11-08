/** @format */

import React, {useEffect, useState} from 'react'
import {Form, Modal, message} from 'antd'
// import * as api from '@/api'
import SelectArea from '@/components/Select/area'
import SelectComp from '@/components/Select/comp'
import SelectMember from '@/components/Select/member'
import {useRequest} from '@umijs/hooks'
import * as api from '@/api'

interface IProps {
  isShow: boolean
  selectRow: any[]
  onOk: () => void
  onClose: () => void
}
const CustomerInfo: React.FC<IProps> = ({isShow, selectRow, ...props}) => {
  const [form] = Form.useForm()
  const [nameStr, setNameStr] = useState('')
  const [userIds, setUserIds] = useState<number[]>([])
  const [areaId, setAreaId] = useState<string>('')
  const [compCode, setCompCode] = useState('')
  const [currMemberCode, setCurrMemberCode] = useState<any>(sessionStorage.getItem('memberId'))
  const [currMemberName, setCurrMemberName] = useState<any>({})

  // const {data: groupList, run} = useRequest(
  //   () => api.getCompGroupMember({compCode: selectRow[0]?.compCode}).then(res => res.data),
  //   {
  //     manual: true,
  //   },
  // )
  const {data: groupObj, run: groupRun} = useRequest(
    () => api.getMemberInGroup({employeeCode: currMemberCode}).then(res => res.data),
    {
      manual: true,
    },
  )

  useEffect(() => {
    const nameList = selectRow.map(item => item.name)
    const idList = selectRow.map(item => item.id)
    setNameStr(nameList.join('、'))
    setUserIds(idList)
    setNameStr
  }, [selectRow])

  useEffect(() => {
    if (currMemberCode) {
      groupRun()
    }
  }, [currMemberCode])

  const onChangeAreaCode = value => {
    setAreaId(value)
    form.setFieldsValue({compCode: null})
  }

  const onChangeCompCode = value => {
    setCompCode(value)
    form.setFieldsValue({employeeCode: undefined})
  }
  const onMemberChange = (value, option) => {
    setCurrMemberCode(value)
    setCurrMemberName(option.children)
    // const obj = groupList.find(item => item.id === value)
    // setCurrGroupObj(obj)
  }
  // const onSelectChange = value => {
  //   const obj = groupList.find(item => item.id === value)
  //   setCurrGroupObj(obj)
  // }

  const onOkModal = () => {
    const formData = (form.getFieldValue as any)()
    if (!formData.compCode) {
      message.warning('请选择归属门店')
      return
    }
    if (!formData.employeeCode) {
      message.warning('请选择归属员工')
      return
    }
    if (!groupObj.id) {
      message.warning('该员工未设置小组哦')
      return
    }

    api
      .saveCustomerGroup({
        compCode: compCode,
        customerIds: userIds,
        employeeCode: currMemberCode,
        employeeName: currMemberName,
        groupId: groupObj.id,
      })
      .then(res => {
        message.success('修改成功')
        props.onOk()
      })
  }

  return (
    <Modal
      title="客户分配"
      width={700}
      centered
      destroyOnClose
      visible={isShow}
      onOk={onOkModal}
      maskClosable={false}
      forceRender
      onCancel={() => props.onClose()}
      okText="保存"
      cancelText="取消"
      bodyStyle={{padding: 20}}>
      {/* {JSON.stringify(selectRow)} */}
      <Form form={form} labelCol={{span: 3}}>
        <Form.Item label="已选客户">
          <span>{nameStr}</span>
        </Form.Item>
        <Form.Item label="归属门店" style={{marginBottom: 0}}>
          <Form.Item name="areaCode" style={{display: 'inline-block'}}>
            <SelectArea placeholder="选择区域" allowClear style={{width: 150}} onChange={onChangeAreaCode} />
          </Form.Item>
          <Form.Item name="compCode" style={{display: 'inline-block', marginLeft: 20}}>
            <SelectComp
              showSearch
              allowClear
              areaId={areaId}
              placeholder="选择门店"
              filterOption={(input, option) => option?.children.indexOf(input) >= 0}
              onChange={onChangeCompCode}
            />
          </Form.Item>
        </Form.Item>
        <Form.Item name="employeeCode" label="归属员工">
          <SelectMember
            showSearch
            allowClear
            placeholder="选择归属员工"
            compCode={compCode}
            filterOption={(input, option) => option?.children.indexOf(input) >= 0}
            style={{width: 320}}
            onChange={onMemberChange}
          />
        </Form.Item>
        <Form.Item name="groupId" label="服务小组">
          <span>{groupObj?.name}</span>
        </Form.Item>
        <Form.Item label="小组成员">
          <span>
            {groupObj?.groupEmpDTOList?.length && groupObj?.groupEmpDTOList?.map(item => item.employeeName).join('、')}
          </span>
        </Form.Item>
      </Form>
    </Modal>
  )
}

// CustomerInfo.defaultProps = {
//   selectRow: [],
// }

export default CustomerInfo
