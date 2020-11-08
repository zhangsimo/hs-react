/** @format */

import React, { useState, useEffect } from 'react'

import { Form, Input, Button, Radio, Modal, Tree, message, Spin } from 'antd'
import './changeCardType.less'
import { getStore } from '@/utils/store'
// import {ApiFilled} from '@ant-design/icons'
import * as api from '@/api'
import { useHistory } from 'react-router-dom'

// const curCard = getStore('curCard')
const { Search } = Input
const size = undefined
const { TextArea } = Input
// const {TreeNode} = Tree

interface IProps {
  FormData: any
  setCardId: any
  progress: any
  isEdit: any
  // isOnline: any
}

const changeCardType: React.FC<IProps> = props => {
  const [visible, setVisible] = useState<boolean>(false)
  const [isAll, setIsAll] = useState<number>(1)
  const [treeData, setTreeData] = useState<any>([])
  const [instruct, setInstruct] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [loading2, setLoading2] = useState<boolean>(false)
  const [selectComp, setSelectComp] = useState<any>([])
  const [defaultSelectComp, setDefaultSelectComp] = useState<any>([])
  const [isDisabled, setIsDisabled] = useState<boolean>(false)
  const history = useHistory()

  const progress = props.progress
  const isEdit = props.isEdit

  const [form] = Form.useForm()
  const submit = () => {
    const curCard = getStore('curCard')
    if (isAll !== 1) {
      if (selectComp.length == 0) {
        message.error('部分门店时，门店不能为空，请添加！')
        return
      }
    }
    let params = {
      cardId: curCard.cardId,
      comp: isAll === 1 ? [] : selectComp,
      isAll: isAll === 1 ? true : false,
      instruct: instruct,
    }
    setLoading2(true)
    api
      .saveShopList(params)
      .then((res: any) => {
        if (res.code == 1) {
          let data = {
            cardId: curCard.cardId,
            page: 1,
            pageSize: 5,
            scroolType: 4,
          }
          props.setCardId(data)
          message.success('保存成功')
          setLoading2(false)
          history.push({
            pathname: '/card/cardList',
          })
        }
      })
      .catch(err => {
        message.error(err.msg)
      })
  }

  const onChangeText = e => {
    setInstruct(e.target.value)
  }

  const onSearch = e => {
    console.log(e)
    // setSearchValue(e)
    getShopList(e)
  }

  useEffect(() => {
    const curCard = getStore('curCard')
    let isUnmounted = false
    if (curCard && curCard.cardId) {
      let params: any = {
        cardId: curCard.cardId,
      }
      api
        .getShopData(params)
        .then(res => {
          if (!isUnmounted) {
            if (res.data && !res.data.defaut) {
              if (res.data.isAll) {
                setIsAll(1)
                setInstruct(res.data.instruct)

                setDefaultSelectComp([])
              } else {
                setIsAll(2)
                let codeList = res.data.compCode
                let arr: any = []
                for (let i in codeList) {
                  arr.push(codeList[i].compCode)
                }
                setSelectComp(codeList)
                setInstruct(res.data.instruct)
                setDefaultSelectComp(arr)
              }
            } else {
              setIsAll(1)
            }
          }
        })
        .catch(err => {
          message.error(err.msg)
        })
    }

    return () => {
      isUnmounted = true
    }
  }, [])

  useEffect(() => {
    if (progress == 5 && !isEdit) {
      setIsDisabled(true)
    } else {
      setIsDisabled(false)
    }
  }, [progress, isEdit])

  const handleCancel = e => {
    setVisible(false)
  }

  const handleOk = e => {
    setVisible(false)
  }

  const onSelectCompType = e => {
    console.log(e.target.value)
    setIsAll(e.target.value)
  }

  const getShopList = e => {
    console.log(e)
    const curCard = getStore('curCard')
    if (e.type == 'click') {
      e.persist()
    }

    let params = {
      cardId: curCard.cardId,
      shopName: e.type == 'click' ? '' : e,
    }

    setLoading(true)
    setVisible(true)

    api
      .getCompTree(params)
      .then((res: any) => {
        if (res.data) {
          console.log(res.data)
          let data = res.data
          setTreeData(data)
          // changeData(data)
          setLoading(false)
        } else {
          console.log(res.data)
          setTreeData([])
        }
      })
      .catch(err => {
        message.error(err.msg)
      })
  }
  // const onSelectTree = (selectedKeys, info) => {
  //   console.log('selected', selectedKeys, info)
  // }
  const onCheckTree = (checkedKeys, info) => {
    setSelectComp(info.checkedNodes)
    setDefaultSelectComp(checkedKeys)
    console.log('onCheck', checkedKeys)
    console.log('onCheck', info)
  }

  return (
    <div className="block_useLimit block" id="block_useLimit">
      <div className="block_title">
        <span>填写使用限制</span>
      </div>
      {/* {isAll} */}
      <div className="block_content">
        <Form form={form} size={size}>
          <Form.Item label="使用门店:">
            <Radio.Group onChange={onSelectCompType} value={isAll} disabled={isDisabled}>
              <Radio value={1}>全部门店</Radio>
              <Radio value={2}>部分门店</Radio>
            </Radio.Group>
            {isAll === 2 ? (
              <Button type="primary" ghost onClick={e => getShopList(e)} disabled={isDisabled}>
                添加
              </Button>
            ) : null}
          </Form.Item>
          <Form.Item label="使用说明:">
            <TextArea
              rows={4}
              style={{ width: '420px' }}
              value={instruct}
              onChange={onChangeText}
              disabled={isDisabled}
            />
          </Form.Item>
          <Form.Item>
            <Button
              htmlType="submit"
              type="primary"
              loading={loading2}
              onClick={submit}
              style={{ marginLeft: '70px' }}
              disabled={isDisabled}>
              保存
            </Button>
          </Form.Item>
        </Form>
      </div>

      <Modal title="选择项目" visible={visible} onOk={handleOk} onCancel={handleCancel}>
        <Spin spinning={loading}>
          <Search style={{ marginBottom: 8 }} placeholder="Search" onSearch={value => onSearch(value)} />
          <Tree
            checkable
            height={233}
            defaultExpandAll
            // defaultExpandedKeys={['0-0-0', '0-0-1']}
            // defaultSelectedKeys={['0-0-0', '0-0-1']}
            // defaultCheckedKeys={defaultSelectComp}
            // defaultCheckedKeys={defaultSelectComp}
            checkedKeys={defaultSelectComp}
            // onSelect={onSelectTree}
            onCheck={onCheckTree}
            treeData={treeData}>
            {/* <TreeNode title={} key={}></TreeNode> */}
          </Tree>
        </Spin>
      </Modal>
    </div>
  )
}

export default changeCardType
