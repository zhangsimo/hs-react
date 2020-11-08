/** @format */

import React, {useEffect, useState} from 'react'
import {Modal, Form, InputNumber, Input, Select} from 'antd'
import UploadImg from '@/components/Upload/ImageQN'
import * as api from '@/api'
import {IEditType} from '@/interface'
const { Option } = Select;
interface IProps {
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
			console.log('form', tempData)
      if (data?.id) {
        await api.postMarkeRpicSave(tempData)
      } else {
				console.log('新增', tempData)
        const res = await api.postMarkeRpicSave(tempData)
				console.log(112, res)
      }
      props.setVisible()
      props.onOk?.(data?.id ? 'update' : 'create', tempData)
    })
  }
	const prefixSelector = (
	    <Form.Item name="linkType" noStyle>
	      <Select style={{ width: 70 }} defaultValue="inner">
	        <Option value="inner">内链</Option>
	        <Option value="outer">外链</Option>
	      </Select>
	    </Form.Item>
	  );
		
	const changeBackgroundImageUrl = (imgUrl: any) => {
		form.setFieldsValue({imgUrl: imgUrl})
	  setBackgroundImageUrl(imgUrl)
	}

  return (
    <Modal
      title={data?.id ? '编辑图片' : '添加图片'}
      maskClosable={false}
      visible={props.visible}
      onCancel={() => props.setVisible()}
      onOk={onSubmit}>
      <Form form={form} {...formItemLayout}>
        <Form.Item label="图片" name="imgUrl" rules={[{required: true, message: '请上传图片'}]}>
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
				<Form.Item label="位置" name="position">
				  <Select style={{ width: 120 }} defaultValue={1}>
						<Option value={1}>商城轮播</Option>
						<Option value={2}>主题活动入口</Option>
						<Option value={3}>营销页</Option>
						<Option value={4}>分销商品页</Option>
					</Select>
				</Form.Item>
				<Form.Item label="链接地址" name="linkUrl">
				  <Input addonBefore={prefixSelector} style={{ width: '100%' }} />
				</Form.Item>
      </Form>
    </Modal>
  )
}

export default Edit
