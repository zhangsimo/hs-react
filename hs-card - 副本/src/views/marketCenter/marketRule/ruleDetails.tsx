/** @format */
import React, {useState} from 'react'
import {Form, message, Spin, Tag} from 'antd'
// import { useBoolean } from '@umijs/hooks'
import * as api from '@/api'
import {useEffect} from 'react'
import {formatRuleType, formatApplyType} from '@/utils/common'

interface IProps {
  cRef: any
  closeModal: () => void
  ruleId: any
}

const RuleDetails: React.FC<IProps> = props => {
  // const [treeData, setTreeData] = useState<any>([])
  // const [loading, setLoading] = useState<boolean>(false)
  const [loading2, setLoading2] = useState<boolean>(false)

  const [form] = Form.useForm()

  useEffect(() => {
    getShowRule({})
  }, [props])

  const getShowRule = data => {
    console.log(data)
    console.log(props.ruleId)
    setLoading2(true)

    const params: any = {
      id: props.ruleId,
    }

    api
      .getRuleDetails(params)
      .then(res => {
        form.setFieldsValue(res.data)
        setLoading2(false)
      })
      .catch(err => {
        console.log(err)
        message.error(err.msg)
        setLoading2(false)
      })
  }

  return (
    <div>
      {/* <ToolsBar>
                
            </ToolsBar> */}

      <Spin spinning={loading2}>
        <Form labelCol={{span: 5}} wrapperCol={{span: 13}} layout="horizontal" form={form}>
          <Form.Item label="规则名称" name="name">
            <div>{form.getFieldValue('name')}</div>
          </Form.Item>
          <Form.Item label="规则类型" name="type">
            <div>
              {' '}
              <Tag color="blue"> {formatRuleType(form.getFieldValue('type'))}</Tag>
            </div>
          </Form.Item>
          <Form.Item label="适用活动类型" name="applyType">
            <div>
              {' '}
              <Tag color="blue">{formatApplyType(form.getFieldValue('applyType'))}</Tag>
            </div>
          </Form.Item>
          {/* <Form.Item label="规则" name="rule">
                        <div>{form.getFieldValue('rule').name}</div>
                    </Form.Item> */}
          <Form.Item label="状态" name="status">
            <div>
              {' '}
              <Tag color="blue">{form.getFieldValue('status') == 0 ? '停用' : '启用'}</Tag>
            </div>
          </Form.Item>
          <Form.Item label="更新人" name="updateBy">
            <div>{form.getFieldValue('updateBy')}</div>
          </Form.Item>
          <Form.Item label="创建人" name="createBy">
            <div>{form.getFieldValue('createBy')}</div>
          </Form.Item>
          <Form.Item label="备注" name="remark">
            <div>{form.getFieldValue('remark')}</div>
          </Form.Item>
        </Form>
      </Spin>
    </div>
  )
}

export default RuleDetails
