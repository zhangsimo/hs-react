/**
 * /* eslint-disable prettier/prettier
 *
 * @format
 */

import React, {useState, useEffect} from 'react'
// import {useRouteMatch} from 'react-router-dom'
import {Table, Button, Form, Input, Select, Modal, Spin, TreeSelect, Radio, Row, Col, message} from 'antd'
import {ColumnProps} from 'antd/lib/table'
import useAntdTable from '@/hooks/useAntdTable'
import './index.less'
// import Edit from './Edit'
import ToolsBar from '@/components/ToolsBar'
import * as api from '@/api'
import {IApp, ITableResult} from '@/interface'
import {SearchOutlined} from '@ant-design/icons'
import {Link} from 'react-router-dom'
// import {useBoolean} from '@umijs/hooks'
const {confirm} = Modal
const User = () => {
  const [form] = Form.useForm()
  const [formUser] = Form.useForm()
  const [menuVisible, setUserVisible] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [title, setTitle] = useState<string>('新增用户')
  const [roleList, setRoleList] = useState<any[]>([])
  const [erpUserList, setErpUserList] = useState<any[]>([])
  const [searchErpUserName, setSearchErpUserName] = useState<any[]>([])

  // const [value, setValue] = useState<any>()

  const getTableData = (tableParams, params) =>
    api.getAppList({...api.formatParams(tableParams, params)}).then(res => ({
      list: res.data,
      total: res.data.total,
    }))

  const {tableProps, search, refresh} = useAntdTable<ITableResult<IApp>, IApp>(getTableData, {
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

  useEffect(() => {
    let isUnmounted = false
    const fetchData = async () => {
      const params = {loginName: searchErpUserName}
      console.log(params)
      const res = await api.getErpUserList(params) //获取用户列表
      if (res.data && res.data.items && res.data.items.length > 0) {
        for (let i in res.data.items) {
          res.data.items[i].title = res.data.items[i].memberName + '--' + res.data.items[i].loginName
          res.data.items[i].value =
            res.data.items[i].memberId + '|' + res.data.items[i].loginName + '|' + res.data.items[i].memberName
        }
      }
      console.log(res.data.items)
      if (!isUnmounted) {
        console.log('=======')
        setErpUserList(res.data.items)
        console.log(erpUserList)
      }
    }

    fetchData()
    return () => {
      isUnmounted = true
    }
  }, [searchErpUserName])

  const {submit} = search || {}

  const onAdd = () => {
    // setTreeData({})
    // console.log(activeData)
    reSet()
    setUserVisible(true)
  }

  const reSet = () => {
    formUser.resetFields()
  }
  const onEdit = item => {
    console.log(item)
    setTitle('编辑用户')
    item.roleId = item.roleList && item.roleList.length > 0 ? item.roleList[0].roleId : ''
    delete item.roleList
    formUser.setFieldsValue({...item})
    setUserVisible(true)
  }

  const onChangeUser = e => {
    formUser.setFieldsValue({memberId: e.split('|')[0]})
    formUser.setFieldsValue({memberName: e.split('|')[2]})
    formUser.setFieldsValue({loginName: e.split('|')[1]})
  }

  const onDel = (item: IApp) => {
    confirm({
      title: '提示',
      content: '真的真的确认删除该班型？此操作不可恢复哦？',
      async onOk() {
        try {
          const res: any = await api.delUser(item.clientId)
          console.log(res)
          if (res.code == 1) {
            refresh()
            message.success('删除成功')
          }
        } catch (err) {
          message.error(err.msg)
        }
      },
    })
  }

  const saveUser = async () => {
    // setTitle('新增用户')
    let roleArr: any = []
    let params = (formUser.getFieldValue as any)()
    roleArr.push(formUser.getFieldValue('roleId'))

    params.roleIdList = roleArr

    await formUser.validateFields()
    setLoading(true)
    api
      .saveUser({...params})
      .then(res => {
        message.success('添加成功')
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

  const columns: ColumnProps<IApp>[] = [
    {
      title: '应用ID',
      dataIndex: 'id',
      align: 'center',
      width: 80,
    },
    {
      title: '应用名称',
      dataIndex: 'clientName',
      align: 'center',
    },

    {
      title: '应用编号',
      dataIndex: 'clientId',
      align: 'center',
    },

    {
      title: 'clientSecret',
      dataIndex: 'clientSecret',
      align: 'center',
    },
    {
      title: '访问域名',
      dataIndex: 'clientSecret',
      align: 'center',
    },

    {
      title: '操作',
      key: 'action',
      width: 250,
      align: 'center',
      render: (row: IApp) => (
        <div>
          <Link to="/app/appConfig">权限配置</Link>
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
            <Input placeholder="请输入应用名称" style={{width: '150px'}} allowClear></Input>
          </Form.Item>
          <Form.Item name="loginName">
            <Input placeholder="请输入登录名称" style={{width: '150px'}} allowClear></Input>
          </Form.Item>
          <Form.Item name="userState">
            <Select placeholder="用户状态" style={{width: '150px'}} allowClear>
              <Select.Option value="1">禁用</Select.Option>
              <Select.Option value="0">启用</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="roleId">
            <Select placeholder="角色筛选" style={{width: '150px'}} allowClear>
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
        rowKey="clientId"
        {...tableProps}
        bordered
        pagination={{
          total: tableProps.pagination.total,
          showTotal: total => `共 ${total} 条`,
          pageSize: tableProps.pagination.pageSize,
          showSizeChanger: true,
        }}
      />
      <Modal title={title} visible={menuVisible} onOk={saveUser} onCancel={onUserCancel}>
        <Spin spinning={loading}>
          <Form form={formUser} initialValues={{userState: '0', roleId: 8}}>
            <Row>
              <Col span={24}>
                <Form.Item name="memberName" label="ERP账户" rules={[{required: true, message: '用户名必填'}]}>
                  <TreeSelect
                    style={{width: '100%'}}
                    showSearch
                    // value={cur}
                    dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
                    treeData={erpUserList}
                    placeholder="请选择用户"
                    treeDefaultExpandAll
                    onSearch={(value: any) => setSearchErpUserName(value)}
                    onChange={onChangeUser}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item name="roleId" label="用户角色" rules={[{required: true, message: '用户角色必填'}]}>
                  <Radio.Group>
                    {/* {roleList.map((item, idx) => (
                      <Radio value={item.roleId} key={idx}>
                        {item.roleName}
                      </Radio>
                    ))} */}
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
    </div>
  )
}

export default User
