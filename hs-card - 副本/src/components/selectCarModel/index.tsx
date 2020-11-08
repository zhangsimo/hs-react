/** @format */

import { Button, Form, Input, Modal, Table } from 'antd'
import React, { useEffect, useState } from 'react'
import { ColumnProps } from 'antd/lib/table'
import { SearchOutlined } from '@ant-design/icons'
import * as api from '@/api'
import { useBoolean } from '@umijs/hooks'
// import { inRange } from 'lodash'
// import {useRequest} from '@umijs/hooks'

interface IProps {
  visible: boolean //是否显示
  onOk: (arr) => void
  onCancel: () => void
  // setVisible: (a: boolean) => void
}

const SelectCarModelPage: React.FC<IProps> = props => {
  const [form] = Form.useForm()
  const [tableData, setTableData] = useState<Array<any>>([])
  const [selectData, setSelectData] = useState<Array<any>>([])
  const tableLoading = useBoolean(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([])
  // const [selectModel, setSelectModel] = useState<boolean>(false)
  const [expandedRowKeys, setExpandedRowKeys] = useState<any[]>([])



  const getBrandList = () => {
    tableLoading.setTrue()
    api
      .getSaleBrandLineModel({
        brandCn: form.getFieldValue('brand'),
        carLineName: form.getFieldValue('line'),
        selectModel: false,
        cacheKey: 'brandLineModel',
      })
      .then(res => {
        tableLoading.setFalse()
        setTableData(res.data)
      })
  }

  useEffect(() => {
    getBrandList()
  }, [])

  const rowSelection = {
    selectedRowKeys,
    checkStrictly: false,
    onChange: (selectedRowKeys, selectedRows) => {
      // console.log(`selectedRowKeys: ${selectedRowKeys}`)
      // console.log('selectedRows: ', selectedRows)
      console.log("22222222222")
      setSelectedRowKeys(selectedRowKeys)
      // setSelectedRows(selectedRows)
    },
    onSelect: (record, selected, selectedRows, nativeEvent) => {
      console.log("333333333333")
      // console.log('record: ', record)
      // console.log('selected: ', selected)
      // console.log('selectedRows: ', selectedRows) //实时选中的行
      // console.log('nativeEvent: ', nativeEvent)

      const tempArr: Array<any> = []
      let newArr: Array<any> = []
      selectedRows.forEach((item: any) => {
        if (!item.children) {
          tempArr.push(item)
        }
      })
      tempArr.forEach(item => {
        newArr = [...newArr, ...treeFindPath(tableData, data => data.key === item.key)]
      })
      // console.log('newARr:', newArr)

      setSelectData(newArr)
    },
    getCheckboxProps: record => ({
      disabled: !record.isLoad, // Column configuration not to be checked
      name: record.name,
    }),
  }

  const expandedRowRender = {
    expandedRowKeys: expandedRowKeys,
    onExpand: (expandedRows, record) => {
      console.log(expandedRows)
      console.log(record)
      // setSelectModel(true)
      // tableLoading.setTrue()
      if (expandedRows) {
        form.setFieldsValue({ brand: record.brandCn })
        if (record.brandCn && !record.isLoad) {
          onSearchBrand('')
        } else {
          // let key: any = []
          expandedRowKeys.push(record.key)
          setExpandedRowKeys([...expandedRowKeys])
        }
      } else {
        // expandedRowKeys.push(record.key)
        for (let i in expandedRowKeys) {
          if (expandedRowKeys[i] == record.key) {
            expandedRowKeys.splice(Number(i), 1)
          }
        }
        setExpandedRowKeys([...expandedRowKeys])
      }



    }

  }


  const treeFindPath = (tree, func, path: any = []) => {
    let tempObj = {}
    if (!tree) return []
    for (const data of tree) {
      //这里按照你的需求来存放最后返回的内容吧
      const temp = { ...data }
      delete temp.children
      path.push(temp)
      if (func(data)) {
        // console.log('path:', path)
        if (path.length) {
          path[0] && (tempObj = { ...tempObj, ...path[0] })
          path[1] && (tempObj = { ...tempObj, ...path[1] })
          path[2] && (tempObj = { ...tempObj, ...path[2], carLineNameId: path[2].id })
          path[3] && (tempObj = { ...tempObj, ...path[3] })
          return [tempObj]
        } else {
          return []
        }
      }
      if (data.children) {
        const findChildren = treeFindPath(data.children, func, path)
        if (findChildren.length) return findChildren
      }
      path.pop()
    }
    return []
  }

  // 对象数组根据key去重
  // const c = (arr, key) => {
  //   const hash = {}
  //   const tempIArr = arr.reduce((preVal, curVal) => {
  //     hash[curVal[key]] ? '' : (hash[curVal[key]] = true && preVal.push(curVal))
  //     return preVal
  //   }, [])
  //   return tempIArr
  // }

  const onSearchBrand = (type) => {
    tableLoading.setTrue()
    api
      .getSaleBrandLineModel({
        brandCn: form.getFieldValue('brand'),
        carLineName: form.getFieldValue('line'),
        selectModel: type ? false : true,

      })
      .then(res => {
        tableLoading.setFalse()
        // const tempArr: Array<any> = []
        let data = res.data[0]
        // let newArr: Array<any> = []
        // res.data.forEach((item: any) => {
        //   if (!item.children) {
        //     tempArr.push(item)
        //   }
        // })
        // tableData.forEach(item => {
        //   newArr = [...tableData, ...treeFindPath(tableData, data => data.key === item.key)]
        // })
        let key: any = []
        if (type) {
          setTableData(res.data)
        } else {
          console.log(data)
          console.log(tableData)
          data.isLoad = true
          let data1 = data.children


          for (let j in data1) {
            data1[j].isLoad = true
            let data2 = data1[j].children
            for (let m in data2) {
              data2[m].isLoad = true
              let data3 = data2[m].children
              for (let n in data3) {
                data3[n].isLoad = true
                let data4 = data3[n].children
                for (let i in data4) {
                  data4[i].isLoad = true
                }
              }
            }

          }

          console.log(data)
          for (let i in tableData) {
            if (tableData[i].brandCn == data.brandCn) {
              console.log(tableData[i])
              console.log(data.brandCn)
              // data[0].isLoad = true
              tableData[i] = data
              key.push(tableData[i].key)
            }
          }

          console.log('tableData:', tableData)

          setTableData([...tableData])
          setExpandedRowKeys(key)
        }

        // setTableData(res.data)
      })
  }
  const onSubmit = () => {
    props.onOk(selectData)
  }

  const columns: ColumnProps<any>[] = [
    // {
    //   title: '序号',
    //   align: 'left',
    //   render: (text, record, index) => `${index + 1}`,
    // },
    {
      title: '车型品牌',
      dataIndex: 'brandCn',
      align: 'left',
    },
    {
      title: '厂商',
      dataIndex: 'manufacturerName',
      align: 'left',
    },
    {
      title: '车系',
      dataIndex: 'carLineName',
      align: 'left',
    },
    {
      title: '年份',
      dataIndex: 'year',
      align: 'left',
      width: 80,
    },
    {
      title: '排量',
      dataIndex: 'displacement',
      align: 'left',
      width: 80,
    },
    {
      title: '车型',
      dataIndex: 'carModelName',
      align: 'left',
      width: 400,
    },
    // {
    //   title: '操作',
    //   align: 'left',
    //   render: (value, row) => {
    //     return <Button type="link">日志</Button>
    //   },
    // },
  ]

  return (
    <Modal title={'选择车型'} visible={props.visible} onCancel={props.onCancel} onOk={onSubmit} width={1100}>
      <Form layout="inline" form={form}>
        <Form.Item name="brand">
          <Input placeholder="车型品牌" allowClear></Input>
        </Form.Item>
        <Form.Item name="line">
          <Input placeholder="车型车系" allowClear></Input>
        </Form.Item>
        <Form.Item>
          <Button type="primary" icon={<SearchOutlined />} onClick={() => onSearchBrand(1)}>
            搜索
          </Button>
        </Form.Item>
      </Form>
      <div style={{ backgroundColor: 'white', marginTop: '12px' }}>
        <Table
          loading={tableLoading.state}
          rowSelection={rowSelection}
          size="middle"
          columns={columns}
          dataSource={tableData}
          expandable={expandedRowRender}
          rowKey="key"
          pagination={false}
          scroll={{ y: 400 }}
        />
      </div>
    </Modal>
  )
}

export default SelectCarModelPage
