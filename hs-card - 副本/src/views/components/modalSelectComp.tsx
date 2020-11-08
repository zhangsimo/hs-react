/** @format */
import React, { useState, useEffect, useImperativeHandle } from 'react';
import { Input, message, Spin, Tree } from 'antd'
// import { useBoolean } from '@umijs/hooks'

// import { ColumnProps } from 'antd/lib/table'
import * as api from '@/api'

const { Search } = Input

// import {ExclamationCircleOutlined} from '@ant-design/icons'
interface IProps {
    setSelectComp: any
    cRef: any
}


let RuleTable: React.FC<IProps> = (props) => {
    // const [treeData, setTreeData] = useState<any>([])
    // const [loading, setLoading] = useState<boolean>(false)
    const [treeData, setTreeData] = useState<any>([])
    const [loading, setLoading] = useState<boolean>(false)
    // const [selectComp, setSelectComp] = useState<any>([])
    const [defaultSelectComp, setDefaultSelectComp] = useState<any>([])

    useImperativeHandle(props.cRef, () => ({
        // changeVal 就是暴露给父组件的方法
        changeVal: () => {
            console.log("fsadfsadfsafa")
            setDefaultSelectComp([])

        }
    }));

    useEffect(() => {

        getShopList({})

    }, [])

    const getShopList = e => {
        let params = {
            shopName: e.type == 'click' ? '' : e,
        }

        setLoading(true)
        // setVisible(true)
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
    const onSearch = e => {
        console.log(e)
        // setSearchValue(e)
        getShopList(e)
    }
    const onCheckTree = (checkedKeys, info) => {
        props.setSelectComp(info.checkedNodes, checkedKeys)
        setDefaultSelectComp(checkedKeys)
        console.log('onCheck', checkedKeys)
        console.log('onCheck', info)
    }

    return (

        <Spin spinning={loading}>
            <Search style={{ marginBottom: 8 }} placeholder="Search" onSearch={value => onSearch(value)} />
            { treeData.length > 0 && <Tree
                checkable
                height={233}
                defaultExpandAll={true}
                checkedKeys={defaultSelectComp}
                // onSelect={onSelectTree}
                onCheck={onCheckTree}
                treeData={treeData}>
                {/* <TreeNode title={} key={}></TreeNode> */}
            </Tree>
            }


        </Spin>


    )
}


export default RuleTable




