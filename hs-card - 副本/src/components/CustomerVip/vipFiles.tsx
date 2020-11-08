// /** @format */

// import React, { useState, useEffect } from 'react'
// import { Form, Row, Col, Input, Space, Button } from 'antd'
// import UploadImg from '@/components/Upload/ImageQN'
// import VipExitPop from './vipExitPop'
// import './style.less'
// import { useHistory } from 'react-router-dom'

// // import * as api from '@/api'
// interface IProps {
//   navInf: any[],
//   disabledSign: boolean,
// }
// const vipFiles: React.FC<IProps> = props => {
//   console.log(props, '=============')
//   const [form] = Form.useForm()
//   const history = useHistory()
//   const disabledSign = props.disabledSign
//   const [menuVisible, setMenuVisible] = useState<boolean>(false)
//   useEffect(() => {
//     form.setFieldsValue({ 'name': '姓名', 'address': '地址', pic1: "https://photo.harsonserver.com/FveYkcAHJ7ybboJiRIJ9P0_M64v7" })
//   })
//   const exit = () => {
//     setMenuVisible(true)
//   }
//   const closeMenuVisible = e => {
//     setMenuVisible(e)
//   }
//   return (
//     <div className="block_selectCard block" id="vipFiles">
//       <VipExitPop menuVisible={menuVisible} closeMenuVisible={closeMenuVisible}></VipExitPop>
//       <div className="block_content">
//         <Form form={form}>
//           <Row>
//             <Col span={6}>
//               <Form.Item name="mobile" label="会员卡号" labelAlign='left' >
//                 <Input disabled={disabledSign}></Input>
//               </Form.Item>
//             </Col>
//             <Col span={6}>
//               <Form.Item name="name" label="会员姓名" labelAlign='left'>
//                 <Input disabled={disabledSign}></Input>
//               </Form.Item>
//             </Col>
//             <Col span={6}>
//               <Form.Item name="mobile" label="会员手机号" labelAlign='left'>
//                 <Input disabled={disabledSign} className='inputNum'></Input>
//               </Form.Item>
//             </Col>
//           </Row>
//           <Row>
//             <Col span={6}>
//               <Form.Item name="name" label="注册日期" >
//                 <Input disabled={disabledSign}></Input>
//               </Form.Item>
//             </Col>
//             <Col span={6}>
//               <Form.Item name="source" label="会员等级" >
//                 <Input disabled={disabledSign}></Input>
//               </Form.Item>
//             </Col>
//             <Col span={6}>
//               <Form.Item name="mobile" label="成长值">
//                 <Input disabled={disabledSign}></Input>
//               </Form.Item>
//             </Col>
//           </Row>
//           <Row>
//             <Col span={6}>
//               <Form.Item name="lllll" label="会员积分">
//                 <Input disabled={disabledSign}></Input>
//               </Form.Item>
//             </Col>
//             <Col span={6}>
//               <Form.Item name="birthday" label="信用值">
//                 <Input disabled={disabledSign}></Input>
//               </Form.Item>
//             </Col>
//           </Row>

//           <Row>
//             <Col span={6}>
//               <Form.Item name="name" label="客户ID" >
//                 <Input disabled={disabledSign}></Input>
//               </Form.Item>
//             </Col>
//             <Col span={6}>
//               <Form.Item name="source" label="openID" >
//                 <Input disabled={disabledSign}></Input>
//               </Form.Item>
//             </Col>
//             <Col span={6}>
//               <Form.Item name="mobile" label="unionID">
//                 <Input disabled={disabledSign}></Input>
//               </Form.Item>
//             </Col>
//           </Row>

//           <Row>
//             <Col span={6}>
//               <Form.Item name="name" label="客户姓名" >
//                 <Input disabled={disabledSign}></Input>
//               </Form.Item>
//             </Col>
//             <Col span={6}>
//               <Form.Item name="mobile" label="客户手机号">
//                 <Input disabled={disabledSign}></Input>
//               </Form.Item>
//             </Col>
//             <Col span={6}>
//               <Form.Item name="lllll" label="性别">
//                 <Input disabled={disabledSign}></Input>
//               </Form.Item>
//             </Col>
//           </Row>
//           <Row>
//             <Col span={6}>
//               <Form.Item name="birthday" label="生日日期">
//                 <Input disabled={disabledSign}></Input>
//               </Form.Item>
//             </Col>
//             <Col span={6}>
//               <Form.Item name="address" label="地址">
//                 <Input disabled={disabledSign}></Input>
//               </Form.Item>
//             </Col>
//           </Row>

