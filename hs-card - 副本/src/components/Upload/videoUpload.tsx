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

function beforeUpload(file) {
  const isJpgOrPng = file.type === 'video/ogg' || file.type === 'video/mp4' || file.type === 'video/webm'
  if (!isJpgOrPng) {
    message.error('只允许上传ogg/mp4/webm文件!')
  }
  const isLt2M = file.size / 1024 / 1024 < 20
  if (!isLt2M) {
    message.error('上传文件不能超过 20MB!')
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
		console.log(3332, props.value)
    setImageUrl(props.value ? props.value : '')
  }, [props.value])


  const handleChange = info => {
		console.log('视频',info)
		let file:any = info.file || {}
    if (file.status === 'uploading') {
			setLading(true)
      return
    }
    if (file.status === 'done' || file.status === "removed") {
			setLading(false)
			if(file.response) {
				props.onChange?.(turl + file.response.key)
			} else {
				props.onChange?.('')
			}
      setImageUrl(imageUrl)
    }
  }


  useMount(() => {
    initData()
  })
	const uploadButton = (
	  <div>
	    {loading ? <LoadingOutlined /> : <div className='upIcon' />}
	    <div className="ant-upload-text">上传视频</div>
	  </div>
	)
	const clearImg = () => {
	  setImageUrl('')
	  props.onChange?.('')
	}
  return (
    <div>
				 {imageUrl && !disabled ? <div className='clearIcon' onClick={() => clearImg()}></div> : ''}
				<Upload
					{...uploadProps}
					name="file"
					showUploadList={false}
					onChange={handleChange}
					beforeUpload={beforeUpload}
					className={props.className}
					disabled={disabled}
					style={props.style}>
					{imageUrl ?
						<video src={imageUrl} controls={true}>
							您的浏览器不支持 video 标签。
						</video>
					: uploadButton}
				</Upload>
    </div>
  )
}

export default UploadImg
