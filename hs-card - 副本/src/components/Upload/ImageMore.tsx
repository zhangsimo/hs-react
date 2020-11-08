/** @format */

import React, { useState, useEffect } from 'react'
import { Upload, message, Button } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
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
  const [disabled, setDisabled] = useState(false)
	const [fileList, setFileList] = useState<any>([])
	
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
		setFileList([...props.value])
  }, [props])

  const handleChange = info => {
		setFileList(info.fileList)
    if (info.file.status === 'uploading') {
      return
    }
    if (info.file.status === 'done' || info.file.status === "removed") {
      // props.onChange?.((info.fileList[0].response.data as string).replace('https://', ''))
			let list:any = info.fileList || []
			for (let i in list) {
				if (list[i].response) {
					list[i]['imagerUrl'] = turl + list[i].response.key
				} else {
					list[i]['imagerUrl'] = list[i].url
				}
			}
      props.onChange?.(list)
    }
  }

  useMount(() => {
    initData()
  })

  return (
    <div>
      <Upload
        {...uploadProps}
        beforeUpload={beforeUpload}
				multiple={true}
				fileList={fileList}
        onChange={handleChange}
				disabled={disabled}
        style={props.style}>
				<Button icon={<UploadOutlined />}>上传图片</Button>
        
      </Upload>
    </div>
  )
}

export default UploadImg
