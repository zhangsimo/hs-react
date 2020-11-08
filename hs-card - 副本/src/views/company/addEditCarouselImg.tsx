/** @format */

import React, {useEffect, useState} from 'react'
import {Modal, Form, InputNumber, Input} from 'antd'
import UploadImg from '@/components/Upload/ImageQN'
import {IEditType} from '@/interface'
interface IProps {
  visible: boolean
	operation
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

const Edit: React.FC<IProps> = ({data, operation, ...props}) => {
  const [form] = Form.useForm()
	const [backgroundImageUrl, setBackgroundImageUrl] = useState<any>()
	const [isExit] = useState<boolean>(false)
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
      props.setVisible()
      props.onOk?.(operation == 'update' ? 'update' : 'create', tempData)
    })
  }
		
	const changeBackgroundImageUrl = (imgUrl: any) => {
		form.setFieldsValue({fileUrl: imgUrl})
	  setBackgroundImageUrl(imgUrl)
	}

  return (
    <Modal
      title={operation == 'update' ? '编辑图片' : '添加图片'}
      maskClosable={false}
      visible={props.visible}
      onCancel={() => props.setVisible()}
      onOk={onSubmit}>
      <Form form={form} {...formItemLayout}>
        <Form.Item label="轮播图" name="fileUrl" rules={[{required: true, message: '请上传图片'}]}>
          <UploadImg
            className="id-img-upload"
						disabled={isExit}
            value={backgroundImageUrl}
            onChange={(e: any) => changeBackgroundImageUrl(e)}></UploadImg>
        </Form.Item>
        <Form.Item label="排序" name="sort" rules={[{required: true, message: '排序必填'}]}>
          <InputNumber />
        </Form.Item>
				<Form.Item label="标题" name="title">
				  <Input />
				</Form.Item>
				<Form.Item label="链接" name="picLink">
				  <Input style={{ width: '100%' }} />
				</Form.Item>
      </Form>
    </Modal>
  )
}

export default Edit
