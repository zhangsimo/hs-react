/** @format */
import React, { useState, useEffect } from 'react'
import {getProvinceList, getCityList, getCityAreaList} from '@/api'
//import {useRequest} from '@umijs/hooks'
import { Select } from 'antd'

const { Option } = Select;
interface IProps {
	ProjectSelect: any
	data?: any
}
const selectArea: React.FC<IProps> = props => {
	const [provinceData, setProvinceData] = useState<any>([]);
	const [cityData, setCityData] = useState<any>([]);
	const [areaData, setAreaData] = useState<any>([]);
	const [select, setSelect] = useState<any>({});
	
	const handleProvinceChange = (value, option) => {
		console.log('省', value, option)
		let selectData = select
		selectData['provinceName'] = option.children
		selectData['provinceCode'] = value
		selectData['cityName'] = null
		selectData['cityCode'] = ''
		selectData['areaName'] = null
		selectData['areaCode'] = ''
		setSelect(selectData)
		queryCityList(value)
		props.ProjectSelect(select)
	};
	
	const onSecondCityChange = (value, option) => {
		console.log('市', value, option)
		let selectData = select
		selectData['cityName'] = option.children
		selectData['cityCode'] = value
		selectData['areaName'] = null
		selectData['areaCode'] = null
		setSelect(selectData)
		queryAreaList(value)
		props.ProjectSelect(select)
		onSecondAreaChange(null, {})
	};
	const onSecondAreaChange = (value, option) => {
		let selectData = select
		selectData['areaName'] = option.children
		selectData['areaCode'] = value
		setSelect(selectData)
		console.log('区', value, select)
		props.ProjectSelect(select)
	};


	useEffect(() => {
		let data = props.data || {}
		getProvinceList({cache: true}).then(res => {
			setProvinceData(res.data)
		})
		if (data.provinceCode) {
			queryCityList(data.provinceCode)
		}
		if (data.cityCode) {
			queryAreaList(data.cityCode)
		}
		setSelect(data)
	}, [props])
	// useRequest(() => {
		
	
	// })
	
	const queryCityList = (code) => {
		getCityList({cache: true, parentCode: code}).then(res => {
			setCityData(res.data)
			setAreaData([])
		})
	}
	
	const queryAreaList = (code) => {
		getCityAreaList({cache: true, parentCode: code}).then(res => {
			setAreaData(res.data)
		})
	}


  return (
		<>
			<Select
				style={{ width: 120, marginRight: '15px' }}
				placeholder={select.provinceName ? select.provinceName : '请选择省'}
				defaultValue={select.provinceCode}
				onChange={handleProvinceChange}
			>
				{provinceData.map((province, i) => (
					<Option value={province.code} key={i}>{province.name}</Option>
				))}
			</Select>
			<Select
				placeholder={select.cityName ? select.cityName : '请选择市'}
				style={{ width: 120, marginRight: '15px' }}
				defaultValue={select.cityCode}
				onChange={onSecondCityChange}
			>
				{cityData.map((city, i) => (
					<Option value={city.code} key={i}>{city.name}</Option>
				))}
			</Select>
			<Select
				placeholder={select.areaName ? select.areaName : '请选择区'}
				defaultValue={select.areaCode}
				style={{ width: 120 }}
				onChange={onSecondAreaChange}
			>
				{areaData.map((area, i) => (
					<Option value={area.code} key={i}>{area.name}</Option>
				))}
			</Select>
		</>
	);
}

export default selectArea
