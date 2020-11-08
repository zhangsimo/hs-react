/** @format */

import React, {useState, useEffect} from 'react'
import {Table, Button, Form, Input, Select, Layout, Modal, message} from 'antd'
import {ColumnProps} from 'antd/lib/table'
import useAntdTable from '@/hooks/useAntdTable'
import Edit from './Edit'
// import EditCategory from './EditCategory'
import ToolsBar from '@/components/ToolsBar'
import {IDictType} from '@/interface/system'
import * as api from '@/api'
import dayjs from 'dayjs'
// import ErrorBoundary from '@/components/ErrorBoundaries'
// import {useRequest} from '@umijs/hooks'
// import {ExclamationCircleOutlined} from '@ant-design/icons'
import DictTree from '@/components/dictTree'
// import Sider from 'antd/lib/layout/Sider'

const defaultCategory = 'sex'
const confirm = Modal.confirm

const Dict = () => {
  // const [visibleCategory, setVisibleCategory] = useState(false)
  const [visible, setVisible] = useState(false)
  const [activeUser, setActiveUser] = useState<IDictType>()
  // 选中的字典分类
  // const [activeCategory, setActiveCategory] = useState<IDictCategoryType>()
  // 选中的字典分类code
  const [activeCategoryCode, setActiveCategoryCode] = useState<string>(defaultCategory)
  // const [size, setSize] = useState<number>(1)

  const [form] = Form.useForm()

  // const {data: category, run: updateCategory} = useRequest(() =>
  //   api.getDictCategoryList({pageSize: 11, page: 1}).then(res => res.data),
  // )

  // useEffect(() => {
  //   let isUnmounted = false

  //   return () => {
  //     isUnmounted = true
  //   }
  // }, [size])

  const getTableData = (paginate, formData) => {
    if (activeCategoryCode) {
      return api.getDictList({...paginate, ...formData, dictType: activeCategoryCode}).then(res => {
        return {
          total: res.data.length,
          list: res.data,
        }
      })
    } else {
      return Promise.resolve({total: 0, list: []})
    }
  }

  // const onPage = async e => {
  //   console.log(e)
  //   await setSize(e)
  //   updateCategory()
  // }

  const {tableProps, search, refresh, run, pagination} = useAntdTable(getTableData, {
    defaultPageSize: 20,
    form,
    cacheKey: 'tableProps',
    manual: true,
  })

  const setDictCateId = (data: string) => {
    console.log(data)
    setActiveCategoryCode(data)
  }

  useEffect(() => {
    if (activeCategoryCode) {
      run({current: pagination.current, pageSize: pagination.pageSize})
    }
  }, [activeCategoryCode])

  const {submit} = search || {}

  const onAdd = (id = '0') => {
    setActiveUser(undefined)
    setVisible(true)
  }

  const onEdit = (item: IDictType) => {
    setActiveUser(item)
    setVisible(true)
  }

  const onDel = (item: IDictType) => {
    confirm({
      title: '提示',
      content: '真的真的确认删除该数据？此操作不可恢复哦？',
      async onOk() {
        try {
          const res: any = await api.delDictData(item.dictCode)
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

  const columns: ColumnProps<IDictType>[] = [
    {
      title: '编码',
      dataIndex: 'dictCode',
      align: 'center',
    },
    {
      title: '标签',
      dataIndex: 'dictLabel',
      align: 'center',
    },
    {
      title: '键值',
      dataIndex: 'dictValue',
      align: 'center',
    },
    {
      title: '默认',
      key: 'asDefault',
      align: 'center',
      render: (row: IDictType) => (row.asDefault === 'Y' ? '默认' : ''),
    },
    {
      title: '状态',
      key: 'status',
      align: 'center',
      render: (row: IDictType) => (row.status === '0' ? '正常' : '停用'),
    },
    {
      title: '备注',
      dataIndex: 'remark',
      align: 'center',
    },
    {
      title: '创建时间',
      key: 'createTime',
      render: (row: IDictType) => <span> {dayjs(row.create_time).format('YYYY-MM-DD')}</span>,
    },
    {
      title: '创建人',
      dataIndex: 'createBy',
      align: 'center',
    },
    {
      title: '更新时间',
      key: 'updateTime',
      align: 'center',
      render: (row: IDictType) => <span> {dayjs(row.create_time).format('YYYY-MM-DD')}</span>,
    },
    {
      title: '更新人',
      dataIndex: 'updateBy',
      align: 'center',
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      render: (row: IDictType) => (
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
      <Layout>
        <Layout.Sider style={{background: '#fff'}}>
          <DictTree setDictCateId={setDictCateId}></DictTree>
        </Layout.Sider>
        {/* <Layout.Sider width={200} style={{background: '#fff', borderRight: '1px solid #ddd'}}>
          <div style={{padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <Button.Group>
              <Button
                type="primary"
                onClick={() => {
                  setActiveCategory(undefined)
                  setVisibleCategory(true)
                }}>
                新增
              </Button>

              <Button
                onClick={() => {
                  setActiveCategory(category?.items.find(item => item.dictType === activeCategoryCode))
                  setVisibleCategory(true)
                }}>
                修改
              </Button>
            </Button.Group>
          </div>
          <ErrorBoundary>
            <Menu
              mode="inline"
              selectedKeys={[activeCategoryCode]}
              onClick={({key}) => {
                setActiveCategoryCode(key)
              }}
              style={{borderRight: 0, paddingBottom: '10px'}}>
              {category?.items?.map(item => (
                <Menu.Item key={item.dictType} className="flex">
                  <Dropdown
                    overlay={
                      <Menu>
                        <Menu.Item
                          onClick={() => {
                            setVisibleCategory(true)
                            setActiveCategory(category?.items?.find(a => a.dictType === item.dictType))
                          }}>
                          修改
                        </Menu.Item>
                        <Menu.Item
                          onClick={() => {
                            confirm({
                              title: '确定删除?',
                              icon: <ExclamationCircleOutlined />,
                              content: '删除了就没有了哦',
                              onOk() {
                                api
                                  .delDictType(item.dictId)
                                  .then((res: any) => {
                                    if (res.code == 1) {
                                      refreshType()
                                      message.success('删除成功')
                                    } else {
                                      message.success('删除失败')
                                    }
                                  })
                                  .catch(err => {
                                    message.success('删除失败')
                                  })
                              },
                              onCancel() {
                                message.info('感谢不删之恩')
                              },
                            })
                          }}>
                          删除
                        </Menu.Item>
                      </Menu>
                    }
                    trigger={['contextMenu']}>
                    <div style={{width: '100%'}}>{item.dictName}</div>
                  </Dropdown>
                </Menu.Item>
              ))}
              <Pagination
                simple
                total={category?.total}
                current={size}
                // defaultCurrent={category?.total}
                pageSize={11}
                showSizeChanger={false}
                onChange={onPage}
              />
            </Menu>
          </ErrorBoundary>
        </Layout.Sider> */}
        <Layout.Content style={{background: '#fff', margin: '0 20px 0'}}>
          <ToolsBar>
            <Form form={form} layout="inline" style={{paddingLeft: '10px'}}>
              <Form.Item name="dictLabel">
                <Input.Search placeholder="字典名称" onSearch={submit} />
              </Form.Item>
              <Form.Item name="status">
                <Select placeholder="字典状态" style={{width: '140px'}} allowClear onChange={submit}>
                  <Select.Option value="0">启用</Select.Option>
                  <Select.Option value="1">暂停</Select.Option>
                </Select>
              </Form.Item>
            </Form>
            <div style={{paddingRight: '10px'}}>
              <Button type="primary" onClick={() => onAdd()}>
                新增
              </Button>
              &nbsp;&nbsp;
              <Button onClick={refresh}>刷新</Button>
            </div>
          </ToolsBar>
          <div style={{background: '#fff', padding: '0 10px'}}>
            <Table
              expandable={{defaultExpandAllRows: true}}
              columns={columns}
              bordered
              rowKey="dictCode"
              {...tableProps}
            />
          </div>
        </Layout.Content>
      </Layout>

      <Edit visible={visible} data={activeUser} type={activeCategoryCode} setVisible={setVisible} onOK={refresh} />
    </div>
  )
}

export default Dict
