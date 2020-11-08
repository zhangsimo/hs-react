/** @format */

import React, {useState, useEffect} from 'react'
import ToolsBar from '@/components/ToolsBar'
import {Form, Input, Button, Table, message, Modal, AutoComplete, Select} from 'antd'
import * as api from '@/api'
import {SearchOutlined, SettingOutlined, UnorderedListOutlined, FormOutlined} from '@ant-design/icons'
import useAntdTable from '@/hooks/useAntdTable'
import {ITableResult} from '@/interface'
import {ColumnProps} from 'antd/lib/table'
import SelectComp from '@/components/Select/comp'
import {useBoolean, useRequest} from '@umijs/hooks'
import hasPermi from '@/components/directive'

const groupTypeList = [
  {id: 2, name: '已分组'},
  {id: 1, name: '未分组'},
]

const PageDataVipmember = () => {
  const [form] = Form.useForm()
  const isShowSet = useBoolean(false)
  const isShowUpdate = useBoolean(false)
  // const [compCode, setCompCode] = useState('')
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([])
  const [selectedRows, setSelectedRows] = useState<Array<any>>([])
  const [currCompCode, setCurrCompCode] = useState<string>('')
  const [nameStr, setNameStr] = useState<string>('')

  const getTableData = (tableParams, params) =>
    api.getMemberERP({...api.formatParams(tableParams, params)}).then(res => {
      setSelectedRowKeys([])
      setSelectedRows([])
      return {
        list: res.data.items,
        total: res.data.total,
      }
    })

  const {tableProps, search} = useAntdTable<ITableResult<any>, any>(getTableData, {
    defaultPageSize: 20,
    form,
  })
  const {submit} = search || {}
  const selectValidate = () => {
    if (!selectedRows.length) {
      message.warning('请先选择员工')
      return false
    }
    const compCodeDiffArr = selectedRows.filter((item, index, array) => {
      return item.compCode !== array[0].compCode
    })
    if (compCodeDiffArr.length > 0) {
      message.warning('只能选择同一家门店哦')
      return false
    }
    return true
  }

  const setGroup = () => {
    if (!selectValidate()) {
      return
    }
    const nameList = selectedRows.map(item => item.employeeName)
    setNameStr(nameList.join('、'))
    setCurrCompCode(selectedRows[0].compCode)
    isShowSet.setTrue()
  }

  const updateGroup = () => {
    if (!selectValidate()) {
      return
    }
    setCurrCompCode(selectedRows[0].compCode)
    isShowUpdate.setTrue()
  }

  const resetSelectRow = () => {
    setSelectedRowKeys([])
    setSelectedRows([])
  }

  const onChangeCompCode = value => {
    // setCompCode(value)
    form.setFieldsValue({memberCode: undefined})
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(selectedRowKeys)
      console.log(selectedRows)
      setSelectedRowKeys(selectedRowKeys)
      setSelectedRows(selectedRows)
    },
  }
  const onOk = obj => {
    const arr = selectedRows.map(item => {
      return {
        empGroupId: obj.id,
        employeeCode: item.employeeCode,
        employeeName: item.employeeName,
        employeePost: item.deptName,
      }
    })
    const params = {groupEmpDTOList: arr, ...obj}
    api.saveMemberGroup(params).then(res => {
      console.log(res)
      isShowSet.setFalse()
      message.success('分组成功')
      submit()
      resetSelectRow()
    })
  }

  const onUpdateOk = obj => {
    api.updateMemberGroupName({...obj}).then(res => {
      isShowUpdate.setFalse()
      message.success('修改成功')
      submit()
      resetSelectRow()
    })
  }

  const columns: ColumnProps<any>[] = [
    // {
    //   title: '序号',
    //   align: 'center',
    //   render: (text, record, index) => `${index + 1}`,
    // },
    {
      title: '小组ID',
      dataIndex: 'groupID',
      align: 'center',
    },
    {
      title: '小组名称',
      dataIndex: 'groupName',
      align: 'center',
    },
    {
      title: '员工姓名',
      dataIndex: 'employeeName',
      align: 'center',
    },
    {
      title: '员工工号',
      dataIndex: 'employeeCode',
      align: 'center',
    },
    {
      title: '所属职位',
      dataIndex: 'deptName',
      align: 'center',
    },
    {
      title: '所属门店',
      dataIndex: 'compName',
      align: 'center',
    },
    {
      title: '状态',
      dataIndex: 'paymentTime',
      align: 'center',
      render: (value, row) => (row.type === 2 ? '已分组' : '未分组'),
    },
    // {
    //   title: '操作',
    //   align: 'center',
    //   render: (value, row) => {
    //     return <Button type="link">日志</Button>
    //   },
    // },
  ]
  return (
    <>
      <ToolsBar>
        <Form layout="inline" form={form}>
          <Form.Item name="compCode">
            <SelectComp
              showSearch
              allowClear
              placeholder="选择门店"
              filterOption={(input, option) => option?.children.indexOf(input) >= 0}
              onChange={onChangeCompCode}
            />
          </Form.Item>
          <Form.Item name="employeeName">
            <Input placeholder="员工姓名" allowClear></Input>
          </Form.Item>
          <Form.Item name="jobNo">
            <Input placeholder="员工工号" allowClear></Input>
          </Form.Item>
          <Form.Item name="groupName">
            <Input placeholder="小组名称" allowClear></Input>
          </Form.Item>
          <Form.Item name="type">
            <Select allowClear placeholder="分组状态" style={{width: 150}}>
              {groupTypeList.map(item => (
                <Select.Option value={item.id}>{item.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={() => submit()}
              disabled={hasPermi('member:list:search')}>
              搜索
            </Button>
            <Button
              type="primary"
              icon={<SettingOutlined />}
              onClick={() => {
                form.resetFields()
              }}
              disabled={hasPermi('member:list:reset')}
              style={{marginLeft: '18px'}}>
              重置
            </Button>
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              icon={<UnorderedListOutlined />}
              onClick={setGroup}
              style={{background: '#304156', color: '#fff', border: '1px solid #304156'}}
              disabled={hasPermi('member:list:group')}>
              员工分组
            </Button>

            <Button
              type="primary"
              icon={<FormOutlined />}
              onClick={updateGroup}
              style={{marginLeft: '18px', background: '#304156', color: '#fff', border: '1px solid #304156'}}
              disabled={hasPermi('member:list:editGroupName')}>
              修改组名
            </Button>
          </Form.Item>
        </Form>
      </ToolsBar>
      <div style={{backgroundColor: 'white', marginTop: '12px'}}>
        <Table
          size="middle"
          rowSelection={rowSelection}
          columns={columns}
          {...tableProps}
          rowKey="employeeCode"
          pagination={{
            showSizeChanger: true,
            total: tableProps.pagination.total,
            current: tableProps.pagination.current,
            showTotal: total => `共 ${total} 条`,
            pageSize: tableProps.pagination.pageSize,
          }}
        />
      </div>
      <SetGroupMadal
        isShowSet={isShowSet.state}
        nameStr={nameStr}
        onOk={onOk}
        onCancel={() => isShowSet.setFalse()}
        compCode={currCompCode}
      />
      <UpdateGroupMadal
        isShowUpdate={isShowUpdate.state}
        onOk={onUpdateOk}
        onCancel={() => isShowUpdate.setFalse()}
        compCode={currCompCode}
      />
    </>
  )
}

export default PageDataVipmember

const SetGroupMadal = props => {
  console.log(1)
  const [options, setOptions] = useState([])
  const [currGroup, setCurrGroup] = useState<string>('')
  // const [selectList, setSelectList] = useState<Array<any>>([])
  const {data, run} = useRequest(() => api.getCompGroupMember({compCode: props.compCode}).then(res => res.data), {
    manual: true,
  })

  useEffect(() => {
    setOptions(data?.map(item => ({value: item.name})))
  }, [data])

  useEffect(() => {
    // debugger
    if (props.compCode || props.isShowSet) {
      run()
    }
  }, [props.compCode, props.isShowSet])

  const onOk = () => {
    props.onOk({
      id: '',
      name: currGroup,
      compCode: props.compCode,
    })
  }
  const onSelectChange = val => {
    setCurrGroup(val)
  }

  const onSelect = (data: string) => {
    console.log('onSelect', data)
  }

  return (
    <Modal title="选择分组" centered destroyOnClose visible={props.isShowSet} onOk={onOk} onCancel={props.onCancel}>
      <Form>
        <Form.Item label="已选择员工：">
          <span>{props.nameStr}</span>
        </Form.Item>
        <Form.Item label="选择小组：">
          <AutoComplete
            options={options}
            placeholder="请选择或输入小组"
            allowClear
            onSelect={onSelect}
            onChange={onSelectChange}></AutoComplete>
        </Form.Item>
      </Form>
    </Modal>
  )
}

const UpdateGroupMadal = props => {
  console.log(2)
  const [form] = Form.useForm()
  // const [selectList, setSelectList] = useState<Array<any>>([])
  const {data, run} = useRequest(() => api.getCompGroupMember({compCode: props.compCode}).then(res => res.data), {
    manual: true,
  })

  useEffect(() => {
    if (props.compCode || props.isShowUpdate) {
      run()
    }
  }, [props.compCode, props.isShowUpdate])

  const onOk = () => {
    props.onOk((form.getFieldValue as any)())
  }
  // const onSelectChange = val => {
  //   setCurrGroup(val)
  // }

  const onSelect = (data: string) => {
    console.log('onSelect', data)
  }

  return (
    <Modal title="修改组名" centered destroyOnClose visible={props.isShowUpdate} onOk={onOk} onCancel={props.onCancel}>
      <Form form={form}>
        <Form.Item name="groupId" label="原小组名：">
          <Select onSelect={onSelect}>
            {data?.map(item => (
              <Select.Option value={item.id}>{item.name}</Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="groupName" label="新小组名：">
          <Input placeholder="小组名称"></Input>
        </Form.Item>
      </Form>
    </Modal>
  )
}
