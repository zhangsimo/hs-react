/** @format */

import React, { useState, useEffect, } from 'react' //useImperativeHandle
import UploadImg from '@/components/Upload/ImageQN'
import { Form, Row, Col, Input, Space, Button, message, Modal } from 'antd'
import '../style.less'
import * as api from '@/api'
interface IProps { constomerInf: any, closeTabs }
const Changcarplate: React.FC<IProps> = (props, cRef) => {
    const [form] = Form.useForm()
    const [isEdit] = useState<boolean>(false)
    const [applyVisible, setApplyVisible] = useState<boolean>(false)
    // const [constomerInf, setConstomerInf] = useState<any>()
    // useImperativeHandle(cRef, () => ({
    //     save: () => {
    //         console.log('打印父组件调用')
    //     }
    // }))
    const confirmReplace = () => {
        form.validateFields().then(res => {
            let params = (form.getFieldValue as any)()
            delete params.engineNumber
            delete params.carModel
            delete params.remark
            delete params.brand
            delete params.carLine
            delete params.carNoOld
            delete params.simpleCusCarDtos
            delete params.vin
            if (!params.vehicleCertificate2) {
                message.warning('请上传驾驶证反面')
                return
            }
            api.applyChangeCarNo(params).then(res => {
                if (res.code === 1) {
                    setApplyVisible(true)
                }
            })
        }).catch(err => {
            message.warning('请完善相关信息')
        })
    }
    const handleOk = () => {
        setApplyVisible(false)
        props.closeTabs()
    }
    useEffect(() => {
        // setConstomerInf(props.constomerInf)
        const carNoOld = { carNoOld: props.constomerInf.carNo }
        const datas = { ...carNoOld, ...props.constomerInf }
        delete datas.carNo
        form.setFieldsValue(datas)
    }, (props.constomerInf))
    const closePage = () => {
        props.closeTabs()
    }
    return (
        <div className="block_selectCard block" id="step2">
            <Modal
                visible={applyVisible}
                onOk={handleOk}
                width={350}
                centered
                closable={false}
                footer={[
                    <Button type="primary" onClick={handleOk}>我知道了</Button>
                ]}
            >
                <p style={{ margin: '20px' }}>提交审核成功，待店总审核</p>
            </Modal>
            <Form labelCol={{ span: 8 }} form={form}>
                <Row>
                    <Col span={5}>
                        <Form.Item name="carId" label="车辆ID" labelAlign='left'>
                            <Input disabled></Input>
                        </Form.Item>
                    </Col>
                    <Col span={5}>
                        <Form.Item name="vin" label="VIN码">
                            <Input disabled></Input>
                        </Form.Item>
                    </Col>
                    <Col span={5}>
                        <Form.Item name="carModel" label="车型">
                            <Input disabled></Input>
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={5}>
                        <Form.Item name="engineNumber" label="发动机号" labelAlign='left'>
                            <Input disabled></Input>
                        </Form.Item>
                    </Col>
                    <Col span={5}>
                        <Form.Item name="carNoOld" label="车牌号">
                            <Input disabled></Input>
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={14}>
                        <Form.Item name="carNo" label="替换车牌号" labelAlign='left' rules={[{ required: true }]} labelCol={{ span: 3 }}>
                            <Input placeholder="请输入车牌号" allowClear style={{ width: '250px' }}></Input>
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={14} className='driverimages'>
                        <Form.Item label="行驶证图片" name="vehicleCertificate1" labelCol={{ span: 3 }} style={{ marginBottom: 0 }} labelAlign='left' rules={[{ required: true }]}>
                            <Form.Item name="vehicleCertificate1" style={{ display: 'inline-block' }}  >
                                <UploadImg className="id-img-upload" title="请上传行驶证正面" disabled={isEdit} />
                            </Form.Item>
                            <Form.Item name="vehicleCertificate2" style={{ display: 'inline-block' }}>
                                <UploadImg className="id-img-upload" title="请上传行驶证反面" disabled={isEdit} />
                            </Form.Item>
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={14}>
                        <Form.Item label="车辆图片" labelCol={{ span: 3 }} style={{ marginBottom: 0 }} labelAlign='left'>
                            <Form.Item name="carPic1" style={{ display: 'inline-block' }}>
                                <UploadImg className="id-img-upload" title="请上传车辆图片" disabled={isEdit} />
                            </Form.Item>
                            <Form.Item name="carPic2" style={{ display: 'inline-block' }}>
                                <UploadImg className="id-img-upload" title="请上传车辆图片" disabled={isEdit} />
                            </Form.Item>
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={14}>
                        <Form.Item label="备注:" name='commitRemark' colon={false} labelAlign='left' labelCol={{ span: 3 }} rules={[{ required: true }]}>
                            <Input.TextArea rows={4} />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
            <Row>

            </Row>
            <Row>
                <Col span={14}>
                    <Form.Item labelCol={{ span: 6 }} labelAlign='left'>
                        <Space size="large" style={{ marginLeft: '89px' }}>
                            <Button type="primary" onClick={confirmReplace}>确认替换</Button>
                            <Button onClick={closePage}>关闭</Button>
                        </Space>
                    </Form.Item>
                </Col>
            </Row>
        </div>
    )
}

export default Changcarplate