/** @format */

import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import useSearchParams from '@/hooks/useSearchParams'
import {
  Steps,
  Form,
  Input,
  Checkbox,
  Button,
  Radio,
  DatePicker,
  Space,
  message,
  Select,
  Table,
  InputNumber,
  TreeSelect,
  Spin,
  Switch,
  // Divider,
} from 'antd'
import { toTreeDate } from '@/utils'
import WEdit from '@/components/WangEditor/index'
import UploadImage from '@/components/Upload/Image'
import * as api from '@/api'
// import ModalGongshi from './modal/gongshi'
// import ModalPeijian from './modal/peijian'
import Company from './modal/company'
// import ModalPeijianTemplate from './modal/peijianTemplate'
import ModalProjectTemplate from './modal/projectTemplate'
import AddGoodPop from './modal/addGoodPop'
// import TableSpec from './table-spec'
import Moment from 'moment'
import './index.less'
import { useBoolean, useRequest } from '@umijs/hooks'
import { ColumnProps } from 'antd/lib/table'
import { RightOutlined } from '@ant-design/icons'
import TagViewStore from '@/store/tag-view'
// import { merge } from 'lodash'
// import { fromPairs } from 'lodash'
import { sum } from 'lodash'
import { uniqueArr } from '@/utils/common'
import { getStore } from '@/utils/store'
import SelectCarModel from '@/components/selectCarModel'

const stepList = [
  { id: 1, name: '基础信息' },
  { id: 2, name: '销售信息' },
  { id: 3, name: '图文描述' },
  { id: 4, name: '物流信息' },
  { id: 5, name: '服务费用' },
  { id: 6, name: '发布范围' },
  { id: 7, name: '其他配置' },
]

const productTypeList = [
  { id: 1, name: '普通商品' },
  { id: 2, name: '工时' },
  { id: 3, name: '配件' },
  { id: 4, name: '项目' },
  { id: 5, name: '套餐' },
]

const { TreeNode } = TreeSelect

