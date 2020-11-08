/** @format */

//工时数据
export interface IGsDetail {
  aliasName: string //别名
  itemCode: string //工时编号
  itemKindName: string //工种
  itemName: string //工时名称
  itemTime: number //工时时长，工时数
  salePrice: number //工时金额
  unitPrice: number //工时单价
}
//配件数据
export interface IPartDetail {
  factoryCode: string //厂家编码
  oemCode: string //配件OE码
  partBrand: string //配件品牌
  partBrandId: string //配件品牌ID
  partBrandName: string //配件品牌
  partCode: string //配件编码
  partName: string //配件名称
}

export interface IGoodList {
  bizType: number //业务类型
  bizTypeName: string //业务类型名称
  cateId: string //类目id
  cateName: string //类目名称
  compNames: string //适用门店s
  createTime: string | Date //创建时间
  ficti: number //虚拟销量
  id: number //商品id
  image: string //商品图片
  labor: IGsDetail[] //工时数据
  localItem: number //是否本地商品 1本地 2标准
  otPrice: number //市场价
  part: IPartDetail[] //配件数据
  price: number //价格
  sales: number //销量
  shelfTime: string | Date //发布时间
  status: number //商品状态：1仓库 2上架 3回收站
  stock: number //库存
  storeName: string //商品名称
  subItemVos: Array<any> //子商品
  type: number //商品类型：1 普通商品、2工时、3配件、4项目、5套餐
  unit: string //单位
  updateTime: string | Date //最后更新时间
}

//商品绑定的门店列表
export interface IGoodCompList {
  compCode: string //公司编码
  compName: string //公司名称
  itemId: number //商品id
  itemName: string //门店商品销售名称
  itemNum: number //数量
  salesNum: number //销量
  showPrice: number //显示价
  status: number //状态
  unit: string //单位
}

//总部商品详情
export interface IGoodDetailHead {
  bizType: string //商品业务分类
  cateId: string //商品类目id
  channels: Array<any> //发布渠道：1微商城 2公众号商城 3门店
  code: string //编码
  costPrice: number //成本价
  id: number //商品id
  image: string //商品图片
  info: string //商品描述
  isPattern: boolean //是否模板
  itemName: string //商品名称
  items: IGoodCompList[] //适用门店商品列表
  limitNum: number //限购数量,-1代表不限购
  localItem: number //是否关联商品 1本地 2标准
  num: number //数量
  origPrice: number //原价
  outterCode: string //外部编码
  patternCode: string //模板编码
  patternName: string //模板名称
  price: number //销售价格
  productType: number //商品类型：1 普通商品、2工时、3配件、4项目、5套餐
  serviceMode: number //服务方式：1门店服务 2物流快递
  showPrice: number //显示价格
  status: number //商品状态：1仓库 2上架 3回收站
  totalNum: number //总数量，库存
  unit: string //单位
  unitPrice: number //单价
  unlimitedTimes: boolean //是否无限次，true无限次，false非无限次
  virtualSalesNum: number //虚拟销量
}
