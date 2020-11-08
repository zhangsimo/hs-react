/** @format */

import {Button, Form, Input, message, Modal, Select, Table} from 'antd'
import React, {useEffect, useState} from 'react'
import {ColumnProps} from 'antd/lib/table'
import {useHistory} from 'react-router-dom'
import * as api from '@/api'
import {IGoodDetailHead} from '@/interface'
import './index.less'
import {useBoolean} from '@umijs/hooks'
import Company from '../edit/modal/company'

interface IProps {
  visible: boolean //是否显示
  goodId: number | undefined //商品ID
  onCancel: () => void
  // onOk?: (item: IDictCategoryType) => void
  // setVisible: (a: boolean) => void
}

const SelectCarModelPage: React.FC<IProps> = props => {
  const visibleCompany = useBoolean(false)
  const [form] = Form.useForm()
  const {confirm} = Modal
  const history = useHistory()
  const [detailData, setDetailData] = useState<IGoodDetailHead>()
  const [detailTableData, setDetailTableData] = useState<Array<any>>([])
  // const [compCodes, setCompCodes] = useState<Array<any>>([])

  const loadData = () => {
    api.goodsDetailHead({id: props.goodId}).then(res => {
      // console.log('res:', res)
      setDetailTableData(res.data.items)
      setDetailData(res.data)
      form.setFieldsValue({
        productType: res.data.productType,
        itemName: res.data.itemName,
      })
    })
  }

  useEffect(() => {
    if (props.goodId) {
      loadData()
    }
  }, [props.goodId])

  const onSubmit = () => {
    form.validateFields().then(async values => {
      api
        .addGoodComp({
          compCodes: detailTableData.map(item => item.compCode),
          itemId: detailData?.id,
          itemName: detailData?.itemName,
        })
        .then((res: any) => {
          console.log('res:', res)
          if (res.code === 1) {
            message.success('保存成功')
          }
          props.onCancel()
          // console.log('res:', res)
        })
    })
  }

  const addCompany = () => {
    visibleCompany.setTrue()
    // const orgCodes: any = companyList.map(o => (o.compCode ? o.compCode : o.shopCode))
    // setOrgCodes(orgCodes)
  }

  const setApplicableStores = val => {
    console.log('val:', val)
    const selectedRows = val.selectedRows
    setDetailTableData(pre => {
      const tempArr = [...pre]
      selectedRows.forEach(item => {
        if (!tempArr.some(ele => ele.compCode === item.compCode)) {
          tempArr.push({
            compCode: item.compCode,
            compName: item.compName,
            // "itemId": 0,
            itemName: detailData?.itemName,
            itemNum: 0,
            salesNum: 0,
            showPrice: 0,
            status: 99,
            unit: '',
          })
          // setCompCodes(preComp => {
          //   const tempArrComp = [...preComp]
          //   tempArrComp.push(item.compCode)
          //   return tempArrComp
          // })
        }
      })
      return tempArr
    })
    // const keys = [...val.selectedRowKeys, ...orgCodes]
    // let rows = [...val.selectedRows, ...companyList]
    // const keysN = [...new Set(keys)]
    // const rowsNew = rows.reduce(
    //   (all, next) => (all.some((item: any) => item['shopCode'] == next['shopCode']) ? all : [...all, next]),
    //   [],
    // )
    // setOrgCodes(keysN)
    // setCompanyList(rowsNew)
    // form.setFieldsValue({orgCodes: keysN})
  }

  const onUpate = (id, opType, text = '确定下架？') => {
    confirm({
      title: '提示',
      content: text,
      onOk() {
        api.updateGoods({productIds: [id], opType}).then(() => {
          loadData()
          switch (opType) {
            case 1:
              message.success('上架成功')
              break
            case 2:
              message.success('下架成功')
              break
            case 3:
              message.success('回收成功')
              break
            case 4:
              message.success('还原成功')
              break
          }
        })
      },
    })
  }

  const columns: ColumnProps<any>[] = [
    // {
    //   title: '序号',
    //   align: 'left',
    //   render: (text, record, index) => `${index + 1}`,
    // },
    {
      title: '门店简称',
      dataIndex: 'compName',
      align: 'left',
    },
    {
      title: '商品销售名称',
      dataIndex: 'itemName',
      align: 'left',
    },
    {
      title: '页面显示价格',
      dataIndex: 'showPrice',
      align: 'left',
    },
    {
      title: '单位',
      dataIndex: 'unit',
      align: 'left',
      width: 100,
    },
    {
      title: '销量',
      dataIndex: 'salesNum',
      align: 'left',
      width: 100,
    },
    {
      title: '状态',
      dataIndex: 'status',
      align: 'left',
      render: (value, row) => {
        if (row.status === 1) return '仓库中'
        else if (row.status === 2) return '上架中'
        else if (row.status === 3) return '回收站'
        else return
      },
    },
    // {
    //   title: '状态',
    //   dataIndex: 'paymentTime',
    //   align: 'left',
    //   render: (value, row) => (row.type === 2 ? '已分组' : '未分组'),
    // },
    {
      title: '操作',
      align: 'left',
      width: 300,
      render: row => (
        <div>
          {row.itemId && (
            <Button
              type="link"
              onClick={() => {
                history.push(`/shop/edit?id=${row.itemId}&compCode=${row.compCode}&headItemFlag=1`)
                props.onCancel()
              }}>
              编辑商品
            </Button>
          )}
          {row.status === 1 && (
            <>
              <Button onClick={() => onUpate(row.itemId, 1, '确定上架？')} type="link">
                立即上架
              </Button>
              <Button onClick={() => onUpate(row.itemId, 3, '确定删除？')} type="link">
                回收站
              </Button>
            </>
          )}
          {row.status === 2 && (
            <Button onClick={() => onUpate(row.itemId, 2, '确定下架？')} type="link">
              立即下架
            </Button>
          )}
          {row.status === 3 && (
            <Button onClick={() => onUpate(row.itemId, 4, '确定还原？')} type="link">
              还原
            </Button>
          )}
        </div>
      ),
    },
  ]

  return (
    <>
      <Modal
        zIndex={98}
        title="商品详情"
        visible={props.visible}
        onCancel={props.onCancel}
        onOk={onSubmit}
        width={1100}
        bodyStyle={{paddingBottom: 0}}>
        <div id="headListDet">
          <Form form={form}>
            <div className="area">
              <div className="area-header">基础信息</div>
              <div className="area-main">
                <Form.Item name="productType" label="商品类型" labelCol={{span: 2}} wrapperCol={{span: 10}}>
                  <Select placeholder="选择商品类型" allowClear style={{width: '100%'}} disabled>
                    <Select.Option value="1">普通商品</Select.Option>
                    <Select.Option value="2">工时</Select.Option>
                    <Select.Option value="3">配件</Select.Option>
                    <Select.Option value="4">项目</Select.Option>
                    <Select.Option value="5">套餐</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item
                  name="itemName"
                  label="销售名称"
                  rules={[{required: true}]}
                  labelCol={{span: 2}}
                  wrapperCol={{span: 10}}>
                  <Input placeholder="请输入销售名称" allowClear></Input>
                </Form.Item>
              </div>
            </div>
            <div className="area">
              <div className="area-header">发布范围</div>
              <div className="area-main">
                <div style={{backgroundColor: 'white', marginTop: '12px'}}>
                  <Form.Item
                    name="shopName"
                    label="适用门店"
                    // rules={[{required: true, message: '请选择适用门店'}]}
                    labelCol={{span: 2}}>
                    <Button type="primary" onClick={() => addCompany()}>
                      添加适用门店
                    </Button>
                  </Form.Item>
                  <Table
                    size="small"
                    columns={columns}
                    rowKey="compCode"
                    dataSource={detailTableData}
                    pagination={false}
                    scroll={{y: 300}}
                  />
                </div>
              </div>
            </div>
          </Form>
        </div>
      </Modal>
      <Company visible={visibleCompany.state} setVisible={visibleCompany.toggle} onOk={setApplicableStores} />
    </>
  )
}

export default SelectCarModelPage
