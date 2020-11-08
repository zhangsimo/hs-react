/** @format */

import React from 'react'
import * as ReactDOM from 'react-dom'
import {ConfigProvider} from 'antd'
import Store from '@/store'
import zh_CN from 'antd/lib/locale-provider/zh_CN'
import App from './app'
import 'antd/dist/antd.less'
import './assets/less/app.less'
import * as serviceWorker from './serviceWorker'
import ErrorBoundary from './components/ErrorBoundaries'

ReactDOM.render(
  <Store>
    <ConfigProvider locale={zh_CN}>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </ConfigProvider>
  </Store>,
  document.getElementById('app'),
)

serviceWorker.unregister()
