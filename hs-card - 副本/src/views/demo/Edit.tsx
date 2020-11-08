/** @format */

import React, {useEffect} from 'react'
import {Modal, Form, Radio, InputNumber} from 'antd'
// import * as api from '@/api'
import {IEditType} from '@/interface'

interface IProps {
  id: number
  visible: boolean
  data
  onOk?: (type: IEditType, item) => void
  setVisible: () => void
}

const formItemLayout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 20,
  },
}

const Edit: React.FC<IProps> = ({data, ...props}) => {
  const [form] = Form.useForm()

  useEffect(() => {
    if (props.visible) {
      setTimeout(() => {
        if (data) {
          form.setFieldsValue({...data})
        } else {
          form.resetFields()
          form.setFieldsValue({status: 1, sort: 1})
        }
      })
    }
  }, [props.visible])

  const onSubmit = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.preventDefault()
    form.validateFields().then(async values => {
      const tempData = {...data, ...values}
      if (data?.id) {
        // await api.updateDrivingClass(data.id, values)
      } else {
        // const res = await api.createDrivingClass({shop_id: props.id, ...values})
        // tempData.id = res.data
      }
      props.setVisible()
      props.onOk?.(data?.id ? 'update' : 'create', tempData)
    })
  }

  return (
    <Modal
      title={data?.id ? '编辑' : '添加'}
      maskClosable={false}
      visible={props.visible}
      onCancel={() => props.setVisible()}
      onOk={onSubmit}>
      <Form form={form} {...formItemLayout}>
        <Form.Item label="状态" name="status">
          <Radio.Group>
            <Radio value={1}>启用</Radio>
            <Radio value={0}>禁用</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="排序" name="sort">
          <InputNumber />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default Edit
