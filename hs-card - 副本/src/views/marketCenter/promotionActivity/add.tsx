import { Steps, Modal } from 'antd';
import React, { useEffect, useState, } from 'react'
import { useHistory } from 'react-router-dom'
const { Step } = Steps;
import * as api from '@/api'
import GoodsSet from './components/goodsSet'
import AddActivity from './components/addActivity'
import RulesSet from './components/rulesSet'
import ActivityPublish from './components/activityPublish'
import './style.less'
// import OldCustomerPage from './oldCustomerPage'
// import { useRequest } from '@umijs/hooks'

function themeState() {
    const [showOld, setShowOld] = useState<boolean>(false);
    console.log(showOld)
    const [current, setCurrent] = useState<number>();
    const [postData, setPostData] = useState({
        activityType: 0,
        classify: 3 //促销活动为2
    });
    // 表单集
    let fromSets: any[] = []
    const history = useHistory()
    // console.log(history.location);
    const parmId = history.location.search.split('=')[1]
    const onStepChange = e => {
        setCurrent(e)
    }

    const prevStep = (e, data): void => {
        setCurrent(e)
        setPostData(data)
    }
    const init = () => {
        fromSets.forEach(form => form['resetFields'] && form['resetFields']())
        onStepChange(0)
        fromSets = []
        setPostData({
            activityType: 0,
            classify: 3
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
                        setPostData({ ...res.data, activityType: 0, classify: 3 })
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        } else {
            setPostData({
                activityType: 0, classify: 3
            })
        }
    }, [parmId])

    const nextStape = (data, from): void => {
        console.log(data)
        fromSets.push(from)
        setPostData(data)
        if (data.finish) {
            console.log("11111111111")
            // 到了最后一步
            api.saveActivty(postData).then((res: any) => {
                if (res.code === 1) {
                    fromSets.forEach(form => form['resetFields'] && form['resetFields']())
                    onStepChange(0)
                    fromSets = []
                    history.push('/marketCenter/promotionActivity?random=' + new Date().getTime());
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
            <Steps current={current} >
                <Step title="创建活动" />
                <Step title="商品设置" />
                <Step title="规则设置" />
                <Step title="活动发布" />
            </Steps>
            <div className="themeStapePageContent">
                {current === 0 && (<AddActivity editData={postData} next={nextStape}></AddActivity>)}
                {/* {(current === 1 && !showOld) && (<GoodsSet editData={postData} isTheme={postData.activityType === 2} next={nextStape}></GoodsSet>)} */}
                {/* {(current === 1 && showOld) && (<OldCustomerPage editData={postData} next={nextStape} />)} */}
                {(current === 1) && (<GoodsSet editData={postData} next={nextStape} prev={prevStep} />)}
                {(current === 2) && (<RulesSet editData={postData} next={nextStape} prev={prevStep} />)}
                {current === 3 && (<ActivityPublish editData={postData} next={nextStape} prev={prevStep}></ActivityPublish>)}
            </div>
        </div>
    )
}

export default themeState
