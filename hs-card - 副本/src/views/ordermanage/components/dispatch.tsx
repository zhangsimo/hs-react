/** @format */

import React, {useState, useEffect} from 'react'
import '../style.less'
import {ColumnProps} from 'antd/lib/table'
import useAntdTable from '@/hooks/useAntdTable'
import {ITableResult} from '@/interface'
import {Form, Modal, Spin, Row, Col, message, DatePicker, Table, Tag} from 'antd'
// import { formatDate } from '@/interface/customer'
import Moment from 'moment'
import * as api from '@/api'
interface IProps {
  dispatchShow?
  onDispatchCancel?
  receiptPopData?
  onReceiptPaySuccess?
  selectDispatchData?
  onDispatchSucess?
}

const ServiceProgress: React.FC<IProps> = props => {
  const [form] = Form.useForm()
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([])
  const [allStaffList, setAllStaffList] = useState<Array<any>>([])
  const [selectStaffList, setSelectStaffList] = useState<any>([])
  const [current, setCurrent] = useState<Number>(0)
  const [loading, setLoading] = useState<boolean>(true)
  const [classCode, setClassCode] = useState<string>('')
  const [dispatchClassList, setDispatchClassList] = useState<any>()
  const [expectFinishDate, setExpectFinishDate] = useState<string>('')
  const [selectClass, setSelectClass] = useState<any>([])
  useEffect(() => {
    setLoading(false)
    if (props.dispatchShow) {
      let holdMansList: any = []
      props.selectDispatchData.holdMans.map((item, i) => holdMansList.push(item.holdManId))
      getClassList()
      form.resetFields()
      setSelectedRowKeys(holdMansList)
      queryAllMeberList(holdMansList)
    }
    setLoading(false)
  }, [props.dispatchShow])
  // useEffect(() => {
  //   console.log(props.selectDispatchData, '-----selectDispatchData')
  //   console.log(props.selectDispatchData.orderId, '-----selectDispatchData.orderId')
  // }, [props.selectDispatchData])

  const getClassList = () =>
    api.getOrderDetailClassList().then(res => {
      let data: any = res.data
      data.unshift({className: '全部'})
      setDispatchClassList(data)
    })

  const onMenuCancel = () => {
    props.onDispatchCancel(false)
  }
  //不分页获取全店可派工人员列表
  const queryAllMeberList = holdMansList => {
    api.getOrderDetailClassMeberList({page: 1, pageSize: 500}).then(res => {
      let list: any = res.data.items || []
      setAllStaffList(list)
      countSelectStaff(list, holdMansList)
    })
  }
  const getTableData = (tableParams, params) =>
    api
      .getOrderDetailClassMeberList({...api.formatParams(tableParams, params), ...{classCode: classCode}})
      .then(res => {
        return {
          list: res.data.items,
          total: res.data.total,
        }
      })

  const {tableProps, search} = useAntdTable<ITableResult<any>, any>(getTableData, {
    defaultPageSize: 10,
    form,
  })

  const rowSelection = {
    selectedRowKeys,
    onChange: selectedRowKeys => {
      setSelectedRowKeys(selectedRowKeys)
      countSelectStaff(allStaffList, selectedRowKeys)
    },
  }

  const countSelectStaff = (list, keys) => {
    let selectList: any = []
    if (list.length) {
      for (let i in keys) {
        for (let j in list) {
          if (list[j].membCode == keys[i]) {
            selectList.push(list[j])
          }
        }
      }
      setSelectStaffList(selectList)
    }
  }
  const closeSelectStaff = code => {
    const list = selectedRowKeys.filter(tag => tag !== code)
    setSelectedRowKeys(list)
    countSelectStaff(allStaffList, list)
  }

  const onMenuOk = () => {
    if (!expectFinishDate) {
      message.error('请选择预计完工时间')
      return
    }
    if (selectStaffList.length === 0) {
      message.error('请选择员工进行派工')
      return
    }
    //单人派工
    // let params = {
    //   captainId: selectClass && selectClass.classHeadId ? selectClass.classHeadId : '',
    //   captainName: selectClass && selectClass.classHead ? selectClass.classHead : '',
    //   expectFinishDate: expectFinishDate,
    //   holdMan: selectStaffList[0].membName,
    //   holdManId: selectStaffList[0].membCode,
    //   orderId: props.selectDispatchData.orderId,
    //   orderList: [
    //     {
    //       "childOrderId": props.selectDispatchData.childOrderId,
    //       "orderProductId": props.selectDispatchData.orderProductId
    //     }
    //   ],
    //   teamId: selectClass && selectClass.id ? selectClass.id : '',
    //   teamName: selectClass && selectClass.className ? selectClass.className : '',
    // }
    //多人派工
    console.log(556, selectedRowKeys, selectStaffList)
    let holdMansList: any = []
    for (let i in selectStaffList) {
      holdMansList.push({
        captainId: selectClass && selectClass.classCode ? selectClass.classCode : '',
        captainName: selectClass && selectClass.classHead ? selectClass.classHead : '',
        holdMan: selectStaffList[i].membName,
        holdManId: selectStaffList[i].membCode,
        teamId: selectClass && selectClass.id ? selectClass.id : '',
        teamName: selectClass && selectClass.className ? selectClass.className : '',
      })
    }
    let params = {
      expectFinishDate: expectFinishDate,
      orderId: props.selectDispatchData.orderId,
      orderList: [
        {
          childOrderId: props.selectDispatchData.childOrderId,
          holdMans: holdMansList,
          orderProductId: props.selectDispatchData.orderProductId,
        },
      ],
    }
    commitDispatch(params)
  }
  const commitDispatch = async params => {
    //单人派工：const res: any = await api.getOrderItemDispatch(params)
    //多人派工
    const res: any = await api.getOrderItemDispatchHolds(params)
    if (res.code === 1) {
      props.onDispatchSucess()
      onMenuCancel()
      dispathchSuccess(`已创建工单，工单号为${res.data}`)
    } else {
      message.error(res.msg)
    }
  }
  const dispathchSuccess = msg => {
    Modal.success({
      content: msg,
    })
  }
  const {submit} = search || {}
  const onSearch = () => {
    submit()
  }
  const onChange = e => {
    const dateFormat = 'YYYY-MM-DD HH:mm'
    setExpectFinishDate(Moment(e).format(dateFormat))
  }
  const clickClass = (o, index) => {
    setClassCode(o.classCode)
    setCurrent(index)
    setSelectClass(o)
    onSearch()
  }
  const columns: ColumnProps<any>[] = [
    {
      title: '工号',
      dataIndex: 'membCode',
      align: 'center',
      width: 180,
    },
    {
      title: '姓名',
      dataIndex: 'membName',
      align: 'center',
      width: 100,
    },
    {
      title: '部门',
      dataIndex: 'deptName',
      align: 'center',
    },
    {
      title: '岗位',
      dataIndex: 'dutyName',
      align: 'center',
    },
  ]
  const disabledDate = current => {
    // Can not select days before today and today
    return current && current < Moment().endOf('day')
  }

  return (
    <div className="dispatch">
      <Modal
        title="派工"
        visible={props.dispatchShow}
        onCancel={onMenuCancel}
        onOk={onMenuOk}
        width={800}
        getContainer={false}>
        <Spin spinning={loading}>
          <Form form={form}>
            <Row>
              <Col span={24}>
                <Form.Item name="orderId" label="预计完工时间" labelCol={{span: 4}}>
                  <DatePicker
                    format="YYYY-MM-DD HH:mm"
                    disabledDate={disabledDate}
                    showTime={{defaultValue: Moment('23:59', 'HH:mm')}}
                    onChange={onChange}
                    style={{width: '200px'}}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={5} style={{height: '40px', lineHeight: '40px', textAlign: 'center'}}>
                已派工:
              </Col>
              <Col span={18} style={{height: '40px', lineHeight: '40px', paddingLeft: '10px'}}>
                {selectStaffList.map(item => (
                  <Tag closable color="#108ee9" key={item.membCode} onClose={() => closeSelectStaff(item.membCode)}>
                    {item.membName}
                  </Tag>
                ))}
              </Col>
            </Row>
            <Row>
              <Col span={5}>
                {dispatchClassList && dispatchClassList.length > 0
                  ? dispatchClassList.map((o, index) => (
                      <div
                        className={`classli ${current === index ? 'classliActive' : ''}`}
                        onClick={() => clickClass(o, index)}>
                        {o.className}
                      </div>
                    ))
                  : ''}
              </Col>
              <Col span={18}>
                <Table
                  size="middle"
                  columns={columns}
                  {...tableProps}
                  rowSelection={rowSelection}
                  rowKey="membCode"
                  pagination={{
                    showSizeChanger: true,
                    total: tableProps.pagination.total,
                    current: tableProps.pagination.current,
                    showTotal: total => `共 ${total} 条`,
                    pageSize: tableProps.pagination.pageSize,
                  }}
                />
              </Col>
            </Row>
          </Form>
        </Spin>
      </Modal>
    </div>
  )
}

export default ServiceProgress
