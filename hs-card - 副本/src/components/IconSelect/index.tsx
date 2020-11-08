/** @format */

//选择区域
import React, {useState, useEffect} from 'react'
import {Popover, Input} from 'antd'
import {SelectProps} from 'antd/lib/select'
import './index.less'
// import {renderToString} from 'react-dom/server'
import * as allIcons from '@ant-design/icons/es'
// import Icon from '@/components/Icon'
import {SearchOutlined} from '@ant-design/icons'

interface IPorps extends SelectProps<string> {
  type: any
  setIcon: any
}

const selectIcon: React.FC<IPorps> = ({type, ...props}) => {
  const data: any = [
    'OrderedListOutlined',
    'HomeOutlined',
    'CreditCardOutlined',
    'UserOutlined',
    'AreaChartOutlined',
    'HeartOutlined',
    'RadarChartOutlined',
    'BarsOutlined',
    'AliwangwangOutlined',
    'ApartmentOutlined',
    'AppstoreOutlined',
    'CloudUploadOutlined',
    'CommentOutlined',
    'LineChartOutlined',
    'SettingOutlined',
    'GiftOutlined',
    'TeamOutlined',
    'AppstoreOutlined',
    'AccountBookOutlined',
    'UnorderedListOutlined',
    'BugOutlined',
    'CalculatorOutlined',
    'CalendarOutlined',
    'CarOutlined',
    'ClearOutlined',
    'UsergroupAddOutlined',
    'ClusterOutlined',
    'ShopOutlined',
    'DashboardOutlined',
    'FileTextOutlined',
    'DeploymentUnitOutlined',
    'CloudDownloadOutlined',
    'BarsOutlined',
    'InsuranceOutlined',
    'TeamOutlined',
    'WindowsOutlined',
  ]

  const [curIcon, setCurIcon] = useState<any>(<SearchOutlined />)
  const [curValue, setCurValue] = useState<any>('')
  const [visible, setVisible] = useState<boolean>(false)
  useEffect(() => {
    let isUnmounted = false
    if (!isUnmounted) {
      if (type) {
        const newIcon = allIcons[type]
        setCurValue(type)
        setCurIcon(React.createElement(newIcon, null))
      } else {
        const newIcon = allIcons['SearchOutlined']
        setCurValue('')
        setCurIcon(React.createElement(newIcon, null))
      }
    }

    return () => {
      isUnmounted = true
    }
  }, [type])

  const changeIcon = (e, item) => {
    console.log(e)
    console.log(item)
    const newIcon = allIcons[item]
    props.setIcon(item)
    setCurValue(item)
    setCurIcon(React.createElement(newIcon, null))
    setVisible(false)
  }

  const handleVisibleChange = visible => {
    setVisible(visible)
  }

  const content = (
    <div className="flex">
      {data.map((item: any, i) => {
        const newIcon = allIcons[item]
        return (
          <div key={i} className="item" data-name={item} onClick={e => changeIcon(e, item)}>
            {React.createElement(newIcon, {style: {fontSize: '18px'}})} {item}
          </div>
        )
      })}
    </div>
  )

  return (
    <Popover
			className="icon_select"
      placement="bottom"
      content={content}
      trigger="click"
      {...props}
      visible={visible}
      onVisibleChange={handleVisibleChange}>
      <Input placeholder="请选择图标" value={curValue} prefix={curIcon} allowClear></Input>
    </Popover>
  )
}

selectIcon.defaultProps = {
  style: {width: '150px'},
}

export default selectIcon
