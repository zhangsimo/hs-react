/**
 * /* eslint-disable prettier/prettier
 *
 * @format
 */

/** @format */

import React, {useState, useEffect} from 'react'
// import {useRouteMatch} from 'react-router-dom'
import {
  Table,
  Button,
  Form,
  Input,
  Select,
  Modal,
  Spin,
  TreeSelect,
  Radio,
  Row,
  Col,
  InputNumber,
  Tag,
  message,
} from 'antd'
import {ColumnProps} from 'antd/lib/table'
import useAntdTable from '@/hooks/useAntdTable'
import './index.less'
import ToolsBar from '@/components/ToolsBar'
import * as api from '@/api'
import {IMenuDetails, ITableResult} from '@/interface'
import IconSelect from '@/components/IconSelect/index'
// import hasPermi from '@/components/directive'
import * as allIcons from '@ant-design/icons/es'
import {CLIENTID} from '@/config'

// import {useBoolean} from '@umijs/hooks'
import {SearchOutlined} from '@ant-design/icons'
const {confirm} = Modal
const Menu = () => {
  // const visible = useBoolean(false)
  const [form] = Form.useForm()
  const [formMenu] = Form.useForm()
  const [menuVisible, setMenuVisible] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [title, setTitle] = useState<string>('新增菜单')
  const [treeData, setTreeData] = useState<any>()
  const [curMenu, setCurMenu] = useState<any>({parentId: null})
  const [curMenuType, setCurMenuType] = useState<string>('C')
  const [isLoadData, setIsLoadData] = useState<boolean>(false)
  const [curIcon, setIconToChild] = useState<string>('')

  const getTableData = (tableParams, params) =>
    api.getMenuList({...api.formatParams(tableParams, params)}).then(res => ({
      list: res.data,
    }))

  const {tableProps, search, refresh} = useAntdTable<ITableResult<IMenuDetails>, IMenuDetails>(getTableData, {
    defaultPageSize: 20,
    form,
  })

  useEffect(() => {
    //获取所有
    let isUnmounted = false
    const fetchData = async () => {
      const res = await api.getMenuListAll()
      if (!isUnmounted) {
        let data = res.data
        for (let i in data) {
          let children = data[i].children
          data[i].title = data[i].menuName
          data[i].value = data[i].menuId
          for (let j in children) {
            let children2 = children[j].children
            children[j].title = children[j].menuName
            children[j].value = children[j].menuId
            for (let m in children2) {
              children2[m].title = children2[m].menuName
              children2[m].value = children2[m].menuId
            }
          }
        }
        setTreeData(res.data)
      }
    }

    fetchData()
    return () => {
      isUnmounted = true
    }
  }, [isLoadData])

  const {submit} = search || {}

  const onAdd = () => {
    reSet()
    setCurMenu({parentId: null})
    setMenuVisible(true)
  }

  const reSet = () => {
    formMenu.resetFields()
  }
  const onEdit = (item: IMenuDetails) => {
    console.log(item)
    setTitle('编辑菜单')
    setCurMenu(item)
    setCurMenuType(item.type)
    setIconToChild(item.icon)
    let aa = {...item}
    console.log(aa, typeof aa, '-----{...aa}')
    formMenu.setFieldsValue({...item})
    setMenuVisible(true)
  }

  const onDel = (item: IMenuDetails) => {
    confirm({
      title: '提示',
      content: '真的真的确认删除该数据？此操作不可恢复哦？',
      async onOk() {
        try {
          const res: any = await api.delMenu(item.menuId)
          console.log(res)
          if (res.code == 1) {
            refresh()
            setIsLoadData(!isLoadData)
            message.success('删除成功')
          }
        } catch (err) {
          message.success('删除失败')
        }
      },
      onCancel() {},
    })
  }

  const addMenu = async () => {
    // let roleArr: any = []
    let params = (formMenu.getFieldValue as any)()
    params.clientId = CLIENTID
    params.assemblyUrl = params.assemblyUrl?.trim()
    params.pageRouteUrl = params.pageRouteUrl?.trim()
    await formMenu.validateFields()
    setLoading(true)
    api
      .saveMenu({...params})
      .then(res => {
        message.success('添加成功')
        refresh()
        reSet()
        setLoading(false)
        setMenuVisible(false)
        setIsLoadData(!isLoadData)
      })
      .catch(err => {
        message.error(err.msg)
        reSet()
        setLoading(false)
      })
  }
  const onMenuCancel = () => {
    reSet()
    setMenuVisible(false)
  }
  const onChangeTree = () => {}

  const onchangeMenuType = e => {
    // curMenu.type = e.target.value
    setCurMenuType(e.target.value)
  }

  const setIcon = e => {
    formMenu.setFieldsValue({icon: e})
  }

  const columns: ColumnProps<IMenuDetails>[] = [
    {
      title: '菜单名称',
      dataIndex: 'menuName',
    },
    {
      title: '图标',
      dataIndex: 'icon',
      align: 'center',
      render: (e: any) => {
        if (e) {
          const newIcon = allIcons[e]
          return React.createElement(newIcon, null)
        } else {
          return ''
        }
      },
    },
    {
      title: '类型',
      dataIndex: 'type',
      align: 'center',
      render: (a, row) => {
        let time: any = ''
        if (row.type == 'C') {
          time = '目录'
        } else if (row.type == 'M') {
          time = '菜单'
        } else if (row.type == 'B') {
          time = '按钮'
        }
        return time
      },
    },
    {
      title: '排序',
      dataIndex: 'sortNum',
      align: 'center',
    },
    {
      title: '权限标识',
      dataIndex: 'permissionCode',
      align: 'center',
    },
    {
      title: '路由地址',
      dataIndex: 'pageRouteUrl',
      // render: (row: IMenuDetails) => {},
    },
    {
      title: '组件路径',
      dataIndex: 'assemblyUrl',
    },

    {
      title: '可见',
      dataIndex: 'menuState',
      align: 'center',
      render: (e: any) => {
        return e == '0' ? <Tag color="green">显示</Tag> : <Tag>隐藏</Tag>
      },
    },

    {
      title: '操作',
      key: 'action',
      align: 'center',
      render: (row: IMenuDetails) => (
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
          <Form.Item name="menuName">
            <Input placeholder="请输入菜单名称" style={{width: '150px'}} allowClear></Input>
          </Form.Item>
          <Form.Item name="menuState">
            <Select placeholder="菜单状态" style={{width: '150px'}} allowClear>
              {/* //onChange={submit} */}
              <Select.Option value="0">显示</Select.Option>
              <Select.Option value="1">隐藏</Select.Option>
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

      <Table columns={columns} rowKey="menuId" {...tableProps} bordered />
      <Modal title={title} visible={menuVisible} onOk={addMenu} onCancel={onMenuCancel} width={720}>
        <Spin spinning={loading}>
          <Form form={formMenu} initialValues={{type: 'C', menuState: '0', sortNum: 0}}>
            {/* <Row>
              <Col span={24}>
                <Form.Item name="clientId" label="应用平台">
                  <Select placeholder="应用平台" allowClear>
                    {roleList.map((item, idx) => (
                      <Select.Option value={item.roleId} key={idx}>
                        {item.roleName}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row> */}
            {curMenu.parentId !== -1 ? (
              <Row>
                <Col span={24}>
                  <Form.Item name="parentId" label="上级菜单">
                    <TreeSelect
                      style={{width: '100%'}}
                      dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
                      treeData={treeData}
                      placeholder="请选择上级菜单"
                      onChange={onChangeTree}
                    />
                  </Form.Item>
                </Col>
              </Row>
            ) : null}

            <Row>
              <Col span={24}>
                <Form.Item name="type" label="菜单类型">
                  <Radio.Group onChange={onchangeMenuType}>
                    <Radio value="C">目录</Radio>
                    <Radio value="M">菜单</Radio>
                    <Radio value="B">按钮</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
            </Row>

            {curMenuType !== 'B' ? (
              <Row>
                <Col span={24}>
                  <Form.Item name="icon" label="菜单图标">
                    <IconSelect type={curIcon} setIcon={setIcon}></IconSelect>
                  </Form.Item>
                </Col>
              </Row>
            ) : null}

            <Row>
              <Col span={12}>
                <Form.Item name="menuName" label="菜单名称" rules={[{required: true, message: '菜单名称必填'}]}>
                  <Input placeholder="请输入菜单名称" allowClear></Input>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="sortNum" label="排序">
                  <InputNumber placeholder="请输入排序" min={0} style={{width: '100%'}} />
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col span={12}>
                {curMenuType == 'B' ? (
                  <Form.Item name="permissionCode" label="权限标识">
                    <Input placeholder="请输入权限标识" allowClear></Input>
                  </Form.Item>
                ) : (
                  <Form.Item name="pageRouteUrl" label="路由地址" rules={[{required: true, message: '路由地址必填'}]}>
                    <Input placeholder="请输入路由地址" allowClear disabled={curMenuType === 'B'}></Input>
                  </Form.Item>
                )}
              </Col>
              <Col span={12}>
                {curMenuType === 'M' ? (
                  <Form.Item name="assemblyUrl" label="组件路径">
                    <Input placeholder="请输入组件路径" allowClear></Input>
                  </Form.Item>
                ) : null}
              </Col>
            </Row>

            <Row>
              <Col span={24}></Col>
            </Row>

            <Row>
              <Col span={24}>
                <Form.Item name="menuState" label="菜单状态">
                  <Radio.Group>
                    <Radio value="0">显示</Radio>
                    <Radio value="1">隐藏</Radio>
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

export default Menu
