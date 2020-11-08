/** @format */

import React, { useState } from 'react'
import { Tabs } from 'antd'
import '../style.less'
import OrderList from './list'
import SubDetail from '../components/subDetail'
const { TabPane } = Tabs;
interface IProps { }
const PageOrderIndex: React.FC<IProps> = props => {
  const [orderType, setOrderType] = useState<string>('offline_store')
  const callback = (key) => {
    setOrderType(key)
  }
  const navInf = [
    { 'title': '门店订单', type: 'offline_store' },
    { 'title': '微商城订单', type: 'micro_mall' },

  ]
  return (
    <div className="block" id="custdetail">
      <SubDetail />
      <div className="block_title">
        <span>订单管理</span>
      </div>
      <div className='ordermanage'>
        <Tabs defaultActiveKey="1" onChange={callback} type="card">
          {
            navInf.map((o, index) => (
              <TabPane tab={o.title} key={o.type}>
                {
                  function tabList(index) {
                    return (
                      <div>
                        {{
                          ['0']: <OrderList orderType={orderType} />,
                          ['1']: <OrderList orderType={orderType} />,
                        }[index]}
                      </div>
                    )
                  }(index)
                }
              </TabPane>
            ))
          }

        </Tabs>
      </div>

    </div >
  )
}

export default PageOrderIndex
