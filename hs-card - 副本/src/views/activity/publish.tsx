/**
 *  数据趋势图表
 *
 * @format
 */

import React, { useEffect } from 'react'
// import useFetch from '@hooks'
// import { getCardGetAnalysis } from '@/api'
// import { useRequest } from '@umijs/hooks'
// import Dist from '@/components/Select/dict'
import {  Form, Button, Checkbox } from 'antd'
import { useHistory } from 'react-router-dom'

interface IProps {
    next: (data: any, from:any) => void,
    editData: any
}


const PublishActivity:React.FC<IProps> = props => {
    const history = useHistory()
    const parmId = history.location.search.split('=')[1]
    const [form] = Form.useForm()

    useEffect(()=> {
        console.log("活动发布props.editData", props.editData);
        props.editData.issueStatus = 0
        props.editData.finish = false
        if (props.editData.channelList && props.editData.channelList.length > 0) {
            const channel:string[] = []
            for(const key of props.editData.channelList) {
                channel.push(key.channel)
            }
            // console.log('channel-channel-channel', channel);
            form.setFieldsValue({'channelList': channel})
        } else {
            props.editData.channelList = []
        }
        
    }, [parmId])

    // 点击保存或者发布按钮
    const saveOrPubilish = status => {
        console.log('点击保存或者发布按钮', status);
        props.editData.issueStatus = status  // 0 保存    1 发布
    }
    
    const data = {
        'h5': {
            channel: 'h5',
            channelName: 'h5页'
        },
        'cgj_applet': {
            channel: 'cgj_applet',
            channelName: '车管家小程序'
        }
    }

    const onFinish = e => {
        // console.log('活动发布', e);
        const channelList:any[] =[]
        e.channelList.forEach(item => {
            channelList.push(data[item])
        })
        props.editData.channelList = channelList
        props.editData.finish = true
        console.log();
        props.next(props.editData, form)
    }

    return (
        <div>
            <Form layout="vertical" form={form} onFinish={onFinish} onError={() => props.editData.finish = false}>
                <Form.Item name="channelList" label="发布渠道" rules={[{ required: true, message: '请选择发布方式' }]}>
                    <Checkbox.Group style={{ width: '100%' }}>
                        <Checkbox value="h5">H5页面</Checkbox>
                        <Checkbox value="cgj_applet">车管家小程序</Checkbox>
                    </Checkbox.Group>
                </Form.Item>
                <Form.Item>
                    <Button type="default" htmlType="submit" onClick={() => saveOrPubilish(0)}>保存</Button>
                    <Button type="primary" htmlType="submit" onClick={() => saveOrPubilish(1)}>发布</Button>
                </Form.Item>
            </Form>
        </div>
    )
}


PublishActivity.defaultProps = {
    next: ():void => {},
  }

export default PublishActivity
