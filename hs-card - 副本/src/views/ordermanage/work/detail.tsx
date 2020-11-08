/** @format */

import React, {useState, useEffect} from 'react'
import {Form, Input, Row, Col, Steps, Spin} from 'antd'
import * as api from '@/api'
import useSearchParam from '@/hooks/useSearchParam'
const WorkDetail = () => {
  const [loading, setLoading] = useState<boolean>(true)
  const {Step} = Steps
  const [form] = Form.useForm()
  const paramWorkId = useSearchParam('workId')
  const workId = paramWorkId ? paramWorkId : sessionStorage.getItem('workId') ? sessionStorage.getItem('workId') : ''
  const [mainProjectList, setMainProjectList] = useState<any[]>([])
  useEffect(() => {
    if (workId) {
      getOrderPageDetail()
      sessionStorage.setItem('workId', workId)
    }
  }, [workId])

  const getOrderPageDetail = () => {
    api.getOrderPageDetail(workId).then(res => {
      const data: any = res.data
      data.mainProjectList && data.mainProjectList.length > 0
        ? data.mainProjectList.map(o => {
            //2已经派工  3物料准备 4施工中 6已完工
            o.status = o.status === 2 ? 0 : o.status === 3 ? 1 : o.status === 4 ? 2 : 3
          })
        : ''
      setMainProjectList(data.mainProjectList)
      for (let [key] of Object.entries(data)) {
        data[key] = data[key] ? data[key] : '无'
      }
      data.status = data.status === 1 ? '待施工' : data.status === 2 ? '已施工' : '已完成'
      form.setFieldsValue(data)
      setLoading(false)
    })
  }
  return (
    <div className="block workldetail">
      <Spin spinning={loading}>
        <div className="block_title">
          <span>详情</span>
        </div>
        <Form labelCol={{span: 6}} form={form}>
          <div className="workldetailC">
            <div className="ctitle">
              <span>工单信息</span>
            </div>

            <Row>
              <Col span={8}>
                <Form.Item name="workCode" label="工单号" labelCol={{span: 6}}>
                  <Input disabled></Input>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="compName" label="服务门店" labelCol={{span: 6}}>
                  <Input disabled></Input>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="customerName" label="用户" labelCol={{span: 6}}>
                  <Input disabled></Input>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <Form.Item name="carNo" label="车牌号" labelCol={{span: 6}}>
                  <Input disabled></Input>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="carModel" label="车型" labelCol={{span: 6}}>
                  <Input disabled></Input>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="status" label="工单状态" labelCol={{span: 6}}>
                  <Input disabled></Input>
                </Form.Item>
              </Col>
            </Row>
          </div>

          {mainProjectList && mainProjectList.length > 0
            ? mainProjectList.map(item => (
                <div className="workldetailC workldetailP">
                  <div className="ctitle">
                    <span>订单信息</span>
                  </div>
                  <Row>
                    <Col span={8}>
                      <Form.Item name="orderId" label="订单号" labelCol={{span: 6}}>
                        <Input disabled></Input>
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item name="dispatchDate" label="派工时间" labelCol={{span: 6}}>
                        <span slot="label">{item.dispatchDate ? item.dispatchDate : '无'}</span>
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item name="childOrderCode" label="子单号" labelCol={{span: 6}}>
                        <span slot="label">{item.childOrderCode ? item.childOrderCode : '无'}</span>
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={8}>
                      <Form.Item name="expectFinishDate" label="预计完工时间" labelCol={{span: 6}}>
                        <span slot="label">{item.expectFinishDate ? item.expectFinishDate : '无'}</span>
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item name="storeName" label="施工项目" labelCol={{span: 6}}>
                        <span slot="label">{item.storeName ? item.storeName : '无'}</span>
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item name="status" label="施工状态" labelCol={{span: 6}}>
                        <span slot="label">
                          {item.status === 0
                            ? '待施工'
                            : item.status === 1
                            ? '领料中'
                            : item.status === 2
                            ? '施工中'
                            : '已完工'}
                        </span>
                      </Form.Item>
                    </Col>
                  </Row>
                  <div className="stepsDiv">
                    <Steps progressDot current={item.status} style={{width: '60%', margin: '20px 0'}}>
                      <Step title="待施工" />
                      <Step title="领料中" className={item.status > 0 ? 'step2' : ''} />
                      <Step title="施工中" className={item.status > 1 ? 'step3' : ''} />
                      <Step title="已完工" className={item.status > 2 ? 'step3' : ''} />
                    </Steps>
                  </div>
                  {/* <div className='stepbtom'>
                <Button type="primary">
                  终止
              </Button>
              </div> */}
                </div>
              ))
            : ''}
        </Form>
      </Spin>
    </div>
  )
}

export default WorkDetail
