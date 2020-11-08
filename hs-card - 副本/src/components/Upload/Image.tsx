/** @format */

import React, { useState, useEffect } from 'react'
import { Upload, message } from 'antd'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import './Image.less'
interface IProps {
  value?: string
  style?: React.CSSProperties
  className?: string | undefined
  onChange?: (e: any) => void
  title?: string
}

function getBase64(img, callback) {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
}

function beforeUpload(file) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/bmp'
  if (!isJpgOrPng) {
    message.error('只允许上传JPG/PNG/JPEG/BMP文件!')
  }
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    message.error('上传文件不能超过 2MB!')
  }
  return isJpgOrPng && isLt2M
}

const UploadImg: React.FC<IProps> = props => {
  const [loading, setLading] = useState(false)
  const [imageUrl, setImageUrl] = useState('')

  useEffect(() => {
    // setImageUrl(props.value ? '//' + props.value : '')
    setImageUrl(props.value ? props.value : '')
  }, [props.value])

  const handleChange = info => {
    console.log('info', info)
    if (info.file.status === 'uploading') {
      setLading(true)
      return
    }
    if (info.file.status === 'done') {
      // props.onChange?.((info.fileList[0].response.data as string).replace('https://', ''))
      props.onChange?.(info.file.response.data)
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, imageUrl => {
        console.log('imageUrl', imageUrl)
        setLading(false)
        setImageUrl(imageUrl)
      })
    }
  }

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div className="ant-upload-text">{props.title}</div>
    </div>
  )
  const clearImg = () => {
    setImageUrl('')
    props.onChange?.('')
  }
  return (
    <div style={{ position: 'relative' }} className='smallUpload'>
      {imageUrl ? <div className='clearIcon' onClick={() => clearImg()}></div> : ''}
      <Upload
        name="file"
        listType="picture-card"
        showUploadList={false}
        action="https://api.harsonserver.com/clerk/common/qnUploadFile.json?platform=36"
        beforeUpload={beforeUpload}
        onChange={handleChange}
        className={props.className}
        style={props.style}>
        {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%', height: '86px' }} /> : uploadButton}
      </Upload>
    </div>
  )
}

export default UploadImg
