/** @format */

import React, {useState} from 'react'
import {Tree, Button, Popover, Modal, message} from 'antd'
import {getDictTreeList} from '@/api'
import {useRequest} from '@umijs/hooks'
import {IDictCategoryType} from '@/interface/system'
import EditCategory from './EditCategory'
import './index.less'
import * as api from '@/api'
import {ExclamationCircleOutlined} from '@ant-design/icons'
const confirm = Modal.confirm
interface IProps {
  setDictCateId: any
}
const {TreeNode} = Tree

const TictTree: React.FC<IProps> = props => {
  const [treeData, setTreeData] = useState<any>([])
  const [activeCategory, setActiveCategory] = useState<IDictCategoryType>()
  const [visibleCategory, setVisibleCategory] = useState(false)
  const [activeCategoryCode, setActiveCategoryCode] = useState<string>('')

  const {run: updateCategory} = useRequest(() =>
    getDictTreeList().then(res => {
      setTreeData(res.data)
    }),
  )
  console.log(props)

  // const getByParentId = parentId => {
  //   return treeData.filter(item => {
  //     return item.parentId === parentId
  //   })
  // }
  const selectTree = (selectedKeys, e) => {
    console.log(selectedKeys)
    console.log(e)
    if (selectedKeys[0]) {
      let dictType: any = selectedKeys[0].split('|')[0]
      // let dictId: any = selectedKeys[0].split('|')[1]
      props.setDictCateId(dictType) //通知父级
      setActiveCategoryCode(dictType) //通知子级
      console.log(activeCategoryCode)
    }
  }

  const editData = () => {
    setVisibleCategory(true)
  }

  const delData = () => {
    confirm({
      title: '确定删除?',
      icon: <ExclamationCircleOutlined />,
      content: '删除了就没有了哦',
      onOk() {
        api
          .delDictType(activeCategory?.dictId)
          .then((res: any) => {
            if (res.code == 1) {
              updateCategory()
              message.success('删除成功')
            } else {
              message.success('删除失败')
            }
          })
          .catch(err => {
            message.success('删除失败')
          })
      },
      onCancel() {
        message.info('感谢不删之恩')
      },
    })
  }

  const menu = (
    <div>
      <Button type="link" block className="btnEdit" onClick={editData}>
        修改
      </Button>
      <Button type="link" block className="btnDel" onClick={delData}>
        删除
      </Button>
    </div>
  )
  // const dropdown = (
  //   <Dropdown overlay={menu}>
  //     <a className="ant-dropdown-link" href="#"></a>
  //   </Dropdown>
  // )

  const handleRightClick = ({event, node}) => {
    console.log(node)
    let dictId: any = node.key.split('|')[1]
    api
      .getDictTypeDetails(dictId)
      .then(res => {
        setActiveCategory(res.data)
      })
      .catch(err => {
        // message.error('核销失败')
      })
    // setCurTreeData(node)
  }

  const renderTreeNodes = data =>
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode
            title={
              item.dictName && (
                <Popover
                  content={menu}
                  placement="bottom"
                  title=""
                  trigger="contextMenu"
                  style={{width: 100}}
                  overlayClassName="distTreeBlock">
                  {item.dictName}
                </Popover>
              )
            }
            key={item.dictType + '|' + item.dictId}
            style={{position: 'relative'}}
            active>
            {renderTreeNodes(item.children)}
          </TreeNode>
        )
      }
      return (
        <TreeNode
          key={item.dictType + '|' + item.dictId}
          title={
            item.dictName && (
              <Popover
                content={menu}
                placement="bottom"
                title=""
                trigger="contextMenu"
                style={{width: 100}}
                overlayClassName="distTreeBlock">
                {item.dictName}
              </Popover>
            )
          }
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
        }}>
        <Button.Group>
          <Button
            type="primary"
            onClick={() => {
              setActiveCategory(undefined)
              setVisibleCategory(true)
            }}>
            新增
          </Button>

          {/* <Button
            onClick={() => {
              setActiveCategory(treeData?.find(item => item.dictType == activeCategoryCode))
              setVisibleCategory(true)
            }}>
            修改
          </Button> */}
        </Button.Group>
      </div>
      <Tree
        autoExpandParent={true}
        style={{width: 200, paddingTop: 15, paddingLeft: 5, paddingBottom: 10}}
        onRightClick={handleRightClick}
        onSelect={selectTree}>
        {renderTreeNodes(treeData)}
      </Tree>

      <EditCategory
        visible={visibleCategory}
        data={activeCategory}
        treeData={treeData}
        updateData={() => updateCategory()}
        setVisible={setVisibleCategory}
      />
    </div>
  )
}

export default TictTree
