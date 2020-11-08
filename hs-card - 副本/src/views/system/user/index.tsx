/**
 * /* eslint-disable prettier/prettier
 *
 * @format
 */

import React, { useState, useEffect } from 'react'
// import {useRouteMatch} from 'react-router-dom'
import { Table, Button, Form, Input, Select, Modal, Spin, Radio, Row, Col, Tag, message } from 'antd'
import { ColumnProps } from 'antd/lib/table'
import useAntdTable from '@/hooks/useAntdTable'
import './index.less'
// import Edit from './Edit'
import ToolsBar from '@/components/ToolsBar'
import * as api from '@/api'
import { IUser, ITableResult } from '@/interface'
import { SearchOutlined } from '@ant-design/icons'
// import {useBoolean} from '@umijs/hooks'
import ErpUser from '../components/erpUserList'
import { Store } from 'antd/lib/form/interface'

const { confirm } = Modal
const User = () => {
  const [form] = Form.useForm()
  const [formUser] = Form.useForm()
  const [menuVisible, setUserVisible] = useState<boolean>(false)
  const [erpUserVisible, setErpUserVisible] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [title, setTitle] = useState<string>('新增用户')
  const [roleList, setRoleList] = useState<any[]>([])
  const [selectErpUserList, setSelectErpUserList] = useState<any[]>([])
  const [isAdd, setIsAdd] = useState<boolean>(false)
  // const [compId, setcompId] = useState<string>('')
  // const [value, setValue] = useState<any>()

  const getTableData = (tableParams: any, params: any) =>
    api.getUserList({ ...api.formatParams(tableParams, params) }).then(res => ({
      list: res.data.items,
      total: res.data.total,
    }))

  const { tableProps, search, refresh } = useAntdTable<ITableResult<IUser>, IUser>(getTableData, {
    defaultPageSize: 20,
    form,
  })

  useEffect(() => {
    let isUnmounted = false
    const fetchData = async () => {
      const res = await api.getRoleList() //获取用户信息

      if (!isUnmounted) {
        setRoleList(res.data)
      }
    }

    fetchData()
    return () => {
      isUnmounted = true
    }
  }, [])

  const { submit } = search || {}

  const onAdd = () => {
    // setTreeData({})
    // console.log(activeData)
    reSet()
    setIsAdd(true)
    setUserVisible(true)
  }

  const reSet = () => {
    formUser.resetFields()
  }
  const onEdit = (item: Store) => {
    console.log(item)
    let curUser: any = []
    curUser.push(item)
    setIsAdd(false)
    setTitle('编辑用户')
    item.roleId = item.roleList && item.roleList.length > 0 ? item.roleList[0].roleId : ''
    setSelectErpUserList(curUser)
    delete item.roleList
    formUser.setFieldsValue({ ...item })
    setUserVisible(true)
  }

  // const onChangeUser = e => {
  //   formUser.setFieldsValue({memberId: e.split('|')[0]})
  //   formUser.setFieldsValue({memberName: e.split('|')[2]})
  //   formUser.setFieldsValue({loginName: e.split('|')[1]})
  // }

  const onBlurUser = () => {
    setErpUserVisible(true)
  }

  const onDel = (item: IUser) => {
    confirm({
      title: '提示',
      content: '真的真的确认删除该班型？此操作不可恢复哦？',
      async onOk() {
        try {
          const res: any = await api.delUser(item.userId)
          console.log(res)
          if (res.code == 1) {
            refresh()
            message.success('删除成功')
          }
        } catch (err) {
          message.success('删除失败')
        }
      },
    })
  }

  const rowSelection = {
    onChange: (selectedRowKeys: any, selectedRows: any) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
    },
    onSelect: (record: any, selected: any, selectedRows: any) => {
      console.log(record, selected, selectedRows)
    },
    onSelectAll: (selected: any, selectedRows: any, changeRows: any) => {
      console.log(selected, selectedRows, changeRows)
    },
  }

  const saveUser = async () => {
    // setTitle('新增用户')
    let roleArr: any = []
    let userList: any = []
    let params = (formUser.getFieldValue as any)()
    roleArr.push(formUser.getFieldValue('roleId'))
    for (let i in selectErpUserList) {
      userList.push({
        loginName: selectErpUserList[i].loginName,
        memberId: selectErpUserList[i].memberId,
        memberName: selectErpUserList[i].memberName,
      })
    }
    if (userList.length == 0) {
      message.error('请至少填写一个用户')
      return
    }
    params.roleIdList = roleArr
    params.userList = userList

    await formUser.validateFields()
    setLoading(true)
    api
      .saveUser({ ...params })
      .then(res => {
        message.success('添加成功')
        setSelectErpUserList([])
        refresh()
        setLoading(false)
        setUserVisible(false)
      })
      .catch(err => {
        message.error(err.msg)
        setLoading(false)
      })
  }
  const onUserCancel = () => {
    setUserVisible(false)
  }

  const onErpUserCancel = () => {
    setErpUserVisible(false)
  }

  const closeUser = e => {
    console.log(e)
    const dataList = selectErpUserList.filter(item => item.memberId !== e.memberId)
    console.log(dataList)
    setSelectErpUserList(dataList)

    console.log(selectErpUserList)
    // setUserVisible(false)
  }
  const setSelectErpUser = (data: React.SetStateAction<any[]>) => {
    console.log(data)
    setSelectErpUserList(data)
    setErpUserVisible(false)
  }

  const columns: ColumnProps<IUser>[] = [
    {
      title: '用户ID',
      dataIndex: 'memberId',
      align: 'center',
      width: 200,
    },
    {
      title: '用户名称',
      dataIndex: 'memberName',
      align: 'center',
    },

    {
      title: '用户账号',
      dataIndex: 'loginName',
      align: 'center',
    },
    {
      title: '门店名称',
      dataIndex: 'compName',
      align: 'center',
    },

    {
      title: '角色',
      dataIndex: 'roleList',
      align: 'center',
      render: (a, row) => {
        let role: any = ''
        if (row.roleList && row.roleList.length > 0) {
          for (let i in row.roleList) {
            role = role + row.roleList[i].roleName + ','
          }

          return role
        } else {
          return '--'
        }
      },
    },

    {
      title: '状态',
      dataIndex: 'userState',
      align: 'center',
      render: (e: any) => {
        return e == '0' ? <Tag color="green">可用</Tag> : <Tag>禁用</Tag>
      },
    },

    {
      title: '操作',
      key: 'action',
      width: 230,
      align: 'center',
      render: (row: IUser) => (
        <div>
          <Button onClick={() => onEdit(row)} type="link">
            修改
          </Button>
          <Button onClick={() => onDel(row)} type="link">
            删除
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div>
      <ToolsBar visible={false}>
        <Form form={form} layout="inline">
          <Form.Item name="memberName">
            <Input placeholder="请输入用户名称" style={{ width: '150px' }} allowClear></Input>
          </Form.Item>
          <Form.Item name="loginName">
            <Input placeholder="请输入登录名称" style={{ width: '150px' }} allowClear></Input>
          </Form.Item>
          <Form.Item name="userState">
            <Select placeholder="用户状态" style={{ width: '150px' }} allowClear>
              <Select.Option value="1">禁用</Select.Option>
              <Select.Option value="0">启用</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="roleId">
            <Select placeholder="角色筛选" style={{ width: '150px' }} allowClear>
              {roleList.map((item, idx) => (
                <Select.Option value={item.roleId} key={idx}>
                  {item.roleName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" icon={<SearchOutlined />} onClick={submit}>
              搜索
            </Button>
          </Form.Item>
        </Form>
        <div>
          <Button type="primary" onClick={onAdd}>
            新增
          </Button>
          &nbsp;&nbsp;
          {/* <Button type="primary" onClick={refresh}>
            分配角色
          </Button> */}
          &nbsp;&nbsp;
          <Button onClick={refresh}>刷新</Button>
        </div>
      </ToolsBar>

      <Table
        columns={columns}
        rowSelection={rowSelection}
        rowKey="userId"
        {...tableProps}
        bordered
        pagination={{
          total: tableProps.pagination.total,
          showTotal: total => `共 ${total} 条`,
          pageSize: tableProps.pagination.pageSize,
          showSizeChanger: true,
        }}
      />
      <Modal title={title} visible={menuVisible} onOk={saveUser} onCancel={onUserCancel} destroyOnClose={true}>
        <Spin spinning={loading}>
          <Form form={formUser} initialValues={{ userState: '0', roleId: 8 }}>
            <Row>
              <Col span={24}>
                {isAdd ? (
                  <Form.Item name="memberName" label="ERP账户">
                    <Button type="ghost" onClick={onBlurUser}>
                      请选择用户
                    </Button>
                    {selectErpUserList.length > 0 && (
                      <div style={{ background: '#eee', padding: '5px', marginTop: '5px' }}>
                        {selectErpUserList.map((item, idx) => (
                          <Tag
                            closable
                            onClose={(e: any) => {
                              e.preventDefault()
                              closeUser(item)
                            }}
                            key={idx}
                            style={{ margin: '5px' }}>
                            {item.memberName}
                          </Tag>
                        ))}
                      </div>
                    )}
                  </Form.Item>
                ) : (
                    <Form.Item name="memberName" label="ERP账户">
                      <Input placeholder="ERP账户" disabled={true}></Input>
                    </Form.Item>
                  )}
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item name="roleId" label="用户角色" rules={[{ required: true, message: '用户角色必填' }]}>
                  <Radio.Group>
                    {roleList.map((item, idx) => (
                      <Radio value={item.roleId} key={idx}>
                        {item.roleName}
                      </Radio>
                    ))}
                  </Radio.Group>
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col span={24}>
                <Form.Item name="userState" label="用户状态">
                  <Radio.Group>
                    <Radio value="0">可用</Radio>
                    <Radio value="1">禁用</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Spin>
      </Modal>
      <Modal
        title="添加客户"
        visible={erpUserVisible}
        footer={null}
        onCancel={onErpUserCancel}
        width="650px"
        destroyOnClose={true}>
        <ErpUser setSelectErpUser={setSelectErpUser} />
      </Modal>
    </div>
  )
}

export default User
