/**
 *  数据趋势图表
 *
 * @format
 */

import React, {useState, useEffect, useRef} from 'react'
// import useFetch from '@hooks'
import echarts from 'echarts'
import {getCardGetAnalysis} from '@/api'
import {useRequest} from '@umijs/hooks'
import Dist from '@/components/Select/dict'
import {SearchOutlined, SettingOutlined} from '@ant-design/icons'
import {DatePicker, Form, Input, Button} from 'antd'
import Moment from 'moment'
import 'moment/locale/zh-cn'
const size = undefined
const {RangePicker} = DatePicker
const dateFormat = 'YYYY/MM/DD hh:mm:ss'
const lineChart = () => {
  const $chart = useRef<HTMLDivElement>(null)

  const [form] = Form.useForm()

  // const [day, setDay] = useState('30')
  // const tformat = (num: number) => (num === 0 ? '0' : num)
  const [timeRange, setTimeRange] = useState<any>([])
  const {data, loading, run} = useRequest(() => getCardGetAnalysis((form.getFieldValue as any)()))
  // useEffect(() => {
  //   run()
  // }, [timeRange])

  const selectTimeRange = e => {
    console.log(e)
    if (!e) {
      setTimeRange([null, null])
    } else {
      setTimeRange([Moment(e[0]), Moment(e[1])])
      form.setFieldsValue({startTime: Moment(e[0]).format(dateFormat)})
      form.setFieldsValue({endTime: Moment(e[1]).format(dateFormat)})
    }
  }

  useEffect(() => {
    let xaxis: any = []
    let series: any = []
    let legend: any = []
    if (data?.data.xaxis && data?.data.xaxis.length > 0) {
      xaxis = data?.data.xaxis
    }
    if (data?.data.series && data?.data.series.length > 0) {
      series = data?.data.series
    }
    if (data?.data.legend && data?.data.legend.length > 0) {
      legend = data?.data.legend
    }

    const myChart = echarts.init($chart.current)

    if (myChart && $chart.current && data?.data) {
      var option = {
        title: {
          text: '券架领取分析',
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        tooltip: {},
        legend: {
          data: legend,
        },
        xAxis: {
          data: xaxis,
        },
        yAxis: {},
        series: series,
      }
      ;(myChart as any).setOption(option)
      console.log(1111111, option)
      console.log(123333, myChart)
    }
  }, [$chart, loading])

  const submit = () => {
    run()
  }

  const reSet = () => {
    setTimeRange([null, null])
    form.resetFields()
  }

  return (
    <div>
      <div>
        <Form layout="inline" form={form} size={size}>
          <Form.Item name="subTitle">
            <Input placeholder="请输入券名称" size={size} style={{width: '130px'}}></Input>
          </Form.Item>

          <Form.Item name="cardType">
            <Dist type={'cards_type'} style={{width: 130}} placeholder="选择券类型"></Dist>
          </Form.Item>

          <Form.Item name="channel">
            <Dist type={'cards_channel'} style={{width: 130}} placeholder="选择领券渠道"></Dist>
          </Form.Item>

          {/* <Form.Item label="客户类型" name="channel">
            <Dist type={'cards_channel'} style={{width: 150}} placeholder="选择客户类型"></Dist>
          </Form.Item> */}

          <Form.Item>
            <RangePicker
              value={timeRange}
              allowClear={false}
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
      </div>

      <div className="section">
        <div className="flex row flex-between head-row">
          <div className="row">
            <span className="icon-stir"></span>券架领取分析
          </div>
        </div>
        <div
          ref={$chart}
          style={{width: '1300px', height: '400px', background: '#fff', padding: '10px'}}
          className=""></div>
      </div>
    </div>
  )
}

export default lineChart
