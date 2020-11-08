/** @format */

import React, { useState, useEffect } from 'react'
import { Tabs, Modal } from 'antd'
import '../style.less'
import LocalGood from './localGood'
import StandardItem from './standardItem'
import WorkingHours from './workingHours'
const { TabPane } = Tabs;
interface IProps {
  replacePartShow?,
  replaceWorkShow?,
  replacePartsCancel?,
  getReplacePartsData?,
  carModelId?,
  getWorkingHoursCallBack?,
  replaceTitpop?
}


const PageOrderIndex: React.FC<IProps> = props => {
  const [current, setCurrent] = useState<string>('1')
  const callback = (key) => {

  }
  const navInf = [
    { 'title': '本地商品库', type: 'offline_store' },
    { 'title': '标准项目', type: 'micro_mall' },
  ]
  useEffect(() => {
    if (props.replacePartShow) {
      props.replacePartShow
    }
  }, [props.replacePartShow])
  const onMenuCancel = () => {
    setCurrent('1')
    props.replacePartsCancel()
  }
  const standardItemCallBack = (val) => {
    props.getReplacePartsData(val)
    props.replacePartsCancel()
    setCurrent('1')
  }
  const workingHoursCallBack = (val) => {
    console.log(val, '工时')
    props.getWorkingHoursCallBack(val)
    props.replacePartsCancel()
    setCurrent('1')
  }

  return (
    <div className="block replaceParts commomClass">
      <Modal title={props.replaceTitpop} visible={props.replacePartShow || props.replaceWorkShow} onCancel={onMenuCancel} width={900} getContainer={false} >
        <Tabs defaultActiveKey={current} onChange={callback} type="card">
          {
            navInf.map((o, index) => (
              <TabPane tab={o.title} key={o.type}>
                {
                  function tabList(index) {
                    return (
                      <div>
                        {{
                          ['0']: props.replacePartShow ? <LocalGood sign='part' standardItemCallBack={standardItemCallBack} carModelId={props.carModelId} /> : <LocalGood sign='items' workingHoursCallBack={workingHoursCallBack} carModelId={props.carModelId} />,
                          ['1']: props.replacePartShow ? <StandardItem standardItemCallBack={standardItemCallBack} carModelId={props.carModelId} /> : <WorkingHours workingHoursCallBack={workingHoursCallBack} carModelId={props.carModelId} />,
                        }[index]}
                      </div>
                    )
                  }(index)
                }
              </TabPane>
            ))
          }
        </Tabs>
      </Modal>
    </div >
  )
}

export default PageOrderIndex
