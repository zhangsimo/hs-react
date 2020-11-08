/**
 * /* eslint-disable prettier/prettier
 *
 * @format
 */

/** @format */

import React, {useState, useEffect} from 'react'
// import {useRouteMatch} from 'react-router-dom'
import {Table, Button, Form, Input, Select, Modal, Spin, Row, Col, message, InputNumber, Tree, Tag, Radio} from 'antd'
import {ColumnProps} from 'antd/lib/table'
import useAntdTable from '@/hooks/useAntdTable'
import './index.less'
// import Edit from './Edit'
import ToolsBar from '@/components/ToolsBar'
import * as api from '@/api'
import {IUser, ITableResult} from '@/interface'
import {SearchOutlined} from '@ant-design/icons'
// import {useBoolean} from '@umijs/hooks'
const {confirm} = Modal
const Role = () => {
  // const visible = useBoolean(false)
  // const [activeData, setActiveData] = useState<IUser>()
  const [form] = Form.useForm()
  const [formRole] = Form.useForm()
  const [roleVisible, setRoleVisible] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [title, setTitle] = useState<string>('新增角色')
  const [menuList, setMenuList] = useState<any[]>([])
  const [curDsscope, setCurDsscope] = useState<any>()

  const [selectMenuList, setSelectMenuList] = useState<string[]>([]) //
  // const [selectMenuListResult, setSelectMenuListResult] = useState<string[]>([]) //半勾选状态

  // const [selectedKeys, setSelectedKeys] = useState<string[]>([])
  // const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true)
  const {TextArea} = Input

  const getTableData = (tableParams, params) =>
    api.getRoleListPage({...api.formatParams(tableParams, params)}).then(res => ({
      list: res.data.items,
      total: res.data.total,
    }))

  const {tableProps, search, refresh} = useAntdTable<ITableResult<IUser>, IUser>(getTableData, {
    defaultPageSize: 20,
    form,
  })

  useEffect(() => {
    let isUnmounted = false
    const fetchData = async () => {
      const res = await api.getMenuListAll() //获取所有菜单
      if (!isUnmounted) {
        let data = res.data
        for (let i in data) {
          let children = data[i].children
          data[i].title = data[i].menuName
          data[i].key = data[i].menuId
          for (let j in children) {
            let children2 = children[j].children
            children[j].title = children[j].menuName
            children[j].key = children[j].menuId
            for (let m in children2) {
              children2[m].title = children2[m].menuName
              children2[m].key = children2[m].menuId
            }
          }
        }
        console.log(res.data)
        setMenuList(res.data)
        // setSearchErpUserName([])
      }
    }

    fetchData()
    return () => {
      isUnmounted = true
    }
  }, [])

  const {submit} = search || {}

  const onAdd = () => {
    setTitle('新增角色')
    reSet()
    setRoleVisible(true)
  }

  const reSet = () => {
    formRole.resetFields()
  }
  const onEdit = item => {
    console.log(item)
    setTitle('编辑角色')
    reSet()
    let idx: any = []
    if (item.menuList && item.menuList.length > 0) {
      for (let i in item.menuList) {
        idx.push(item.menuList[i].menuId)
      }
    }
    console.log(idx)
    setSelectMenuList(idx)
    formRole.setFieldsValue({...item})
    setRoleVisible(true)
  }

  const onDel = (item: IUser) => {
    confirm({
      title: '提示',
      content: '真的真的确认删除该数据？此操作不可恢复哦？',
      async onOk() {
        try {
          const res: any = await api.delRole(item.roleId)
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

  const saveRole = async () => {
    // let roleArr: any = []
    let params = (formRole.getFieldValue as any)()
    // roleArr.push(formRole.getFieldValue('roleId'))

    // params.roleIdList = roleArr
    params.menuIds = selectMenuList

    await formRole.validateFields()
    setLoading(true)
    api
      .saveRole({...params})
      .then(res => {
        if (params.roleId) {
          message.success('修改成功')
        } else {
          message.success('添加成功')
        }
        refresh()
        setLoading(false)
        setRoleVisible(false)
      })
      .catch(err => {
        message.error(err.msg)
        setLoading(false)
      })
  }
  const onRoleCancel = () => {
    setRoleVisible(false)
  }

  const onCheck = (checkedKeys, info) => {
    console.log('onCheck', checkedKeys)
    // let checkedKeys = checkedKeys.checked
    console.log('onCheck2', info)
    let data: any = info
    // let checkedKeysResult = [...checkedKeys, ...info.halfCheckedKeys]
    // console.log('onCheck', checkedKeysResult)
    if (!data.checked) {
      let idx: any = []
      for (let i in data.checkedNodes) {
        if (data.checkedNodes[i].parentId != data.node.id) {
          idx.push(data.checkedNodes[i].id)
        }
      }
      console.log('-------', idx)
      setSelectMenuList(idx)
    } else {
      // if (data.node.parentId) {
      //   let idx: any = []
      //   idx.push(data.node.parentId)
      //   console.log(idx)
      //   let checkedKeysResult = [...idx, ...checkedKeys.checked]
      //   setSelectMenuList(checkedKeysResult)
      // } else {
      //   setSelectMenuList(checkedKeys.checked)
      // }

      setSelectMenuList(checkedKeys.checked)
    }

    // setSelectMenuListResult(checkedKeysResult)
  }

  const onchangeScope = e => {
    console.log(e)
    setCurDsscope(e)
  }

  const columns: ColumnProps<IUser>[] = [
    {
      title: '角色编号',
      dataIndex: 'roleId',
      align: 'center',
      width: 100,
    },
    {
      title: '角色名称',
      dataIndex: 'roleName',
      align: 'center',
    },

    {
      title: '角色编号',
      dataIndex: 'roleCode',
      align: 'center',
    },
    {
      title: '角色顺序',
      dataIndex: 'sortNum',
      align: 'center',
    },
    {
      title: '角色描述',
      dataIndex: 'roleDesc',
      align: 'center',
    },
    {
      title: '状态',
      dataIndex: 'delFlag',
      align: 'center',
      render: (e: any) => {
        return e == '0' ? <Tag color="green">启用</Tag> : <Tag>禁用</Tag>
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 250,
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
          <Form.Item name="roleName">
            <Input placeholder="请输入角色名称" style={{width: '150px'}} allowClear></Input>
          </Form.Item>
          <Form.Item name="roleCode">
            <Input placeholder="请输入权限字符" style={{width: '150px'}} allowClear></Input>
          </Form.Item>
          <Form.Item name="delFlag">
            <Select placeholder="角色状态" style={{width: '150px'}} allowClear>
              <Select.Option value="1">禁用</Select.Option>
              <Select.Option value="0">启用</Select.Option>
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
          <Button onClick={refresh}>刷新</Button>
        </div>
      </ToolsBar>

      <Table
        columns={columns}
        rowKey="roleId"
        {...tableProps}
        bordered
        pagination={{
          total: tableProps.pagination.total,
          showTotal: total => `共 ${total} 条`,
          pageSize: tableProps.pagination.pageSize,
          showSizeChanger: true,
        }}
      />
      <Modal title={title} visible={roleVisible} onOk={saveRole} onCancel={onRoleCancel}>
        <Spin spinning={loading}>
          <Form form={formRole} initialValues={{sortNum: 0, delFlag: '0'}}>
            <Row>
              <Col span={24}>
                <Form.Item name="roleName" label="角色名称" rules={[{required: true, message: '角色名称必填'}]}>
                  <Input placeholder="请输入角色名称" allowClear></Input>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item name="roleCode" label="权限字符" rules={[{required: true, message: '权限字符必填'}]}>
                  <Input placeholder="请输入权限字符" allowClear></Input>
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col span={24}>
                <Form.Item name="sortNum" label="角色排序" rules={[{required: true, message: '角色排序必填'}]}>
                  <InputNumber min={0} style={{width: '100%'}} />
                  {/* <Radio.Group>
                    <Radio value="0">可用</Radio>
                    <Radio value="1">禁用</Radio>
                  </Radio.Group> */}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item name="dsScope" label="权限范围">
                  <Select placeholder="请选择权限范围" allowClear onChange={onchangeScope}>
                    <Select.Option value={1}>全部数据权限</Select.Option>
                    <Select.Option value={2}>自定义数据权限</Select.Option>
                    <Select.Option value={3}>本部门数据权限</Select.Option>
                    <Select.Option value={4}>本部门以及以下数据权限</Select.Option>
                    <Select.Option value={5}>仅本人数据权限</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            {curDsscope === 2 ? (
              <Row>
                <Col span={24}>
                  <Form.Item name="dsScope" label="数据权限">
                    <Select placeholder="请选择公司" allowClear>
                      <Select.Option value="1">全部数据权限</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            ) : null}

            <Row>
              <Col span={24}>
                <Form.Item name="menuList" label="菜单权限">
                  <Tree
                    checkable
                    checkStrictly
                    // expandedKeys={expandedKeys}
                    // autoExpandParent={autoExpandParent}
                    onCheck={onCheck}
                    checkedKeys={selectMenuList}
                    // onSelect={onSelect}
                    // selectedKeys={selectedKeys}
                    treeData={menuList}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item name="delFlag" label="角色状态">
                  <Radio.Group>
                    <Radio value="0">可用</Radio>
                    <Radio value="1">禁用</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col span={24}>
                <Form.Item name="roleDesc" label="描述">
                  <TextArea rows={3} />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Spin>
      </Modal>
    </div>
  )
}

export default Role
