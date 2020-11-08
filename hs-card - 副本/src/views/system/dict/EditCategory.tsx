/** @format */

import React, {useEffect} from 'react'
import {Modal, Form, Input, Radio} from 'antd'
import {IDictCategoryType} from '@/interface/system'
import {updateDictCategory, createDictCategory} from '@/api'

interface IProps {
  visible: boolean
  data?: IDictCategoryType
  onOk?: (item: IDictCategoryType) => void
  setVisible: (a: boolean) => void
  updateData: (data: IDictCategoryType[] | ((prevState: IDictCategoryType[]) => IDictCategoryType[])) => void
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
      console.log('data', data)
      setTimeout(() => {
        if (data) {
          form.setFieldsValue({...data})
        } else {
          form.resetFields()
          form.setFieldsValue({sort: 1})
        }
      })
    }
  }, [props.visible, data])

  const onSubmit = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.preventDefault()
    form.validateFields().then(async (values: IDictCategoryType) => {
      const item = {...values}
      if (data?.dictId) {
        await updateDictCategory({dictId: data?.dictId, ...values})
        item.dictId = data.dictId
        props.updateData(data => {
          const a = data.slice()
          a.forEach(b => {
            if (b.dictId === item.dictId) {
              Object.assign(b, item)
            }
          })
          return a
        })
      } else {
        const res = await createDictCategory({...values})
        item.dictId = res.data
        item.create_time = new Date()
        props.updateData(data => {
          const a = data.slice()
          a.push(item)
          return a
        })
      }
      props.setVisible(false)
      props.onOk?.(item)
    })
  }
  const onCancel = () => {
    props.setVisible(false)
  }

  return (
    <Modal title={data?.id ? '编辑分类' : '添加分类'} visible={props.visible} onCancel={onCancel} onOk={onSubmit}>
      {props.visible && (
        <Form {...formItemLayout} form={form} initialValues={{status: '0'}}>
          <Form.Item label="名称" name="dictName">
            <Input />
          </Form.Item>
          <Form.Item label="type" name="dictType">
            <Input />
          </Form.Item>
          {/* <Form.Item label="平台" name="platformLabel">
            <Input />
          </Form.Item> */}
          <Form.Item label="状态" name="status">
            <Radio.Group>
              <Radio value="0">启用</Radio>
              <Radio value="1">禁用</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="备注" name="remark">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      )}
    </Modal>
  )
}

export default Edit
