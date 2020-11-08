/** @format */

import React, {useState, useEffect} from 'react'
import {Tree} from 'antd'

interface IProps {
  treeData: any[]
  selectedKeys: number[]
  onCheck?: (data: number[]) => void
}
const {TreeNode} = Tree

const TreeMenu: React.FC<IProps> = props => {
  const [selectedKeys, setSelectedKeys] = useState<string[]>([])

  useEffect(() => {
    setSelectedKeys(props.selectedKeys.map(id => id + ''))
  }, [props.selectedKeys])

  const onCheck = (data: string[]) => {
    setSelectedKeys(data)
    props.onCheck?.(data.map(id => parseInt(id)))
  }

  const renderTreeNodes = data =>
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.id} active>
            {renderTreeNodes(item.children)}
          </TreeNode>
        )
      }
      return <TreeNode key={item.id} title={item.title} active />
    })
  return (
    <Tree checkable autoExpandParent={true} onCheck={onCheck} checkedKeys={selectedKeys}>
      {renderTreeNodes(props.treeData)}
    </Tree>
  )
}

TreeMenu.defaultProps = {
  treeData: [],
  selectedKeys: [],
}

export default TreeMenu
