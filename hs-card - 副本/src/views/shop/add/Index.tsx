/** @format */

import React, { useState, useCallback, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { Tabs, Radio, Button, message, Spin, Input } from 'antd'
import cn from 'classnames'
import { useRequest } from '@umijs/hooks'
import * as api from '@/api'
import './index.less'
import AddGoodPop from '../edit/modal/addGoodPop'
import { setStore } from '@/utils/store'
import useSearchParams from '@/hooks/useSearchParams'
const Index = () => {
  const [loading, setLoading] = useState(true)
  const [active, setActive] = useState('3')
  const [list, setList] = useState<any[]>([])
  const [isBindWb, setIsBindWb] = useState<string>('0') //1:是,0:否
  const [peijianList, setPeijianList] = useState<any[]>([])
  const [visibleGongshi, setVisibleGongshi] = useState<boolean>(false)
  const [visiblePeijan, setVisiblePeijian] = useState<boolean>(false)
  const [curSelectWbData, setCurSelectWbData] = useState<string>() //
  const [gongshiList, setGongshiList] = useState<any[]>([])
  // const [projectList, setProjectList] = useState<any[]>([])
  const [mealgoodShow, setmealgoodShow] = useState<boolean>(false)
  const [projectTemplateList, setProjectTemplateList] = useState<any[]>([])

  // console.log(setProjectList([]))
  const carModelId = '00000000'
  const headItemFlag = useSearchParams('headItemFlag') || 2

  const history = useHistory()
  const { data } = useRequest(() => api.getShopCategoryList({ page: 1, pageSize: 2000 }).then(res => res.data.items), {
    cacheKey: 'shopCategory',
  })
  const onSelect = useCallback(
    (item, index) => {
      const a = list.slice(0, index)
      a[index] = item
      setList(a)
      console.log(list, '0000===List')
    },
    [list],
  )
  useEffect(() => {
    if (data) {
      setLoading(false)
    }
  }, [data])
  const onEdit = useCallback(() => {
    if (!list.length) {
      message.error('请选择分类')
    } else {
      // history.push('/shop/edit?productType=' + active + '&category=' + JSON.stringify(list.pop()))
      if (isBindWb == '1') {
        if (active == '2') {
          console.log(gongshiList)
          if (gongshiList.length == 0) {
            message.error('请选择标准数据')
            return
          } else {
            setStore('curwbBindData', gongshiList[0]) //缓存当前记录
          }
        }

        if (active == '3') {
          console.log(peijianList)
          if (peijianList.length == 0) {
            message.error('请选择标准数据')
            return
          } else {
            setStore('curwbBindData', peijianList[0]) //缓存当前记录
          }
        }

        if (active == '4') {
          console.log(projectTemplateList)
          if (projectTemplateList.length == 0) {
            message.error('请选择标准数据')
            return
          } else {
            setStore('curwbBindData', projectTemplateList[0]) //缓存当前记录
          }
        }
      }
      const poparams = list.pop()
      history.push(
        '/shop/edit?productType=' +
        active +
        '&categoryId=' +
        poparams.id +
        '&categoryName=' +
        poparams.cateName +
        '&isBindWb=' +
        isBindWb +
        '&headItemFlag=' +
        headItemFlag,
      )
    }
  }, [list, isBindWb, gongshiList, peijianList, projectTemplateList, active])

  const changeBind = e => {
    setIsBindWb(e.target.value)
  }

  const selectBindWb = e => {
    // setIsBindWb(e.target.value)
    if (active == '3') {
      setVisiblePeijian(true)
    }
    if (active == '2') {
      setVisibleGongshi(true)
    }
    if (active == '4') {
      setmealgoodShow(true)
    }
  }

  // const getPrice = selectedRows => {
  //   if (selectedRows && selectedRows.length > 0) {
  //     let priceNEW: number = 0
  //     selectedRows.map(o => (priceNEW += o.price ? Number(o.price) : 0))
  //     form.setFieldsValue({price: priceNEW.toFixed(2)})
  //   }
  // }

  const getMealgoodData = (selectedRowKeys, selectedRows) => {
    console.log(selectedRowKeys)
    console.log(selectedRows)
    setProjectTemplateList(selectedRows)
    setCurSelectWbData(selectedRows[0].itemName)
    setmealgoodShow(false)
    // getPrice([...projectTemplateList, ...selectedRows])
  }

  const setPeijianListBack = val => {
    setPeijianList([...val])
    setCurSelectWbData(val[0].partStandardName)
  }

  const getGongshiList = val => {
    console.log(val)
    setGongshiList([...val])
    setCurSelectWbData(val[0].itemName)
  }

  const mealgoodShowCancel = e => {
    setmealgoodShow(false)
    setVisibleGongshi(false)
    setVisiblePeijian(false)
  }

  const changeTab = e => {
    setActive(e)
    if (e == '3') {
      setCurSelectWbData(peijianList[0]?.partStandardName)
    }
    if (e == '2') {
      setCurSelectWbData(gongshiList[0]?.itmeName)
    }
    if (e == '4') {
      setCurSelectWbData(projectTemplateList[0]?.itmeName)
    }
  }

  return (
    <div className="shopAdd-container">
      <Spin spinning={loading}>
        <Tabs type="card" activeKey={active} onChange={a => changeTab(a)}>
          <Tabs.TabPane key="3" tab="配件"></Tabs.TabPane>
          <Tabs.TabPane key="2" tab="工时"></Tabs.TabPane>
          <Tabs.TabPane key="4" tab="项目"></Tabs.TabPane>
          <Tabs.TabPane key="5" tab="套餐"></Tabs.TabPane>
          <Tabs.TabPane key="1" tab="周边产品"></Tabs.TabPane>
        </Tabs>

        <div className="a">
          <p>提醒:配置商品类型以及关联标准数据后，一旦保存商品数据后，无法修改，请谨慎填写</p>
          <div className="b">
            <div className="category1">
              <ul>
                {data
                  ?.filter(item => item.pid === 0)
                  .map(item => (
                    <li
                      key={item.id}
                      onClick={() => onSelect(item, 0)}
                      className={cn({ active: item.id === list[0]?.id })}>
                      {item.cateName}
                    </li>
                  ))}
              </ul>
            </div>
            {list.map(
              (a, i) =>
                !!data?.filter(item => item.pid === a.id)?.length && (
                  <div key={a.id} className="category1">
                    <ul className="11">
                      {data
                        ?.filter(item => item.pid === a.id)
                        .map(item => (
                          <li
                            key={item.id}
                            onClick={() => onSelect(item, i + 1)}
                            className={cn({ active: item.id === list[i + 1]?.id })}>
                            {item.cateName}
                          </li>
                        ))}
                    </ul>
                  </div>
                ),
            )}
            <div className="flex-tiem">
              <div>
                {active == '2' || active == '3' || active == '4' ? (
                  <div className="mb-10">
                    关联标准数据
                    <Radio.Group value={isBindWb} style={{ marginLeft: '15px' }} onChange={changeBind}>
                      <Radio value="1">是</Radio>
                      <Radio value="0">否</Radio>
                    </Radio.Group>
                  </div>
                ) : (
                    ''
                  )}

                {isBindWb == '1' && (active == '2' || active == '3' || active == '4') ? (
                  <div className="mb-10">
                    <Input placeholder="标准数据名称" style={{ width: '200px' }} readOnly value={curSelectWbData} />
                    <Button
                      type="primary"
                      style={{ background: '#333', borderColor: '#333', marginLeft: '-10px' }}
                      onClick={selectBindWb}>
                      选择标准数据
                    </Button>
                  </div>
                ) : (
                    ''
                  )}
                <br />
                <Button type="primary" onClick={onEdit}>
                  下一步，发布商品
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Spin>

      <AddGoodPop
        replaceTitpop="添加配件"
        proType="3"
        type="radio"
        getPeijian={setPeijianListBack}
        mealgoodShow={visiblePeijan}
        mealgoodShowCancel={mealgoodShowCancel}
      />

      <AddGoodPop
        replaceTitpop="添加工时"
        proType="2"
        type="radio"
        getGongshi={getGongshiList}
        carModelId={carModelId}
        mealgoodShow={visibleGongshi}
        isBindWb={isBindWb}
        mealgoodShowCancel={mealgoodShowCancel}
      />

      <AddGoodPop
        replaceTitpop="添加项目"
        proType="4"
        type="radio"
        carModelId={carModelId}
        mealgoodShow={mealgoodShow}
        isBindWb={isBindWb}
        getMealgoodData={getMealgoodData}
        mealgoodShowCancel={mealgoodShowCancel}></AddGoodPop>
    </div>
  )
}

export default Index
