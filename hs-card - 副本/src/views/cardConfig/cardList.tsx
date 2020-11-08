/** @format */

import React, { useState, useEffect } from 'react'
import { ColumnProps } from 'antd/lib/table'
import { Table, Button, Form, Input, message, Modal, Spin, Popover } from 'antd'
import ToolsBar from '@/components/ToolsBar'
import { SearchOutlined, SettingOutlined, PlusOutlined } from '@ant-design/icons'
import { setStore, removeStore } from '@/utils/store'
import './index.less'
import useAntdTable from '@/hooks/useAntdTable'
import { ICardDetail, ITableResult } from '@/interface'
import * as api from '@/api'
// import SelectArea from '@/components/Select/area'
import SelectComp from '@/components/Select/comp'
import { useHistory } from 'react-router-dom'
import { cardTypeFormat, cardStatusFormat, channelNameFormat } from './_common/index'
// import * as Moment from 'moment'
import hasPermi from '@/components/directive'
import Dist from '@/components/Select/dict'
import 'moment/locale/zh-cn'
const size = undefined
// const tableHeight = {y: document.body.clientHeight - 320}
const PageDateCompReport = () => {
  // const [areaId, setAreaId] = useState<string>('')
  const [curOptObj, setCurOptObj] = useState<any>({ title: '', type: '' })
  const [visible, setVisible] = useState<boolean>(false)
  const [logVisible, setLogVisible] = useState<boolean>(false)
  const [copyVisible, setCopyVisible] = useState<boolean>(false)
  const [dataNum, setDataNum] = useState<string[]>([])
  const [curRow, setCurRow] = useState<any>()
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([])
  const [logData, setLogData] = useState<any>({})
  // const [total, setTotal] = useState<any>()
  const [channelMore, setChannelMore] = useState<string>('')
  const [curLog, setCurLog] = useState<any>()
  const [form] = Form.useForm()
  const history = useHistory()
  const [loading, setLoading] = useState<boolean>(false)

  // const {RangePicker} = DatePicker
  // const dateFormat = 'YYYY-MM-DD'
  const getTableData = (tableParams, params) =>
    api.getCardList({ ...api.formatParams(tableParams, params) }).then(res => {
      setSelectedRowKeys([])

      return {
        list: res.data.items,
        total: res.data.total,
      }
    })

  const { tableProps, search } = useAntdTable<ITableResult<ICardDetail>, ICardDetail>(getTableData, {
    defaultPageSize: 20,
    form,
  })

  removeStore('curCard')

  const onDetail = row => {
    const turl = `/card/getCardList?cardCode=${row.cardCode}&cardId=${row.cardId}`
    history.push(turl)
    // replace({
    //   pathname: '/contentXQ',
    //   search: JSON.stringify(row),
    // })
  }

  useEffect(() => {
    removeStore('curCard') //清楚上一个记录
  }, [])

  const addCard = () => {
    history.push('/card/addCard')
  }

  const onSelectChange = selectedRowKeys => {
    console.log(selectedRowKeys)

    setSelectedRowKeys(selectedRowKeys)
    // setSelectedRow(selectedRow)
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  }

  const { submit } = search || {}

  const reSet = () => {
    form.resetFields()
  }

  const isShowUpperOrLower = type => {
    console.log(type)
    if (type == 1) {
      setCurOptObj({ title: '上架确认', type: type })
      filterData()
    }

    if (type == 2) {
      setCurOptObj({ title: '下架确认', type: type })
      setVisible(true)
    }
  }

  const filterData = () => {
    // const okNum: any[] = []
    // const noNum: any[] = []
    let params = {
      cardIds: selectedRowKeys.join(','),
    }
    api
      .getUpperNum({ ...params })
      .then(res => {
        console.log(res)
        let data = res.data
        setDataNum(data)
        console.log(dataNum)
        setVisible(true)
      })
      .catch(err => {
        message.error('获取失败')
      })
  }
  const setUpperOrLower = () => {
    if (curOptObj.type == 1) {
      let params = {
        cardIds: selectedRowKeys.join(','),
      }
      api
        .setUpper({ ...params })
        .then(res => {
          message.success('上架成功')
          submit()
        })
        .catch(err => {
          message.error('上架失败')
        })
    } else {
      let params = {
        cardId: selectedRowKeys[0],
      }

      api
        .setLower({ ...params })
        .then(res => {
          message.success('下架成功')
          submit()
        })
        .catch(err => {
          message.error('下架失败')
        })
    }
    setVisible(false)
    // useAntdTable<ITableResult<ICardDetail>, ICardDetail>(getTableData, {
    //   defaultPageSize: 20,
    //   form,
    // })
  }

  const cancel = () => {
    setVisible(false)
  }

  const isShowCopy = row => {
    setCurRow(row)
    console.log(row)
    setCopyVisible(true)
  }

  const setCopyRow = async () => {
    console.log(curRow)
    await delete curRow.cardId
    await delete curRow.isOnline
    setTimeout(() => {
      setStore('curCard', curRow) //缓存当前记录
    }, 200)
    setTimeout(() => {
      const turl = `/card/addCard?isCopy=1`
      history.push(turl)
    }, 500)
    setCopyVisible(false)
  }
  const cancelCopy = () => {
    setCopyVisible(false)
  }

  // const onChangeAreaCode = value => {
  //   setAreaId(value)
  //   form.setFieldsValue({compCodes: null})
  // }
  const isShowLog = row => {
    console.log(row)
    setCurLog(row)
    setLogVisible(true)

    let params = {
      cardId: row.cardId,
      pageSize: 6,
      page: 1,
    }
    getLogList(params)
  }

  const getLogList = params => {
    console.log(curLog)
    setLoading(true)

    api
      .getLogList(params)
      .then(res => {
        setLogData(res.data)
        // setTotal(res.data.total)
        console.log(res.data)
        setLoading(false)
      })
      .catch(err => {
        message.error(err.msg)
        setLoading(false)
      })
  }

  const onChangeLog = (page, pageSize) => {
    // const curCard = getStore('curCard')
    console.log(page)
    let params = {
      cardId: curLog.cardId,
      page: page,
      total: logData.total,
      pageSize: pageSize,
    }
    getLogList(params)
  }

  const onlogCancel = () => {
    setLogVisible(false)
  }

  const goDetails = curRow => {
    setStore('curCard', curRow) //缓存当前记录
    setTimeout(() => {
      history.push({
        pathname: '/card/addCard',
      })
    }, 500)
  }

  const showMore = (curRow, type) => {
    let apiUrl: any = ''
    let params = { cardId: curRow.cardId }
    if (type == 1) {
      apiUrl = api.getCardChannelList
    } else {
      apiUrl = api.getCardShopList
    }
    apiUrl(params)
      .then(res => {
        let data = res.data
        let arr: any = []
        for (let i in data) {
          if (type == 1) {
            arr.push(data[i].channelName)
          } else {
            arr.push(data[i].compName)
          }
        }
        setChannelMore(arr.join(','))
      })
      .catch(err => {
        message.error(err.msg)
      })
  }

  const columnsLog: ColumnProps<ICardDetail>[] = [
    {
      title: '操作人工号',
      dataIndex: 'operateCode',
      align: 'left',
      width: 200,
    },
    {
      title: '操作人姓名',
      dataIndex: 'operator',
      align: 'left',
      width: 150,
    },
    {
      title: '操作人时间',
      dataIndex: 'operateDate',
      align: 'left',
      width: 200,
    },
    {
      title: '操作事件',
      dataIndex: 'operateEvent',
      align: 'left',
      fixed: 'right',
      width: 150,
    },
  ]

  const columns: ColumnProps<ICardDetail>[] = [
    {
      title: '卡券名称',
      dataIndex: 'subTitle',
      align: 'left',
      width: 250,
      ellipsis: true,
      render: (a, row: ICardDetail) => {
        return (
          <div>
            <Button type="link" onClick={() => goDetails(row)} style={{ padding: '0' }}>
              {row.subTitle.length < 15 ? row.subTitle : row.subTitle.substr(0, 15) + '...'}
            </Button>
          </div>
        )
      },
    },
    {
      title: '券类型',
      dataIndex: 'cardType',
      align: 'left',
      width: 80,
      render: (a, row) => cardTypeFormat(a, row, 'cardType'),
    },

    {
      title: '状态',
      dataIndex: 'cardStatus',
      align: 'left',
      width: 100,
      render: (a, row) => cardStatusFormat(a, row, 'cardStatus'),
    },
    {
      title: '剩余库存',
      dataIndex: 'remainNum',
      align: 'left',
      width: 100,
      render: (a, row: ICardDetail) => {
        return (
          <div>
            <Button type="link" onClick={() => goDetails(row)} style={{ padding: '0' }}>
              {row.remainNum}
            </Button>
          </div>
        )
      },
    },
    {
      title: '创建量',
      dataIndex: 'total',
      align: 'left',
      width: 100,
      render: (a, row) => {
        return (
          <div>
            <Button type="link" onClick={() => goDetails(row)} style={{ padding: '0' }}>
              {row.total}
            </Button>
          </div>
        )
      },
    },
    {
      title: '已领量',
      dataIndex: 'drawNum',
      align: 'left',
      width: 100,
      render: (a, row) => {
        return (
          <div>
            <Button type="link" onClick={() => onDetail(row)} style={{ padding: '0' }}>
              {row.drawNum}
            </Button>
          </div>
        )
      },
    },
    {
      title: '已消费量',
      dataIndex: 'consumNum',
      align: 'left',
      width: 100,
      render: (a, row) => {
        return (
          <div>
            <Button type="link" onClick={() => onDetail(row)} style={{ padding: '0' }}>
              {row.consumNum}
            </Button>
          </div>
        )
      },
    },
    {
      title: '有效期',
      dataIndex: 'validDays',
      align: 'left',
      width: 200,
      render: (a, row) => {
        let time: any = ''
        if (row.validStart && !row.validEnd) {
          time = row.validStart + ' 至 ' + '--'
        } else if (!row.validStart && row.validEnd) {
          time = '--' + ' 至 ' + row.validEnd
        } else if (!row.validStart && !row.validEnd) {
          time = '--' + ' 至 ' + '--'
        } else {
          time = row.validStart + ' 至 ' + row.validEnd
        }
        return time
      },
    },
    {
      title: '发放渠道',
      dataIndex: 'channelName',
      align: 'left',
      width: 130,
      ellipsis: true,
      render: (a, row) => {
        return (
          <div>
            {channelNameFormat(a, row)}
            {row.channelName ? (
              <Popover content={channelMore} title="发放渠道" trigger="click">
                <Button type="link" onClick={() => showMore(row, 1)}>
                  更多
                </Button>
              </Popover>
            ) : null}
          </div>
        )
      },
    },
    {
      title: '适用门店',
      dataIndex: 'compName',
      align: 'left',
      width: 150,
      ellipsis: true,
      render: (a, row) => {
        return (
          <div>
            {row.compName}
            {row.compName ? (
              <Popover content={channelMore} title="适用门店" trigger="click">
                <Button type="link" onClick={() => showMore(row, 2)}>
                  更多
                </Button>
              </Popover>
            ) : (
                '--'
              )}
          </div>
        )
      },

      // render: (a, row) => shopFormat(a, row),
    },
    {
      title: '创建人',
      dataIndex: 'creator',
      align: 'left',
      width: 100,
      render: (a, row) => {
        if (row.creator) {
          return row.creator
        } else {
          return '--'
        }
      },
      // sorter: (a, b) => a.repost - b.repost,
    },
    {
      title: '操作',
      align: 'left',
      fixed: 'right',
      width: 250,
      render: (row: ICardDetail) => {
        return (
          <div>
            <Button type="link" onClick={() => isShowCopy(row)} style={{ color: '#FB721F' }}>
              复制
            </Button>
            <Button type="link" onClick={() => onDetail(row)} style={{ color: '#FB721F' }}>
              领券明细
            </Button>
            <Button type="link" onClick={() => isShowLog(row)} style={{ color: '#FB721F' }}>
              日志
            </Button>
          </div>
        )
      },
    },
  ]

  return (
    <div>
      <ToolsBar visible={false}>
        <div>
          <Form layout="inline" form={form} size={size}>
            <Form.Item label="" name="subTitle">
              <Input placeholder="请输入券名称" size={size} style={{ width: '150px' }} allowClear></Input>
            </Form.Item>

            <Form.Item label="" name="cardType">
              <Dist type={'cards_type'} style={{ width: 150 }} placeholder="选择券类型" allowClear></Dist>
            </Form.Item>

            <Form.Item label="" name="cardStatus">
              <Dist type={'cards_status'} style={{ width: 150 }} placeholder="选择状态" allowClear></Dist>
              {/* <Select value="1" style={{width: 110}} placeholder="选择状态">
                <Select.Option value="1">生效中</Select.Option>
                <Select.Option value="2">已失效</Select.Option>
              </Select> */}
            </Form.Item>

            {/* <Form.Item label="时间" name="time">
              <RangePicker size={size} style={{width: 230}} />
            </Form.Item> */}

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
            <Form.Item label="" name="creator">
              <Input placeholder="输入创建人" size={size} style={{ width: '150px' }}></Input>
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                icon={<SearchOutlined />}
                size={size}
                onClick={submit}
                disabled={hasPermi('card:list:search')}>
                搜索
              </Button>
              <Button
                type="primary"
                icon={<SettingOutlined />}
                size={size}
                onClick={reSet}
                disabled={hasPermi('card:list:reSet')}
                style={{ marginLeft: '18px' }}>
                重置
              </Button>
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                size={size}
                onClick={addCard}
                disabled={hasPermi('card:list:creat')}>
                新建
              </Button>

              <Button
                type="primary"
                size={size}
                onClick={e => {
                  isShowUpperOrLower(1)
                }}
                disabled={hasPermi('card:list:up') && selectedRowKeys.toString() === ''}
                style={{ marginLeft: '18px', background: '#304156', color: '#fff', border: '1px solid #304156' }}>
                上架
              </Button>
              <Button
                type="primary"
                size={size}
                onClick={e => {
                  isShowUpperOrLower(2)
                }}
                disabled={hasPermi('card:list:down') && selectedRowKeys.toString() === ''}
                style={{ marginLeft: '18px', background: '#304156', color: '#fff', border: '1px solid #304156' }}>
                下架
              </Button>
            </Form.Item>
          </Form>
        </div>
      </ToolsBar>
      <div style={{ backgroundColor: 'white', marginTop: '15px' }}>
        <Table
          rowSelection={rowSelection}
          columns={columns}
          scroll={{ x: 1300 }}
          rowKey="cardId"
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
      {/* Pagination size="small" total={projectList.total}
      // pageSize={projectList.pageSize}
      onChange={onChangeProject}
      onShowSizeChange={onShowSizeChange}
      style={{marginTop: '15px', textAlign: 'right'}} */}
      {/* /> */}
      <Modal title={curOptObj.title} visible={visible} onOk={setUpperOrLower} onCancel={cancel}>
        {curOptObj.type == 1 ? (
          <div>
            <p>选中{selectedRowKeys.length}个卡券：</p>
            <p>1、{dataNum[1]}个符合上架条件</p>
            <p>2、{dataNum[0]}个不符合上架条件</p>
          </div>
        ) : (
            <p>只支持单个下架，如果勾选多条数据，则默认第一条数据，确定要下架该优惠券？</p>
          )}
      </Modal>
      <Modal title="复制确认" visible={copyVisible} onOk={setCopyRow} onCancel={cancelCopy}>
        <div>
          <p>您已复制当前数据，即将跳转到卡券新增页面？</p>
        </div>
      </Modal>
      <Modal title="日志列表" visible={logVisible} onOk={setCopyRow} onCancel={onlogCancel} footer={null} width={750}>
        <Spin spinning={loading}>
          <Table
            columns={columnsLog}
            rowKey="id"
            dataSource={logData.items}
            bordered
            size="small"
            pagination={{
              total: logData.total,
              showTotal: total => `共 ${total} 条`,
              pageSize: logData.pageSize,
              onChange: onChangeLog,
            }}
            style={{ width: '100%' }}
          />
          {/* <Pagination
            total={logData.pageSize}
            current={logData.page}
            // pageSize={logData.pageSize}
            onChange={onChangeLog}
            onShowSizeChange={onShowSizeChange}
            style={{marginTop: '15px', textAlign: 'right'}}
          /> */}
        </Spin>
      </Modal>
    </div>
  )
}

export default PageDateCompReport
