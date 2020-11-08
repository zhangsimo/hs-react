/** @format */

import React, {useState, useEffect, useCallback} from 'react'
import {ColumnProps} from 'antd/lib/table'
import {Table, Form, Input, Button, message, Modal, Spin, InputNumber, Empty} from 'antd'
import './changeCardType.less'
// import {ICompReport} from '@/interface'
import {getStore} from '@/utils/store'

import * as api from '@/api'

const size = undefined
interface IProps {
  setCardId: any
  progress: any
  isEdit: any
  isOnline: any
}

// const tableHeight = {y: document.body.clientHeight - 320}

const PageSelectChannel: React.FC<IProps> = props => {
  const [visible, setVisible] = useState<boolean>(false)
  const [cardChannelList, setCardChannelList] = useState<any[]>([])
  const [selectChannelList, setSelectChannelList] = useState<any[]>([])
  const [cardTotalNum, setCardTotalNum] = useState<number>(0)
  const [loadings, setLoadings] = useState<boolean>(false)
  const [loading2, setLoading2] = useState<boolean>(false)
  const [isDisabled, setIsDisabled] = useState<boolean>(false)
  const [form] = Form.useForm()
  const progress = props.progress
  const isEdit = props.isEdit

  console.log(progress)
  const [selectedRow, setSelectedRow] = useState<any[]>([])

  const onSelectChange = (selectedRowKeys, selectedRow) => {
    setSelectedRow(selectedRow)
  }

  useEffect(() => {
    const curCard = getStore('curCard')

    let isUnmounted = false
    if (curCard && curCard.cardId) {
      let params: any = {
        cardId: curCard.cardId,
      }
      api
        .getCardChannelList(params)
        .then(res => {
          if (!isUnmounted) {
            // let countNUm: number = 0
            setSelectChannelList(res.data)

            setCardTotalNum(Number(curCard.total))
          }
        })
        .catch(err => {
          message.error(err.msg)
        })
    }
    return () => {
      isUnmounted = true
    }
  }, [])

  useEffect(() => {
    if (progress == 5 && !isEdit) {
      setIsDisabled(true)
    } else {
      setIsDisabled(false)
    }
  }, [progress, isEdit])

  const rowSelection = {
    selectedRow,
    onChange: onSelectChange,
  }

  const getShowChannel = () => {
    setLoading2(true)
    setVisible(true)
    api.getDictTypeVal('cards_channel').then(res => {
      console.log(res)
      setCardChannelList(res.data)
      setLoading2(false)
    })
  }

  const columnsChannel: ColumnProps<''>[] = [
    {
      title: '渠道商名称',
      dataIndex: 'dictLabel',
      align: 'center',
      width: '200',
    },
  ]

  const handleOk = () => {
    const curCard = getStore('curCard')
    if (selectedRow.length == 0) {
      message.error('请至少选择一个项目')
      return
    }

    let arr: any = []
    for (let i in selectedRow) {
      arr.push({
        cardId: curCard.cardId,
        cardNum: Number(selectedRow[i].cardNum) || 0,
        channel: selectedRow[i].dictValue,
        channelName: selectedRow[i].dictLabel,
        drawNum: Number(selectedRow[i].drawNum) || 0,
      })
    }

    setSelectChannelList(arr)
    setVisible(false)
  }

  const handleCancel = e => {
    setVisible(false)
  }

  const submit = () => {
    const curCard = getStore('curCard')
    if (selectChannelList.length <= 0) {
      message.error('请先添加渠道')
      return
    }

    //不能超过券总数量
    let countNUm: number = 0
    for (let i in selectChannelList) {
      countNUm = Number(countNUm) + Number(selectChannelList[i].cardNum ? selectChannelList[i].cardNum : 0)
    }

    if (countNUm > curCard.total) {
      message.error('不能超过券总数量')
      return
    }

    let params: any = {
      cardId: curCard.cardId,
      channels: selectChannelList,
    }
    console.log(params)
    setLoadings(true)
    api
      .saveCardChannel(params)
      .then(res => {
        let data = {
          cardId: curCard.cardId,
          page: 1,
          pageSize: 5,
          scroolType: 3,
        }
        props.setCardId(data)
        let anchorElement = document.getElementById('block_useLimit')
        if (anchorElement) {
          anchorElement.scrollIntoView({block: 'start', behavior: 'smooth'})
        }
        setLoadings(false)
      })
      .catch(err => {
        message.error(err.msg)
      })
  }

  const onChangeChannelNum = useCallback(
    (e, item) => {
      console.log(e)
      console.log(item)
      const curCard = getStore('curCard')
      let countNUm: number = 0
      console.log(selectChannelList)

      setSelectChannelList(b => {
        const a = [...b]
        for (let i in a) {
          countNUm = Number(countNUm) + Number(a[i].cardNum ? a[i].cardNum : 0)
          // a[i].cardNum = e
          // break
        }
        return a
      })

      if (countNUm > curCard.total - 1) {
        item.cardNum = 0
        message.error('不能超过券总数量')
        return
      }

      item.cardNum = e
      // console.log(1111, selectChannelList)
      // setSelectChannelList(selectChannelList)
    },
    [selectChannelList],
  )

  const pfCardNum = useCallback(
    e => {
      console.log(e)
      const curCard = getStore('curCard')
      let num: number = 0
      num = curCard.total / selectChannelList.length

      setSelectChannelList(b => {
        const a = [...b]
        for (let i in a) {
          if (curCard.total % selectChannelList.length == 0) {
            a[i].cardNum = num
          } else {
            a[i].cardNum = Math.floor(curCard.total / selectChannelList.length)
            // a[1].cardNum = Math.floor(curCard.total / selectChannelList.length)
            a[selectChannelList.length - 1].cardNum =
              Math.floor(curCard.total / selectChannelList.length) + (curCard.total % selectChannelList.length)
          }
        }
        return a
      })
    },
    [selectChannelList],
  )

  // const content = (
  //   <div>
  //     <p>说明</p>
  //     <p>评分</p>
  //   </div>
  // )
  return (
    <div className="block_selectChannel block" id="block_selectChannel">
      <div className="block_title">
        <span>选择发放渠道</span>
      </div>
      <div className="block_content">
        <div>
          选择渠道: &nbsp;&nbsp;
          <Button type="primary" ghost onClick={getShowChannel} disabled={isDisabled}>
            添加
          </Button>
          &nbsp;&nbsp;&nbsp;
          {/* <Popover content={content} title="平分券数量"> */}
          <Button type="primary" onClick={pfCardNum} ghost disabled={isDisabled}>
            平分券数量
          </Button>
          {/* </Popover> */},
        </div>
        <div style={{marginTop: '20px'}}>
          <Form form={form} size={size}>
            <Form.Item label="券总数量:">
              <Input placeholder="券总数量" size={size} style={{width: '230px'}} value={cardTotalNum} disabled></Input>
            </Form.Item>
            <Form.Item label="" name="subTitle">
              <div style={{border: '1px solid #f0f0f0', marginLeft: '70px', width: '230px'}}>
                <ul className="flex">
                  <li
                    style={{
                      background: '#fafafa',
                      padding: '5px',
                      textAlign: 'center',
                      borderLeft: '1px solid #f0f0f0',
                      borderBottom: '1px solid #f0f0f0',
                      width: '137px',
                    }}>
                    已选择渠道商
                  </li>
                  <li
                    style={{
                      background: '#fafafa',
                      padding: '5px',
                      textAlign: 'center',
                      borderLeft: '1px solid #f0f0f0',
                      borderBottom: '1px solid #f0f0f0',
                      width: '90px',
                    }}>
                    券发放量
                  </li>
                </ul>

                {selectChannelList.length > 0 ? (
                  selectChannelList.map((item, idx) => (
                    <ul key={idx} className="flex">
                      <li
                        style={{
                          padding: '5px',
                          textAlign: 'center',
                          lineHeight: '32px',
                          borderRight: '1px solid #f0f0f0',
                          width: '137px',
                        }}>
                        {item.channelName}
                      </li>
                      <li style={{padding: '5px', textAlign: 'center'}}>
                        <InputNumber
                          placeholder=""
                          style={{width: '80px'}}
                          min={0}
                          // defaultValue={item.cardNum}
                          disabled={isDisabled}
                          value={item.cardNum}
                          onChange={e => onChangeChannelNum(e, item)}
                        />
                      </li>
                    </ul>
                  ))
                ) : (
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                )}
              </div>
              {/* <Table
                columns={columns}
                rowKey="cardId"
                bordered
                rowClassName={() => 'editable-row'}
                dataSource={selectChannelList}
                size="small"
                style={{width: '230px', marginLeft: '70px'}}
                pagination={false}
              /> */}
            </Form.Item>
          </Form>
        </div>

        <Button
          htmlType="submit"
          type="primary"
          onClick={submit}
          loading={loadings}
          disabled={isDisabled}
          style={{marginLeft: '70px'}}>
          下一步
        </Button>
      </div>

      <Modal title="选择渠道商" visible={visible} onOk={handleOk} onCancel={handleCancel} style={{width: '250px'}}>
        <Spin spinning={loading2}>
          <Table
            rowSelection={rowSelection}
            columns={columnsChannel}
            rowKey="dictValue"
            dataSource={cardChannelList}
            size="small"
            bordered
            pagination={false}
          />

          {/* <Pagination
          size="small"
          total={projectList}
          pageSize={5}
          onChange={onChangeProject}
          style={{marginTop: '15px', textAlign: 'right'}}
        /> */}
        </Spin>
      </Modal>
    </div>
  )
}

export default PageSelectChannel
