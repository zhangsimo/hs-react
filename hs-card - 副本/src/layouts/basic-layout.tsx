/** @format */

import React from 'react'
// 组件
import {Layout} from 'antd'
import {ContainerQuery} from 'react-container-query'
import DocumentTitle from 'react-document-title'
import Header from './header'
import SidebarMenu from './sidebar-menu'
// 数据
import classNames from 'classnames'
import './index.less'

const query = {
  'screen-xs': {
    maxWidth: 575,
  },
  'screen-sm': {
    minWidth: 576,
    maxWidth: 767,
  },
  'screen-md': {
    minWidth: 768,
    maxWidth: 991,
  },
  'screen-lg': {
    minWidth: 992,
    maxWidth: 1199,
  },
  'screen-xl': {
    minWidth: 1200,
    maxWidth: 1599,
  },
  'screen-xxl': {
    minWidth: 1600,
  },
}

const BasicLayout: React.FC = props => {
  return (
    <DocumentTitle title="华胜运营管理后台">
      <ContainerQuery query={query}>
        {params => (
          <Layout className={classNames(params)}>
            <Layout.Header className="header">
              <Header />
            </Layout.Header>
            <Layout className="container">
              <Layout.Sider className="sider">
                <SidebarMenu />
              </Layout.Sider>
              <Layout.Content>
                <div className="content">{props.children}</div>
              </Layout.Content>
            </Layout>
          </Layout>
        )}
      </ContainerQuery>
    </DocumentTitle>
  )
}

export default BasicLayout
