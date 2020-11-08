/** @format */

import React, { useEffect } from 'react'
import './style.less'
import CarInf from './add'
import useSearchParam from '@/hooks/useSearchParam'
interface IProps { }
const IsEdit = true
const PageDataCarDetail: React.FC<IProps> = props => {
  const paramVin = useSearchParam('vin')
  const paramCarId = useSearchParam('carId')
  const vin = paramVin ? paramVin : sessionStorage.getItem('vin') ? sessionStorage.getItem('vin') : ''
  const carId: any = paramCarId ? paramCarId : sessionStorage.getItem('carId') ? sessionStorage.getItem('carId') : ''
  useEffect(() => {
    if (carId) {
      sessionStorage.setItem('carId', carId)
    }
  }, [carId])
  useEffect(() => {
    if (vin) {
      sessionStorage.setItem('vin', vin)
    }
  }, [vin])
  return (
    <CarInf IsEdit={IsEdit} vin={vin} carId={carId}></CarInf>
  )
}

export default PageDataCarDetail
