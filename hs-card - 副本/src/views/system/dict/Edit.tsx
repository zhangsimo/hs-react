/** @format */

import React, {useEffect} from 'react'
import {Modal, Form, Input, Radio} from 'antd'
import {IDictType} from '@/interface/system'
import {updateDict, createDict} from '@/api'
interface IProps {
  visible: boolean
  data?: IDictType
  /** 字典分类 */
  type: string
  onOK?: () => void
  setVisible: (a: boolean) => void
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
          form.setFieldsValue({status: '0', dictSort: 1})
        }
      })
    }
  }, [props.visible, data])

  const onSubmit = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.preventDefault()
    form.validateFields().then(async (values: IDictType) => {
      if (data?.dictCode) {
        await updateDict({dictCode: data?.dictCode, ...values, dictType: props.type})
      } else {
        await createDict({...values, dictType: props.type})
      }
      props.setVisible(false)
      props.onOK?.()
    })
  }
  const onCancel = () => {
    props.setVisible(false)
  }

  return (
    <Modal title="编辑字典" visible={props.visible} maskClosable={false} onCancel={onCancel} onOk={onSubmit}>
      <Form {...formItemLayout} form={form} initialValues={{asDefault: 'Y', status: '0'}}>
        <Form.Item
          name="dictLabel"
          label="名称"
          rules={[
            {
              required: true,
            },
          ]}>
          <Input />
        </Form.Item>
        <Form.Item
          label="值"
          name="dictValue"
          rules={[
            {
              required: true,
            },
          ]}>
          <Input />
        </Form.Item>
        <Form.Item label="是否默认" name="asDefault">
          <Radio.Group>
            <Radio value="Y">是</Radio>
            <Radio value="N">不是</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="状态" name="status">
          <Radio.Group>
            <Radio value="0">启用</Radio>
            <Radio value="1">停用</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="排序" name="dictSort" required>
          <Input />
        </Form.Item>
        <Form.Item label="备注" name="remark" required>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  )
}

Edit.defaultProps = {
  visible: false,
}

export default Edit
