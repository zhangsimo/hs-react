/** @format */

import React, { Component } from 'react'
import './App.css'
import E from 'wangeditor'
import * as api from '@/api'
import { message } from 'antd'

interface IProps {
  props?: object
  onChange?: (value) => void
  value?: string
  menus?: Array<string>
}

interface IState {
  /** sss */
  value: string
}

class App extends Component<IProps, IState> {
  constructor(props, context) {
    super(props, context)
    this.state = {
      value: '',
    }
  }
  render() {
    {
      /* <button onClick={this.clickHandle.bind(this)}>获取内容</button> */
    }
    return <div ref="editorElem" style={{ width: '100%' }} {...this.props.props}></div>
  }
  componentDidMount() {
    this.editorInit()
  }
  clickHandle() {
    // alert(this.state.value)
  }
  getToken() {
    return api.getQNToken().then(res => {
      if (res.status == 'success') {
        return res.uptoken
      } else {
        message.error('获取上传Token失败！')
      }
    })
  }
  async editorInit() {
    const elem = this.refs.editorElem
    const editor = new E(elem)
    const turl = 'https://photo.harsonserver.com/' //显示图片的域名
    const token = await this.getToken()
    // editor.customConfig.uploadImgShowBase64 = true	//上传图片64位
    editor.customConfig.uploadImgServer = 'https://upload.qiniup.com/' //上传图片到服务器
    // editor.customConfig.qiniu = true		//允许上传到七牛
    editor.customConfig.pasteFilterStyle = false
    if (this.props.menus?.length) {
      editor.customConfig.menus = this.props.menus
    }
    editor.customConfig.uploadImgParams = {
      token: token,
      // key: 'HS' + new Date().getTime() + '.' + fileExtension,
    }
    editor.customConfig.uploadFileName = 'file'
    editor.customConfig.uploadImgMaxLength = 5
    editor.customConfig.pasteTextHandle = function (content) {
      // content 即粘贴过来的内容（html 或 纯文本），可进行自定义处理然后返回
      // debugger
      return content
    }
    editor.customConfig.uploadImgHooks = {
      before: function (xhr, editor, files) {
        // 图片上传之前触发
        // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，files 是选择的图片文件
        // 如果返回的结果是 {prevent: true, msg: 'xxxx'} 则表示用户放弃上传
        // return {
        //     prevent: true,
        //     msg: '放弃上传'
        // }
        // const file = files[0]
        // var fileExtension = file.name.substring(file.name.lastIndexOf('.') + 1)  //文件后缀名
      },
      success: function (xhr, editor, result) {
        // 图片上传并返回结果，图片插入成功之后触发
        // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
      },
      fail: function (xhr, editor, result) {
        // 图片上传并返回结果，但图片插入错误时触发
        // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
      },
      error: function (xhr, editor) {
        // 图片上传出错时触发
        // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
      },
      timeout: function (xhr, editor) {
        // 图片上传超时时触发
        // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
      },

      // 如果服务器端返回的不是 {errno:0, data: [...]} 这种格式，可使用该配置
      // （但是，服务器端返回的必须是一个 JSON 格式字符串！！！否则会报错）
      customInsert: function (insertImg, result, editor) {
        console.log(insertImg)
        console.log(result)
        // 图片上传并返回结果，自定义插入图片的事件（而不是编辑器自动插入图片！！！）
        // insertImg 是插入图片的函数，editor 是编辑器对象，result 是服务器端返回的结果

        // 举例：假如上传图片成功后，服务器端返回的是 {url:'....'} 这种格式，即可这样插入图片：
        var url = turl + result.key
        console.log(url)
        insertImg(url)

        // result 必须是一个 JSON 格式字符串！！！否则报错
      },
    }

    // 使用 onchange 函数监听内容的变化，并实时更新到 state 中
    editor.customConfig.onchange = html => {
      this.setState({
        value: html,
      })
      this.props.onChange?.(html)
    }
    editor.create()
    this.props.value && editor.txt.html(this.props.value) //回写内容
  }
}

export default App
