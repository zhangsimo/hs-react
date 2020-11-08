/** @format */

import React, {useState, useEffect} from 'react'
import {
  Form,
  Input,
  Row,
  Col,
  Button,
  message,
  Modal,
  Spin,
  //Popconfirm
} from 'antd'
import {
  ExclamationCircleOutlined,
  //QuestionCircleOutlined
} from '@ant-design/icons'
import * as api from '@/api'
import AddCustomer from '../components/addCustomer'
// import HaveGoods from '../components/haveGoods'
import HaveGoodsPop from '../components/haveGoodsPop'
import GoodMix from '../components/goodMix'
import GoodMall from '../components/goodMall'
import AddGoodPop from '../components/addGoodPop'
import useSearchParam from '@/hooks/useSearchParam'
import TagViewStore from '@/store/tag-view'
import PayWay from '../components/payWay'
import {useHistory} from 'react-router-dom'
import {includes} from 'lodash'
const OrderDetail = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const {confirm} = Modal
  const history = useHistory()
  const [form] = Form.useForm()
  const [custormShow, setCustormShow] = useState<boolean>(false)
  const [haveGoodShow, setHaveGoodShow] = useState<boolean>(false)
  const [refundShow, setRefundShow] = useState<boolean>(false)
  const [customerInfoBO, setCustomerInfoBO] = useState<any>()
  const [customerDetailData, setCustomerDetailData] = useState<any>()
  const [serviceItemsOrderList, setServiceItemsOrderList] = useState<any>()
  // const [haveGoodOrderList, setHaveGoodOrderList] = useState<any>()
  const [packageOrderList, setPackageOrderList] = useState<any>()
  const [customerId, setCustomerId] = useState<String>('') //setCustomerId
  const [carModelId] = useState<String>('00000000') //60000416
  const [replacegoodShow, setReplacegoodShow] = useState<boolean>(false)
  const [receiptShow, setReceiptShow] = useState<boolean>(false)
  const [receiptPopData, setReceiptPopData] = useState<any>()
  const [childOrderIdRefund, setChildOrderIdRefund] = useState<any>()
  const parmId = useSearchParam('orderId')
	const type = useSearchParam('orderType')
  const herf = window.location.href
  const orderId: any = parmId
    ? parmId
    : includes(herf, 'orderdetail')
    ? sessionStorage.getItem('orderId')
      ? sessionStorage.getItem('orderId')
      : ''
    : ''
	const orderType: any = type
	  ? type
	  : includes(herf, 'orderdetail')
	  ? sessionStorage.getItem('orderType')
	    ? sessionStorage.getItem('orderType')
	    : ''
	  : ''
  const {delView} = TagViewStore.useContainer()
  useEffect(() => {
		if (orderType) {
			sessionStorage.setItem('orderType', orderType)
		}
    if (orderId) {
      setLoading(true)
      sessionStorage.setItem('orderId', orderId)
			if (orderType == 'micro_mall') {
				getOrderMicroMallDetail()
			} else {
				getOrderData()
			}
     
    }
		
  }, [orderId, orderType])
	
	const getOrderMicroMallDetail = () => {
	  api.getOrderMicroMallDetail({orderId: orderId}).then(res => {
	    const data: any = res.data
	    let customerInfo: any = {
	      name: data.realName,
	      mobile: data.userPhone,
	      carNo: data.carNo,
	      vin: data.vin,
	      carModel: data.carModel,
	      cameMileage: data.cameMileage,
	      customerId: data.customerId,
	      carId: data.carId,
	    }
	    setCustomerId(data.customerId)
	    // getHaveGoodData(data.customerId)//获取客户已购商品
	    setCustomerInfoBO(customerInfo)
	    setCustomerDetailData(data)
	    setServiceItemsOrderList(data.serviceItemsOrderList)
	    data.packageOrderList = data.packageOrderList.map(o => {
	      const subItemVos = o.products
	      return {...o, subItemVos: subItemVos, products: []}
	    })
	    setPackageOrderList(data.packageOrderList)
	    setLoading(false)
	  })
	}
	
  const getOrderData = () => {
    api.getOrderDetailOrderId(orderId).then(res => {
      const data: any = res.data
      let customerInfo: any = {
        name: data.realName,
        mobile: data.userPhone,
        carNo: data.carNo,
        vin: data.vin,
        carModel: data.carModel,
        cameMileage: data.cameMileage,
        customerId: data.customerId,
        carId: data.carId,
      }
      setCustomerId(data.customerId)
      // getHaveGoodData(data.customerId)//获取客户已购商品
      setCustomerInfoBO(customerInfo)
      setCustomerDetailData(data)
      setServiceItemsOrderList(data.serviceItemsOrderList)
      data.packageOrderList = data.packageOrderList.map(o => {
        const subItemVos = o.products
        return {...o, subItemVos: subItemVos, products: []}
      })
      setPackageOrderList(data.packageOrderList)
      setLoading(false)
    })
  }
  // const getHaveGoodData = async (customerId) => {
  //   const { data: orderData } = await api.getOrderDetailBuyProduct({ customerId: customerId, orderId: orderId })
  //   setHaveGoodOrderList(orderData)
  // }
  const custormEdit = () => {
    setCustormShow(true)
  }
  const custormCancel = () => {
    setCustormShow(false)
  }
  const haveGoodpopCancel = () => {
    setHaveGoodShow(false)
  }
  const custormCommit = val => {
    setCustormShow(false)
    setCustomerInfoBO(val)
    getOrderData()
  }
  const replacegoodShowCancel = () => {
    setReplacegoodShow(false)
  }
  const getOrderReceipt = () => {
    if (customerDetailData.customerId === '0' && customerDetailData.readyRepairNum > 0) {
      //游客身份不能直接收款
      showConfirm()
      return
    }
    if (customerDetailData.readyRepairNum != 0) {
      message.error('存在未派工项目，请先行派工再付款')
      return
    }
    setReceiptShow(true)
    let receiptPopData = {
      orderId: customerDetailData.orderId,
      payableAmt: customerDetailData.payableAmt,
      paidAmt: customerDetailData.paidAmt ? customerDetailData.paidAmt : 0,
    }
    setReceiptPopData(receiptPopData)
  }

  // const cancelOrder = () => {
  // 	api.getOrderCancel({ orderId: customerDetailData.orderId }).then(res => {
  // 	  if (res.code === 1) {
  // 	    message.success('取消订单成功')
  // 	    closePage()
  // 	  }
  // 	})
  // }

  const showConfirm = () => {
    confirm({
      title: '提示',
      icon: <ExclamationCircleOutlined />,
      content: '当前用户身份为游客，且订单中包含未派工项目，请补充客户手机号和姓名进行收款，或删除未派工的项目进行收款',
    })
  }
  const onReceiptCancel = () => {
    setReceiptShow(false)
  }
  const onReceiptPaySuccess = () => {
    setReceiptShow(false)
    closePage()
  }

  const delChildOrderId = async row => {
    let data: any = ''
    if (row.orderType === 'package_type') {
      data = await api.delChildOrderIdProject(row.childOrderId)
    } else {
      data = await api.delChildOrderIdProduct(row.orderProductId)
    }
    if (data.code === 1) {
      message.success('删除成功')
      getOrderData()
    } else {
      message.error(data.msg)
    }

    // if (res.code === 1) {
    //   message.success('派工成功')
    // } else {
    //   message.error(res.msg)
    // }
  }
  const closePage = () => {
    delView({pathname: '/ordermanage/orderdetail', state: {title: '订单详情'}})
    history.push('/ordermanage/List')
  }
  const childRefund = val => {
    setRefundShow(true)
    const params: any = {}
    if (val.orderType === 'package_type') {
      params.childOrderIds = [val.childOrderId] //套餐按子订单退
    } else {
      params.orderProductIds = [val.orderProductId] //项目按子商品退
    }
    // const params = {
    //   orderType: val.orderType,
    //   childOrderId: val.childOrderId
    // }
    setChildOrderIdRefund(params)
  }
  const onOkRefund = () => {
    api.getOrderRefund(childOrderIdRefund).then(res => {
      if (res.code === 1) {
        message.success('退款成功')
        setRefundShow(false)
        getOrderData()
      }
    })
  }
  const onCanRefund = () => {
    setRefundShow(false)
  }

  return (
    <div className="block orderdetail">
      <Spin spinning={loading}>
        <HaveGoodsPop
          haveGoodShow={haveGoodShow}
          customerId={customerId}
          haveGoodpopCancel={haveGoodpopCancel}
          carModelId={carModelId}></HaveGoodsPop>
        <AddCustomer
          title={customerDetailData && customerDetailData.payState === 'OPS001' ? '补充客户信息' : '添加客户/车辆'}
          custormShow={custormShow}
          orderId={orderId}
          custormCancel={custormCancel}
          custormCommit={custormCommit}
          customerInfoBO={customerInfoBO}
        />
        <div className="block_title">
          <span>订单详情</span>
        </div>
        <Form form={form}>
          {orderId ? (
            <>
              <div className="orderdetailC">
                <div className="ctitle ctitlem">
                  <span>订单信息</span>
                </div>
                <Row>
                  <Col span={8}>
                    <Form.Item name="orderId" label="订单号">
                      <span slot="label">
                        {customerDetailData && customerDetailData.orderId ? customerDetailData.orderId : '无'}
                      </span>
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item name="orderChannelName" label="订单来源">
                      <span slot="label">
                        {customerDetailData && customerDetailData.orderChannelName
                          ? customerDetailData.orderChannelName
                          : '无'}
                      </span>
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item name="payState" label="订单状态">
                      <span slot="label">
                        {customerDetailData && customerDetailData.payState
                          ? customerDetailData.payState === 'OPS001'
                            ? '待付款'
                            : customerDetailData.payState === 'OPS002'
                            ? '已付款'
                            : ''
                          : '无'}
                      </span>
                    </Form.Item>
                  </Col>
                </Row>
              </div>
            </>
          ) : (
            ''
          )}

          <div className="orderdetailC">
            <div className="ctitle">
              <span>客户信息</span>
              {(customerDetailData && customerDetailData.payState === 'OPS001' && customerId === '0') ||
              !customerDetailData ? (
                <Button onClick={custormEdit} type="primary">
                  编辑
                </Button>
              ) : (
                ''
              )}
            </div>
            <Row>
              <Col span={8}>
                <Form.Item name="workCode" label="客户姓名" labelCol={{span: 8}}>
                  {customerInfoBO && customerInfoBO.name ? (
                    <span slot="label">{customerInfoBO.name}</span>
                  ) : (
                    <Input disabled />
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="mobile" label="客户电话">
                  {customerInfoBO && customerInfoBO.mobile ? (
                    <span slot="label">{customerInfoBO.mobile}</span>
                  ) : (
                    <Input disabled />
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="carNo" label="车牌号">
                  {customerInfoBO && customerInfoBO.carNo ? (
                    <span slot="label">{customerInfoBO.carNo}</span>
                  ) : (
                    <Input disabled />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <Form.Item name="vin" label="VIN码" labelCol={{span: 8}}>
                  {customerInfoBO && customerInfoBO.vin ? (
                    <span slot="label">{customerInfoBO.vin}</span>
                  ) : (
                    <Input disabled />
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="carModel" label="车型">
                  {customerInfoBO && customerInfoBO.carModel ? (
                    <span slot="label">{customerInfoBO.carModel}</span>
                  ) : (
                    <Input disabled />
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="cameMileage" label="进厂里程数">
                  {customerInfoBO && customerInfoBO.cameMileage ? (
                    <span slot="label">{customerInfoBO.cameMileage}</span>
                  ) : (
                    <Input disabled />
                  )}
                </Form.Item>
              </Col>
            </Row>
          </div>
        </Form>
        {orderId ? (
          <>
            <div className="orderdetailC">
              <div className="ctitle ctitlem">
                <span>销售门店信息</span>
              </div>
              <Row>
                <Col span={8}>
                  <Form.Item name="compCode" label="门店编码" labelCol={{span: 8}}>
                    <span slot="label">
                      {customerDetailData && customerDetailData.compCode ? customerDetailData.compCode : '无'}
                    </span>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="manageType" label="门店性质">
                    <span slot="label">
                      {customerDetailData && customerDetailData.manageType ? customerDetailData.manageType : '无'}
                    </span>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="address" label="门店地址">
                    <span slot="label">
                      {customerDetailData && customerDetailData.address ? customerDetailData.address : '无'}
                    </span>
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <Form.Item name="legalPerspn" label="门店简称" labelCol={{span: 8}}>
                    <span slot="label">
                      {customerDetailData && customerDetailData.legalPerson ? customerDetailData.legalPerson : '无'}
                    </span>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="maturity" label="门店类型">
                    <span slot="label">
                      {customerDetailData && customerDetailData.maturity ? customerDetailData.maturity : '无'}
                    </span>
                  </Form.Item>
                </Col>
              </Row>
            </div>
          </>
        ) : (
          ''
        )}
        {/* <div className='orderdetailC'>
        <div className='ctitle ctitlem'>
          <span>已购商品</span>
          {
            customerDetailData && customerDetailData.payState ? '' : <Button onClick={() => setHaveGoodShow(true)} type="primary">选择已购项目</Button>
          }
        </div>
        <GoodMix childRefund={childRefund} delChildOrderId={delChildOrderId} carModelId={carModelId} sign='haveGood' payStatus={customerDetailData && customerDetailData.payState ? customerDetailData.payState : ''} serviceItemsOrderList={haveGoodOrderList} />
      </div> */}

        <div className="orderdetailC">
          <div className="ctitle ctitlem">
            <span>服务项目</span>
            {/* < Button onClick={() => setReplacegoodShow(true)} type="primary">添加项目</Button> */}
            {/* {
            customerDetailData && customerDetailData.payState ? '' : < Button onClick={() => setReplacegoodShow(true)} type="primary">新增商品</Button>
          } */}
          </div>
					{
						customerDetailData && customerDetailData.orderChannelName=='线下门店' ? (
							<GoodMix
							  refreshDeatailData={getOrderData}
							  childRefund={childRefund}
							  delChildOrderId={delChildOrderId}
							  carModelId={carModelId}
							  sign="good"
							  payStatus={customerDetailData && customerDetailData.payState ? customerDetailData.payState : ''}
							  serviceItemsOrderList={serviceItemsOrderList}
							/>
						) : (
							<GoodMall
								childRefund={childRefund}
								serviceItemsOrderList={serviceItemsOrderList}
							></GoodMall>
						)
					}

          <AddGoodPop
            replaceTitpop="添加商品"
            replacegoodShow={replacegoodShow}
            replacegoodShowCancel={replacegoodShowCancel}></AddGoodPop>
        </div>

        <div className="orderdetailC">
          <div className="ctitle ctitlem">
            <span>购买套餐</span>
            {customerDetailData && customerDetailData.payState ? (
              ''
            ) : (
              <Button onClick={() => setReplacegoodShow(true)} type="primary">
                添加套餐
              </Button>
            )}
          </div>
					{
						customerDetailData && customerDetailData.orderChannelName=='线下门店' ? (
							<GoodMix
							  refreshDeatailData={getOrderData}
							  childRefund={childRefund}
							  delChildOrderId={delChildOrderId}
							  carModelId={carModelId}
							  sign="good"
							  payStatus={customerDetailData && customerDetailData.payState ? customerDetailData.payState : ''}
							  serviceItemsOrderList={packageOrderList}
							  goodType="meal"
							/>
						) : (
							<GoodMall
								childRefund={childRefund}
								serviceItemsOrderList={packageOrderList}
								goodType="meal"
							></GoodMall>
						)
					}
          
          <AddGoodPop
            replaceTitpop="添加套餐"
            carModelId={carModelId}
            replacegoodShow={replacegoodShow}
            replacegoodShowCancel={replacegoodShowCancel}></AddGoodPop>
        </div>
        <div className="orderdetailC">
          <div className="cusPrice">
            <p>
              销售金额:{' '}
              <span>{customerDetailData && customerDetailData.totalAmt ? customerDetailData.totalAmt : 0}</span>
            </p>
            <p>
              实付金额: <span>{customerDetailData && customerDetailData.paidAmt ? customerDetailData.paidAmt : 0}</span>
            </p>
            <p>
              退款金额:{' '}
              <span>{customerDetailData && customerDetailData.refundPrice ? customerDetailData.refundPrice : 0}</span>
            </p>
          </div>
        </div>
        <div className="footerBtn">
          <div>
            {customerDetailData && (customerDetailData.payState === 'OPS001' && customerDetailData.orderChannelName=='线下门店') ? (
              <Button type="primary" onClick={() => getOrderReceipt()}>
                收 款
              </Button>
            ) : (
              ''
            )}

            {
              //customerDetailData && customerDetailData.payState === 'OPS001' ? <Popconfirm title="您确定取消该订单吗？" icon={<QuestionCircleOutlined style={{ color: 'red' }} />} onConfirm={() => cancelOrder()}><Button type="primary" danger style={{marginTop: '8px'}}>取消订单</Button></Popconfirm> : ''
            }

            <Button onClick={closePage}>返 回</Button>
          </div>
        </div>
        <PayWay
          onReceiptCancel={onReceiptCancel}
          receiptShow={receiptShow}
          receiptPopData={receiptPopData}
          onReceiptPaySuccess={onReceiptPaySuccess}
        />
        <Modal
          width="300px"
          title="提示"
          visible={refundShow}
          onOk={onOkRefund}
          onCancel={onCanRefund}
          okText="确认"
          cancelText="取消">
          <p>确定进行退款操作 ？</p>
        </Modal>
      </Spin>
    </div>
  )
}

export default OrderDetail
