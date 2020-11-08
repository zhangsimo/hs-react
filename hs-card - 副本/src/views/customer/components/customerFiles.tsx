// /** @format */

// import React, { useEffect } from 'react'
// import { Form, Row, Col, Input, Space, Button, Select, message } from 'antd'
// import UploadImg from '@/components/Upload/ImageQN'
// import '../style.less'
// // import * as api from '@/api'
// interface IProps {
//   navInf: any[]
// }

// const customerFiles: React.FC<IProps> = props => {
//   console.log(props.navInf, '-----props.navINf----')
//   const [form] = Form.useForm()

//   useEffect(() => {
//     form.setFieldsValue({ 'name': '姓名', 'address': '地址' })
//   })
//   const save = () => {
//     form
//       .validateFields()
//       .then(res => {
//         let params = (form.getFieldValue as any)()
//         console.log(params, '---点击了保存按钮=====')
//         let picArr: Array<any> = []
//         for (let i = 1; i <= 4; i++) {
//           if (params['pic' + i]) {
//             picArr.push({
//               fileUrl: params['pic' + i],
//               sourceType: i,
//             })
//           }
//         }
//         params.files = picArr
//         console.log('params:', params)
//         return false
//         // api.saveCustomerInfo(params).then(res => {
//         //   console.log('res:', res)
//         // })
//       })
//       .catch(err => {
//         console.log('err:', err)
//         message.warning('请完善相关信息')
//       })
//   }
//   return (
//     <div className="block_selectCard block" id="addCustomer">
//       <div className="block_content">
//         {console.log(props.navInf, '-------------------------------')}
//         <Form labelCol={{ span: 8 }} form={form}>
//           <Row>
//             <Col span={6}>
//               <Form.Item name="name" label="客户姓名" rules={[{ required: true }]}>
//                 <Input disabled></Input>
//               </Form.Item>
//             </Col>
//             <Col span={6}>
//               <Form.Item name="mobile" label="手机号" rules={[{ required: true }]}>
//                 <Input disabled></Input>
//               </Form.Item>
//             </Col>
//             <Col span={6}>
//               <Form.Item name="source" label="客户来源" rules={[{ required: true }]}>
//                 <Input></Input>
//               </Form.Item>
//             </Col>
//           </Row>
//           <Row>
//             <Col span={6}>
//               <Form.Item name="lllll" label="性别">
//                 <Input></Input>
//               </Form.Item>
//             </Col>
//             <Col span={6}>
//               <Form.Item name="birthday" label="生日">
//                 <Input></Input>
//               </Form.Item>
//             </Col>
//             <Col span={6}>
//               <Form.Item name="sort" label="分类">
//                 <Input></Input>
//               </Form.Item>
//             </Col>
//           </Row>
//           <Row>
//             <Col span={24}>
//               <Form.Item label="地址" labelCol={{ span: 2 }} style={{ marginBottom: 0 }}>
//                 <Form.Item name="province" style={{ width: 150, display: 'inline-block' }}>
//                   <Select placeholder="选择省份">
//                     <Select.Option value="1">全部</Select.Option>
//                   </Select>
//                 </Form.Item>
//                 <Form.Item name="city" style={{ width: 150, display: 'inline-block', marginLeft: 10 }}>
//                   <Select placeholder="选择城市">
//                     <Select.Option value="1">全部</Select.Option>
//                   </Select>
//                 </Form.Item>
//                 <Form.Item name="district" style={{ width: 150, display: 'inline-block', marginLeft: 10 }}>
//                   <Select placeholder="选择区/县">
//                     <Select.Option value="1">全部</Select.Option>
//                   </Select>
//                 </Form.Item>
//                 <Form.Item name="sort" style={{ width: 150, display: 'inline-block', marginLeft: 10 }}>
//                   <Select placeholder="选择街道">
//                     <Select.Option value="1">全部</Select.Option>
//                   </Select>
//                 </Form.Item>
//                 <Form.Item name="address" style={{ width: 300, display: 'inline-block', marginLeft: 10 }}>
//                   <Input placeholder="详细地址"></Input>
//                 </Form.Item>
//               </Form.Item>
//             </Col>
//           </Row>
//           <Row>
//             <Col span={6}>
//               <Form.Item name="storeCode" label="归属门店" rules={[{ required: true }]}>
//                 <Input></Input>
//               </Form.Item>
//             </Col>
//             <Col span={6}>
//               <Form.Item name="employeeName" label="专属顾问" rules={[{ required: true }]}>
//                 <Input></Input>
//               </Form.Item>
//             </Col>
//             <Col span={6}>
//               <Form.Item name="groupId" label="服务小组">
//                 <Input></Input>
//               </Form.Item>
//             </Col>
//           </Row>
//           <Row>
//             <Col span={6}>
//               <Form.Item name="idNumber" label="身份证号码">
//                 <Input></Input>
//               </Form.Item>
//             </Col>
//           </Row>
//           <Row>
//             <Col span={24}>
//               <Form.Item label="身份证图片" labelCol={{ span: 2 }} style={{ marginBottom: 0 }}>
//                 <Form.Item name="pic1" style={{ width: 300, display: 'inline-block' }}>
//                   <UploadImg className="id-img-upload" title="请上传身份证正面" />
//                 </Form.Item>
//                 <Form.Item name="pic2" style={{ width: 300, display: 'inline-block' }}>
//                   <UploadImg className="id-img-upload" title="请上传身份证反面" />
//                 </Form.Item>
//               </Form.Item>
//             </Col>
//           </Row>
//           <Row>
//             <Col span={24}>
//               <Form.Item label="驾驶证图片" labelCol={{ span: 2 }} style={{ marginBottom: 0 }}>
//                 <Form.Item name="pic3" style={{ width: 300, display: 'inline-block' }}>
//                   <UploadImg className="id-img-upload" title="请上传驾驶证正面" />
//                 </Form.Item>
//                 <Form.Item name="pic4" style={{ width: 300, display: 'inline-block' }}>
//                   <UploadImg className="id-img-upload" title="请上传驾驶证反面" />
//                 </Form.Item>
//               </Form.Item>
//             </Col>
//           </Row>
//           <Row>
//             <Col span={24}>
//               <Form.Item label=" " colon={false} labelCol={{ span: 2 }}>
//                 <Space size="large">
//                   <Button onClick={save}>保存</Button>
//                   <Button type="primary" onClick={() => 0}>
//                     取消
//                   </Button>
//                 </Space>
//               </Form.Item>
//             </Col>
//           </Row>
//         </Form>
//       </div>
//     </div>
//   )
// }

// export default customerFiles
