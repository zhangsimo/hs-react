/** @format */

import React, { useState, } from 'react' //useEffect
import { Tabs, Modal } from 'antd'
import '../style.less'
import AddlocalGood from './addlocalGood'
import AddstandardItem from './addstandardItem'
const { TabPane } = Tabs;
interface IProps {
  replacegoodShow?,
  replacePartsCancel?,
  getReplacePartsData?,
  carModelId?,
  getWorkingHoursCallBack?,
  replaceTitpop?
  replacegoodShowCancel
}


const PageOrderIndex: React.FC<IProps> = props => {
  const [current, setCurrent] = useState<string>('1')
  const callback = (key) => {

  }
  const navInf = [
    { 'title': '本地商品库', type: 'offline_store' },
    { 'title': '标准项目', type: 'micro_mall' },
  ]
  // useEffect(() => {
  //   if (props.replacePartShow) {
  //     props.replacePartShow
  //   }
  // }, [props.replacePartShow])
  const onMenuCancel = () => {
    props.replacegoodShowCancel()

  }
  const standardItemCallBack = (val) => {
    props.getReplacePartsData(val)
    props.replacePartsCancel()
    setCurrent('1')
  }


  return (
    <div className="block replaceParts commomClass">
      <Modal title={props.replaceTitpop} visible={props.replacegoodShow} onCancel={onMenuCancel} width={900} getContainer={false} >
        <Tabs defaultActiveKey={current} onChange={callback} type="card">
          {
            navInf.map((o, index) => (
              <TabPane tab={o.title} key={o.type}>
                {
                  function tabList(index) {
                    return (
                      <div>
                        {{
                          ['0']: <AddlocalGood sign='goods' standardItemCallBack={standardItemCallBack} carModelId={props.carModelId} />,
                          ['1']: <AddstandardItem sign='standardgoods' standardItemCallBack={standardItemCallBack} carModelId={props.carModelId} />
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