//           <div className='bortop'>
//             <Row>
//               <Col span={6}>
//                 <Form.Item name="storeCode" label="客户类型" >
//                   <Input disabled={disabledSign}></Input>
//                 </Form.Item>
//               </Col>
//               <Col span={6}>
//                 <Form.Item name="storeCode" label="归属门店" >
//                   <Input disabled={disabledSign}></Input>
//                 </Form.Item>
//               </Col>
//               <Col span={6}>
//                 <Form.Item name="employeeName" label="归属员工">
//                   <Input disabled={disabledSign}></Input>
//                 </Form.Item>
//               </Col>
//             </Row>
//             <Row>
//               <Col span={6}>
//                 <Form.Item name="storeCode" label="分类" >
//                   <Input disabled={disabledSign}></Input>
//                 </Form.Item>
//               </Col>
//               <Col span={6}>
//                 <Form.Item name="employeeName" label="客户来源" >
//                   <Input disabled={disabledSign}></Input>
//                 </Form.Item>
//               </Col>
//               <Col span={6}>
//                 <Form.Item name="groupId" label="服务小组">
//                   <Input disabled={disabledSign}></Input>
//                 </Form.Item>
//               </Col>
//             </Row>

//             <Row>
//               <Col span={6}>
//                 <Form.Item name="storeCode" label="客户车辆">
//                   <Input disabled={disabledSign}></Input>
//                 </Form.Item>
//               </Col>
//             </Row>

//             <Row>
//               <Col span={6}>
//                 <Form.Item name="employeeName" label="意向级别">
//                   <Input disabled={disabledSign}></Input>
//                 </Form.Item>
//               </Col>
//               <Col span={6}>
//                 <Form.Item name="groupId" label="标签">
//                   <Input disabled={disabledSign}></Input>
//                 </Form.Item>
//               </Col>
//               <Col span={6}>
//                 <Form.Item name="groupId" label="跟踪优先级">
//                   <Input disabled={disabledSign} className='inputNum'></Input>
//                 </Form.Item>
//               </Col>
//             </Row>
//           </div>

//           <div className='bortop'>
//             <Row>
//               <Col span={6}>
//                 <Form.Item name="idNumber" label="身份证号码">
//                   <Input disabled={disabledSign} className='inputNum'></Input>
//                 </Form.Item>
//               </Col>
//             </Row>
//             <Row>
//               <Col span={12}>
//                 <Form.Item label="身份证图片" labelCol={{ span: 3 }} style={{ marginBottom: 0 }}>
//                   <Form.Item name="pic1" style={{ display: 'inline-block' }}>
//                     <UploadImg className="id-img-upload" title="请上传身份证正面" disabled={true} />
//                   </Form.Item>
//                   <Form.Item name="pic2" style={{ display: 'inline-block' }}>
//                     <UploadImg className="id-img-upload" title="请上传身份证反面" disabled={true} />
//                   </Form.Item>
//                 </Form.Item>
//               </Col>
//               <Col span={6}>
//                 <Form.Item name="idNumber" label="身份证上传日期">
//                   <Input disabled={disabledSign} className='inputNum'></Input>
//                 </Form.Item>
//               </Col>
//             </Row>
//             <Row>
//               <Col span={12}>
//                 <Form.Item label="驾驶证图片" labelCol={{ span: 3 }} style={{ marginBottom: 0 }}>
//                   <Form.Item name="pic3" style={{ display: 'inline-block' }}>
//                     <UploadImg className="id-img-upload" title="请上传驾驶证正面" disabled={true} />
//                   </Form.Item>
//                   <Form.Item name="pic4" style={{ display: 'inline-block' }}>
//                     <UploadImg className="id-img-upload" title="请上传驾驶证反面" disabled={true} />
//                   </Form.Item>
//                 </Form.Item>
//               </Col>
//               <Col span={6}>
//                 <Form.Item name="idNumber" label="驾驶证上传日期">
//                   <Input disabled={disabledSign} className='inputNum'></Input>
//                 </Form.Item>
//               </Col>
//             </Row>
//             <Row>
//               <Col span={24}>
//                 <Form.Item label=" " colon={false} labelCol={{ span: 2 }}>
//                   <Space size="large">
//                     <Button onClick={exit}>修改</Button>
//                     <Button type="primary" onClick={() => history.goBack()}>
//                       关闭
//                     </Button>
//                   </Space>
//                 </Form.Item>
//               </Col>
//             </Row>
//           </div>
//         </Form>
//       </div>
//     </div>
//   )
// }

// export default vipFiles
