/** @format */

import React, {useState} from 'react'
import {Tree} from 'antd'
import {getCompTreeNoParams} from '@/api'
import {useRequest} from '@umijs/hooks'
// import './index.less'
// import * as api from '@/api'
// import {ExclamationCircleOutlined} from '@ant-design/icons'
interface IProps {
  setCompId: any
}
const {TreeNode} = Tree

const TictTree: React.FC<IProps> = props => {
  const [treeData, setTreeData] = useState<any>([])
  // const [activeCategory, setActiveCategory] = useState<any>()
  // const [curTreeData, setCurTreeData] = useState<any>({})

  useRequest(() =>
    getCompTreeNoParams().then(res => {
      setTreeData(res.data)
    }),
  )
  console.log(props)

  const selectTree = (selectedKeys, e) => {
    console.log(selectedKeys)
    console.log(e)
    props.setCompId(selectedKeys[0]) //通知父级
  }

  const renderTreeNodes = data =>
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode
            title={item.shopNo ? <span>{'NO.' + item.shopNo + item.shortName}</span> : <span>{item.shortName}</span>}
            key={item.compCode}
            style={{position: 'relative'}}
            active>
            {renderTreeNodes(item.children)}
          </TreeNode>
        )
      }
      return (
        <TreeNode
          key={item.compCode}
          title={item.shopNo ? <span>{'NO.' + item.shopNo + item.shortName}</span> : <span>{item.shortName}</span>}
          style={{position: 'relative'}}
          active
        />
      )
    })

  return (
    <div>
      <div
        style={{
          padding: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderBottom: '1px solid #eee',
          color: '#1890ff',
          fontSize: '16px',
        }}>
        机构列表
      </div>
      <Tree
        autoExpandParent={true}
        height={650}
        style={{width: 240, paddingTop: 15, paddingLeft: 5, paddingBottom: 10}}
        onSelect={selectTree}>
        {renderTreeNodes(treeData)}
      </Tree>
    </div>
  )
}

export default TictTree
