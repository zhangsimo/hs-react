/** @format */

import React, {useState, useEffect} from 'react'
// import {useRouteMatch} from 'react-router-dom'
import {Button, Modal, message, Spin, Form, Input, Select, Table} from 'antd'
import QRCode from 'qrcode.react'

// import Edit from './Edit'
import ToolsBar from '@/components/ToolsBar'
import * as api from '@/api'
import { ColumnProps } from 'antd/lib/table'
import {CopyToClipboard} from 'react-copy-to-clipboard'
import {CARD_APP_ROOT} from '@/config'
// import cardPic from '@/assets/image/card_pic.jpg'
// const cardPic = require('@/assets/image/card_pic.jpg')
import useAntdTable from '@/hooks/useAntdTable'
import { ITableResult, IUser } from '@/interface'

import {
	PoweroffOutlined,
	SearchOutlined,
	DollarCircleOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons'
import {useHistory} from 'react-router-dom'
const confirm = Modal.confirm

const ActivityCard = () => {
  const history = useHistory()
	
	const [form] = Form.useForm()
	const random = history.location.search.split('=')[1]
  const [loading, setLoading] = useState<boolean>(false)
	
	const getActivityCardList = (tableParams, params) => {
		// console.log('tableParams', tableParams, 'params', params);
		setLoading(true)
		return api.getActivityCardList({ ...api.formatParams(tableParams, params) }).then(res => {
			setLoading(false)
			return {
				list: res.data.items,
				total: res.data.total
			}
		}).catch(() => {
			setLoading(false)
		})
	}
	
	
	useEffect(() => {
		reset()
	}, [random])
	
	const searchBt = () => {
		submit()
	}
	
	const { tableProps, search } = useAntdTable<ITableResult<IUser>, IUser>(getActivityCardList, {
		defaultPageSize: 10,
		form
	})
	const { submit, reset } = search || {}

  const onAdd = () => {
    const turl = `/activity/cardDetails`
    history.push(turl)
  }

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
            submit()
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
	// 点击发布按钮
	const onPublish = row => {
		confirm({
			title: '发布优惠券架',
			icon: <DollarCircleOutlined />,
			content: '即将发布' + row.name + '- 优惠券架',
			onOk() {
				api.getCardsshelvesUpper({ id: row.id }).then((res: any) => {
					if (res.code == 1) {
						message.success('发布优惠券架成功')
						submit()
					}
				})
			},
			onCancel() {
				message.info('取消发布优惠券架')
			},
		})
	}
	// 使失效、下架
	const onUnpublish = row => {
		console.log('使失效、下架', row);
		confirm({
			title: '优惠券架-下架',
			icon: <PoweroffOutlined />,
			content: '确定要下架 ' + row.name  + '???',
			onOk() {
				api.getCardsshelvesDown({ id: row.id }).then((res: any) => {
					if (res.code == 1) {
						message.success('失效成功')
						submit()
					}
				})
			},
			onCancel() {
				message.info('优惠券架-下架失效!')
			},
		})
	}

   const copyMa = id => {
    const canvasImg: any = document.getElementById('qrCode' + id) // 获取canvas类型的二维码
    const img = new Image()
    img.src = canvasImg?.toDataURL('image/png') // 将canvas对象转换为图片的data url
    const downLink: any = document.getElementById('down_link' + id)
    downLink.href = img.src
    downLink.download = '二维码' // 图片name
  }
	
	const columns: ColumnProps<IUser>[] = [
		{
			title: '编号',
			dataIndex: 'id',
			align: 'center',
			width: 50,
			render: (a, b, i) => i + 1
		},
		{
			title: '券架',
			dataIndex: 'name',
			align: 'center',
			width: 200
		},
		{
			title: '发布渠道',
			dataIndex: 'channelName',
			align: 'center',
			width: 200,
			render: (status: any, row: any): any => (
				<div>
					{row.channel.map((item, ind) => (<span style={{marginRight: '10px'}}>{item == 'cgj_applet' ? '车管家-微信小程序' : 'H5'},</span>))}
				</div>
			)
		},
		{
			title: '创建人',
			dataIndex: 'createBy',
			align: 'center',
			width: 200
		},
		{
			title: '创建时间',
			dataIndex: 'createTime',
			align: 'center',
			width: 200
		},
		{
			title: '发布状态',
			dataIndex: 'status',
			align: 'center',
			width: 200,
			render: (status: any): string => {
				return status === 1 ? '上架' : '下架'
			}
		},
		{
			title: '操作',
			key: 'action',
			width: 300,
			align: 'center',
			fixed: 'right',
			render: (row: any) => (
				<div>
					{/* status 券架状态{1:上架, 2:下架} */}
					{+row.status === 2 ? (<Button onClick={() => onPublish(row)} type="link">发布</Button>) : null}
					{+row.status === 1 ? (<Button onClick={() => onUnpublish(row)} type="link">下架</Button>) : null}
					{+row.status !== 0 ? (
						<CopyToClipboard text={CARD_APP_ROOT + '/activityCard/' + row.id} onCopy={copyLink}>
							<Button type="link">复制链接</Button>
						</CopyToClipboard>
					) : null}
					{+row.status !== 0 ? (<a id={'down_link' + row.id} onClick={e => copyMa(row.id)}>
						<span style={{ whiteSpace: 'nowrap' }}>下载二维码</span>
						<QRCode
							id={'qrCode' + row.id}
							value={CARD_APP_ROOT + '/activityCard/' + row.id}
							size={200} // 二维码的大小
							fgColor="#000000" // 二维码的颜色
							style={{ margin: 'auto', display: 'none' }}
						/>
					</a>) : null}
					{+row.status === 2 ? (<Button onClick={() => delCard(row.id)} type="link">删除</Button>) : null}
					{+row.status === 2 ? (<Button onClick={() => editCard(row)} type="link">编辑</Button>) : null}
				</div>
			),
		},
	]

  return (
    <div>
      <Spin spinning={loading}>
        <ToolsBar visible={false}>
           <Form form={form} layout="inline">
          <Form.Item name="name" label="券架名称">
            <Input placeholder="券架名称" style={{ width: '150px' }} allowClear />
          </Form.Item>
          <Form.Item name="status" label="券架状态">
            <Select placeholder="券架状态" style={{width: '140px'}} allowClear>
              <Select.Option value="1">上架</Select.Option>
              <Select.Option value="2">下架</Select.Option>
            </Select>
          </Form.Item>
        </Form>
          <div>
					<Button type="primary" icon={<SearchOutlined />} onClick={searchBt}>搜索</Button>
            <Button type="primary" onClick={onAdd}>
              新增
            </Button>
            &nbsp;&nbsp;
          </div>
        </ToolsBar>
				<div className="tableConent">
					<Table
						columns={columns}
						rowKey="id"
						{...tableProps}
						bordered
					/>
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
