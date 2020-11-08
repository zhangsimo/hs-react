/** @format */

// import React from 'react'
import React, { useState, useEffect, useRef } from 'react'
import { Button, message, Table, Form, Input, Select, Tag, Modal } from 'antd'

import ToolsBar from '@/components/ToolsBar'
import * as api from '@/api'
import { useHistory } from 'react-router-dom'
import useAntdTable from '@/hooks/useAntdTable'
import { ITableResult, IUser } from '@/interface'
import { formatRuleType, formatApplyType } from '@/utils/common'
import RuleDetails from '../../components/ruleDetails'
import TeamBuyRule from './components/teamBuyRule'
import BuyGiveRule from './components/buyGiveRule'
import LimitBuyRule from './components/limitBuyRule'
import UseCardRule from './components/useCardRule'
import DiscountRule from './components/discountRule'
import CommissionRule from './components/commissionRule'
import FullReduceRule from './components/fullReduceRule'
import { PlusOutlined, SearchOutlined } from '@ant-design/icons'
// import { divide } from 'lodash'
// import Meta from 'antd/lib/card/Meta'

const Theme = () => {
  // const routeMatch = useRouteMatch<{id: string}>()
  const history = useHistory()
  const [form] = Form.useForm()
  const random = history.location.search.split('=')[1]
  const [visibleRuleDetails, setVisibleRuleDetails] = useState<boolean>(false)
  const [visibleEdit, setVisibleEdit] = useState<boolean>(false)
  const [curRuleId, setCurRuleId] = useState<any>(0)
  const [curType, setCurType] = useState<any>()
  const [width, setWidth] = useState<any>()

  const childRef = useRef()
  const updateChildState = () => {
    // changeVal就是子组件暴露给父组件的方法
    ; (childRef?.current as any)?.changeVal()
  }
  const getTableData = (tableParams, params) => {
    return api
      .getMarketRuleList({ ...api.formatParams(tableParams, params) })
      .then(res => {
        return {
          list: res.data.items,
          total: res.data.total,
        }
      })
      .catch(err => {
        message.error(err.msg)
      })
  }

  const { tableProps, search } = useAntdTable<ITableResult<IUser>, IUser>(getTableData, {
    defaultPageSize: 10,
    form,
  })

  // console.log('tablePropstableProps', tableProps);

  const { submit, reset } = search || {}

  useEffect(() => {
    reset()
  }, [random])

  const searchBt = () => {
    submit()
  }

  const creatRule = () => {
    history.push('/marketCenter/addMrketRule')
    // /marketCenter/addMrketRule
  }

  const editDetails = row => {
    console.log(row)
    if (row.type == 'TeamBuyRule') {
      setWidth(500)
    }

    if (row.type == 'FullReduceRule') {
      setWidth(500)
    }

    if (row.type == 'BuyGiveRule') {
      setWidth(800)
    }

    if (row.type == 'LimitBuyRule') {
      setWidth(400)
    }

    if (row.type == 'UseCardRule') {
      setWidth(830)
    }

    if (row.type == 'DiscountRule') {
      setWidth(600)
    }

    if (row.type == 'CommissionRule') {
      setWidth(620)
    }
    setCurType(row.type)
    setCurRuleId(row.id)
    updateChildState()
    setVisibleEdit(true)
  }

  const onViewDetails = row => {
    setCurRuleId(row.id)
    setVisibleRuleDetails(true)
  }

  const disableRule = data => {
    api
      .disableMarketRule({ id: data.id })
      .then((res: any) => {
        if (res.code == 1) {
          message.success('停用成功')
          submit()
        } else {
          message.error(res.msg)
        }
      })
      .catch(err => {
        message.error(err.msg)
      })
  }

  const enableRule = data => {
    api
      .enableMarketRule({ id: data.id })
      .then((res: any) => {
        if (res.code == 1) {
          message.success('启用成功')
          submit()
        } else {
          message.error(res.msg)
        }
      })
      .catch(err => {
        message.error(err.msg)
      })
  }

  const closeModal = () => {
    setVisibleEdit(false)
  }
  const columns: any = [
    {
      title: '编号',
      dataIndex: 'id',
      align: 'center',
      width: 80,
      render: (a, b, i) => i + 1,
    },
    {
      title: '规则名称',
      dataIndex: 'name',
      align: 'center',
      width: 300,
      render: (a, row: any) => {
        return (
          <div>
            <Button type="link" style={{ padding: '0' }}>
              {row.rule.cardList && row.rule.cardList.length ? row.name + "—" + row.rule.cardList[0].subTitle : row.name}
              {/* {row.name.length < 20 ? row.name : row.name.substr(0, 20) + '...'} */}
            </Button>
          </div>
        )
      },
    },

    {
      title: '类型',
      dataIndex: 'type',
      align: 'center',
      width: 120,
      render: (val, row: any) => {
        return formatRuleType(row.type)
      },
    },
    {
      title: '适用类型',
      dataIndex: 'applyType',
      align: 'center',
      width: 120,
      render: (val, row: any) => {
        return formatApplyType(row.applyType)
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      align: 'center',
      width: 120,
      render: (status: any, row: any): any => {
        return <div>{row.status === 1 ? <Tag color="green">启用</Tag> : <Tag color="red">停用</Tag>}</div>
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      align: 'center',
      width: 200,
    },
    // {
    // 	title: '创建时间',
    // 	dataIndex: 'createTime',
    // 	align: 'center',
    // 	width: 220,
    // 	render: (status: any, row: any): any => {
    // 		return (
    // 			<div>
    // 				{row.validType === 2 ? '永久有效' : (
    // 					<div>
    // 						<div>{row.startTime}</div>
    // 						<div>至</div>
    // 						<div>{row.endTime}</div>
    // 					</div>
    // 				)}
    // 			</div>
    // 		)
    // 	}
    // },
    {
      title: '创建人',
      dataIndex: 'createBy',
      align: 'center',
      width: 150,
    },
    {
      title: '更新时间',
      dataIndex: 'createTime',
      align: 'center',
      width: 200,
    },
    {
      title: '更新人',
      dataIndex: 'createBy',
      align: 'center',
      width: 150,
    },

    {
      title: '操作',
      key: 'action',
      width: 220,
      align: 'center',
      fixed: 'right',
      render: (row: any) => (
        <div>
          {row.status === 0 ? (
            <Button onClick={() => enableRule(row)} type="link">
              启用
            </Button>
          ) : null}
          {row.status === 1 ? (
            <Button onClick={() => disableRule(row)} type="link" style={{ color: 'red' }}>
              停用
            </Button>
          ) : null}
          <Button onClick={() => editDetails(row)} type="link">
            编辑
          </Button>
          <Button onClick={() => onViewDetails(row)} type="link">
            详细
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div>
      <ToolsBar visible={false}>
        <Form form={form} layout="inline">
          <Form.Item name="name" label="规则名称">
            <Input placeholder="请输入规则名称" style={{ width: '150px' }} allowClear></Input>
          </Form.Item>

          <Form.Item name="applyType" label="适用活动">
            <Select placeholder="请选择发布状态" style={{ width: '150px' }} allowClear>
              {/* <Select.Option value={1}>主题活动</Select.Option>
              <Select.Option value={2}>转介绍活动</Select.Option> */}
              <Select.Option value={3}>秒杀</Select.Option>
              <Select.Option value={4}>团购</Select.Option>
              <Select.Option value={5}>分销</Select.Option>
              <Select.Option value={6}>买赠</Select.Option>
              <Select.Option value={7}>满减</Select.Option>
              <Select.Option value={8}>折扣</Select.Option>
              <Select.Option value={99}>通用</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="status" label="规则状态">
            <Select placeholder="请选择规则状态" style={{ width: '150px' }} allowClear>
              <Select.Option value={0}>停用</Select.Option>
              <Select.Option value={1}>启用</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <div>
              <Button type="primary" icon={<SearchOutlined />} onClick={searchBt}>
                搜索
              </Button>
              <Button type="primary" icon={<PlusOutlined />} onClick={creatRule}>
                创建
              </Button>
            </div>
          </Form.Item>
        </Form>
      </ToolsBar>
      {/* 表格内容 */}
      <div className="tableConent">
        <Table columns={columns} rowKey="id" {...tableProps} bordered scroll={{ x: 100 }} />
      </div>

      <Modal
        title="规则详细"
        centered
        visible={visibleRuleDetails}
        footer={null}
        // confirmLoading={loading}
        width={600}
        onCancel={() => setVisibleRuleDetails(false)}
        bodyStyle={{ padding: '20px 0px 20px 80px ' }}>
        <RuleDetails ruleId={curRuleId}></RuleDetails>
      </Modal>

      <Modal
        title={formatRuleType(curType)}
        centered
        visible={visibleEdit}
        footer={null}
        // confirmLoading={loading}
        width={width}
        onCancel={() => setVisibleEdit(false)}
        bodyStyle={{ padding: '0px 20px' }}>
        {curType == 'TeamBuyRule' && visibleEdit ? (
          <TeamBuyRule cRef={childRef} closeModal={closeModal} ruleId={curRuleId}></TeamBuyRule>
        ) : null}

        {curType == 'BuyGiveRule' && visibleEdit ? (
          <BuyGiveRule cRef={childRef} closeModal={closeModal} ruleId={curRuleId}></BuyGiveRule>
        ) : null}

        {curType == 'LimitBuyRule' && visibleEdit ? (
          <LimitBuyRule cRef={childRef} closeModal={closeModal} ruleId={curRuleId}></LimitBuyRule>
        ) : null}

        {curType == 'UseCardRule' && visibleEdit ? (
          <UseCardRule cRef={childRef} closeModal={closeModal} ruleId={curRuleId}></UseCardRule>
        ) : null}
        {curType == 'DiscountRule' && visibleEdit ? (
          <DiscountRule cRef={childRef} closeModal={closeModal} ruleId={curRuleId}></DiscountRule>
        ) : null}
        {curType == 'CommissionRule' && visibleEdit ? (
          <CommissionRule cRef={childRef} closeModal={closeModal} ruleId={curRuleId}></CommissionRule>
        ) : null}
        {curType == 'FullReduceRule' && visibleEdit ? (
          <FullReduceRule cRef={childRef} closeModal={closeModal} ruleId={curRuleId}></FullReduceRule>
        ) : null}
      </Modal>
    </div>
  )
}

export default Theme
