import { Steps, Modal } from 'antd';
import React, { useEffect, useState, } from 'react'
import { useHistory } from 'react-router-dom'
const { Step } = Steps;
import * as api from '@/api'
import PageSetup from './themeDetails'
import CreateActivity from './components/createActivity'
import PublishActivity from './components/publish'
import './../../activity/index.less'
import './styles.less'
import OldCustomerPage from './components/oldCustomerPage'
// import { useRequest } from '@umijs/hooks'

function themeState() {
    const [showOld, setShowOld] = useState<boolean>(false);
    const [current, setCurrent] = useState<number>();
    const [postData, setPostData] = useState({
        activityType: 0,
        classify: 1 //主题活动为1
    });
    // 表单集
    let fromSets: any[] = []
    const history = useHistory()
    // console.log(history.location);
    const parmId = history.location.search.split('=')[1]
    const onStepChange = e => {
        setCurrent(e)
    }
    const init = () => {
        fromSets.forEach(form => form['resetFields'] && form['resetFields']())
        onStepChange(0)
        fromSets = []
        setPostData({
            activityType: 0,
            classify: 1 //主题活动为1
        })
    }
    useEffect(() => {
        init()
        if (parmId) {
            let params = {
                id: parmId,
            }
            api
                .getActivityThemeDetails(params)
                .then((res: any) => {
                    console.log('resresresres', res);
                    if (res.code === 1) {
                        if (!res.data.oldCustomerSetting) {
                            res.data.oldCustomerSetting = {}
                        }
                        setPostData({ ...res.data, activityType: 0, classify: 1 })
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        } else {
            setPostData({ activityType: 0, classify: 1 })
        }
    }, [parmId])

    const nextStape = (data, from): void => {
        fromSets.push(from)
        setPostData(data)
        if (data.finish) {
            // 到了最后一步
            api.saveActivityTheme(postData).then((res: any) => {
                if (res.code === 1) {
                    fromSets.forEach(form => form['resetFields'] && form['resetFields']())
                    onStepChange(0)
                    fromSets = []
                    history.push('/activity/theme?random=' + new Date().getTime());
                    init()
                } else {
                    Modal.error({
                        title: '错误',
                        content: res.msg,
                    });
                }
            }).catch((err) => {
                console.log(err);
            })
        } else {
            onStepChange(data.stape)
            setShowOld(data.showOld)
        }
        console.log('postData', postData);
    }

    return (
        <div className="themeActivityStapePage">
            <Steps current={current} onChange={onStepChange}>
                <Step title="创建活动" />
                <Step title="页面设置" />
                <Step title="活动发布" />
            </Steps>
            <div className="themeStapePageContent">
                {current === 0 && (<CreateActivity editData={postData} next={nextStape}></CreateActivity>)}
                {(current === 1 && !showOld) && (<PageSetup editData={postData} isTheme={postData.activityType === 2} next={nextStape}></PageSetup>)}
                {(current === 1 && showOld) && (<OldCustomerPage editData={postData} next={nextStape} />)}
                {current === 2 && (<PublishActivity editData={postData} next={nextStape}></PublishActivity>)}
            </div>
        </div>
    )
}

export default themeState
