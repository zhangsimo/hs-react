/**
 *  用户概况
 *
 * @format
 */

import React, {useEffect, useRef, useState} from 'react'
// import useFetch from '@hooks'
import echarts from 'echarts'
import {getConversionRate} from '@/api'
import {useRequest, useBoolean} from '@umijs/hooks'
import {SearchOutlined, SettingOutlined} from '@ant-design/icons'
import {DatePicker, Form, Input, Button, Radio} from 'antd'
import SelectArea from '@/components/Select/area'
import SelectComp from '@/components/Select/comp'
import Dist from '@/components/Select/dict'
import Moment from 'moment'
import 'moment/locale/zh-cn'
const size = undefined
const {RangePicker} = DatePicker
const dateFormat = 'YYYY/MM/DD hh:mm:ss'
const lineChart = () => {
  const [form] = Form.useForm()
  const [timeRange, setTimeRange] = useState<any>([])
  const $chart0 = useRef<HTMLDivElement>(null)
  console.log(form.getFieldsValue())
  const [areaId, setAreaId] = useState<string>('')
  const isClient = useBoolean(false)
  const {data, run} = useRequest(() =>
    getConversionRate({
      ...(form.getFieldValue as any)(),
      isClient: isClient.state,
    }),
  )

  useEffect(() => {
    run()
  }, [isClient.state])

  const selectTimeRange = e => {
    console.log(e)
    // console.log(Moment(e[0]).format(dateFormat))
    if (!e) {
      setTimeRange([null, null])
    } else {
      setTimeRange([Moment(e[0]), Moment(e[1])])
      form.setFieldsValue({startTime: Moment(e[0]).format(dateFormat)})
      form.setFieldsValue({endTime: Moment(e[1]).format(dateFormat)})
    }
  }
  useEffect(() => {
    const myChart0 = echarts.init($chart0.current)
    let value1: any = []
    let dateFeild: any = []
    for (let i in data?.data) {
      if (data?.data[i].dataKey == '打开H5页面') {
        value1[0] = data?.data[i].dataKey
        dateFeild[0] = data?.data[i].dataValue
      }
      if (data?.data[i].dataKey == '领券') {
        value1[1] = data?.data[i].dataKey
        dateFeild[1] = data?.data[i].dataValue
      }
      if (data?.data[i].dataKey == '消费') {
        value1[2] = data?.data[i].dataKey
        dateFeild[2] = data?.data[i].dataValue
      }
      // value1.push(data?.data[i].dataKey)
      // dateFeild.push(data?.data[i].dataValue)
    }
    if (myChart0 && $chart0.current && data?.data) {
      var option1 = {
        title: {
          text: '转化率',
        },
        color: ['#939FFC'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'line', // 默认为直线，可选为：'line' | 'shadow'
          },
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        legend: {
          data: ['活跃门店数'],
        },
        xAxis: [
          {
            type: 'category',
            data: value1 || [],
            axisTick: {
              alignWithLabel: true,
            },
          },
        ],
        yAxis: [
          {
            type: 'value',
          },
        ],
        series: [
          {
            // name: '活跃门店数',
            type: 'line',
            barWidth: '60%',
            data: dateFeild || [],
          },
        ],
      }
      ;(myChart0 as any).setOption(option1)
    }
  }, [$chart0, data])

  const submit = () => {
    run()
  }

  const reSet = () => {
    // setTimeRange([Moment(null), Moment(null)])
    setTimeRange([null, null])
    form.resetFields()
  }

  const onChangeAreaCode = value => {
    setAreaId(value)
    form.setFieldsValue({compCode: null})
  }
  const onChangeType = () => {
    isClient.toggle()
  }

  return (
    <div>
      <Form layout="inline" form={form} size={size}>
        <Form.Item name="subTitle">
          <Input placeholder="输入券名称" size={size} style={{width: '130px'}}></Input>
        </Form.Item>

        <Form.Item name="cardType">
          <Dist type={'cards_type'} style={{width: 130}} placeholder="选择券类型"></Dist>
        </Form.Item>

        <Form.Item name="channel">
          <Dist type={'cards_channel'} style={{width: 130}} placeholder="选择领券渠道"></Dist>
        </Form.Item>

        <Form.Item name="areaCode">
          <SelectArea placeholder="选择区域" allowClear style={{width: 120}} onChange={onChangeAreaCode} />
        </Form.Item>
        <Form.Item name="compCodes">
          <SelectComp
            showSearch
            allowClear
            areaId={areaId}
            placeholder="选择门店"
            filterOption={(input, option) => option?.children.indexOf(input) >= 0}
          />
        </Form.Item>
        <Form.Item>
          <RangePicker
            value={timeRange}
            // allowClear={false}
            onChange={(e: any) => {
              selectTimeRange(e)
            }}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" icon={<SearchOutlined />} size={size} onClick={submit}>
            搜索
          </Button>
          <Button type="primary" icon={<SettingOutlined />} size={size} onClick={reSet} style={{marginLeft: '18px'}}>
            重置
          </Button>
        </Form.Item>
      </Form>

      <div className="section">
        <div className="flex row flex-between head-row">
          <div className="row">
            <span className="icon-stir"></span>优惠券转化率
          </div>
          <Radio.Group onChange={onChangeType} defaultValue="visitor" buttonStyle="solid">
            <Radio.Button value="visitor">操作次数</Radio.Button>
            <Radio.Button value="respost">客户数</Radio.Button>
          </Radio.Group>
        </div>
        <div ref={$chart0} style={{width: '1300px', height: '400px', padding: '10px'}} className=""></div>
      </div>
    </div>
  )
}

export default lineChart
