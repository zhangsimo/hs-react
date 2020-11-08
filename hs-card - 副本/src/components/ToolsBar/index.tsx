/** @format */

import React from 'react'
import './index.less'

interface IProps {
  visible?: boolean
  content?: React.ReactNode
}

const ToolsBar: React.FC<IProps> = ({visible, content, children}) => {
  return (
    <div className="toolsBar">
      <div className="flex flex_between">{children}</div>
      <div style={{display: visible ? 'block' : 'none'}} className="toolsBar-content">
        {content}
      </div>
    </div>
  )
}

ToolsBar.defaultProps = {
  visible: false,
}

export default ToolsBar
