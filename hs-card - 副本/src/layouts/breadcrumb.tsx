/** @format */

import React from 'react'
import {Breadcrumb} from 'antd'
import {Link} from 'react-router-dom'

export default class MyBreadcrumb extends React.Component {
  state = {
    map: [
      {
        name: 'home',
        title: '首页',
        path: '/',
      },
      {
        name: 'home',
        title: '系统',
        path: '/system',
      },
    ],
  }

  render() {
    return (
      <Breadcrumb>
        {this.state.map.map(item => (
          <Breadcrumb.Item key={item.name}>
            {item.path ? (
              <Link to={item.path}>
                <span>{item.title}</span>
              </Link>
            ) : (
              <span>{item.title}</span>
            )}
          </Breadcrumb.Item>
        ))}
      </Breadcrumb>
    )
  }
}
