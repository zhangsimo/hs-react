/** @format */

import React, { useEffect } from 'react'
import UploadImg from '@/components/Upload/ImageQN'
import { Form, Row, Col, Input, } from 'antd'
import '../style.less'
// import * as api from '@/api'
interface IProps { }
const Changcarplate: React.FC<IProps> = props => {
    const [form] = Form.useForm()
    useEffect(() => {

    })

    return (
        <div className="block_selectCard block" id="step2">
            <Form labelCol={{ span: 8 }} form={form}>
                <Row>
                    <Col span={5}>
                        <Form.Item name="name" label="车辆ID" labelAlign='left'>
                            车辆ID
                            </Form.Item>
                    </Col>
                    <Col span={5}>
                        <Form.Item name="mobile" label="VIN码">
                            12345
                            </Form.Item>
                    </Col>
                    <Col span={5}>
                        <Form.Item name="source" label="车型">
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={5}>
                        <Form.Item name="name" label="发动机号" labelAlign='left'>

                        </Form.Item>
                    </Col>
                    <Col span={5}>
                        <Form.Item name="mobile" label="车牌号">
                            12345
                            </Form.Item>
                    </Col>
                </Row>
                <Form layout="inline" form={form}>
                    <Form.Item name="customerId" label="替换车牌号">
                        <Input placeholder="请输入车牌号" allowClear style={{ width: '350px' }}></Input>
                    </Form.Item>
                </Form>
                <Row>
                    <Col span={14}>
                        <Form.Item label="行驶证图片" labelCol={{ span: 3 }} style={{ marginBottom: 0 }} labelAlign='left'>
                            <Form.Item name="pic1" style={{ width: 300, display: 'inline-block' }}>
                                <UploadImg className="id-img-upload" title="请上传行驶证正面" disabled='true' />
                            </Form.Item>
                            <Form.Item name="pic2" style={{ width: 300, display: 'inline-block' }}>
                                <UploadImg className="id-img-upload" title="请上传行驶证反面" disabled='true' />
                            </Form.Item>
                        </Form.Item>
                    </Col>
                    <Col span={10}>
                        <Form.Item name="activeTime" label="上传日期" labelCol={{ span: 6 }}>
                            2020年4月30日
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={14}>
                        <Form.Item label="车辆图片" labelCol={{ span: 3 }} style={{ marginBottom: 0 }} labelAlign='left'>
                            <Form.Item name="pic1" style={{ width: 300, display: 'inline-block' }}>
                                <UploadImg className="id-img-upload" title="请上传车辆图片" disabled='true' />
                            </Form.Item>
                            <Form.Item name="pic2" style={{ width: 300, display: 'inline-block' }}>
                                <UploadImg className="id-img-upload" title="请上传车辆图片" disabled='true' />
                            </Form.Item>
                        </Form.Item>
                    </Col>
                    <Col span={10}>
                        <Form.Item name="activeTime" label="上传日期" labelCol={{ span: 6 }}>
                            2020年4月30日
                        </Form.Item>
                    </Col>
                </Row>

            </Form>
        </div>
    )
}

export default Changcarplate
