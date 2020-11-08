/**
 * 项目管理
 *
 * @format
 */

import { useState, useEffect } from 'react'
import { createContainer } from 'unstated-next'
import { setStore, getStore, removeStore } from '@/utils/store'

const defaultView = {
  pathname: '/index/index',
  state: { title: '首页' },
}
const defaultCurrentView = getStore('currentView') || defaultView
const defaultTagview = getStore('tagview') || [defaultView]

const useTabView = () => {
  const [currentView, setCurrentView] = useState<any>(defaultCurrentView)
  const [tagViews, setTagViews] = useState<any[]>(defaultTagview)

  useEffect(() => {
    setStore('tagview', tagViews, 'session')
  }, [tagViews])
  useEffect(() => {
    setStore('currentView', currentView, 'session')
  }, [currentView])

  /**
   * 添加页面
   */
  const addView = view => {
    // console.log('viewview1111', view);
    setCurrentView(view)
    setTagViews(prev => {
      // console.log('prevprev2222', prev);
      const oldTagViews = prev.slice()
      if (oldTagViews.some(v => v.pathname === view.pathname)) {
        return oldTagViews
      }
      if (view.state && view.state.type === 'replace') {
        delete view.state.type
        for (let v of tagViews) {
          if (v.pathname === view.pathname) {
            v = Object.assign(v, view)
            break
          }
        }
      } else {
        oldTagViews.push(view)
      }
      return oldTagViews
    })
  }

  /**
   * 删除页面
   */
  const delView = view => {
    const isDelCurrent = view.pathname === currentView.pathname
    let newCurrentView
    setTagViews(prev => {
      const temp = prev.slice()
      temp.forEach((v, i) => {
        if (v.pathname === view.pathname) {
          temp.splice(i, 1)
        }
        newCurrentView = { ...temp[0] }
      })
      return temp
    })
    if (isDelCurrent && newCurrentView) {
      setCurrentView(newCurrentView)
    }
  }

  /**
   * 更新页面
   * @param view 新页面
   * @param originView 旧页面
   */
  const updateView = (view, originView) => {
    setTagViews(newTagViews => {
      for (let v of newTagViews) {
        if (v.pathname === originView.pathname) {
          v = Object.assign(v, view)
          break
        }
      }
      return newTagViews
    })
  }

  const delAllView = () => {
    console.log(22222)
    removeStore('tagview', 'session')
    removeStore('currentView', 'session')
    setCurrentView({
      pathname: '/index/index',
      state: { title: '首页' },
    })
    setTagViews([
      {
        pathname: '/index/index',
        state: { title: '首页' },
      },
    ])
  }

  return {
    defaultView,
    currentView,
    tagViews,
    addView,
    delView,
    updateView,
    delAllView,
  }
}

export default createContainer(useTabView)
