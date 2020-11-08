/** @format */

import React, { useEffect } from 'react'
import { Tabs } from 'antd'
import './style.less'
import useSearchParam from '@/hooks/useSearchParam'
import CustomerInf from './add'
import CarInformation from '@/components/CustomerVip/carInformation'
import ConsumeReCord from '@/components/CustomerVip/consumeReCord'
import TrackReCord from '@/components/CustomerVip/trackReCord'
import IntegralCord from '@/components/CustomerVip/integralCord'
import OrderCord from '@/components/CustomerVip/orderCord'
import Coupon from '@/components/CustomerVip/coupon'
import DailyReCord from '@/components/CustomerVip/dailyReCord'
const { TabPane } = Tabs;
interface IProps { }
const IsEdit = true
const PageCustomerDetail: React.FC<IProps> = props => {
  const parmId = useSearchParam('id')
  const customerId = parmId ? parmId : sessionStorage.getItem('customerId') ? sessionStorage.getItem('customerId') : ''
  useEffect(() => {
    if (customerId) {
      sessionStorage.setItem('customerId', customerId)
    }
  }, [customerId])

  const callback = (key) => {
    // console.log(key);
  }
  const navInf = [
    { 'title': '客户信息', id: 1 },
    { 'title': '车辆信息', id: 2 },
    // { 'title': '消费记录', id: 3 },
    // { 'title': '跟踪记录', id: 4 },
    // { 'title': '积分明细', id: 5 },
    // { 'title': '订单&预存', id: 6 },
    // { 'title': '优惠券', id: 7 },
    // { 'title': '修改日志', id: 8 },
  ]
  return (
    <div className="block_selectCard block" id="custdetail">
      <div className="block_title">
        <span>客户档案详细</span>
      </div>

      <div className='detailContent'>
        <Tabs defaultActiveKey="1" onChange={callback} type="card">
          {
            navInf.map((o, index) => (
              <TabPane tab={o.title} key={o.title}>
                {
                  function tabList(index) {
                    return (
                      <div>
                        {{
                          ['0']: <CustomerInf IsEdit={IsEdit} customerId={customerId} />,
                          ['1']: <CarInformation customerId={customerId} />,
                          ['2']: <ConsumeReCord />,
                          ['3']: <TrackReCord />,
                          ['4']: <IntegralCord />,
                          ['5']: <OrderCord />,
                          ['6']: <Coupon />,
                          ['7']: <DailyReCord />
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

export default PageCustomerDetail
