/** @format */

import React, { useEffect } from 'react'
import { Modal, Form, Input, Radio, InputNumber, TreeSelect } from 'antd'
import * as api from '@/api'
import { IEditType } from '@/interface'
import { useRequest } from '@umijs/hooks'
import { toTreeDate } from '@/utils'
import UploadImage from '@/components/Upload/Image'
interface IProps {
  pid?: number
  visible: boolean
  data: any
  onOk?: (type: IEditType, item) => void
  setVisible: () => void,
  cateName?: string
}

const formItemLayout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 20,
  },
}

const Edit: React.FC<IProps> = ({ data, ...props }) => {
  const [form] = Form.useForm()
  const { data: treeData } = useRequest(() =>
    api.getShopCategoryList({}).then(res =>
      toTreeDate<any>(
        res.data.items.map(item => ({ pid: item.pid, title: item.cateName, value: item.id })),
        0,
        { id: 'value', pid: 'pid', children: 'children' },
      ),
    ),
  )


  useEffect(() => {
    if (props.visible) {
      if (data) {
        form.setFieldsValue({ ...data, pid: data.pid || undefined })
      } else {
        form.resetFields()
        form.setFieldsValue({ status: 1, sort: 1, pid: props.pid || undefined })
      }
      // })
    }
  }, [props.visible])
  useEffect(() => {
    form.setFieldsValue({ cateNameFa: props.cateName })
  }, [props.cateName])
  useEffect(() => {
    form.setFieldsValue({ cateNameFa: props.cateName })
  }, [props.cateName])

  const onSubmit = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.preventDefault()
    form.validateFields().then(async values => {
      const tempData = { ...data, ...values }
      if (data?.id) {
        await api.updateShopCategory({ ...values, categoryId: data.id })
      } else {
        // console.log(222, { ...values, pid: props.pid || 0 })
        const res = await api.createShopCategory({ ...values, pid: props.pid || 0 })
        tempData.id = res.data
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
        {
          props.pid === 0 || props.cateName ? '' :
            <Form.Item label="上级类目" name="pid">
              <TreeSelect
                allowClear
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                treeData={treeData}
                placeholder="请选择父级,不选默认最顶层"
                disabled
              />
            </Form.Item>
        }
        {/* 解决子类 */}
        {
          props.cateName ?
            <Form.Item label="上级类目" name="cateNameFa">
              <Input disabled />
            </Form.Item> : ''
        }

        <Form.Item label="类目名称" name="cateName" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="排序" name="sort" rules={[{ required: true }]}>
          <InputNumber min={1} max={999} />
        </Form.Item>
        <Form.Item label="是否可见" name="status">
          <Radio.Group>
            <Radio value={1}>是</Radio>
            <Radio value={0}>否</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="类目图标" name="pic">
          <UploadImage />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default Edit
