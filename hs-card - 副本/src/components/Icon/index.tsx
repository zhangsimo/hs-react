/**
 * /* 用于菜单的自定义图标
 *
 * @format
 */

import React from 'react'
// import {createFromIconfontCN} from '@ant-design/icons'
import * as allIcons from '@ant-design/icons/es'

interface Props {
  type: string
}

export default function Icon(props: Props): JSX.Element {
  const newIcon = allIcons[props.type]
  let icon = React.createElement(newIcon, null)
  return icon
  // <IconFont type={'icon-' + props.type} />
}
