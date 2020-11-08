/**
 *  数据趋势图表
 *
 * @format
 */

import React, { useState, useEffect } from 'react'
import * as api from '@/api'
import EditImg from './addEditCarouselImg'
import { Form, Input, Button, message, Table, Spin } from 'antd'
import { useHistory } from 'react-router-dom'
import UploadImg from '@/components/Upload/ImageMore'
import UploadVideo from '@/components/Upload/videoUpload'
import {useBoolean} from '@umijs/hooks'
import ProvinceCityArea from '@/components/Select/provinceCityArea'
import './index.less'

const CompanyDetails = () => {
	

    const [form] = Form.useForm()
		const visible = useBoolean(false)
		const [loading, setLoading] = useState<boolean>(false)
		const [activeData, setActiveData] = useState<any>({})
		const [operation, setOperation] = useState<string>('create')
		const [selectPCA, setSelectPCA] = useState<any>({})
		const [carouselImgList, setCarouselImgList] = useState<any>([])
		const [shopVideo, setShopVideo] = useState<any>(null)
		
    const history = useHistory()
    const compCode = history.location.search.split('=')[1]
    const [data, setData] = useState<any>({ })
    const [shopImgList, setShopImgList] = useState<any>([])
    const size = undefined
		
    // getCompDetails
    useEffect(() => {

        if (compCode) {
            let params = {
                compCode: compCode,
            }
            setLoading(true)
            api
                .getCompDetails(params)
                .then((res: any) => {
                    if (res.code == 1) {
                        setData(res.data)
                        form.setFieldsValue(res.data)
												console.log(8889, data, res.data)
												let list = res.data.cgjCompanyActivityPicsDTOList || []
												let fileList = res.data.cgjCompanyFilesDTOList || []
												let imgList:any = []
												for (let i in fileList) {
													fileList[i]["url"] = fileList[i].fileUrl
													fileList[i]["uid"] = '-'+fileList[i].id
													
													if (fileList[i].type === 2) {
														setShopVideo(fileList[i].fileUrl)
													} else {
														imgList.push({
															uid: '-' + fileList[i].id,
															fileUrl: fileList[i].fileUrl,
															id: fileList[i].id,
															status: 'done',
															compCode: fileList[i].compCode,
															url: fileList[i].fileUrl,
														})
													}
												}
												console.log(9998, imgList)
												
												setShopImgList(imgList)
												setCarouselImgList(list)
                    } else {
											setCarouselImgList([])
											message.error(res.msg)
                    }
										setLoading(false)
                })
                .catch(err => {
                    message.error(err.msg)
                    setLoading(false)
                })
        }
    }, [compCode])

    const saveData = e => {
			let filesList:any = []
			if (shopVideo) {
				filesList.push({
					type: 2,
					compCode: data.compCode,
					fileUrl: shopVideo
				})
			}
			for (let i in shopImgList) {
				shopImgList[i]["type"] = 1
				filesList.push(shopImgList[i])
			}
			
        let params = {
            ...data,
						...form.getFieldsValue(),
						...selectPCA,
						cgjCompanyActivityPicsDTOList: carouselImgList,
						cgjCompanyFilesDTOList: filesList
        }
        // setLoading(true)
        api
            .saveCompany(params)
            .then((res: any) => {
                if (res.code == 1) {
                    message.success('保存成功')

                } else {

                    message.error(res.msg)
                }
            })
            .catch(err => {
                message.error(err.msg)
                // setLoading(false)
            })

    }

    const changeImg = url => {
			console.log('图片', url, data)
			let list:any = []
			for (let i in url) {
				console.log(2258, url[i].imagerUrl)
				list.push({
					uid: url[i].uid,
					id:  url[i].id,
					status: url[i].status,
					compCode: url[i].compCode || data.compCode,
					fileUrl: url[i].imagerUrl,
					url: url[i].imagerUrl,
				})
			}
			setShopImgList([...list])
    }
		
		const changeVideo = url => {
			console.log('视频', url)
		    setShopVideo(url)
		}

   
		



    const columns: any = [
        {
            title: '序号',
            width: 70,
            align: 'center',
            render: (val, row, index) => `${index + 1}`,
        },
        {
            title: '图片',
            dataIndex: 'fileUrl',
            align: 'center',
            width: 120,
            render: (value, row) => (
                <div>

                    <img
                        width={100}
                        height={100}
                        src={row.fileUrl ? row.fileUrl : 'data:image/png;base64,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'}
                    />

                </div>
            ),

        },
				{
				    title: '排序',
				    width: 70,
				    dataIndex: 'sort',
				},
        {
            title: 'Banner信息',
            dataIndex: 'title',
            align: 'left',
            width: 320,
            render: (value, row) => (
                <div className="imgDetail">
                    <p>标题：{row.title}</p>
                    <p>链接：{row.picLink}</p>

                </div>
            )

        },

        {
            title: '操作',
            dataIndex: '',
            align: 'center',
            width: 150,
            render: (a, row, index) => {
                return (
                    <div>
                        <Button type="link" onClick={() => onAddEditCarouselImg(row, index)} >
                            编辑
                        </Button>
                        <Button type="link" onClick={() => delData(index)} >
                            删除
                        </Button>
                    </div>
                )
            },
        },

    ]
		
		const onAddEditCarouselImg = (item, index) => {
			item['compCode'] = data.compCode
			if (index=='null') {
				setOperation('create')
			} else {
				setOperation('update')
				item['imgIndex'] = index
			}
			console.log(index, item)
		  setActiveData(item)
		  visible.toggle()
		}
		const onSuccess = (type, data) => {
			console.log('上传成功',type, data)
			if (type=='create') {
				carouselImgList.push(data)
			} else {
				carouselImgList[data.imgIndex] = data
			}
			setCarouselImgList([...carouselImgList])
		}
		const delData = (index) => {
			carouselImgList.splice(index, 1)
			setCarouselImgList([...carouselImgList])
		}
			
		const selectProject = value => {
			setSelectPCA(value)
		  console.log(value)
		}

    return (
        <div style={{ background: '#fff', padding: '20px' }}>
            <Spin spinning={loading}>
            <Form layout="vertical" form={form} size={size} >

                <Form.Item name="compName" label="门店名称" rules={[{ required: true }]}>
                    <Input disabled style={{ width: '280px' }}></Input>

                </Form.Item>
                <Form.Item label="门店图片">
                    <div>
                        <p style={{ color: '#ccc', fontSize: '14px', margin: 0 }}>建议尺寸：120px*120px</p>
                        <UploadImg
                            className="theme-img-upload"
                            disabled={false}
                            value={shopImgList}
                            onChange={e => changeImg(e)}>
                        </UploadImg>
                    </div>
                </Form.Item>
                <Form.Item name="shopVideo" label="视频">
                    <div>
                        <p style={{ color: '#ccc', fontSize: '14px', margin: 0 }}></p>
                        <UploadVideo
                            className="theme-img-upload"
                            disabled={false}
                           value={shopVideo}
                            onChange={e => changeVideo(e)}>
                        </UploadVideo>
                    </div>
                </Form.Item>

                <div>
								<div>
									店铺活动轮播图
									<Button type="primary" onClick={() => onAddEditCarouselImg({}, 'null')}>
									  新增
									</Button>
								</div>
                    <Table
                        columns={columns}
                        bordered
                        rowKey="key"
                        dataSource={carouselImgList}
                        size="small"
                        pagination={false}
                        style={{ width: '100%' }}
                    />
										
                </div>
								<Form.Item label="门店地址" rules={[{ required: true }]}>
								    <ProvinceCityArea ProjectSelect={(val) => selectProject(val)} data={{"areaCode": data.areaCode,"areaName": data.areaName,"cityCode": data.cityCode,"cityName": data.cityName,"provinceCode": data.provinceCode,"provinceName": data.provinceName }} />
										<div className="shop_address_box">
										<Form.Item name="shopAddress" className="shop_address_item" label="详细地址"  style={{marginRight: '15px', flexDirection: 'initial', marginTop: '15px'}} rules={[{ required: true }]}>
										    <Input placeholder="请输入详细地址" style={{ width: '280px' }} ></Input>
										</Form.Item>
										<Form.Item name="longitude" className="shop_address_item" label="经度"  style={{marginRight: '15px', flexDirection: 'initial', marginTop: '15px'}} rules={[{ required: true }]}>
										    <Input placeholder="请输入经度" ></Input>
										</Form.Item>
										<Form.Item name="latitude" className="shop_address_item" label="纬度"  style={{marginRight: '15px', flexDirection: 'initial', marginTop: '15px'}} rules={[{ required: true }]}>
										    <Input placeholder="请输入纬度" ></Input>
										</Form.Item>
										</div>
								</Form.Item>
                <Form.Item name="linkPhone" label="联系电话" rules={[{ required: true }]}>
                    <Input placeholder="请输入联系电话" style={{ width: '280px' }} ></Input>
                </Form.Item>
                <Form.Item name="businessHours" label="营业时间" rules={[{ required: true }]}>
									<Input placeholder="请输入营业时间" style={{ width: '280px' }} ></Input>
                </Form.Item>

                <Form.Item name="companyArea" label="场地面积" >
                    <Input placeholder="请输入场地面积" style={{ width: '280px' }} suffix="平方" ></Input>
                </Form.Item>

                <Form.Item name="mainRepairCarModel" label="主修车型" >
                    <Input.TextArea placeholder="请输入主修车型，多个车型，输入以“逗号”隔开" rows={6} style={{ width: '40%', marginRight: '30px' }}></Input.TextArea>
                </Form.Item>

                <Form.Item name="serviceItems" label="服务项目" >
                    <Input.TextArea placeholder="请输入服务项目，多个项目，输入以“逗号”隔开" rows={6} style={{ width: '40%', marginRight: '30px' }}></Input.TextArea>
                </Form.Item>


                <Form.Item name="brandLines" label="品牌线"  >
                    <Input.TextArea placeholder="请输入品牌线，多个品牌线，输入以“逗号”隔开" rows={6} style={{ width: '40%', marginRight: '30px' }}></Input.TextArea>
                </Form.Item>


                <Form.Item name="btn-box">
                    <div style={{ textAlign: 'center' }}><Button type="primary" onClick={saveData}>保存</Button></div>
                </Form.Item>
            </Form>
           </Spin>
						
						<EditImg
						  visible={visible.state}
							operation={operation}
						  data={activeData}
						  setVisible={visible.toggle}
						  onOk={onSuccess}
						/>
        </div>
    )
}

export default CompanyDetails
