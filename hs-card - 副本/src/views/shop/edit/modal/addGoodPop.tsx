/** @format */

import React, { useState, useEffect } from 'react' //useEffect
import { Tabs, Modal } from 'antd'
// import '../style.less'
import AddlocalGood from './addlocalGood'
import AddstandardItem from './addstandardItem'
import BindWbFromProject from './bindWbFromProject'

import ModalGongshi from './gongshi'
import ModalPeijian from './peijian'
const { TabPane } = Tabs
interface IProps {
  mealgoodShow?
  replacePartsCancel?
  getMealgoodData?
  carModelId?
  getWorkingHoursCallBack?
  replaceTitpop?
  mealgoodShowCancel
  getGongshi?
  proType?
  productType?
  type? //单选还是复选
  isBindWb? //是不是关联维保进来的
  isbzName? //是不是选择标准名称
  getPeijian?
}

const PageOrderIndex: React.FC<IProps> = props => {
  const [current, setCurrent] = useState<string>('1')
  const [propsType, setPropsType] = useState<string>('local')
  const [meal, setMeal] = useState<any>([])

  const callback = key => {
    setPropsType(key)
  }

  useEffect(() => {
    if (props.proType == 3) {
      let meal = [
        // {title: '本地商品库', type: 'local'},
        { title: '维保标准库', type: 'standard' },
      ]
      setMeal(meal)
    } else {
      let meal: any = []
      if (props.productType == 4 || props.isBindWb == 1 || props.isbzName) {
        //项目的时候，不展示本地数据
        meal = [{ title: '维保标准库', type: 'standard' }]
      } else {
        if (props.isBindWb == 1) {
          //关联维保进来，只显示标准库
          meal = [{ title: '维保标准库', type: 'standard' }]
        } else {
          meal = [
            { title: '维保标准库', type: 'standard' },
            { title: '本地商品库', type: 'local' },
          ]
        }
      }
      setMeal(meal)
    }
  }, [props.productType, props.proType, props.isBindWb, props.isbzName])

  const onMenuCancel = () => {
    props.mealgoodShowCancel()
  }

  //套餐
  const standardItemCallBack = (selectedRowKeys, selectedRows) => {
    console.log(selectedRows, '000')
    console.log(props.isBindWb, '111')

    let newSelectedRows: any = []
    selectedRows &&
      selectedRows.length > 0 &&
      selectedRows.map(o => {
        let subItemCreateBos: any = []
        let param: any = {}
        if (props.isBindWb == 1 || props.isbzName) {
          param = {
            outterCode: o.id,
            itemName: o.pkgName ? o.pkgName : o.pkgName,
            // type: o.type === 1 ? '普通商品' : o.type === 2 ? '工时' : o.type === 3 ? '配件' : o.type === 4 ? '项目' : '套餐',
            unit: o.id ? o.unit : '次',
            totalNum: 1,
            productType: 4,
          }
        } else {
          param = {
            itemName: o.storeName ? o.storeName : o.storeName,
            // type: o.type === 1 ? '普通商品' : o.type === 2 ? '工时' : o.type === 3 ? '配件' : o.type === 4 ? '项目' : '套餐',
            unit: o.id ? o.unit : '次',
            totalNum: 1,
            productType: o.type ? o.type : 4,
          }
        }

        //工时
        if (props.isBindWb == 1 || props.isbzName) {
          o.items && o.items.length > 0
            ? (o.items = o.items.map(i => {
              const item = {
                itemCode: i.itemStdCode,
                productType: 2,
                itemName: i.itemName,
                aliasName: i.itemName, //后端没有别名字段
              }
              return item
            }))
            : ''
        } else {
          o.items && o.items.length > 0
            ? (o.items = o.items.map(i => {
              const item = {
                outterCode: i.itemId,
                productType: 2,
                price: i.unitPrice,
                origPrice: i.unitPrice,
                itemName: i.itemName,
              }
              return item
            }))
            : ''
        }

        // console.log(o.items, '------o.items')
        if (o.items && o.items.length > 0) {
          subItemCreateBos = [...subItemCreateBos, ...o.items]
        }
        console.log(subItemCreateBos, '-------subItemCreateBos')
        //配件
        if (props.isBindWb == 1) {
          o.parts && o.parts.length > 0
            ? (o.parts = o.parts.map(i => {
              const parts = {
                code: i.id,
                productType: 3,
                name: i.partName,
                nameCn: i.partName, //后端没有别名字段
              }
              return parts
            }))
            : ''
        } else {
          o.parts && o.parts.length > 0
            ? (o.parts = o.parts.map(i => {
              const parts = {
                outterCode: i.partCode,
                productType: 3,
                price: i.partAmt,
                origPrice: i.partAmt,
                itemName: i.partName,
              }
              return parts
            }))
            : ''
        }

        // console.log(o.parts, '-----o.parts')
        if (o.parts && o.parts.length > 0) {
          subItemCreateBos = [...subItemCreateBos, ...o.parts]
        }

        if (props.isBindWb == 1) {
          //关联维保进来
          const subItemCreateBosfilter = subItemCreateBos.filter(f => f !== 'null' && f)
          param = { ...param, id: o.id, subItemCreateBos: subItemCreateBosfilter }

          if (param.id || param.outterCode) {
            newSelectedRows.push(param)
          }
        } else {
          const subItemCreateBosfilter = subItemCreateBos.filter(f => f !== 'null' && f)
          param = o.id
            ? { ...param, id: o.id, origPrice: o.otPrice, price: o.price }
            : {
              ...param,
              outterCode: o.packageId,
              origPrice: o.saleAmt,
              price: o.saleAmt,
              subItemCreateBos: subItemCreateBosfilter,
            }
          if (param.id || param.outterCode) {
            newSelectedRows.push(param)
          }
        }
      })
    console.log(newSelectedRows, '结果------')
    props.getMealgoodData(selectedRowKeys, newSelectedRows)
    setCurrent('1')
  }
  //工时维保
  const setGongshiList = val => {
    const valNew: any = val.map(o => {
      delete o.id
      return { ...o, price: o.amount }
    })
    props.getGongshi(valNew)
    props.mealgoodShowCancel()
  }
  //配件维保
  const setPeijianList = val => {
    let peijian = []

    if (props.productType == 4 || props.isbzName) {
      peijian = val.map(o => {
        return o
      })


    } else {
      peijian = val.map(o => {
        delete o.id
        return o
      })

    }

    console.log(peijian)
    props.getPeijian(peijian)
    props.mealgoodShowCancel()
  }
  //商品库-工时
  const workingHoursCallBack = val => {
    // console.log(val)
    const workHours = val.map(i => ({
      goodId: i.id,
      itemCode: i.labor.itemCode,
      itemName: i.storeName,
      aliasName: i.labor.aliasName,
      itemKindName: i.labor.itemKindName,
      productType: i.type,
      price: i.price,
      origPrice: i.otPrice,
      name: i.storeName,
      unit: i.unit,
    }))
    props.getGongshi(workHours)
    props.mealgoodShowCancel()
  }
  //商品库-配件
  const replacementsCallBack = val => {
    const replacements = val.map(i => ({
      goodId: i.id,
      ...i,
      code: i.part.partCode,
      unit: i.unit,
      salePrice: i.price,
      partStandardName: i.storeName,
      partBrand: i.part.partBrandName,
      partCode: i.part.partCode,
    }))
    setPeijianList(replacements)
    console.log(replacements, '---replacements')
  }
  return (
    <div className="block replaceParts commomClass">
      <Modal
        title={props.replaceTitpop}
        visible={props.mealgoodShow}
        onCancel={onMenuCancel}
        width={1150}
        footer={null}
        getContainer={false}>
        <Tabs defaultActiveKey={current} onChange={callback} type="card">
          {meal.map((o, index) => (
            <TabPane tab={o.title} key={o.type}>
              {(function tabList(index) {
                return (
                  <div>
                    {
                      {
                        ['0']:
                          props.proType === '5' ? (
                            <AddstandardItem
                              sign={props.mealgoodShow}
                              standardItemCallBack={standardItemCallBack}
                              carModelId={props.carModelId}
                            />
                          ) : props.proType === '2' ? (
                            <ModalGongshi onOk={setGongshiList} type={props.type} productType={props.productType} />
                          ) : props.proType === '4' ? (
                            <BindWbFromProject
                              sign={props.mealgoodShow}
                              type={props.type}
                              standardItemCallBack={standardItemCallBack}
                              carModelId={props.carModelId}
                            />
                          ) : (
                                  <ModalPeijian
                                    onOkPeijian={setPeijianList}
                                    type={props.type}
                                    isbzName={props.isbzName}
                                    productType={props.productType}
                                  />
                                ),
                        ['1']: (
                          <AddlocalGood
                            proType={props.proType}
                            sign={props.mealgoodShow}
                            workingHoursCallBack={workingHoursCallBack}
                            standardItemCallBack={standardItemCallBack}
                            carModelId={props.carModelId}
                            propsType={propsType}
                            replacementsCallBack={replacementsCallBack}
                          />
                        ),
                      }[index]
                    }
                  </div>
                )
              })(index)}
            </TabPane>
          ))}
        </Tabs>
      </Modal>
    </div>
  )
}

export default PageOrderIndex
