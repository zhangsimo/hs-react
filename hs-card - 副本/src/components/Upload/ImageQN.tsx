/** @format */

import React, { useState, useEffect } from 'react'
import { Upload, message } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import './ImageQN.less'
import * as api from '@/api'
import { useMount } from '@umijs/hooks'
// import { values } from 'lodash'

interface IProps {
  value?: any
  disabled: any
  style?: React.CSSProperties
  className?: string | undefined
  onChange?: (e: any) => void
  title?: string
  clearImgEdit?: (e: any) => void
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
  const [disabled, setDisabled] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [uploadProps, setUploadProps] = useState<object>()
  const turl = 'https://photo.harsonserver.com/' //显示图片的域名

  const getToken = () => {
    return api.getQNToken({ cache: true }).then((res: any) => {
      if (res.status == 'success') {
        return res.uptoken
      } else {
        message.error('获取上传Token失败！')
      }
    })
  }

  const initData = async () => {
    const token = await getToken()

    setUploadProps({
      listType: 'picture-card',
      action: 'http://upload.qiniup.com',
      data: {
        token: token,
      },
      headers: {
        token: token,
      },
      // beforeUpload: beforeUpload,
      // onChange: onUploadChange,
    })
  }

  useEffect(() => {
    setDisabled(props.disabled)
    // setImageUrl(props.value ? '//' + props.value : '')
  }, [props.disabled])

  useEffect(() => {
    // setImageUrl(props.value ? '//' + props.value : '')
    setImageUrl(props.value ? props.value : '')
  }, [props.value])


  const handleChange = info => {
    if (info.file.status === 'uploading') {
      setLading(true)
      return
    }
    if (info.file.status === 'done') {
      // props.onChange?.((info.fileList[0].response.data as string).replace('https://', ''))
      props.onChange?.(turl + info.file.response.key)
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, imageUrl => {
        setLading(false)
        setImageUrl(imageUrl)
      })
    }
  }
  const clearImg = () => {
    setImageUrl('')
    props.onChange?.('')
  }

  useMount(() => {
    initData()
  })

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <div className='upIcon' />}
      <div className="ant-upload-text">{props.title}</div>
    </div>
  )
  return (
    <div>
      {imageUrl && !disabled ? <div className='clearIcon' onClick={() => clearImg()}></div> : ''}
      <Upload
        {...uploadProps}
        name="file"
        showUploadList={false}
        beforeUpload={beforeUpload}
        onChange={handleChange}
        className={props.className}
        disabled={disabled}
        style={props.style}>
        {imageUrl && imageUrl !== '无' ?
          <div>
            <img src={imageUrl} alt="avatar" style={{ width: '100%', height: '130px' }} /></div> : uploadButton}

      </Upload>
    </div>
  )
}

export default UploadImg
