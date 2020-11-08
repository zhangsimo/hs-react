/** @format */

import React, { useState } from 'react'
import { Tabs } from 'antd'
import '../style.less'
import ChargebackList from './list'
const { TabPane } = Tabs;
interface IProps { }
const ChargebackIndex: React.FC<IProps> = props => {
  const [orderType, setOrderType] = useState<string>('micro_mall')
  const callback = (key) => {
    setOrderType(key)
  }
  const navInf = [
		{ 'title': '微商城', type: 'micro_mall' },
    { 'title': '门店', type: 'offline_store' },
  ]
  return (
    <div className="block" id="custdetail">
      <div className="block_title">
        <span>客户退单</span>
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
                          ['0']: <ChargebackList orderType={orderType} />,
                          ['1']: <ChargebackList orderType={orderType} />,
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

export default ChargebackIndex
