/** @format */
/**数据概况页*/

import React from 'react'
// import {useState} from 'react'
// import {getCoreData} from '@/api'
// import {useRequest} from '@umijs/hooks'
import LineChart from './_components/dataTrendChart'
// import TableChart from './_components/contentTable'
import UserChart from './_components/userProfileChart'
import XFFX from './_components/xffx'
import ActivityChart from './_components/activityChart'

// import {DatePicker} from 'antd'

// const {RangePicker} = DatePicker

import './style.less'

const PageDataSurvey: React.FC = () => {
  // const [day, setDay] = useState('30')

  // const {data, loading} = useRequest(() =>
  //   getCoreData({
  //     startTime: timeRange && timeRange[0].format('YYYY-MM-DD hh:mm:ss'),
  //     endTime: timeRange && timeRange[1].format('YYYY-MM-DD hh:mm:ss'),
  //   }),
  // )

  // const handleSizeChange = e => {
  //   setType(e.target.value)
  // }

  return (
    <div>
      <div>
        <UserChart />
      </div>
      <br />
      <div>
        <LineChart />
      </div>
      <br />
      <div>
        <XFFX />
      </div>
      <br />
      <div>
        <ActivityChart />
      </div>
    </div>
  )
}

export default PageDataSurvey
