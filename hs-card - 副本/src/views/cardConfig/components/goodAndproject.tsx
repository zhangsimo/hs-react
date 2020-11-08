/** @format */

import React, { useState, useEffect } from 'react'
import { ColumnProps } from 'antd/lib/table'
import { Table, Button, Modal, message, Spin, Radio, Form, Input, Row, Col, Tree } from 'antd'
import ToolsBar from '@/components/ToolsBar'
// import {FormInstance} from 'antd/lib/form'
import * as api from '@/api'
import './changeCardType.less'
import { IselectProject } from '@/interface'
import { projectFormat } from '../_common/index'
import { getStore } from '@/utils/store'
import { Pagination } from 'antd'
import './goodAndproject.less'
import GlobalStore from '@/store/global'
import { SearchOutlined } from '@ant-design/icons'
import { useRequest, useBoolean } from '@umijs/hooks'
import { getTreeDataFormat } from '@/utils/common'

interface IProps {
  projectDetails: any
  goodDetail: any
  setCardId: any
  progress: any
  isEdit: any
  isOnline: any
}

// const PageGoodAndPorject = () => {
const PageGoodAndPorject: React.FC<IProps> = props => {
  const [visible, setVisible] = useState<boolean>(false)
  const [visibleGood, setVisibleGood] = useState<boolean>(false)
  const { user } = GlobalStore.useContainer()
  const [projectList, setProjectList] = useState<any>({})
  const [goodList, setGoodList] = useState<any>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [loading2, setLoading2] = useState<boolean>(false)
  const [loading3, setLoading3] = useState<boolean>(false)
  const [activeType, setActiveType] = useState<number>(1)
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([])
  const [goodSelectedRowKeys, setGoodSelectedRowKeys] = useState<string[]>([])
  const [selectedRowProject, setSelectedRowProject] = useState<any[]>([])
  const [selectedRowProjectKey, setSelectedRowProjectKey] = useState<any[]>([])
  const [selectedRowGood, setSelectedRowGood] = useState<any[]>([])
  const [selectedRowGoodKey, setSelectedRowGoodKey] = useState<any[]>([])
  const [currTreeType, setCurrTreeType] = useState('')
  const isFid = useBoolean(false)

  const [isDisabled, setIsDisabled] = useState<boolean>(false)
  const progress = props.progress
  const isEdit = props.isEdit
  const isOnline = props.isOnline
  const [formGood] = Form.useForm()
  const [formProject] = Form.useForm()

  const { data: treeDataGood } = useRequest(() =>
    api
      .getShopCategoryListNested({
        page: 1,
        pageSize: 2000,
        // storeId: 419,
        // c: 'category',
        // a: 'store_category',
        // requestFrom: 'app',
        // wxType: 1,
      })
      .then(res =>
        getTreeDataFormat(res.data.items, {
          value: 'key', // 新字段
          oldValue: 'id', //老字段
          field: 'title',
          oldField: 'cateName',
          parentField: 'children', //必要
          oldParentField: 'childs', //必要


          // value: 'key', // 新字段
          // oldValue: 'catId', //老字段
          // field: 'title',
          // oldField: 'catName',
          // parentField: 'children', //必要
          // oldParentField: 'catList', //必要
        }),
      ),
  )

  useEffect(() => {
    if (currTreeType) {
      formGood.setFieldsValue({
        keywords: null,
      })
      getShowGood({})
    }
  }, [currTreeType])

  const onSelectChange = selectedRowKeys => {
    console.log(selectedRowKeys)
    setSelectedRowKeys(selectedRowKeys)
  }
  const onGoodSelectChange = selectedRowKeys => {
    console.log(selectedRowKeys)
    setGoodSelectedRowKeys(selectedRowKeys)
  }

  const onSelectChangeProject = (
    selectedRowKeys: React.SetStateAction<any[]>,
    selectedRowValue: React.SetStateAction<any[]>,
  ) => {
    console.log(selectedRowKeys)
    console.log(selectedRowValue)
    setSelectedRowProjectKey(selectedRowKeys)
    setSelectedRowProject(selectedRowValue)
  }
  const onSelectChangeGood = (
    selectedRowKeys: React.SetStateAction<any[]>,
    selectedRowValue: React.SetStateAction<any[]>,
  ) => {
    console.log(selectedRowKeys)
    console.log(selectedRowValue)
    setSelectedRowGoodKey(selectedRowKeys)
    setSelectedRowGood(selectedRowValue)
  }

  console.log(progress)
  useEffect(() => {
    if (progress == 5) {
      if (isOnline == 1) {
        setIsDisabled(true)
      } else {
        if (isEdit) {
          setIsDisabled(false)
        } else {
          setIsDisabled(true)
        }
      }
    } else {
      setIsDisabled(false)
    }
  }, [progress, isEdit, isOnline])

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  }
  const rowSelectionG = {
    goodSelectedRowKeys,
    onChange: onGoodSelectChange,
  }

  const rowSelectionPorject = {
    selectedRowProject,
    selectedRowKeys: selectedRowProjectKey,
    onChange: onSelectChangeProject,
  }
  const rowSelectionGood = {
    selectedRowGood,
    selectedRowKeys: selectedRowGoodKey,
    onChange: onSelectChangeGood,
  }

  const getShowProject = data => {
    const curCard = getStore('curCard')
    let params: any = {
      cardId: curCard.cardId,
      memberId: user?.memberId,
      memberName: user?.memberName,
      page: data.page || 1,
      pageSize: data.pageSize || 10,
      total: data.total || null,
      searchKey: formProject.getFieldValue('searchKey'),
    }

    let apiUrl: any = ''
    if (curCard.useType == 4) {
      apiUrl = api.getFindPkgs
    } else if (curCard.useType == 2) {
      apiUrl = api.getFindHours
    } else if (curCard.useType == 3) {
      apiUrl = api.getFindParts
    } else {
      apiUrl = api.getFindParts
    }
    setLoading2(true)
    setVisible(true)
    apiUrl({ ...params })
      .then(res => {
        let data = res.data
        setProjectList(data)
        setLoading2(false)
      })
      .catch(err => {
        console.log(err)
        message.error(err.msg)
        setLoading2(false)
      })
  }
  const getShowGood = data => {
    setLoading2(true)
    setVisibleGood(true)
    const compCode = sessionStorage.getItem('compCode')
    let shopCodes: any = []
    shopCodes.push(compCode)
    const params = {
      shopCodes: shopCodes,
      status: '2',
      nameOrCode: '',
      page: data.page || 1,
      pageSize: data.pageSize || 10,
      goodsName: formGood.getFieldValue('goodsName'),
      categoryId: isFid.state ? '' : currTreeType,

      // c: 'product',
      // a: 'selling_goods_list',
      // page: data.page || 1,
      // pageSize: data.pageSize || 10,
      // storeId: 9,
      // keywords: formGood.getFieldValue('keywords'),
      // classifyC_id: isFid.state ? '' : currTreeType, // isFid.state是否为父节点
      // classifyF_id: isFid.state ? currTreeType : '',
    }

    // if (data?.type === 'search') {
    //   // data?.type 是否通过查询框搜索
    //   delete params.classifyC_id
    //   delete params.classifyF_id
    // }
    api
      .getMarketGoodsList(params)
      .then(res => {
        let data = res.data
        // setSelectedRowProjectKey([])
        // let arr: any = []
        setGoodList(data)
        // for (let i in data.items) {
        //   arr.push(data.items[i].itemCode)
        // }
        // console.log(arr)
        // setSelectedRowProjectKey(arr)
        // setSelectedRowProject(data.items)
        // setSelectedRowProject(data.items)
        setLoading2(false)
      })
      .catch(err => {
        console.log(err)
        message.error(err.msg)
        setLoading2(false)
      })
  }
  const handleOk = () => {
    const curCard = getStore('curCard')
    if (selectedRowProjectKey.length == 0) {
      message.error('请至少选择一个项目')
      return
    }
    console.log(selectedRowProjectKey)
    console.log(props.projectDetails.items)

    let arr: any = []

    for (let i: any = 0; i < selectedRowProjectKey.length; i++) {
      for (let j: any = 0; j < projectList.items.length; j++) {
        if (projectList.items[j].itemCode == selectedRowProjectKey[i]) {
          arr.push(projectList.items[j])
          console.log(selectedRowProjectKey[i])
          // selectedRowProjectKey.splice(j, 1)
        }
      }
    }
    console.log(arr)

    let params: any = {
      cardId: curCard.cardId,
      items: arr,
    }
    console.log(params)
    setLoading(true)
    api
      .saveCardItem(params)
      .then(res => {
        console.log(res)
        let data = {
          cardId: curCard.cardId,
          page: 1,
          pageSize: 5,
          scroolType: 2,
        }
        props.setCardId(data)
        setVisible(false)
        let anchorElement = document.getElementById('block_selectChannel')
        if (anchorElement) {
          anchorElement.scrollIntoView({ block: 'start', behavior: 'smooth' })
        }
        setSelectedRowProjectKey([]) //初始化，置空
        setLoading(false)
      })
      .catch(err => {
        setSelectedRowProjectKey([]) //初始化，置空
        message.error(err.msg)
        setLoading(false)
      })
  }
  const handleOkGood = () => {
    const curCard = getStore('curCard')
    if (selectedRowGoodKey.length == 0) {
      message.error('请至少选择一个商品')
      return
    }
    console.log(selectedRowGood)
    console.log(selectedRowGoodKey)
    console.log(props.projectDetails.items)
    // debugger
    if (curCard.cardType === 4) {
      if (props.goodDetail.items.length >= 1 || selectedRowGoodKey.length >= 2) {
        message.warning('兑换券只能关联一个商品哦')
        return
      }
    }
    // debugger
    const arr = selectedRowGood.map(item => ({
      cardId: curCard.cardId,
      itemCode: Number(item.goodsId),
      itemName: item.goodsName,
      itemType: '5',
    }))
    let params: any = {
      cardId: curCard.cardId,
      items: arr,
    }
    setLoading(true)
    api
      .saveCardItem(params)
      .then(res => {
        console.log(res)
        let data = {
          cardId: curCard.cardId,
          page: 1,
          pageSize: 5,
          scroolType: 2,
        }
        props.setCardId(data)
        setVisibleGood(false)
        // let anchorElement = document.getElementById('block_selectChannel')
        // if (anchorElement) {
        //   anchorElement.scrollIntoView({block: 'start', behavior: 'smooth'})
        // }
        setSelectedRowGoodKey([]) //初始化，置空
        setLoading(false)
      })
      .catch(err => {
        setSelectedRowGoodKey([]) //初始化，置空
        message.error(err.msg)
        setLoading(false)
      })
  }

  const handleCancel = e => {
    setVisible(false)
  }

  //单个删除项目
  const deleteData = row => {
    const curCard = getStore('curCard')
    console.log(row)
    let params = {
      cardId: curCard.cardId,
      itemCode: row.itemCode,
    }
    api
      .delCardItem(params)
      .then(res => {
        let data = {
          cardId: curCard.cardId,
          page: 1,
          pageSize: 5,
        }
        props.setCardId(data)
        message.success('删除成功')
      })
      .catch(err => {
        message.error(err.msg)
      })
  }
  //单个删除项目 商品
  const deleteDataGood = row => {
    const curCard = getStore('curCard')
    console.log(row)
    let params = {
      cardId: curCard.cardId,
      itemCode: Number(row.productId),
    }
    api
      .delCardItem(params)
      .then(res => {
        let data = {
          cardId: curCard.cardId,
          page: 1,
          pageSize: 5,
        }
        props.setCardId(data)
        message.success('删除成功')
      })
      .catch(err => {
        message.error(err.msg)
      })
  }

  const onChangePage = (page, pageSize) => {
    const curCard = getStore('curCard')
    let params = {
      cardId: curCard.cardId,
      page: page,
      total: props.projectDetails.total,
      pageSize: pageSize,
    }
    setLoading3(true)
    props.setCardId(params)
    setTimeout(function () {
      setLoading3(false)
    }, 1000)
  }

  // const onChangePageGood = (page, pageSize) => {
  //   const curCard = getStore('curCard')
  //   let params = {
  //     cardId: curCard.cardId,
  //     page: page,
  //     total: props.goodDetail.total,
  //     pageSize: pageSize,
  //   }
  //   setLoading3(true)
  //   props.setCardId(params)
  //   setTimeout(function () {
  //     setLoading3(false)
  //   }, 1000)
  // }

  const onChangeProject = (page, pageSize) => {
    const curCard = getStore('curCard')
    let params = {
      cardId: curCard.cardId,
      page: page,
      total: projectList.total,
      pageSize: pageSize,
    }
    getShowProject(params)
  }
  // const onChangeGood = (page, pageSize) => {
  //   setSelectedRowGood([]) // 下一页 清空其他页的勾选
  //   setSelectedRowGoodKey([])
  //   // const curCard = getStore('curCard')
  //   // let params = {
  //   //   cardId: curCard.cardId,
  //   //   page: page,
  //   //   total: goodList.total,
  //   //   pageSize: pageSize,
  //   // }
  //   // getShowGood(params)
  // }
  const onShowSizeChange = (current, size) => {
    const curCard = getStore('curCard')
    let params = {
      cardId: curCard.cardId,
      page: current,
      total: projectList.total,
      pageSize: size,
    }
    getShowProject(params)
  }
  // const onShowSizeChangeGood = (current, size) => {
  //   const curCard = getStore('curCard')
  //   let params = {
  //     cardId: curCard.cardId,
  //     page: current,
  //     total: goodList.total,
  //     pageSize: size,
  //   }
  //   getShowGood(params)
  // }

  const delCardItem = () => {
    const curCard = getStore('curCard')
    if (selectedRowKeys.length == 0 && goodSelectedRowKeys.length == 0) {
      message.error('请至少选择一个项目或商品')
      return
    }
    let params: any = {
      cardId: curCard.cardId,
      itemCodes: [...selectedRowKeys, ...goodSelectedRowKeys].join(','),
    }

    api
      .delBatchCardItem(params)
      .then(res => {
        let data = {
          cardId: curCard.cardId,
          page: 1,
          pageSize: 5,
        }
        props.setCardId(data)
        message.success('删除成功')
      })
      .catch(err => {
        message.error(err.msg)
      })
  }

  // const onGoodSearch = () => {}
  const treeTypeClick = (selectedKeys, e) => {
    setCurrTreeType(e.node.id)
    if (e.node.pid === '0') {
      isFid.setTrue()
    } else {
      isFid.setFalse()
    }
  }

  const columns: ColumnProps<IselectProject>[] = [
    {
      title: '项目名称',
      dataIndex: 'itemName',
      align: 'left',
      width: 300,
    },
    {
      title: '项目类型',
      dataIndex: 'itemType',
      align: 'center',
      render: (a, row: any) => row.itemClass || projectFormat(a, row),
      width: 130,
    },
    {
      title: '操作',
      dataIndex: '',
      align: 'center',
      render: (a, row) => {
        return (
          <div>
            <Button type="link" onClick={() => deleteData(row)} disabled={isDisabled}>
              删除
            </Button>
          </div>
        )
      },
    },
  ]

  const columnsGood: ColumnProps<any>[] = [
    {
      title: '商品',
      dataIndex: 'goodsName',
      align: 'left',
      width: 370,
      render: (valu, row) => (
        <div className="table-title">
          <img src={row.goodsImgUrl} alt={row.goodsName} />
          <div className="table-title-text">
            <p>{row.goodsName}</p>
            <p>原价：￥{row.originalPrice}</p>
            {/* {row.isFx ? <Tag color="#f50">已分销</Tag> : <Tag color="#87d068">未分销</Tag>} */}
          </div>
        </div>
      ),
    },

    {
      title: '商品售价',
      dataIndex: 'salePrice',
      width: 150,
      align: 'center',
    },

    {
      title: '所属分类',
      dataIndex: 'classify',
      width: 150,
      align: 'center',
    },
    {
      title: '规格数量',
      dataIndex: 'goodsStock',
      width: 120,
      align: 'center',
    },
    // {
    //   title: '所属分组',
    //   dataIndex: 'itemType',
    //   width: 100,
    //   align: 'center',
    // },
    // {
    //   title: '成本价(含税)',
    //   dataIndex: 'pointPrice',
    //   width: 150,
    //   align: 'left',
    //   render: (value, row) => (
    //     <div className="price-detail">
    //       <p>成本价：{row.primeCostPrice}</p>
    //       <p>毛利率：{row.grossMargin}</p>
    //       <p>毛利额：{row.grossProfit}</p>
    //     </div>
    //   ),
    // },
    {
      title: '操作',
      dataIndex: '',
      align: 'center',
      width: 130,
      render: (a, row) => {
        return (
          <div>
            <Button type="link" onClick={() => deleteDataGood(row)} disabled={isDisabled}>
              删除
            </Button>
          </div>
        )
      },
    },
  ]

  const columnsTotal: ColumnProps<IselectProject>[] = [
    {
      title: '项目名称',
      dataIndex: 'itemName',
      align: 'left',
    },
    {
      title: '项目类型',
      dataIndex: 'itemType',
      align: 'center',
      render: (a, row) => projectFormat(a, row),
    },
  ]
  const columnsTotalGood: ColumnProps<any>[] = columnsGood.slice(0, -1)

  return (
    <div className="block_goodAndProject block" id="block_goodAndProject">
      <div className="block_title">
        <span>选择关联项目或商品</span>
      </div>
      <div className="block_content">
        <div>
          选择项目或商品: &nbsp;&nbsp;
          <Button type="primary" ghost onClick={getShowProject} disabled={isDisabled}>
            添加项目
          </Button>
          &nbsp;&nbsp;&nbsp;
          <Button type="primary" ghost onClick={getShowGood} disabled={isDisabled}>
            添加商品
          </Button>
          &nbsp;&nbsp;&nbsp;
          <Button type="primary" ghost onClick={delCardItem} disabled={isDisabled}>
            批量删除
          </Button>
        </div>
        <div>
          <br />
          {/* <h4>已选的项目：</h4> */}
          <Radio.Group buttonStyle="solid" value={activeType} onChange={e => setActiveType(e.target.value)}>
            <Radio.Button value={1} key={1}>
              已添加的维保项目
            </Radio.Button>
            <Radio.Button value={2} key={2}>
              已添加的电商商品
            </Radio.Button>
          </Radio.Group>
          {activeType === 1 && (
            <div style={{ backgroundColor: 'white', marginTop: '12px', overflow: 'auto' }}>
              <Spin spinning={loading3} style={{ width: '600px' }}>
                <Table
                  rowSelection={rowSelection}
                  columns={columns}
                  rowKey="itemCode"
                  bordered
                  dataSource={props.projectDetails.items}
                  size="small"
                  style={{ width: '600px' }}
                  scroll={{ y: 240 }}
                  pagination={false}
                />

                <Pagination
                  size="small"
                  total={props.projectDetails.total}
                  pageSize={5}
                  // pageSizeOptions={['5', '10']}
                  showSizeChanger={false}
                  onChange={onChangePage}
                  style={{ marginTop: '15px' }}
                />
              </Spin>
            </div>
          )}
          {activeType === 2 && (
            <div style={{ backgroundColor: 'white', marginTop: '12px', overflow: 'auto' }}>
              <Table
                rowSelection={rowSelectionG}
                columns={columnsGood}
                rowKey="productId"
                bordered
                dataSource={props.goodDetail.items}
                size="small"
                style={{ width: '1000px' }}
                scroll={{ y: 240 }}
                pagination={false}
              />

              {/* <Pagination
                size="small"
                total={props.goodDetail.total}
                pageSize={20}
                // pageSizeOptions={['5', '10']}
                showSizeChanger={false}
                onChange={onChangePageGood}
                style={{ marginTop: '15px' }}
              /> */}
            </div>
          )}
          {/* <Button htmlType="submit" type="primary" onClick={submit}>
            下一步
          </Button> */}
        </div>
      </div>

      <Modal title="选择项目" visible={visible} onOk={handleOk} confirmLoading={loading} onCancel={handleCancel}>
        <div id="itemSelectModal">
          <ToolsBar>
            <Form layout="inline" form={formProject}>
              <Form.Item name="searchKey">
                <Input placeholder="输入名称搜索" allowClear style={{ width: 330, marginLeft: 20 }} />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  icon={<SearchOutlined />}
                  onClick={() => {
                    getShowProject({})
                  }}>
                  搜索
                </Button>
              </Form.Item>
            </Form>
          </ToolsBar>
          <Spin spinning={loading2}>
            <Table
              rowSelection={rowSelectionPorject}
              columns={columnsTotal}
              rowKey="itemCode"
              dataSource={projectList.items}
              size="small"
              pagination={false}
              style={{ height: '350px', overflow: 'auto' }}
            />

            <Pagination
              size="small"
              total={projectList.total}
              // pageSize={projectList.pageSize}
              onChange={onChangeProject}
              onShowSizeChange={onShowSizeChange}
              style={{ marginTop: '15px', textAlign: 'right' }}
            />
          </Spin>
        </div>
      </Modal>

      <Modal
        title="选择商品"
        centered
        visible={visibleGood}
        onOk={handleOkGood}
        confirmLoading={loading}
        width={1100}
        onCancel={() => setVisibleGood(false)}
        bodyStyle={{ padding: '0px 20px 0px 0px ' }}>
        <Row id="goodSelectModal">
          <Col span={5} className="left-style">
            <Tree treeData={treeDataGood} height={520} selectedKeys={[currTreeType]} onSelect={treeTypeClick} />
          </Col>
          <Col span={19} style={{ padding: '0px 0px 20px 0px ' }}>
            <ToolsBar>
              <Form layout="inline" form={formGood}>
                <Form.Item name="goodsName">
                  <Input placeholder="输入商品名称搜索" allowClear style={{ width: 400, marginLeft: 20 }} />
                </Form.Item>
                <Form.Item>
                  <Button
                    type="primary"
                    icon={<SearchOutlined />}
                    onClick={() => {
                      setCurrTreeType('')
                      getShowGood({ type: 'search' })
                    }}>
                    搜索
                  </Button>
                </Form.Item>
              </Form>
            </ToolsBar>
            <Spin spinning={loading2}>
              <Table
                rowSelection={rowSelectionGood}
                columns={columnsTotalGood}
                // rowKey="productId"
                rowKey={record => record.goodsId}
                dataSource={goodList}
                size="small"
                // pagination={false}
                pagination={{
                  total: goodList.length,
                  showTotal: total => `共 ${total} 条`,
                  pageSize: 8,
                  showSizeChanger: false,

                }}
                style={{ height: '450px', overflow: 'auto' }}
              />

              {/* <Pagination
                size="small"
                total={goodList.length}
                pageSize={8}
                onChange={onChangeGood}
                // onShowSizeChange={onShowSizeChangeGood}
                style={{ marginTop: '15px', textAlign: 'right' }}
              /> */}
            </Spin>
          </Col>
        </Row>
      </Modal>
    </div>
  )
}

export default PageGoodAndPorject