const Index = () => {
  const [loading, setLoading] = useState(false)
  const showSelectCarModel = useBoolean(false)
  const [mealgoodShow, setmealgoodShow] = useState<boolean>(false)
  const [longTermEffective, setLongTermEffective] = useState<boolean>(false)
  // const [isDisabled, setIsDisabled] = useState<boolean>(false)

  const [islimitNum, setIslimitNum] = useState<boolean>(false)
  const [productType, setProductType] = useState<any>()
  // const [category, setCategory] = useState<any>()
  const [projectTemplateList, setProjectTemplateList] = useState<any[]>([])
  const [gongshiList, setGongshiList] = useState<any[]>([])
  const [peijianList, setPeijianList] = useState<any[]>([])
  const [companyList, setCompanyList] = useState<any[]>([])
  const [carModelList, setCarModelList] = useState<any[]>([])
  const [columnsPeijian, setColumnsPeijian] = useState<any[]>([])

  // const [gongshiRowKeys, setGongshiRowKeys] = useState<any[]>([])
  // const [peijianRowKeys, setPeijianRowKeys] = useState<any[]>([])
  // const [objectRowKeys, setObjectRowKeys] = useState<any[]>([])
  const [orgCodes, setOrgCodes] = useState<any[]>([])
  const [itemsUnitPrice, setItemsUnitPrice] = useState<number>()
  const [itemsNum, setItemsNum] = useState<number>()
  const history = useHistory()
  const [visibleGongshi, setVisibleGongshi] = useState<boolean>(false)
  const [visiblePeijan, setVisiblePeijian] = useState<boolean>(false)
  const [visibleProject, setVisibleProject] = useState<boolean>(false)
  const [selectionType, setSelectionType] = useState<any>('checkbox')

  // const visiblePeijian = useBoolean(false)
  const visibleProjectTemplate = useBoolean(false)
  // const visiblePeijianTemplate = useBoolean(false)
  const visibleCompany = useBoolean(false)
  const productTypeStr: any = useSearchParams('productType') || ''
  const categoryId: any = useSearchParams('categoryId')
  const categoryName: any = useSearchParams('categoryName')
  const isBindWbStr: any = useSearchParams('isBindWb') || '0'
  const [isBindWb, setIsBindWb] = useState<any>()
  const [isbzName, setIsbzName] = useState<boolean>(false) //是不是选择标准名称

  const [bindWbData, setBindWbData] = useState<any>({})
  const id = useSearchParams('id')
  const headItemFlag = useSearchParams('headItemFlag') //headItemFlag总部商品标识： 1总部 2门店
  const carModelId = '00000000'
  const compCode = sessionStorage.getItem('compCode')

  const [form] = Form.useForm()
  const { data: dictBiz } = useRequest(() => api.getDictBiz())
  const { data: dictPartsBrand } = useRequest(() => api.getDictPartsBrand())
  const { data: dictDic } = useRequest(() => api.getDictdic({ typeCode: 'QUALITY', typeName: 'quality' }))
  const { data: unit } = useRequest(() => api.getDictdic({ typeCode: 'UNIT', typeName: 'unit' }))
  const { data: maintWork } = useRequest(() => api.getDictdic({ typeCode: '00000003', typeName: 'maintWork' }))

  // const { data: compTree } = useRequest(() => api.getCompTreeNoParams().then(res => res.data))

  const { delView } = TagViewStore.useContainer()
  form.setFieldsValue({ standard: '1' })

  const { data: treeData = [] } = useRequest(() =>
    api.getShopCategoryList({ page: 1, pageSize: 2000 }).then(res =>
      toTreeDate<any>(
        res.data.items.map(item => ({ pid: item.pid, title: item.cateName, value: item.id })),
        0,
        { id: 'value', pid: 'pid', children: 'children' },
      ),
    ),
  )

  //绑定维保进来
  useEffect(() => {
    if (isBindWbStr == 1) {
      let data = getStore('curwbBindData')
      setBindWbData(data)
      setIsBindWb(isBindWbStr)
      console.log(data)
      //如果是配件
      if (productTypeStr == 3) {
        let spaceOfOrigType: any = false
        data.itemName = data.partStandardName
        data.attrBos1 = {}
        data.attrBos2 = {}

        if (data.isImport) {
          spaceOfOrigType = 'DOMESTIC' //进口
        } else {
          spaceOfOrigType = 'IMPORT' //国产
        }
        api.getDictdic({ typeCode: 'QUALITY', typeName: 'quality' }).then(res => {
          let dataDict = res.data
          for (let i in dataDict) {
            if (dataDict[i].code == data.qualityCode) {
              console.log(dataDict[i])
              data.attrBos1.quality = dataDict[i].id
            }
          }

          api.getDictPartsBrand().then(res => {
            let dataBrand = res.data.list
            for (let i in dataBrand) {
              if (dataBrand[i].code == data.partBrandCode) {
                data.attrBos2.outterBrandCode = dataBrand[i].id
              }
            }
            data.attrBos1.partCode = data.partCode
            data.attrBos1.oemCode = data.oeCode
            // data.attrBos2.outterBrandCode = data.partBrandCode
            data.attrBos1.spaceOfOrigType = spaceOfOrigType
            data.patternName = data.partStandardName
            data.patternCode = data.partStandardNameId

            form.setFieldsValue({ ...data })
          })

          console.log(dataDict)
        })
      }
      //如果是工时过来
      if (productTypeStr == 2) {
        data.attrBos1 = {}
        data.attrBos1.typeOfWork = data.itemKind
        data.patternName = data.itemName
        data.patternCode = data.itemCode
        form.setFieldsValue({ ...data })
      }

      //如果是项目过来
      if (productTypeStr == 4) {
        let gongshiList: any = []
        let peijianList: any = []
        if (data.subItemCreateBos && data.subItemCreateBos.length > 0) {
          for (let i in data.subItemCreateBos) {
            if (data.subItemCreateBos[i].productType == 2) {
              gongshiList.push(data.subItemCreateBos[i])
            }

            if (data.subItemCreateBos[i].productType == 3) {
              peijianList.push(data.subItemCreateBos[i])
            }
          }

          setGongshiList(gongshiList)
          setPeijianList(peijianList)
        }

        data.patternName = data.itemName
        data.patternCode = data.itemCode
        form.setFieldsValue({ ...data })
      }
    }
  }, [isBindWbStr])

  const originType = [
    {
      id: 'IMPORT',
      name: '国产',
    },
    {
      id: 'DOMESTIC',
      name: '进口',
    },
  ]

  const onTotalNum = (e, index) => {
    console.log(e)
    console.log(index)
    let arr: any = []
    if (e == 1) {
      projectTemplateList[index].totalNum = 1
      projectTemplateList[index].unlimitedTimes = true
      projectTemplateList[index].isDisabled = true
    } else if (!e) {
      projectTemplateList[index].totalNum = ''
      projectTemplateList[index].unlimitedTimes = false
      projectTemplateList[index].isDisabled = false
    } else {
      // let a = e.target.value
      projectTemplateList[index].totalNum = e.target.value
    }
    // b.totalNum = e.target.value
    arr = [...projectTemplateList]
    setProjectTemplateList(arr)
  }

  const columnsProjectTemplate: ColumnProps<any>[] = [
    // {
    //   title: '项目ID',
    //   dataIndex: 'id',
    // },
    {
      title: '名称',
      dataIndex: 'itemName',
      align: 'center',
    },
    {
      title: '类型',
      dataIndex: 'productType',
      align: 'center',
      render: (value, row) =>
        row.productType === 1
          ? '普通商品'
          : row.productType === 2
            ? '工时'
            : row.productType === 3
              ? '配件'
              : row.productType === 4
                ? '项目'
                : '套餐',

      // render: (o) => {
      //   // return {
      //     console.log(o, '商品详情接口----')
      //     // o&&o.productType === 1 ? '普通商品' : o.productType === 2 ? '工时' : o.productType === 3 ? '配件' : o.productType === 4 ? '项目' : '套餐'
      //   //  }
      // }
    },
    {
      title: '单位',
      dataIndex: 'unit',
      align: 'center',
    },
    {
      title: '销售数量',
      dataIndex: 'totalNum',
      align: 'center',
      render: (a, b, i) => (
        <Input
          style={{ width: '100px' }}
          // value={b.totalNum}
          value={b.totalNum}
          disabled={b.isDisabled}
          key={i}
          // onChange={e => {
          //   console.log('2222222222')
          //   b.totalNum = e.target.value
          // }}
          onChange={e => onTotalNum(e, i)}
        />
      ),
    },
    {
      title: '不限次数',
      dataIndex: 'unlimitedTimes',
      align: 'center',
      render: (a, row, i) => (
        <Switch
          checked={row.unlimitedTimes}
          onChange={e => {
            if (e) {
              row.totalNum = 1
              // row.unlimitedTimes = true
              onTotalNum(1, i)
            } else {
              console.log(row)
              row.totalNum = ''
              // row.totalNum = ''
              onTotalNum(0, i)
            }
          }}
        />
      ),
    },
    {
      title: '原价',
      dataIndex: 'origPrice',
      align: 'center',
      render: (a, b, i) => (
        <Input
          style={{ width: '100px' }}
          defaultValue={b.origPrice}
          disabled
          onChange={e => {
            b.origPrice = e.target.value
          }}
        />
      ),
    },
    {
      title: '销售价格',
      dataIndex: 'price',
      align: 'center',
      render: (a, b, i) => (
        <Input
          style={{ width: '100px' }}
          defaultValue={b.price}
          onChange={e => {
            b.price = e.target.value
            getPrice(projectTemplateList)
          }}
        />
      ),
    },
    {
      title: '操作',
      key: 'id',
      render: (a, b, i) => (
        <Button
          onClick={() => {
            setProjectTemplateList(prev => {
              const b = prev.slice()
              b.splice(i, 1)
              getPrice(b)
              return b
            })
          }}>
          删除
        </Button>
      ),
    },
  ]
  const columnsGongshi: ColumnProps<any>[] = [
    {
      title: '工时名称编码',
      dataIndex: 'itemCode',

      render: (a, row) => {
        return <div>{row.itemCode ? row.itemCode : '--'}</div>
      },
    },
    {
      title: '工时名称',
      dataIndex: 'itemName',
    },
    {
      title: '别名',
      dataIndex: 'aliasName',
    },
    {
      title: '工种',
      dataIndex: 'itemKindName',
      render: (a, row) => {
        return <div>{row.itemKindName ? row.itemKindName : '--'}</div>
      },
    },
    // {
    //   title: '销售金额',
    //   dataIndex: 'price',

    // },
    {
      title: '操作',
      key: 'id',
      render: (a, b, i) => (
        <Button
          onClick={() => {
            setGongshiList(prev => {
              const b = prev.slice()
              b.splice(i, 1)
              return b
            })
          }}>
          删除
        </Button>
      ),
    },
  ]

  // let columnsPeijian: any = []
  const columnsPeijianSet = type => {
    if (type == 4) {
      let columnsPeijian = [
        {
          title: '配件名称编码',
          dataIndex: 'code',
        },
        {
          title: '配件标准名称',
          dataIndex: 'name',
        },
        // {
        //   title: '必要性',
        //   dataIndex: 'partBrandCode',
        // },
        {
          title: '配件别名',
          dataIndex: 'nameCn',
          align: 'center',
          render: (a, row) => {
            return <div>{row.nameCn ? row.nameCn : '--'}</div>
          },
        },

        {
          title: '操作',
          key: 'id',
          render: (a, b, i) => (
            <Button
              onClick={() => {
                setPeijianList(prev => {
                  const b = prev.slice()
                  b.splice(i, 1)
                  return b
                })
              }}>
              删除
            </Button>
          ),
        },
      ]

      setColumnsPeijian(columnsPeijian)
    } else {
      let columnsPeijian = [
        {
          title: '配件名称编码',
          dataIndex: 'partCode',
        },
        {
          title: '配件标准名称',
          dataIndex: 'partStandardName',
        },
        // {
        //   title: '必要性',
        //   dataIndex: 'partBrandCode',
        // },
        {
          title: '配件品牌',
          dataIndex: 'partBrand',
        },

        {
          title: '参考价',
          dataIndex: 'salePrice',
        },
        {
          title: '操作',
          key: 'id',
          render: (a, b, i) => (
            <Button
              onClick={() => {
                setPeijianList(prev => {
                  const b = prev.slice()
                  b.splice(i, 1)
                  return b
                })
              }}>
              删除
            </Button>
          ),
        },
      ]
      setColumnsPeijian(columnsPeijian)
    }
  }

  const columnsCarModel: ColumnProps<any>[] = [
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
    {
      title: '操作',
      align: 'left',
      render: (value, row, index) => {
        return (
          <Button
            type="link"
            danger
            onClick={() => {
              setCarModelList(pre => {
                const tempArr = [...pre]
                tempArr.splice(index, 1)
                return tempArr
              })
            }}>
            删除
          </Button>
        )
      },
    },
  ]

  const columnsCompany: ColumnProps<any>[] = [
    {
      title: '门店简称',
      dataIndex: 'shopShortName',
    },
    // {
    //   title: '地域',
    //   dataIndex: '',
    // },
    {
      title: '省市区',
      key: 'shopProvince',
      render: a => a.bk1 + a.bk2,
    },
    {
      title: '区域',
      dataIndex: 'areaName',
    },
    {
      title: '分店性质',
      dataIndex: 'shopLevelName',
    },
    {
      title: '分店类型',
      render: (value, row) =>
        row.shopType === 0 ? '总店' : row.shopType === 1 ? '直营' : row.shopType === 2 ? '加盟控股' : '加盟参股',
    },
    {
      title: '操作',
      align: 'center',
      render: (value, row) => {
        return (
          <Button type="link" danger onClick={() => deleteCompany(row)}>
            删除
          </Button>
        )
      },
    },
  ]
  useEffect(() => {
    if (!id) {
      setLoading(true)
      if (categoryId) {
        try {
          // setCategory(JSON.parse(categoryStr))
        } catch {
          history.replace('/shop/add')
          closePageDetail()
        }
      } else {
        history.replace('/shop/add')
        closePageDetail()
      }
    }
  }, [categoryId, id])

  useEffect(() => {
    if (!id) {
      //新增
      if (!productTypeStr) {
        history.replace('/shop/add')
        closePageDetail()
      } else {
        setProductType(parseInt(productTypeStr))
      }
    }
  }, [productTypeStr, id])

  useEffect(() => {
    let priceCom: any = []
    const gongshiListN = gongshiList.map(o => o.price)
    const peijianListN = peijianList.map(o => o.salePrice)
    priceCom = [...gongshiListN, ...peijianListN]
    form.setFieldsValue({ price: priceCom && priceCom.length > 0 ? (sum(priceCom) ? sum(priceCom).toFixed(2) : 0) : 0 })
  }, [gongshiList, peijianList])

  useEffect(() => {
    if (id) {
      setLoading(true)
      api
        .getGoodsDetail({ id: id })
        .then(res => {
          const data: any = res.data
          form.setFieldsValue({ ...data })
          console.log(data, '商品详情接口----')
          data.cateId = Number(data.cateId)
          form.setFieldsValue({ cateId: data.cateId })
          form.setFieldsValue({ priceType: data.priceType })

          if (data.outterCode) {
            setIsBindWb(1)
            setBindWbData(data)
          }

          setProductType(data.productType)
          columnsPeijianSet(data.productType) //改变当前配件columns
          setCompanyList(data.orgCodes)
          const compCode = data.orgCodes.map(o => {
            return o.shopCode
          })
          setOrgCodes(compCode)
          data.orgCodes = compCode

          var attrBos1: any = {}
          var attrBos2: any = {}
          if (data.attrBos?.length) {
            data.attrBos.map(item => {
              if (item.attrValue) {
                attrBos1[item.attrNameCode] = item.attrValue
              }
              if (item.outterAttrCode) {
                attrBos2[item.attrNameCode] = item.outterAttrCode
              }
            })
            data.attrBos.forEach(item => {
              if (item.attrValue) {
                data.attrBos[item.attrNameCode] = item.attrValue
              }
              if (item.outterAttrCode) {
                data.attrBos[item.attrNameCode] = item.outterAttrCode
              }
            })
          }

          // if (data.limitNum === -1) {
          //   data.limitNum = ''
          //   data.islimitNum = true
          // }
          if (data.limitNum && data.limitNum > 0) {
            data.islimitNum = false
            setIslimitNum(false)
          } else {
            data.limitNum = ''
            data.islimitNum = true
            setIslimitNum(true)
          }

          for (let [key] of Object.entries(attrBos1)) {
            if (key === 'effectiveTimeStart') {
              attrBos1[key] = attrBos1[key] ? Moment(attrBos1[key], 'YYYY-MM-DD') : ''
            }
            if (key === 'effectiveTimeEnd') {
              attrBos1[key] = attrBos1[key] ? Moment(attrBos1[key], 'YYYY-MM-DD') : ''
            }
            if (attrBos1['effectiveTimeStart'] || attrBos1['effectiveTimeEnd']) {
              attrBos1['longTermEffective'] = false
              setLongTermEffective(false)
            } else {
              attrBos1['longTermEffective'] = true
              setLongTermEffective(true)
            }
          }

          // data.channels = '3'
          data.channels = data.channels.map(o => o.toString())
          const GongshiList: any = data.subItemCreateBos.filter(f => f.productType === 2)
          const GongshiListN =
            GongshiList && GongshiList.length > 0
              ? GongshiList.map(o => ({ ...o, itemCode: o.outterCode, ...o.labor }))
              : []
          setGongshiList(GongshiListN)
          const peijianListN = data.subItemCreateBos.filter(f => f.productType === 3)
          const peijianListM =
            peijianListN && peijianListN.length > 0
              ? peijianListN.map(o => {
                if (data.productType == 4) {
                  return {
                    ...o,
                    code: o.outterCode,
                    name: o.itemName,
                    nameCn: o.nameCn || '',
                  }
                } else {
                  return {
                    ...o,
                    partStandardName: o.itemName,
                    partBrand: o.part && o.part.partBrandName ? o.part.partBrandName : '',
                    salePrice: o.price,
                    code: o.part && o.part.partCode ? o.part.partCode : o.outterCode,
                    partCode: o.part && o.part.partCode ? o.part.partCode : '',
                  }
                }
              })
              : []
          setItemsUnitPrice(data.unitPrice)
          setItemsNum(data.num)
          setPeijianList(peijianListM)
          // const projectTemplateListN = data.subItemCreateBos.filter(f => f.productType === 4)
          // setProjectTemplateList(projectTemplateListN)
          if (data.productType === 5) {
            setProjectTemplateList(data.subItemCreateBos)
          }
          // api.getShopCategoryDetail({ categoryId: data.cateId }).then(res => {
          //   setCategory(res.data)
          // })
          console.log(attrBos1, '----attrBos1')
          form.setFieldsValue({ ...data, ...{ attrBos1: attrBos1 }, ...{ attrBos2: attrBos2 } }) //...paramReturn
          form.setFieldsValue({ price: data.price })
          setLoading(false)
        })
        .catch(err => {
          console.log(err, '0000')
          message.error('获取商品信息失败')
        })
    } else {
      setLoading(false)
      setLongTermEffective(true)
      columnsPeijianSet(productTypeStr)
      form.setFieldsValue({ islimitNum: true, attrBos1: { longTermEffective: true }, channels: ['1'] })
    }
  }, [id])

  const onSave = status => {
    form
      .validateFields()
      .then(async values => {
        console.log('values:', values)
        const attrBos: { attrNameCode: string; attrValue?: string; outterAttrCode?: string }[] = []
        if (productType === 2 && !values.unitPrice) {
          //工时单价特殊处理
          message.error('工时单价不能为空')
          return false
        }
        if (productType === 2 && !values.num) {
          //工时单价特殊处理
          message.error('工时数不能为空')
          return false
        }

        if (!values?.attrBos1?.spaceOfOrigType) {
          delete values?.attrBos1?.spaceOfOrigType
        }
        for (const key in values.attrBos1) {
          if (Object.prototype.hasOwnProperty.call(values.attrBos1, key)) {
            //时间做特殊处理
            if (
              (values.attrBos1[key] && key === 'effectiveTimeStart') ||
              (values.attrBos1[key] && key === 'effectiveTimeEnd')
            ) {
              attrBos.push({ attrNameCode: key, attrValue: selectTimeRange(values.attrBos1[key]) })
            } else if (values.attrBos1[key]) {
              attrBos.push({ attrNameCode: key, attrValue: values.attrBos1[key] })
            }
            // attrBos.push({ attrNameCode: key, attrValue: values.attrBos1[key] })
          }
        }
        if (values.attrBos2) {
          for (const key in values.attrBos2) {
            if (Object.prototype.hasOwnProperty.call(values.attrBos2, key)) {
              if (values.attrBos2[key]) {
                attrBos.push({ attrNameCode: key, outterAttrCode: values.attrBos2[key] })
              }
            }
          }
        }
        console.log(values.attrBos1, values.attrBos2)
        delete values.attrBos1
        delete values.attrBos2
        values.attrBos = attrBos
        console.log('day ssns')

        values.status = status
        values.headItemFlag = headItemFlag //headItemFlag总部商品标识： 1总部 2门店
        values.saleCarModelData = carModelList //适用车型
        values.productType = productType
        values.patternCode = form.getFieldValue('patternCode')
        values.cateId = categoryId ? categoryId : values.cateId
        if (values.islimitNum) {
          values.limitNum = -1
        }
        let gongshiListNew: any = []
        let peijianListNew: any = []

        gongshiList && gongshiList.length > 0
          ? gongshiList.map(o => {
            gongshiListNew.push({
              id: o.goodId ? o.goodId : o.id ? o.id : '',
              outterCode: o.itemCode ? o.itemCode : o.outterCode ? o.outterCode : '',
              productType: 2,
              unit: o.unit ? o.unit : '次',
              totalNum: 1,
              itemName: o.itemName,
              price: o.price,
              origPrice: o.price,
            })
          })
          : ''
        console.log(peijianList)
        peijianList && peijianList.length > 0
          ? peijianList.map(o => {
            if (productType == 4) {
              // let peiJianId = ''
              let params = {}
              if (id) {
                //如果编辑
                if (o.cateId || o.cateId == '0') {
                  params = {
                    id: o.id ? o.id : '',
                    productType: 3,
                    unit: o.unit ? o.unit : '次',
                    totalNum: 1,
                    price: 0,
                    itemName: o.name,
                  }
                } else {
                  params = {
                    outterCode: o.id ? o.id : '',
                    productType: 3,
                    unit: o.unit ? o.unit : '次',
                    totalNum: 1,
                    price: 0,
                    itemName: o.name,
                  }
                }
              } else {
                params = {
                  // id: o.id ? o.id : '',
                  outterCode: o.id ? o.id : o.code, //code是维保关联，后端接口code,id,有点混淆，非常容易混乱
                  productType: 3,
                  unit: o.unit ? o.unit : '次',
                  totalNum: 1,
                  price: 0,
                  itemName: o.name,
                }
              }
              peijianListNew.push(params)
              // peijianListNew[0].price = form.getFieldValue("showPrice") //这个price只是为了让子商品总价=之和
            } else {
              peijianListNew.push({
                id: o.goodId ? o.goodId : o.id ? o.id : '',
                outterCode: o.id ? o.id : o.outterCode ? o.outterCode : '',
                productType: 3,
                unit: o.unit ? o.unit : '次',
                totalNum: 1,
                itemName: o.name,
                price: o.salePrice,
                origPrice: o.salePrice,
              })
            }
          })
          : ''
        console.log(values.subItemCreateBos)
        console.log(projectTemplateList)
        console.log(gongshiListNew)
        console.log(peijianListNew)
        values.subItemCreateBos =
          productType === 5 ? [...projectTemplateList] : [...projectTemplateList, ...gongshiListNew, ...peijianListNew]
        console.log(values.subItemCreateBos)
        values.subItemCreateBos = values.subItemCreateBos.filter(f => f.outterCode || f.id)
        console.log(values.subItemCreateBos)
        if (values.subItemCreateBos.length > 0) {
          if (productType !== 5) {
            values.subItemCreateBos[0].price = form.getFieldValue('showPrice')
          }
        }

        // if (productType === 4 && values.subItemCreateBos.length === 0) {
        //   message.error('工时跟配件不能同时为空')
        //   return false
        // }

        if (id) {
          values.id = id ? Number(id) : ''
        } else {
          //新增
          if (isBindWb) {
            //如果是关联维保的，则带上Id
            let data = getStore('curwbBindData')
            if (productType === 4) {
              values.outterCode = data.id //项目
            }
            if (productType === 3) {
              values.outterCode = data.code //配件
            }
            if (productType === 2) {
              values.outterCode = data.itemCodeBase //工时
            }
          }
        }

        if (productType === 3 && !values.totalNum) {
          message.warning('库存信息不能为空')
          return
        }
        if (productType === 3 && !values.origPrice) {
          message.warning('原价不能为空')
          return
        }

        if (compCode == 'COM00000000000001' && headItemFlag == '1' && !id && values.orgCodes.length === 0) {
          //总部才判断
          message.warning('适用门店不能为空')
          return
        }
        console.log(JSON.stringify(values))
        console.log(values)
        if (values.price == '' && values.price !== 0) {
          message.error('销售金额不能为空')
          return false
        }
        //发布范围默认是智慧门店
        // values.channels = values.channels

        // : row.productType === 2
        // ? '工时'
        // : row.productType === 3
        // ? '配件'
        // : row.productType === 4

        if (productType === 4) {
          values.price = values.showPrice
        }

        const hide = message.loading('保存中')
        // return
        console.log('1111values:', values)
        api
          .createGoods(values)
          .then(res => {
            const data: any = res
            if (data.code === 1) {
              // // history.push('/shop/list')
              // history.push('/shop/category')
              // // history.goBack()
              // console.log(12, res)
              closePageDetail()
            }
          })
          .catch(err => {
            message.error('保存失败')
          })
          .finally(() => {
            hide()
          })
        return
      })
      .catch(err => {
        console.log(err, '---err')
        message.warning('请完善相关信息')
      })
  }
  const closePageDetail = () => {
    delView({ pathname: '/shop/edit', state: { title: '商品详情' } })
    if (id) {
      history.push('/shop/list')
    } else {
      history.push('/shop/add?headItemFlag=' + headItemFlag)
    }
  }
  const renderTreeNodes = data =>
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode
            title={item.shopNo ? <span>{'NO.' + item.shopNo + item.shortName}</span> : <span>{item.shortName}</span>}
            key={item.shopNo + item.key}
            value={item.compCode}>
            {renderTreeNodes(item.children)}
          </TreeNode>
        )
      }
      return (
        <TreeNode
          value={item.compCode}
          key={item.shopNo + item.key}
          title={item.shopNo ? <span>{'NO.' + item.shopNo + item.shortName}</span> : <span>{item.shortName}</span>}
        />
      )
    })
  const setApplicableStores = val => {
    const keys = [...val.selectedRowKeys, ...orgCodes]
    let rows = [...val.selectedRows, ...companyList]
    const keysN = [...new Set(keys)]
    const rowsNew = rows.reduce(
      (all, next) => (all.some((item: any) => item['shopCode'] == next['shopCode']) ? all : [...all, next]),
      [],
    )
    setOrgCodes(keysN)
    setCompanyList(rowsNew)
    form.setFieldsValue({ orgCodes: keysN })
  }
  const deleteCompany = row => {
    const orgCodesfilter = orgCodes.filter(f => f !== row.shopCode)
    const companyListfilter = companyList.filter(f => f.shopCode !== row.shopCode)
    setOrgCodes(orgCodesfilter)
    setCompanyList(companyListfilter)
    form.setFieldsValue({ orgCodes: orgCodesfilter })
  }

  const mealgoodShowCancel = e => {
    setmealgoodShow(false)
    setVisibleGongshi(false)
    setVisiblePeijian(false)
    setVisibleProject(false)
  }
  const getMealgoodData = (selectedRowKeys, selectedRows) => {
    setmealgoodShow(false)
    setVisibleProject(false)
    //选择标准名称--项目
    if (isbzName) {
      console.log(selectedRows)
      setSelectionType('checkbox')
      let data: any = {}
      data.patternName = selectedRows[0].itemName
      data.patternCode = selectedRows[0].outterCode
      form.setFieldsValue({ ...data })
      return
    }
    if (productType == 5) {
      //套餐时，销售价赋值给原价
      let newData = [...projectTemplateList, ...selectedRows]
      for (let i in newData) {
        newData[i].origPrice = newData[i].price
      }
      console.log(newData)
      setProjectTemplateList(newData)
    } else {
      setProjectTemplateList([...projectTemplateList, ...selectedRows])
    }
    // setProjectTemplateList([...projectTemplateList, ...selectedRows])
    getPrice([...projectTemplateList, ...selectedRows])
  }
  const getPrice = selectedRows => {
    if (selectedRows && selectedRows.length > 0) {
      let priceNEW: number = 0
      selectedRows.map(o => (priceNEW += o.price ? Number(o.price) : 0))
      form.setFieldsValue({ price: priceNEW.toFixed(2) })
    }
  }
  const onChangeTimeRadio = e => {
    console.log(e, e.target.value)
    setLongTermEffective(e.target.value)
    form.setFieldsValue({ attrBos1: { longTermEffective: e.target.value } })
    if (e.target.value) {
      form.setFieldsValue({ attrBos1: { effectiveTimeStart: '', effectiveTimeEnd: '' } })
    }
  }
  const onChangeNumRadio = e => {
    form.setFieldsValue({ islimitNum: e.target.value })
    setIslimitNum(e.target.value)
    if (e.target.value) {
      form.setFieldsValue({ limitNum: '' })
    }
  }
  const disabledDate = current => {
    // Can not select days before today and today
    return current && current < Moment().endOf('day')
  }

  const disabledDateTime = () => {
    return {
      disabledHours: () => range(0, 24).splice(4, 20),
      disabledMinutes: () => range(30, 60),
      disabledSeconds: () => [55, 56],
    }
  }
  const range = (start, end) => {
    const result: any = []
    for (let i = start; i < end; i++) {
      result.push(i)
    }
    return result
  }
  const selectTimeRange = e => {
    // const dateFormat = 'YYYY-MM-DD HH:mm:ss'
    const dateFormat = 'YYYY-MM-DD'
    return Moment(e).format(dateFormat)
  }

  const addGongshi = () => {
    // const gongshiRowKeys: any = gongshiList.map(o => o.outterCode ? o.outterCode : o.itemCode ? o.itemCode : '')
    // setGongshiRowKeys(gongshiRowKeys)
    setProductType(productType)
    setVisibleGongshi(true)
  }
  const setPeijianListBack = val => {
    console.log(val)
    console.log(peijianList)
    if (isbzName) {
      let data: any = {}
      data.patternName = val[0].name
      data.patternCode = val[0].id
      form.setFieldsValue({ ...data })
      if (productType != 4) {
        return
      }
    }
    let arr = uniqueArr(val, peijianList, 'code')
    console.log(arr)
    setPeijianList(arr)

    // setPeijianList([...peijianList, ...val])
  }
  const addObject = () => {
    // const objectRowKeys = projectTemplateList.map(o => o.outterCode ? o.outterCode : o.itemCode ? o.itemCode : '')
    // setObjectRowKeys(objectRowKeys)
    setmealgoodShow(true)
  }
  const addCompany = () => {
    visibleCompany.setTrue()
    const orgCodes: any = companyList.map(o => (o.compCode ? o.compCode : o.shopCode))
    setOrgCodes(orgCodes)
  }
  const itemsUnitPriceChange = e => {
    let price: number = 0
    e.currentTarget.id === 'unitPrice' ? setItemsUnitPrice(e.target.value) : setItemsNum(e.target.value)
    if (e.currentTarget.id === 'unitPrice' && itemsNum) {
      price = Number(e.target.value) * Number(itemsNum)
      setItemsUnitPrice(e.target.value)
      form.setFieldsValue({ unitPrice: e.target.value })
    } else if (e.currentTarget.id === 'num' && itemsUnitPrice) {
      price = Number(e.target.value) * Number(itemsUnitPrice)
      setItemsNum(e.target.value)
      form.setFieldsValue({ num: e.target.value })
    }
    form.setFieldsValue({ attrBos1: { origPrice: price } })
  }
  const getGongshiList = val => {
    console.log(val)
    //选择标准名称
    if (isbzName) {
      let data: any = {}
      data.patternName = val[0].itemName
      data.patternCode = val[0].itemCode //还有一个id，传哪个
      form.setFieldsValue({ ...data })
      if (productType != 4) {
        return
      }
    }
    let arr = uniqueArr(val, gongshiList, 'itemCode')
    console.log(arr)
    setGongshiList(arr)

    // setGongshiList([...gongshiList, ...val])
  }

  // 日期框滚动下拉固定
  const datePicketScollFixed = trigger => {
    return trigger.parentNode || document.body
    // return trigger.parentElement == null ? trigger : trigger.parentElement;
    // return trigger.parentElement == null ? trigger : trigger.parentElement;
  }

  const setSalePrice = e => {
    form.setFieldsValue({ showPrice: e })
  }

  const selectBzName = e => {
    setSelectionType('radio')
    setIsbzName(true)
    if (productType == 2) {
      setVisibleGongshi(true)
    } else if (productType == 3) {
      setVisiblePeijian(true)
    } else if (productType == 4) {
      setVisibleProject(true)
    }
  }

  // const datePickerStartChange = (e) => {
  //   console.log(e, '-0000')
  //   form.setFieldsValue({ attrBos1: { effectiveTimeStart: e } })
  // }
  // const datePickerEndChange = (e) => {
  //   form.setFieldsValue({ attrBos1: { effectiveTimeEnd: e } })
  // }

  const onSelectCarModel = () => {
    showSelectCarModel.setTrue()
  }

  const SelectCarModelOk = arr => {
    showSelectCarModel.setFalse()
    setCarModelList(arr)
  }

  return (
    <div className="addProduct">
      <Spin spinning={loading}>
        {/* {productType} */}
        <div style={{ marginBottom: 20 }}>
          <Steps current={1} size="small" labelPlacement="vertical">
            {stepList.map(item => (
              <Steps.Step key={item.id} title={item.name} />
            ))}
          </Steps>
        </div>

        <Form form={form} labelCol={{ span: 3 }} wrapperCol={{ span: 16 }} initialValues={{ priceType: 1, channels: '1' }}>
          <div
            className="area-title"
            onClick={() => {
              if (!id) {
                history.goBack()
              }
            }}>
            <div style={{ margin: '5px 50px 0 0' }}>
              商品类型：{productTypeList.find(item => item.id === parseInt(productType ?? ''))?.name}
              {isBindWb == 1 && (
                <span>
                  &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 关联标准数据：
                  {bindWbData.partStandardName ? bindWbData.partStandardName : bindWbData.itemName}
                </span>
              )}
            </div>
            {!id ? (
              <div style={{ marginTop: '5px' }}>
                {categoryName} <RightOutlined />
                {/* 商品类目：{category ? category.cateName : categoryName}
                {category && category.cateName || categoryName ? <RightOutlined /> : ''} */}
              </div>
            ) : (
                <Form.Item name="cateId" style={{ minWidth: '500px' }} label="商品类目">
                  <TreeSelect
                    allowClear
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                    treeData={treeData}
                    placeholder="选择商品类目"
                    getPopupContainer={datePicketScollFixed}
                  />
                </Form.Item>
              )}
          </div>
          <div className="area">
            <div className="area-header">基础信息</div>
            <div className="area-main">
              <Form.Item label="销售名称" name="itemName" rules={[{ required: true }]}>
                {/* //{['itemName', 'name']} */}
                <Input allowClear style={{ maxWidth: '500px' }} />
              </Form.Item>
              {[2, 3, 4, 5].includes(productType) && (
                <Form.Item required>
                  <Form.Item
                    label="商品业务分类"
                    name="bizType"
                    labelCol={{ span: 11 }}
                    rules={[{ required: true }]}
                    style={{ display: 'inline-flex', marginBottom: 0, width: 'calc(47%)' }}>
                    <Select allowClear style={{ maxWidth: '225px' }}>
                      {dictBiz?.data.map(item => (
                        <Select.Option key={item.id} value={item.id}>
                          {item.pkgTypeName}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>

                  {[2, 3, 4].includes(productType) && (
                    <React.Fragment>
                      <Form.Item
                        label="标准名称"
                        labelCol={{ span: 8 }}
                        style={{ display: 'inline-flex', marginBottom: 0, width: 'calc(33%)' }}
                        name={['patternName']}>
                        <Input allowClear style={{ maxWidth: '225px' }} placeholder="选择标准名称" disabled />
                      </Form.Item>
                      <Button type="primary" onClick={e => selectBzName(e)}>
                        选择标准名称
                      </Button>
                    </React.Fragment>
                  )}
                </Form.Item>
              )}
              {[3].includes(productType) && (
                <Form.Item required>
                  <Form.Item
                    label="配件编码"
                    labelCol={{ span: 11 }}
                    name={['attrBos1', 'partCode']}
                    style={{ display: 'inline-flex', marginBottom: 0, width: 'calc(47%)' }}
                    rules={[{ required: true }]}>
                    <Input allowClear style={{ maxWidth: '225px' }} disabled={isBindWb == 1} />
                  </Form.Item>
                  <Form.Item
                    label="OE"
                    labelCol={{ span: 8 }}
                    style={{ display: 'inline-flex', marginBottom: 0, width: 'calc(33%)' }}
                    name={['attrBos1', 'oemCode']}>
                    <Input allowClear style={{ maxWidth: '225px' }} disabled={isBindWb == 1} />
                  </Form.Item>
                </Form.Item>
              )}
              {[3].includes(productType) && (
                <Form.Item label="品牌">
                  <Form.Item
                    name={['attrBos2', 'outterBrandCode']}
                    style={{ display: 'inline-flex', marginBottom: 0, width: 'calc(25.6%)' }}>
                    <Select allowClear disabled={isBindWb == 1}>
                      {dictPartsBrand && dictPartsBrand.data
                        ? dictPartsBrand.data.list.map(item => (
                          <Select.Option key={item.code} value={item.id}>
                            {item.name}
                          </Select.Option>
                        ))
                        : ''}
                    </Select>
                  </Form.Item>
                  <Form.Item
                    label="品质"
                    labelCol={{ span: 8 }}
                    name={['attrBos1', 'quality']}
                    style={{ display: 'inline-flex', marginBottom: 0, width: 'calc(33%)' }}>
                    <Select allowClear disabled={isBindWb == 1}>
                      {dictDic?.data.map(item => (
                        <Select.Option key={item.code} value={item.id}>
                          {item.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Form.Item
                    label="产地类型"
                    labelCol={{ span: 7 }}
                    style={{ display: 'inline-flex', marginBottom: 0, width: 'calc(35%)', marginLeft: '25px' }}
                    name={['attrBos1', 'spaceOfOrigType']}>
                    <Select allowClear disabled={isBindWb == 1}>
                      {originType.map(item => (
                        <Select.Option key={item.id} value={item.id}>
                          {item.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Form.Item>
              )}
              {[3].includes(productType) && (
                <Form.Item label="供应商" name={['attrBos1', 'supplier']}>
                  <Input allowClear style={{ maxWidth: '500px' }} />
                </Form.Item>
              )}
              {/* {[3, 4, 5].includes(productType) && (
              <Form.Item label="适用车型品牌">
                <Button disabled>全部车型</Button>
              </Form.Item>
            )} */}
              <Form.Item label="适用车型品牌">
                <Button onClick={onSelectCarModel}>选择适用车型</Button>
                {!!carModelList.length && (
                  <Table
                    size="small"
                    columns={columnsCarModel}
                    rowKey="key"
                    dataSource={carModelList}
                    pagination={false}
                    scroll={{ y: 300 }}
                  />
                )}
              </Form.Item>
            </div>
          </div>
          <div className="area">
            <div className="area-header">销售信息</div>
            <div className="area-main">
              {[4].includes(productType) && (
                <>
                  <Form.Item label="工时" name="car" wrapperCol={{ span: 24 }}>
                    <Button type="primary" onClick={() => addGongshi()}>
                      添加工时
                    </Button>
                    {!!gongshiList.length && (
                      <Table columns={columnsGongshi} rowKey="id" dataSource={gongshiList} pagination={false} />
                    )}
                  </Form.Item>
                  <Form.Item label="配件" name="car" wrapperCol={{ span: 24 }}>
                    <Button type="primary" onClick={() => setVisiblePeijian(true)}>
                      添加配件
                    </Button>
                    {!!peijianList.length && (
                      <Table columns={columnsPeijian} rowKey="id" dataSource={peijianList} pagination={false} />
                    )}
                  </Form.Item>
                </>
              )}
              {/* {[2].includes(productType) && (
              <Form.Item label="适用车型">
                <Button disabled>全部车型</Button>
              </Form.Item>
            )} */}
              {[5].includes(productType) && (
                <Form.Item label="选择套餐内容" name="car" required wrapperCol={{ span: 24 }}>
                  <div>
                    <Button onClick={() => addObject()} type="primary">
                      选择套餐内容
                    </Button>
                    {/* <Button onClick={() => visibleProjectTemplate.setTrue()} type="primary">
                    选择套餐内容
                  </Button> */}
                    {!!projectTemplateList.length && (
                      <Table
                        columns={columnsProjectTemplate}
                        rowKey="id"
                        dataSource={projectTemplateList}
                        pagination={false}
                      />
                    )}
                  </div>
                </Form.Item>
              )}
              {[3].includes(productType) && (
                <Form.Item label="销售规格" name="standard" style={{ marginBottom: 0 }}>
                  <Radio.Group>
                    <Radio value="1">无规格</Radio>
                    <Radio value="2" disabled>
                      多规格
                    </Radio>
                  </Radio.Group>
                </Form.Item>
              )}
              {[3].includes(productType) && (
                <Form.Item wrapperCol={{ offset: 3 }}>
                  <div className="ant-table ant-tableMg">
                    <table>
                      <thead className="ant-table-thead ant-table-theadbg">
                        <tr>
                          <th className="ant-table-cell">规格名称</th>
                          <th className="ant-table-cell">
                            <span style={{ color: ' #ff4d4f' }}>*</span> 库存
                          </th>
                          <th className="ant-table-cell">成本价</th>
                          <th className="ant-table-cell">
                            <span style={{ color: ' #ff4d4f' }}>*</span>原价
                          </th>
                          <th className="ant-table-cell">
                            <span style={{ color: ' #ff4d4f' }}>*</span>售价
                          </th>
                        </tr>
                      </thead>
                      <tbody style={{ marginTop: '20px' }}>
                        <tr className="ant-table-tbody">
                          <td className="ant-table-cell" style={{ paddingLeft: '13px' }}>
                            规格名称
                          </td>
                          <td className="ant-table-cell">
                            <Form.Item name="totalNum" style={{ marginBottom: 0 }}>
                              <InputNumber size="small" min={0} />
                            </Form.Item>
                          </td>
                          <td className="ant-table-cell">
                            <Form.Item name="costPrice" style={{ marginBottom: 0 }}>
                              <InputNumber size="small" />
                            </Form.Item>
                          </td>
                          <td className="ant-table-cell">
                            <Form.Item name="origPrice" style={{ marginBottom: 0 }}>
                              <InputNumber size="small" />
                            </Form.Item>
                          </td>
                          <td className="ant-table-cell">
                            <Form.Item name="price" style={{ marginBottom: 0 }}>
                              <InputNumber size="small" min={0} onChange={e => setSalePrice(e)} />
                            </Form.Item>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </Form.Item>
              )}
              {[2].includes(productType) && (
                <Form.Item wrapperCol={{ offset: 3 }}>
                  <div className="ant-table">
                    <table>
                      <thead className="ant-table-thead">
                        <tr>
                          <th className="ant-table-cell">车型</th>
                          <th className="ant-table-cell">工种</th>
                          <th className="ant-table-cell">
                            <span style={{ color: ' #ff4d4f' }}>*</span>单价
                          </th>
                          <th className="ant-table-cell">
                            <span style={{ color: ' #ff4d4f' }}>*</span>工时数
                          </th>
                          <th className="ant-table-cell">标准金额</th>
                          <th className="ant-table-cell">
                            <span style={{ color: ' #ff4d4f' }}>*</span>销售金额
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="ant-table-tbody">
                          <td className="ant-table-cell">全部车型</td>
                          <td className="ant-table-cell">
                            <Form.Item name={['attrBos1', 'typeOfWork']}>
                              <Select
                                placeholder="选择工种"
                                style={{ width: '100px', margin: '25px 0 0 -15px' }}
                                allowClear
                                size="small">
                                {maintWork?.data.map(item => (
                                  <Select.Option value={item.code} key={item.code}>
                                    {item.name}
                                  </Select.Option>
                                ))}
                              </Select>
                            </Form.Item>
                          </td>
                          <td className="ant-table-cell">
                            {/* 单价 */}
                            <Form.Item name="unitPrice" style={{ marginBottom: 0 }}>
                              <Input style={{ width: '80px' }} size="small" onChange={itemsUnitPriceChange} />
                            </Form.Item>
                          </td>
                          <td className="ant-table-cell">
                            {/* 工时数 */}
                            <Form.Item name="num" style={{ marginBottom: 0 }}>
                              <Input style={{ width: '80px' }} size="small" onChange={itemsUnitPriceChange} />
                            </Form.Item>
                          </td>
                          <td className="ant-table-cell">
                            {/* 标准金额 */}
                            <Form.Item name={['attrBos1', 'origPrice']} style={{ marginBottom: 0 }}>
                              <Input style={{ width: '80px' }} size="small" disabled />
                            </Form.Item>
                          </td>
                          <td className="ant-table-cell">
                            {/* 销售金额 */}
                            <Form.Item name="price" style={{ marginBottom: 0 }}>
                              <InputNumber
                                style={{ width: '80px' }}
                                size="small"
                                min={0}
                                onChange={e => setSalePrice(e)}
                              />
                            </Form.Item>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </Form.Item>
              )}
              {[5].includes(productType) && (
                <Form.Item required>
                  <Form.Item
                    label="销售价格"
                    labelCol={{ span: 11 }}
                    name="price"
                    rules={[{ required: true }]}
                    style={{ display: 'inline-flex', marginBottom: 0, width: 'calc(47%)' }}>
                    <Input disabled style={{ maxWidth: '225px' }} />
                  </Form.Item>
                </Form.Item>
              )}
              {[4].includes(productType) && (
                <Form.Item required wrapperCol={{ offset: 2 }}>
                  <Form.Item label="价格类型" name="priceType" rules={[{ required: true }]} style={{ display: 'inline-flex', marginBottom: 0, width: 'calc(47%)' }}>
                    <Radio.Group>
                      <Radio value={1} >
                        标准价模式
                      </Radio>
                      <Radio value={2}>一口价模式</Radio>

                    </Radio.Group>
                  </Form.Item>
                </Form.Item>
              )}

              {[4].includes(productType) && (
                <Form.Item required>
                  <Form.Item
                    label="一口价/标准价"
                    labelCol={{ span: 11 }}
                    name="showPrice"
                    rules={[{ required: true }]}
                    style={{ display: 'inline-flex', marginBottom: 0, width: 'calc(47%)' }}>
                    <Input style={{ maxWidth: '225px' }} />
                  </Form.Item>
                </Form.Item>
              )}
              {[2, 3].includes(productType) && (
                <Form.Item required>
                  <Form.Item
                    label="默认显示价格"
                    name="showPrice"
                    labelCol={{ span: 11 }}
                    rules={[{ required: true }]}
                    style={{ display: 'inline-flex', marginBottom: 0, width: 'calc(47%)' }}>
                    <InputNumber style={{ width: '100%' }} disabled={[2, 3, 5].includes(productType)} />
                  </Form.Item>
                  <Form.Item
                    label="单位"
                    name="unit"
                    labelCol={{ span: 13 }}
                    rules={[{ required: true }]}
                    style={{ display: 'inline-flex', marginBottom: 0, width: 'calc(36%)' }}>
                    {/* unit */}
                    <Select allowClear style={{ maxWidth: '225px' }}>
                      {unit?.data.map(item => (
                        <Select.Option key={item.name} value={item.name}>
                          {item.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Form.Item>
              )}

              {[4].includes(productType) && (
                <Form.Item required>
                  <Form.Item
                    label="单&nbsp;位"
                    name="unit"
                    labelCol={{ span: 13 }}
                    rules={[{ required: true }]}
                    style={{ display: 'inline-flex', marginBottom: 0, width: 'calc(40%)' }}>
                    {/* unit */}
                    <Select allowClear style={{ maxWidth: '225px' }}>
                      {unit?.data.map(item => (
                        <Select.Option key={item.name} value={item.name}>
                          {item.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Form.Item>
              )}

              {[2, 3, 4, 5].includes(productType) && (
                <Form.Item required>
                  <Form.Item
                    label="总数量"
                    name="totalNum"
                    labelCol={{ span: 11 }}
                    rules={[{ required: true }]}
                    style={{ display: 'inline-flex', marginBottom: 0, width: 'calc(47%)' }}>
                    <InputNumber style={{ width: '100%' }} />
                  </Form.Item>
                  <Form.Item
                    labelCol={{ span: 13 }}
                    label="虚拟销量"
                    style={{ display: 'inline-flex', marginBottom: 0, width: 'calc(36%)' }}
                    name="virtualSalesNum">
                    <InputNumber style={{ width: '100%' }} />
                  </Form.Item>
                </Form.Item>
              )}
              {[2, 3, 4, 5].includes(productType) && (
                <div className="islimitNum">
                  <Form.Item name="islimitNum" labelCol={{ span: 3 }} label="限购数量">
                    <Radio.Group onChange={onChangeNumRadio}>
                      <div className="limitNumflex">
                        <div className="limitNum">
                          <Radio value={false}>
                            {/* 限购数量
                    <Input allowClear style={{ width: '100px', marginLeft: '8px' }}  /> */}
                            {
                              <Form.Item label="" name="limitNum" style={{ display: 'inline-flex' }}>
                                <Input allowClear disabled={islimitNum} style={{ maxWidth: '125px' }} />
                              </Form.Item>
                            }
                          </Radio>
                        </div>
                        <Radio value={true}>
                          不限购
                          {/* <Form.Item
                      label="不限数量"
                      name="islimitNum"
                      style={{ display: 'inline-flex', marginBottom: 0, width: '120px' }}>
                    </Form.Item> */}
                        </Radio>
                      </div>
                    </Radio.Group>
                  </Form.Item>
                </div>
              )}

              {[2, 4, 5].includes(productType) && (
                <Form.Item
                  style={{ marginBottom: 0 }}
                  wrapperCol={{ span: 2 }}
                  name={['attrBos1', 'longTermEffective']}
                  label="使用有效期限">
                  <Radio.Group onChange={onChangeTimeRadio} style={{ display: 'flex' }}>
                    <div style={{ display: 'flex' }}>
                      <Radio value={false}>
                        <Form.Item
                          name={['attrBos1', 'effectiveTimeStart']}
                          labelCol={{ span: 7 }}
                          style={{ display: 'inline-block' }}>
                          <DatePicker
                            format="YYYY-MM-DD"
                            disabledDate={disabledDate}
                            disabledTime={disabledDateTime}
                            style={{ width: '200px' }}
                            disabled={longTermEffective}
                            // showTime={{ defaultValue: Moment('00:00:00', 'HH:mm:ss') }}
                            // onChange={datePickerStartChange}
                            getPopupContainer={datePicketScollFixed}
                          />
                        </Form.Item>
                        <span style={{ display: 'inline-block', width: '24px', lineHeight: '32px', textAlign: 'center' }}>
                          -
                        </span>
                        <Form.Item name={['attrBos1', 'effectiveTimeEnd']} style={{ display: 'inline-block' }}>
                          <DatePicker
                            format="YYYY-MM-DD"
                            disabledDate={disabledDate}
                            disabledTime={disabledDateTime}
                            style={{ width: '200px' }}
                            disabled={longTermEffective}
                            // showTime={{ defaultValue: Moment('23:59:59', 'HH:mm:ss') }}
                            // onChange={datePickerStartChange}
                            getPopupContainer={datePicketScollFixed}
                          />
                        </Form.Item>
                      </Radio>
                    </div>
                    <Radio value={true} style={{ marginTop: '5px' }}>
                      长期有效
                      {/* <Form.Item
                      label='长期有效'
                      style={{ display: 'inline-block', }}>
                      <Checkbox value="1"> 长期有效</Checkbox>
                      <DatePicker style={{ width: '100%' }} />
                    </Form.Item> */}
                    </Radio>
                  </Radio.Group>
                </Form.Item>
              )}
            </div>
          </div>

          <div className="area">
            <div className="area-header">图文描述</div>
            <div className="area-main" style={{ position: 'relative', zIndex: 1 }}>
              <Form.Item label="商品图片" name="image">
                <UploadImage />
              </Form.Item>
              {!loading && (
                <Form.Item label="详情描述" wrapperCol={{ span: 20 }} name="info">
                  <WEdit />
                </Form.Item>
              )}
            </div>
          </div>

          <div className="area">
            <div className="area-header">物流信息</div>
            <div className="area-main">
              <Form.Item label="服务方式" name="serviceMode" rules={[{ required: true }]}>
                <Radio.Group>
                  <Radio value="1">门店服务</Radio>
                  <Radio value="2" disabled>
                    物流快递
                  </Radio>
                </Radio.Group>
              </Form.Item>
              {/* <Form.Item label="运费模板" name="car">
              <Input  allowClear  />
            </Form.Item> */}
            </div>
          </div>
          {/* {[2].includes(productType) && (
            <div className="area">
              <div className="area-header">服务费用</div>
              <div className="area-main">
                <Form.Item label="选择工时服务" name="car" wrapperCol={{ span: 24 }}>
                  <Button onClick={() => setVisibleGongshi(true)} type='primary'>添加工时</Button>
                  {!!gongshiList.length && (
                    <Table columns={columnsGongshi} rowKey="id" dataSource={gongshiList} pagination={false} />
                  )}
                </Form.Item>
              </div>
            </div>
          )} */}

          <div className="area">
            <div className="area-header">发布范围</div>
            <div className="area-main">
              <Form.Item label="发布渠道" name="channels" rules={[{ required: true }]} labelCol={{ span: 3 }}>
                {/*<Radio.Group>
                  <Radio value="3">智慧门店</Radio>
                </Radio.Group>
								*/}
                <Checkbox.Group>
                  <Checkbox value="1">小程序商城</Checkbox>
                  {/*<Checkbox value="2">公众号商城</Checkbox>*/}
                  <Checkbox value="3">智慧门店</Checkbox>
                </Checkbox.Group>
              </Form.Item>

              {compCode == 'COM00000000000001' && headItemFlag == '1' && !id ? (
                <div className={companyList && companyList.length > 0 ? 'orgCodesShop' : ''}>
                  <Form.Item name="orgCodes" wrapperCol={{ span: 24 }}>
                    {/* <TreeSelect multiple>{renderTreeNodes(compTree || [])}</TreeSelect> */}
                    <Form.Item name="orgCodes" label="适用门店" rules={[{ required: true }]} labelCol={{ span: 3 }}>
                      <Button type="primary" onClick={() => addCompany()}>
                        添加适用门店
                      </Button>
                      {!!companyList.length && (
                        <Table
                          columns={columnsCompany}
                          rowKey="id"
                          dataSource={companyList}
                          pagination={false}
                          style={{ marginTop: '20px' }}
                        />
                      )}
                    </Form.Item>

                    {/* <div>
                  <Button onClick={visibleCompany.setTrue} type="primary">
                    选择套餐内容
                  </Button>
                  {!!companyList.length && (
                    <Table columns={columnsCompany} rowKey="id" dataSource={companyList} pagination={false} />
                  )}
                </div> */}
                  </Form.Item>
                </div>
              ) : null}
            </div>
          </div>
          {/* <div className="area">
          <div className="area-header">其他配置</div>
          <div className="area-main">
            <Form.Item label="提成设置" style={{marginBottom: 0}} name="tc" rules={[{required: true}]}>
              <Radio.Group>
                <Radio value="1">单独设置</Radio>
                <Radio value="2">
                  默认设置 <span style={{color: '#999'}}> (默认为0.5%)</span>
                </Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item wrapperCol={{offset: 3}} name="tc_">
              <Input style={{width: '100px'}} />
            </Form.Item>
          </div>
        </div> */}
          <div className="submit">
            <Space size="large">
              <Button onClick={() => onSave(2)} type="primary">
                发布上架
              </Button>
              <Button onClick={() => onSave(1)}>发布到仓库</Button>
            </Space>
          </div>
        </Form>

        <AddGoodPop
          replaceTitpop="添加工时"
          proType="2"
          type={selectionType}
          productType={productType}
          getGongshi={getGongshiList}
          carModelId={carModelId}
          mealgoodShow={visibleGongshi}
          isBindWb={isBindWb}
          isbzName={isbzName}
          mealgoodShowCancel={mealgoodShowCancel}
        />
        <ModalProjectTemplate
          visible={visibleProjectTemplate.state}
          setVisible={visibleProjectTemplate.toggle}
          onOk={setProjectTemplateList}
        />
        <AddGoodPop
          replaceTitpop="添加配件"
          proType="3" //配件为3
          type={selectionType}
          productType={productType}
          getPeijian={setPeijianListBack}
          mealgoodShow={visiblePeijan}
          isbzName={isbzName}
          isBindWb={isBindWb}
          mealgoodShowCancel={mealgoodShowCancel}
        />

        <AddGoodPop
          replaceTitpop="添加项目"
          proType="4"
          type="radio"
          carModelId={carModelId}
          mealgoodShow={visibleProject}
          isbzName={isbzName}
          getMealgoodData={getMealgoodData}
          mealgoodShowCancel={mealgoodShowCancel}></AddGoodPop>
        <Company
          orgCodes={orgCodes}
          visible={visibleCompany.state}
          setVisible={visibleCompany.toggle}
          onOk={setApplicableStores}
          companyList={companyList}></Company>
        <AddGoodPop
          replaceTitpop="添加套餐"
          proType="5"
          carModelId={carModelId}
          mealgoodShow={mealgoodShow}
          getMealgoodData={getMealgoodData}
          mealgoodShowCancel={mealgoodShowCancel}></AddGoodPop>

        <SelectCarModel
          visible={showSelectCarModel.state}
          onOk={SelectCarModelOk}
          onCancel={showSelectCarModel.setFalse}
        />
        {/* <ModalPeijianTemplate
        visible={visiblePeijianTemplate.state}
        setVisible={visiblePeijianTemplate.toggle}
        onOk={() => {
          console.log('gongshi')
        }}
      /> */}
      </Spin>
    </div>
  )
}

export default Index
