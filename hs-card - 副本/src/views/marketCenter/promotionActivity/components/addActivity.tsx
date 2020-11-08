/**
 *  数据趋势图表
 *
 * @format
 */

import React, { useState, useEffect } from 'react'
// import useFetch from '@hooks'
// import { getCardGetAnalysis } from '@/api'
// import { useRequest } from '@umijs/hooks'
// import Dist from '@/components/Select/dict'
import { DatePicker, Form, Input, Button, Select, Radio, message } from 'antd'
import Moment from 'moment'
import 'moment/locale/zh-cn'
import { useHistory } from 'react-router-dom'
import UploadImg from '@/components/Upload/ImageQN'
import '../style.less'

import {
    yearMonthDay
} from '@/utils/common'
import { parseInt } from 'lodash'


const { RangePicker } = DatePicker
const dateFormat = 'YYYY/MM/DD hh:mm:ss'

interface IProps {
    next: (data: any, from: any) => void,
    editData: any
}


const CreateActivity: React.FC<IProps> = props => {
    const [form] = Form.useForm()
    // console.log('Form.useForm()', Form.useForm());
    const history = useHistory()
    const parmId = history.location.search.split('=')[1]
    const [periodStatus, setPeriodStatus] = useState<'' | 'error'>('')
    const [uploadStatus, setUploadStatus] = useState<'' | 'error'>('')
    // const tformat = (num: number) => (num === 0 ? '0' : num)
    const [timeRange, setTimeRange] = useState<any>([null, null])
    const [shareImg, setShareImg] = useState<string>('')
    const size = undefined


    useEffect(() => {
        if (parmId && Object.keys(props.editData).length > 1) {
            console.log('props.editDat', props.editData);
            form.setFieldsValue({ type: props.editData.type })
            form.setFieldsValue({ theme: props.editData.theme })
            form.setFieldsValue({ shareDesk: props.editData.shareDesk })
            form.setFieldsValue({ illustrate: props.editData.illustrate })
            setShareImg(props.editData.shareImg)
            if (props.editData.validType === 1) {
                props.editData.startTime && props.editData.endTime && setTimeRange([Moment(props.editData.startTime), Moment(props.editData.endTime)])
            }
            form.setFieldsValue({ validType: props.editData.validType + '' })
        } else {
            //上一步切换
            form.setFieldsValue({ type: props.editData.type })
            form.setFieldsValue({ theme: props.editData.theme })
            form.setFieldsValue({ shareDesk: props.editData.shareDesk })
            form.setFieldsValue({ illustrate: props.editData.illustrate })
            setShareImg(props.editData.shareImg)
            if (props.editData.validType === 1) {
                props.editData.startTime && props.editData.endTime && setTimeRange([Moment(props.editData.startTime), Moment(props.editData.endTime)])
            }
            if (props.editData.validType) {
                form.setFieldsValue({ validType: props.editData.validType + '' })
            }

        }
    }, [props, parmId])

    const selectTimeRange = e => {
        if (!e) {
            setTimeRange([null, null])
        } else {
            setTimeRange([Moment(e[0]), Moment(e[1])])
            form.setFieldsValue({ startTime: Moment(e[0]).format(dateFormat) })
            form.setFieldsValue({ endTime: Moment(e[1]).format(dateFormat) })
        }
    }

    const nextStape = e => {
        // console.log('eeeeeeeeee', e);
        props.editData.stape = 1
        props.editData.activityType = props.editData.type = e.type
        props.editData.theme = e.theme
        props.editData.shareDesk = e.shareDesk
        props.editData.illustrate = e.illustrate
        props.editData.startTime = ''
        props.editData.endTime = ''
        props.editData.validType = parseInt(e.validType)
        if (e.validType === '1') {
            if (timeRange[0] && timeRange[0]._d && timeRange[1] && timeRange[1]._d) {
                setPeriodStatus('')
                props.editData.startTime = yearMonthDay(timeRange[0]._d)
                props.editData.endTime = yearMonthDay(timeRange[1]._d)
            } else {
                setPeriodStatus('error')
                return
            }
        }
        if (shareImg) {
            props.editData.shareImg = shareImg
            setUploadStatus('')
        } else {
            message.error('请上传分享图标')
            setUploadStatus('error')
            return
        }

        console.log('活动创建props.editData', props.editData);
        props.next(props.editData, form)
    }

    const changeImg = url => {
        setShareImg(url)
    }
    const disabledDate = current => {
        var curDate = new Date();
        var stringDate = new Date(curDate.getTime() - 24 * 60 * 60 * 1000)
        return current && current < Moment(stringDate).endOf('day');
    }
    const validatorShareImg = (rule, value, next) => {
        shareImg ? next() : next(Error('请选择图标图片'))
    }

    return (
        <div className="addActivityPage">
            <Form layout="vertical" form={form} size={size} onFinish={nextStape} initialValues={{ validType: '2' }}>
                <Form.Item name="type" label="活动类型" rules={[{ required: true }]}>
                    <Select placeholder="请选择活动类型" style={{ width: '200px' }} allowClear>
                        <Select.Option value={6}>买赠</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item name="theme" label="活动主题" rules={[{ required: true }]}>
                    <Input.TextArea placeholder="请输入活动主题" rows={4} style={{ width: '100%' }}></Input.TextArea>
                </Form.Item>
                <Form.Item name="shareDesk" label="分享文案" rules={[{ required: true }]} className="shareDesk">
                    <Input.TextArea placeholder="请输入分享文案，字数不超过30个" maxLength={30} rows={4} style={{ width: '20%', marginRight: '30px' }}></Input.TextArea>
                </Form.Item>
                <Form.Item name="shareImg" label="分享图标" validateStatus={uploadStatus} help={uploadStatus === 'error' ? '请上传分享图标' : ''} rules={[{ required: true, validator: validatorShareImg }]}>
                    <div>
                        <p style={{ color: '#ccc', fontSize: '14px', margin: 0 }}>建议尺寸：120px*120px</p>
                        <UploadImg
                            className="theme-img-upload"
                            disabled={false}
                            value={shareImg}
                            onChange={e => changeImg(e)}>
                        </UploadImg>
                    </div>
                </Form.Item>
                <Form.Item name="validType" style={{ marginBottom: 0 }} label="活动有效期" rules={[{ required: true }]} validateStatus={periodStatus} help={periodStatus === 'error' ? '请选择开始和结束日期' : ''}>
                    <Radio.Group style={{ display: 'flex', alignItems: 'center' }} value="1">
                        <Radio value='1' style={{ display: 'flex', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                固定
                                <RangePicker
                                    value={timeRange}
                                    allowClear={false}
                                    disabledDate={disabledDate}
                                    onChange={(e: any) => {
                                        selectTimeRange(e)
                                    }}
                                    onFocus={() => setPeriodStatus('')}
                                    style={{ marginLeft: '10px' }}
                                />
                            </div>
                        </Radio>
                        <Radio value="2" style={{ marginLeft: '40px' }}>永久有效</Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item name="illustrate" label="活动说明">
                    <Input.TextArea placeholder="请输入活动说明" rows={4} style={{ width: '100%' }}></Input.TextArea>
                </Form.Item>
                <Form.Item name="bt">
                    <div style={{ textAlign: 'center' }}><Button type="primary" htmlType="submit">下一步</Button></div>

                </Form.Item>
            </Form>
        </div>
    )
}
CreateActivity.defaultProps = {
    next: (): void => { },
}
export default CreateActivity
