/** @format */
import React, { useState } from 'react'
import { Form, message, Spin, Tag } from 'antd'
// import { useBoolean } from '@umijs/hooks'
import * as api from '@/api'
import { useEffect } from 'react'
import { formatRuleType, formatApplyType } from '@/utils/common'

interface IProps {
  ruleId: any
}

let RuleDetails: React.FC<IProps> = props => {
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
        <Form labelCol={{ span: 5 }} wrapperCol={{ span: 13 }} layout="horizontal" form={form}>
          <Form.Item label="规则名称" name="name">
            <div>{form.getFieldValue('name')}</div>
          </Form.Item>
          <Form.Item label="规则类型" name="type">
            <div>

              <Tag color="blue"> {formatRuleType(form.getFieldValue('type'))}</Tag>
            </div>
          </Form.Item>
          <Form.Item label="适用活动类型" name="applyType">
            <div>

              <Tag color="blue">{formatApplyType(form.getFieldValue('applyType'))}</Tag>
            </div>
          </Form.Item>
          <Form.Item label="规则" >
            {/* {form.getFieldValue('rule')} */}

            {form.getFieldValue('type') == 'TeamBuyRule' ? '达标人数：' + form.getFieldValue('rule').standard + " | " + '成团时长(小时)：' + form.getFieldValue('rule').timeLength : null}
            {form.getFieldValue('type') == 'FullReduceRule' ? '满' + form.getFieldValue('rule').fullMoney + '减' + form.getFieldValue('rule').reduceMoney : null}
            {form.getFieldValue('type') == 'BuyGiveRule' ?
              form.getFieldValue('rule')?.goodsList.map(item => (
                <span>
                  {item.goodsName}
                </span>
              ))
              : null}

            {form.getFieldValue('type') == 'UseCardRule' ?
              form.getFieldValue('rule')?.cardList.map(item => (
                <span>
                  {item.subTitle} | 有效期:{item.validType == 1 ? item.validDays : item.validStart - item.validEnd}
                </span>
              ))
              : null}

            {form.getFieldValue('type') == 'LimitBuyRule' ? '限购数量:' + form.getFieldValue('rule').limitAmount : null}
            {form.getFieldValue('type') == 'DiscountRule' ? '购买数量：' + form.getFieldValue('rule').buyAmount + '|' + '折扣：' + form.getFieldValue('rule').discount + '折' : null}
            {form.getFieldValue('type') == 'CommissionRule' ? '员工佣金:' + form.getFieldValue('rule').staffCommission.value + "|" + '非员工佣金:' + form.getFieldValue('rule').otherCommission.value : null}
            {/* {form.getFieldValue('rule').goodsList?.data.map(item => (
              <span>
                {item.goodsName}
              </span>
            ))} */}
          </Form.Item>
          <Form.Item label="状态" name="status">
            <div>

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
