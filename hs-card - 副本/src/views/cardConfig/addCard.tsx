/** @format */
import React, { useState, useEffect } from 'react'
import { Steps, Button } from 'antd'
import ChangeCardType from './components/changeCardType'
import GoodAndproject from './components/goodAndproject'
import SelectChannel from './components/selectChannel'
import UseLimit from './components/useLimit'
// import {useRequest} from '@umijs/hooks'
import GlobalStore from '@/store/global'
import { Spin } from 'antd'
import useSearchParam from '@/hooks/useSearchParam'
import * as api from '@/api'
// import {useRouteMatch} from 'react-router-dom'
import { getStore } from '@/utils/store'
// import useSearchParam from '@/hooks/useSearchParam'

// getCardDetails
const { Step } = Steps

const PageDateAddCard = () => {
  const curCard = getStore('curCard')
  const [loading, setLoading] = useState<boolean>(false)
  const [FormData, setFormData] = useState<any>({ cardsTimes: [] })
  const [projectParams, setProjectParams] = useState<any>({ bool: false })
  const [projectDetails, setProjectDetails] = useState<any>({})
  const [goodDetails, setGoodDetails] = useState<any>()
  const [goodVisible, setGoodVisible] = useState<any>(false)
  const [channelVisible, setChannelVisible] = useState<any>(false)
  const [useLimitVisible, setUseLimitVisible] = useState<any>(false)
  const [curStep, setCurStep] = useState<number>(0)
  const [isEdit, setIsEdit] = useState<any>(false)
  const [isOnline, setIsOnline] = useState<any>(false)

  const { user } = GlobalStore.useContainer()
  const isCopy = useSearchParam('isCopy')

  // isCopy
  // const cardId: string = ''
  useEffect(() => {
    let isUnmounted = false
    console.log('进入')
    if (curCard && (curCard.cardId || curCard.cardId == 0)) {
      let params = {
        cardId: curCard.cardId,
      }
      api.getCardDetails(params).then(res => {
        let data = res.data
        if (!isUnmounted) {
          if (data.useType == 1) {
            setGoodVisible(false)
            if (data.progress == 1 || data.progress == 0 || data.progress == 2) {
              data.progress = data.progress + 1

              setChannelVisible(true)
            } else if (data.progress == 3 || data.progress == 4 || data.progress == 5) {
              setChannelVisible(true)
              setUseLimitVisible(true)
            }
            // setCurStep(2)
          } else {
            setGoodVisible(true)

            if (data.progress == 1 || data.progress == 0) {
              setChannelVisible(false)
              setUseLimitVisible(false)
            } else if (data.progress == 2) {
              setChannelVisible(true)
              setUseLimitVisible(false)
            } else if (data.progress == 3 || data.progress == 4 || data.progress == 5) {
              setChannelVisible(true)
              setUseLimitVisible(true)
            }
          }

          // if (data.progress == 5) {
          //   data.isDisabled = true
          // } else {
          //   data.isDisabled = false
          // }

          console.log('---------------')
          setCurStep(data.progress)
          setIsOnline(data.isOnline)

          setFormData(data)
          setLoading(false)

          // setCurStep(data.progress)
        }

        console.log(FormData)
      })
    } else {
      let data = getStore('curCard') ? getStore('curCard') : {}
      if (isCopy == '1') {
        setChannelVisible(false)
        setUseLimitVisible(false)
      }
      console.log(data)
      setFormData(data)
      setGoodVisible(false)
      setCurStep(0)
      setProjectDetails({})
      setGoodDetails([])
      setIsEdit(true)
    }
    return () => {
      isUnmounted = true
    }
  }, [projectParams.bool, curCard?.cardId, isCopy])

  useEffect(() => {
    const curCard = getStore('curCard')
    let isUnmounted = false
    if (curCard && curCard.cardId) {
      ; (async () => {
        let params: any = {
          cardId: curCard.cardId,
          memberId: user?.memberId,
          memberName: user?.memberName,
          page: projectParams.page,
          pageSize: projectParams.pageSize,
          total: projectParams.total,
        }
        console.log(params)
        const data = await api.getCardItem(params)
        console.log(data)
        if (!isUnmounted) {
          setProjectDetails(data.data)
        }
      })()
        ; (async () => {
          let paramsGood: any = {
            cardId: curCard.cardId,
            storeId: 9,
            c: 'product',
            a: 'selling_goods_list',
            page: projectParams.page || 1,
            pageSize: projectParams.pageSize || 10,
          }
          const dataGood = await api.getCardGood(paramsGood)
          if (!isUnmounted) {
            setGoodDetails(dataGood.data)
          }
        })()
    }
    return () => {
      isUnmounted = true
    }
  }, [projectParams.bool, curCard?.cardId])

  // useEffect(() => {
  //   setCurStep(curStep)
  // }, [curStep])

  const setCardId = data => {
    console.log(data)
    if (projectParams.bool) {
      data.bool = false
    } else {
      data.bool = true
    }
    projectParams.bool = !projectParams.bool
    setProjectParams(data)
    if (data.scroolType == 1) {
      if (data.useType == 0) {
        setGoodVisible(false)
      } else {
        setGoodVisible(true)
      }

      // setCurStep(1)
    }

    if (data.scroolType == 2) {
      setChannelVisible(true)
      // setCurStep(2)
    }

    if (data.scroolType == 3) {
      setUseLimitVisible(true)
      // setCurStep(3)
    }
  }

  const setEdit = () => {
    console.log(FormData)

    setIsEdit(!isEdit)
  }

  return (
    <div>
      <div style={{ padding: '20px 120px' }}>
        <Steps size="small" current={curStep}>
          <Step title="填写优惠券基本信息" />
          <Step title="选择关联项目" />
          <Step title="选择发放渠道" />
          <Step title="选择使用门店" />
          <Step title="完成" />
        </Steps>
      </div>

      <Spin spinning={loading}>
        <ChangeCardType FormData={FormData} setCardId={setCardId} isEdit={isEdit} />
      </Spin>

      {goodVisible ? (
        <GoodAndproject
          projectDetails={projectDetails}
          goodDetail={goodDetails}
          progress={curStep}
          setCardId={setCardId}
          isEdit={isEdit}
          isOnline={isOnline}
        />
      ) : null}

      {channelVisible ? (
        <SelectChannel setCardId={setCardId} progress={curStep} isEdit={isEdit} isOnline={isOnline} />
      ) : null}

      {useLimitVisible ? (
        <UseLimit FormData={FormData} setCardId={setCardId} progress={curStep} isEdit={isEdit} />
      ) : null}

      {curStep == 5 ? (
        <div
          style={{
            position: 'fixed',
            left: '0',
            bottom: '0',
            width: '100%',
            height: '50px',
            textAlign: 'center',
            background: '#fff',
            borderTop: '1px solid #ddd',
            lineHeight: '50px',
          }}>
          <Button type="primary" onClick={setEdit}>
            {isEdit ? '取消编辑' : '编辑'}
          </Button>
        </div>
      ) : null}
    </div>
  )
}

export default PageDateAddCard
