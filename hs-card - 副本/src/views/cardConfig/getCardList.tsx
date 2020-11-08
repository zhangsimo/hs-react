/** @format */

import React, { useState, useEffect } from 'react'
import { ColumnProps } from 'antd/lib/table'
import { Table, Button, Form, Input, message, Modal, Select } from 'antd'
import ToolsBar from '@/components/ToolsBar'
import { SearchOutlined, SettingOutlined, DownloadOutlined } from '@ant-design/icons'

import './index.less'
import useAntdTable from '@/hooks/useAntdTable'
import { ICardGetDetails, ITableResult } from '@/interface'
import * as api from '@/api'
// import SelectArea from '@/components/Select/area'
import SelectComp from '@/components/Select/comp'

import useSearchParam from '@/hooks/useSearchParam'
// import {veriWayFormat} from './_common/index'
// import * as Moment from 'moment'
import 'moment/locale/zh-cn'
import Dist from '@/components/Select/dict'
import hasPermi from '@/components/directive'
// import {useCaseFormat} from './_common/index'

const size = undefined
// const dateFormat = 'YYYY-MM-DD'

// const tableHeight = {y: document.body.clientHeight - 320}
const PageDateGetCaradList = () => {
  // const [areaId, setAreaId] = useState<string>('')
  // const [curOptObj] = useState<any>({title: '', type: ''})
  // const [visible, setVisible] = useState<boolean>(false)
  const [veriVisible, setVeriVisible] = useState<boolean>(false)
  const [shopVisible, setShopVisible] = useState<boolean>(false)


  const [selectDataList, setSelectDataList] = useState<any[]>([])
  const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([])
  const [selectedRow, setSelectedRow] = useState<any[]>([])
  const [brandList, setBrandList] = useState<any[]>([])

  const [form] = Form.useForm()
  const [shopform] = Form.useForm()


  let cardCode = useSearchParam('cardCode')
  // let isEdit = useSearchParam('isEdit')

  let apiUrl: any = ''
  if (cardCode) {
    apiUrl = api.getcardGetList
  } else {
    apiUrl = api.getCardListPage
  }

  const getTableData = (tableParams, params) =>
    apiUrl({
      ...api.formatParams(tableParams, { ...params, cardCode: cardCode, recordCardCode: form.getFieldValue('cardCode') }),
    }).then(res => ({
      list: res.data.items,
      total: res.data.total,
    }))

  const { tableProps, search } = useAntdTable<ITableResult<ICardGetDetails>, ICardGetDetails>(getTableData, {
    defaultPageSize: 20,
    form,
  })

  useEffect(() => {
    let isUnmounted = false
      ; (async () => {
        const data = await api.getBrandList()
        console.log(data)
        if (!isUnmounted) {
          setBrandList(data.data)
        }
      })()
    return () => {
      isUnmounted = true
    }
  }, [])

  const onSelectChange = (selectedRowKeys, selectedRow) => {
    console.log(selectedRowKeys)
    setSelectedRowKeys(selectedRowKeys)
    setSelectedRow(selectedRow)
  }

  const rowSelection = {
    selectedRowKeys: selectedRowKeys,
    onChange: onSelectChange,
  }

  const { submit } = search || {}

  const reSet = () => {
    form.resetFields()
  }

  const okVeriCard = () => {
    let cardCode: any = []
    if (selectDataList.length == 0) {
      message.error('不能为空')
      return
    }
    for (let i in selectDataList) {
      let arr = selectDataList[i].codeList
      for (let j in arr) {
        cardCode.push(arr[j])
      }
    }
    let params = {
      cardCode: cardCode,
    }
    api
      .veriCard(params)
      .then(res => {
        message.success('核销成功')
        setVeriVisible(false)
      })
      .catch(err => {
        message.error(err.msg)
      })
  }

  const cancel = () => {
    setVeriVisible(false)
  }




  // const onChangeAreaCode = value => {
  //   setAreaId(value)
  //   // form.setFieldsValue({compCodes: null})
  // }

  const veriCard = value => {
    if (selectedRowKeys.length == 0) {
      message.error('请至少选择一个项目')
      return
    }

    let arr: any = []
    let cardUseAndVeri: number = 0
    let cardUseAndNoVeri: number = 0
    let cardNoUseAndVeri: number = 0
    let cardNoUseAndNoVeri: number = 0

    // let cardUseList: any = [] //已使用，已核销
    let cardUseAndVeriList: any = [] //已使用，已核销
    let cardUseAndNoVeriList: any = [] //已使用，未核销

    let cardNoUseAndVeriList: any = [] //待使用，已核销
    let cardNoUseAndNoVeriList: any = [] //待使用，未核销

    for (let i in selectedRow) {
      console.log(selectedRow[i])
      if (selectedRow[i].cardStatus == '已使用' && selectedRow[i].veriStatus == '已核销') {
        cardUseAndVeri++
        cardUseAndVeriList.push(selectedRow[i].cardCode)
        arr[0] = {
          id: 0,
          cardStatus: '已使用',
          veriStatus: selectedRow[i].veriStatus,
          cardNum: cardUseAndVeri,
          codeList: cardUseAndVeriList,
        }
      }

      if (selectedRow[i].cardStatus == '已使用' && selectedRow[i].veriStatus == '未核销') {
        cardUseAndNoVeri++
        cardUseAndNoVeriList.push(selectedRow[i].cardCode)
        arr[1] = {
          id: 1,
          cardStatus: '待使用',
          veriStatus: selectedRow[i].veriStatus,
          cardNum: cardUseAndNoVeri,
          codeList: cardUseAndNoVeriList,
        }
      }

      if (selectedRow[i].cardStatus == '待使用' && selectedRow[i].veriStatus == '已核销') {
        cardNoUseAndVeri++
        cardNoUseAndVeriList.push(selectedRow[i].cardCode)
        arr[2] = {
          id: 2,
          cardStatus: '待使用',
          veriStatus: selectedRow[i].veriStatus,
          cardNum: cardNoUseAndVeri,
          codeList: cardNoUseAndVeriList,
        }
      }

      if (selectedRow[i].cardStatus == '待使用' && selectedRow[i].veriStatus == '未核销') {
        cardNoUseAndNoVeri++
        cardNoUseAndNoVeriList.push(selectedRow[i].cardCode)
        arr[3] = {
          id: 3,
          cardStatus: '待使用',
          veriStatus: selectedRow[i].veriStatus,
          cardNum: cardNoUseAndNoVeri,
          codeList: cardNoUseAndNoVeriList,
        }
      }
    }
    console.log(arr)
    setSelectDataList(arr)
    setVeriVisible(true)
  }

  // const renderOptions = () => {
  //   return selectChannelList.map(item => (
  //     <Select.Option key={item.channel} value={item.cardId}>
  //       {item.channelName}
  //     </Select.Option>
  //   ))
  // }

  const deleteData = row => {
    console.log(row)
    let arr: any = []
    for (let index in selectDataList) {
      if (row.id !== selectDataList[index].id) {
        arr.push(selectDataList[index])
      }
    }
    setSelectDataList(arr)
  }

  const importClientData = () => {
    let params = {
      compCodes: form.getFieldValue('compCodes'),
      cardCode: cardCode,
      subTitle: form.getFieldValue('subTitle'),
      cardType: form.getFieldValue('cardType'),
      cardStatus: form.getFieldValue('cardStatus'),
      channelType: form.getFieldValue('channelType'),
      veriStatus: form.getFieldValue('veriStatus'),
      veriWay: form.getFieldValue('veriWay'),
    }
    console.log(params)
    api.exportData('importClientData', params)
  }

  const changeStatus = () => {
    // clientVeriCard
    if (selectedRowKeys.length == 0) {
      message.error('请至少选择一个项目')
      return
    }

    console.log(selectedRowKeys)

    setShopVisible(true)
  }

  const shopCancel = () => {
    setShopVisible(false)
  }

  const okClientVeriCard = () => {
    // let cardCode: any = []
    let data: any = shopform.getFieldValue('data').split("|")
    console.log(data[0])
    console.log(data[1])

    if (!data[0]) {
      message.error('门店不能为空')
      return
    }

    let params = {
      cardCode: selectedRowKeys,
      compCode: data[0],
      compName: data[1],
    }
    api
      .clientVeriCard(params)
      .then(res => {
        message.success('核销成功')
        setShopVisible(false)
      })
      .catch(err => {
        message.error(err.msg)
      })
  }




  const veriColumns: ColumnProps<ICardGetDetails>[] = [
    {
      title: '卡券状态',
      dataIndex: 'cardStatus',
      align: 'left',
    },
    {
      title: 'B端核销状态',
      dataIndex: 'veriStatus',
      align: 'left',
      // render: (a, row) => projectFormat(a, row),
    },
    {
      title: '卡券数量',
      dataIndex: 'cardNum',
      align: 'left',
    },
    {
      title: '操作',
      dataIndex: 'cardNum',
      align: 'left',
      render: (a, row) => {
        return (
          <div>
            <Button type="link" onClick={() => deleteData(row)}>
              删除
            </Button>
          </div>
        )
      },
    },
  ]
  const columns: ColumnProps<ICardGetDetails>[] = [
    {
      title: '卡券编码',
      dataIndex: 'cardCode',
      align: 'left',
      width: 200,
    },
    {
      title: '卡券名称',
      dataIndex: 'subTitle',
      align: 'left',
      ellipsis: true,
      width: 280,
    },
    {
      title: '券类型',
      dataIndex: 'cardType',
      align: 'left',
      width: 100,
      // render: (a, row) => cardTypeFormat(a, row, 'cardType'),
    },
    // {
    //   title: '使用场景',
    //   dataIndex: 'useCase',
    //   align: 'left',
    //   width: 120,
    //   render: (a, row) => useCaseFormat(a, row),
    // },

    {
      title: '状态',
      dataIndex: 'cardStatus',
      align: 'left',
      width: 100,
      // render: (a, row) => cardStatusFormat(a, row, 'cardStatus'),
    },
    {
      title: '领券渠道',
      dataIndex: 'channelName',
      align: 'left',
      width: 120,
    },
    {
      title: '客户姓名',
      dataIndex: 'clientName',
      align: 'left',
      width: 120,
      render: (a, row) => {
        if (row.clientName) {
          return row.clientName
        } else {
          return '--'
        }
      },
    },
    {
      title: '手机号码',
      dataIndex: 'mobile',
      align: 'left',
      width: 120,
    },
    {
      title: '车牌号',
      dataIndex: 'carNo',
      align: 'left',
      width: 120,
    },
    {
      title: '品牌',
      dataIndex: 'brand',
      align: 'left',
      width: 120,
    },
    {
      title: '有效期',
      dataIndex: 'validDays',
      align: 'left',
      width: 250,
      render: (a, row) => {
        let time: any = ''
        if (row.validStart && !row.validEnd) {
          time = row.validStart + '至' + '00-00-00'
        } else if (!row.validStart && row.validEnd) {
          time = '00-00-00' + '至' + row.validEnd
        } else if (!row.validStart && !row.validEnd) {
          time = '00-00-00' + '至' + '00-00-00'
        } else {
          time = row.validStart + '至' + row.validEnd
        }
        return time
      },
    },
    {
      title: '领券时间',
      dataIndex: 'drawDate',
      align: 'left',
      width: 200,
    },
    {
      title: '客户使用时间',
      dataIndex: 'useDate',
      align: 'left',
      width: 150,
      render: (a, row) => {
        if (row.useDate) {
          return row.useDate
        } else {
          return '--'
        }
      },
    },
    {
      title: '使用门店',
      dataIndex: 'compName',
      align: 'left',
      width: 120,
      render: (a, row) => {
        if (row.compName) {
          return row.compName
        } else {
          return '--'
        }
      },
    },
    {
      title: 'B端核销状态',
      dataIndex: 'veriStatus',
      align: 'left',
      width: 180,
      render: (a, row) => {
        if (row.veriStatus) {
          return row.veriStatus
        } else {
          return '--'
        }
      },
    },
    {
      title: 'B端核销时间',
      dataIndex: 'veriDate',
      align: 'left',
      width: 180,
      render: (a, row) => {
        if (row.veriDate) {
          return row.veriDate
        } else {
          return '--'
        }
      },
    },
    {
      title: '核销方式',
      dataIndex: 'veriWay',
      align: 'left',
      width: 130,
      render: (a, row) => {
        if (row.veriWay) {
          return row.veriWay
        } else {
          return '--'
        }
      },
    },
  ]

  return (
    <div>
      <ToolsBar visible={false}>
        <div>
          <Form layout="inline" form={form} size={size}>
            <Form.Item label="" name="cardCode">
              <Input placeholder="请输入卡券编码" size={size} style={{ width: '150px' }} allowClear></Input>
            </Form.Item>
            <Form.Item label="" name="subTitle">
              <Input placeholder="请输入券名称" size={size} style={{ width: '150px' }} allowClear></Input>
            </Form.Item>

            <Form.Item label="" name="cardType">
              <Dist type={'cards_type'} style={{ width: 150 }} placeholder="选择券类型" allowClear></Dist>
            </Form.Item>

            <Form.Item label="" name="cardStatus">
              <Dist type={'cards_status_user'} style={{ width: 150 }} placeholder="选择状态" allowClear></Dist>
              {/* <Select value="1" style={{width: 110}} placeholder="选择状态">
                <Select.Option value="1">生效中</Select.Option>
                <Select.Option value="2">已失效</Select.Option>
              </Select> */}
            </Form.Item>

            <Form.Item label="" name="brand">
              <Select style={{ width: 110 }} placeholder="选择品牌" allowClear showSearch>
                {brandList.map((item, index) => (
                  <Select.Option value={item.nameCn} key={index}>
                    {item.nameCn}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            {/* <Form.Item label="区域" name="areaCode">
              <SelectArea placeholder="选择区域" allowClear style={{width: 120}} onChange={onChangeAreaCode} />
            </Form.Item> */}
            <Form.Item name="compCodes">
              <SelectComp
                showSearch
                allowClear
                // areaId={areaId}
                placeholder="选择门店"
                filterOption={(input, option) => option?.children.indexOf(input) >= 0}
              />
            </Form.Item>
            <Form.Item label="" name="channelType">
              <Dist type={'cards_channel'} style={{ width: 150 }} placeholder="选择领券渠道" allowClear></Dist>
              {/* <Select style={{width: 110}} placeholder="选择状态">
                {renderOptions()}
              </Select> */}
            </Form.Item>

            <Form.Item label="" name="veriStatus">
              <Dist type={'cards_veri_status'} style={{ width: 150 }} placeholder="选择核销状态" allowClear></Dist>
            </Form.Item>
            <Form.Item label="" name="veriWay">
              <Dist type={'cards_veri_way'} style={{ width: 150 }} placeholder="选择核销方式" allowClear></Dist>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                icon={<SearchOutlined />}
                size={size}
                onClick={submit}
                disabled={hasPermi('getCard:list:search')}>
                搜索
              </Button>
              <Button
                type="primary"
                icon={<SettingOutlined />}
                size={size}
                onClick={reSet}
                disabled={hasPermi('getCard:list:reset')}
                style={{ marginLeft: '18px' }}>
                重置
              </Button>

              <Button
                type="primary"
                icon={<DownloadOutlined />}
                size={size}
                onClick={importClientData}
                disabled={hasPermi('getCard:list:import')}
                style={{ marginLeft: '18px' }}>
                导出
              </Button>
              <Button
                type="primary"
                // icon={<SearchOutlined />}
                size={size}
                onClick={veriCard}
                disabled={hasPermi('getCard:list:veri')}
                style={{ marginLeft: '18px', background: '#304156', color: '#fff', border: '1px solid #304156' }}>
                渠道商核销
              </Button>
              <Button
                type="primary"
                // icon={<SearchOutlined />}
                size={size}
                onClick={changeStatus}
                disabled={hasPermi('getCard:list:changeStatus')}
                style={{ marginLeft: '18px', background: '#304156', color: '#fff', border: '1px solid #304156' }}>
                客户消费核销
              </Button>
            </Form.Item>
          </Form>
        </div>
      </ToolsBar>

      <div style={{ backgroundColor: 'white', marginTop: '15px' }}>
        <Table
          rowSelection={rowSelection}
          columns={columns}
          scroll={{ x: 2500 }}
          rowKey="cardCode"
          bordered
          {...tableProps}
          size={size}
          pagination={{
            total: tableProps.pagination.total,
            showTotal: total => `共 ${total} 条`,
            pageSize: tableProps.pagination.pageSize,
            showSizeChanger: true,
          }}
        />
      </div>

      <Modal title="" visible={veriVisible} onOk={okVeriCard} onCancel={cancel}>
        <Table
          // rowSelection={rowSelection}
          columns={veriColumns}
          rowKey="id"
          bordered
          dataSource={selectDataList}
          size="small"
          style={{ marginTop: '25px' }}
          pagination={false}
        />
      </Modal>

      <Modal title="选择门店" visible={shopVisible} onOk={okClientVeriCard} onCancel={shopCancel}>
        <Form layout="inline" form={shopform} size={size}>
          <Form.Item label="" name="data" style={{ width: '100%' }}>
            <SelectComp
              showSearch
              allowClear
              isShopName={true}
              style={{ width: '80%', margin: '0 auto', display: 'block' }}
              placeholder="选择门店"
              filterOption={(input, option) => option?.children.indexOf(input) >= 0}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default PageDateGetCaradList
