/** @format */

import React, {useState} from 'react'
// import {useRouteMatch} from 'react-router-dom'
import {Button, Card, Modal, Row, Col, message, Pagination, Spin} from 'antd'
import QRCode from 'qrcode.react'

// import Edit from './Edit'
import ToolsBar from '@/components/ToolsBar'
import * as api from '@/api'
// import {ICardTheme} from '@/interface'
// import CardDetails from './components/cardDetails'
import {CopyToClipboard} from 'react-copy-to-clipboard'
import {CARD_APP_ROOT} from '@/config'
// import cardPic from '@/assets/image/card_pic.jpg'
// const cardPic = require('@/assets/image/card_pic.jpg')
import {useRequest} from '@umijs/hooks'
import {
  EditOutlined,
  DeleteOutlined,
  QrcodeOutlined,
  PaperClipOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons'
import Meta from 'antd/lib/card/Meta'
import {useHistory} from 'react-router-dom'
const confirm = Modal.confirm

const ActivityCard = () => {
  const history = useHistory()

  // const visible = useBoolean(false)
  const [dataList, setdataList] = useState<any>([])
  const [total, setTotal] = useState<any>(0)
  const [params, setParams] = useState<any>({page: 1, pageSize: 8})

  // const [form] = Form.useForm()
  // const [addVisible, setAddVisible] = useState<boolean>(false)
  // const [loading, setLoading] = useState<boolean>(false)
  // const [curCardData, setCurCardData] = useState<any>({})

  const {run: initData, loading: loading} = useRequest(() =>
    api.getActivityCardList(params).then((res: any) => {
      if (res.code == 1) {
        setdataList(res.data.items)
        setTotal(res.data.total)
        setParams({pageSize: res.data.pageSize, page: res.data.page})
      } else {
        setdataList([])
      }
    }),
  )

  const onAdd = () => {
    const turl = `/activity/cardDetails`
    history.push(turl)
  }

  // const saveData = () => {
  //   visible.toggle()
  //   setdataList([])
  // }

  // const oncancel = type => {
  //   if (type) {
  //     initData()
  //   }

  // }

  const editCard = (item: any) => {
    // history.push({pathname: '/activity/cardDetails', state: {id: item.id}})
    const turl = `/activity/cardDetails?id=${item.id}`
    history.push(turl)
  }

  const delCard = (id: any) => {
    confirm({
      title: '确定删除?',
      icon: <ExclamationCircleOutlined />,
      content: '删除了就没有了哦',
      onOk() {
        let params = {
          id: id,
        }
        api.delActivityCard(params).then((res: any) => {
          if (res.code == 1) {
            message.success('删除成功')
            initData()
          } else {
          }
        })
      },
      onCancel() {
        message.info('感谢不删之恩')
      },
    })
  }

  const copyLink = e => {
    console.log(e)
    message.success('复制成功')
  }

  const onChangePage = async (page, pageSize) => {
    console.log(page)
    console.log(pageSize)
    let params = {
      page: page,
      pageSize: pageSize,
    }
    await setParams(params)
    initData()
  }
  const copyMa = id => {
    const canvasImg: any = document.getElementById('qrCode' + id) // 获取canvas类型的二维码
    const img = new Image()
    img.src = canvasImg?.toDataURL('image/png') // 将canvas对象转换为图片的data url
    const downLink: any = document.getElementById('down_link' + id)
    downLink.href = img.src
    downLink.download = '二维码' // 图片name
  }

  return (
    <div>
      <Spin spinning={loading}>
        <ToolsBar visible={false}>
          {/* <Form form={form} layout="inline">
          <Form.Item name="name">
            <Input.Search placeholder="名字" />
          </Form.Item>
          <Form.Item name="status">
            <Select placeholder="用户状态" style={{width: '140px'}} allowClear>
              <Select.Option value="0">暂停</Select.Option>
              <Select.Option value="1">启用</Select.Option>
            </Select>
          </Form.Item>
        </Form> */}
          <div>
            <Button type="primary" onClick={onAdd}>
              新增
            </Button>
            &nbsp;&nbsp;
          </div>
        </ToolsBar>

        <Row gutter={16}>
          {dataList.map((item, idx) => (
            <Col span={6} key={idx} style={{marginBottom: '15px'}}>
              <Card
                cover={
                  <img
                    alt="example"
                    src={item.signboardImageUrl ? item.signboardImageUrl : require('@/assets/image/card_pic.jpg')}
                    style={{height: 197}}
                  />
                }
                key={idx}
                actions={[
                  <EditOutlined key="edit" onClick={e => editCard(item)} />,
                  <CopyToClipboard text={CARD_APP_ROOT + '/activityCard/' + item.id} onCopy={copyLink}>
                    <PaperClipOutlined />
                  </CopyToClipboard>,
                  // <QrcodeOutlined onClick={e => copyMa(item)} />,
                  <a id={'down_link' + item.id} onClick={e => copyMa(item.id)}>
                    <QrcodeOutlined />,
                    <QRCode
                      id={'qrCode' + item.id}
                      value={CARD_APP_ROOT + '/activityCard/' + item.id}
                      size={200} // 二维码的大小
                      fgColor="#000000" // 二维码的颜色
                      style={{margin: 'auto', display: 'none'}}
                      // imageSettings={{
                      //   // 二维码中间的logo图片
                      //   src: 'logoUrl',
                      //   height: 40,
                      //   width: 40,
                      //   excavate: true, // 中间图片所在的位置是否镂空
                      // }}
                    />
                  </a>,
                  <DeleteOutlined key="ellipsis" onClick={e => delCard(item.id)} />,
                ]}>
                <Meta
                  // avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                  title={item.title}
                  description={item.name}
                />
              </Card>
            </Col>
          ))}
        </Row>

        <div style={{textAlign: 'right'}}>
          <Pagination total={total} pageSize={params.pageSize} onChange={onChangePage} style={{marginTop: '15px'}} />
        </div>

        {/* <Modal title="优惠券架" visible={addVisible} onOk={saveData} footer={null} width={950} onCancel={oncancel}>
        <Spin spinning={loading}>
         <CardDetails curCardData={curCardData} addVisible={oncancel}></CardDetails> 
        </Spin>
      </Modal> */}
      </Spin>
    </div>
  )
}

export default ActivityCard
