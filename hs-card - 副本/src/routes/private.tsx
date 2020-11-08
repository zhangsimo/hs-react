/** @format */

import React, { memo, Suspense, useEffect } from 'react'
import BasicLayout from '@/layouts/basic-layout'
import { Redirect, useHistory, Route } from 'react-router-dom'
// import { HashRouter, Route } from 'react-keeper'
import CacheRoute, { CacheSwitch } from 'react-router-cache-route'
import routeList from '@/routes/route-constant'
import PageLoading from '@/components/PageLoading'
import GlobalStore from '@/store/global'
import TagViewStore from '@/store/tag-view'

const getViewName = (pathname, menus) => {
  let title = '新页面'
  // menus.forEach(item => {
  //   if (item.children) {
  //     item.children?.forEach(item1 => {
  //       if (pathname === item1.pageRouteUrl) {
  //         title = item1.menuName
  //       }
  //     })
  //   } else if (item.pageRouteUrl === '/index/index' && !item.children) {
  //     title = item.menuName
  //   }
  // })
  const getName = (path, menus1) => {
    for(const item of menus1) {
      if ((path === item.pageRouteUrl) || (item.pageRouteUrl === '/index/index' && !item.children)) {
        title = item.menuName
        break
      } else if (item.children && item.children instanceof Array && item.children.length > 0) {
        getName(path, item.children)
      }
    }
  }
  getName(pathname, menus)
  return title
}

const Layout: React.FC = () => {
  const history = useHistory()
  const { token, menus } = GlobalStore.useContainer()
  const { addView } = TagViewStore.useContainer()
  useEffect(() => {
    if (menus?.length) {
      history.listen(route => {
        addView({ pathname: route.pathname, state: { title: getViewName(route.pathname, menus) }, search: route.search })
      })
    }
  }, [menus])

  return token ? (
    <BasicLayout>
      <Suspense fallback={<PageLoading />}>
        <CacheSwitch>
          {/* <HashRouter> */}
          <Route path="/index" component={React.lazy(() => import('../views/index/Index'))} />
          <Route path="/error" component={React.lazy(() => import('../views/NotFound/401'))} />
          {routeList.map((view, index) => {
            // console.log(
            //   'router',
            //   view.path,
            //   view.isCache !== false,
            //   view.isCache !== false && view.path.indexOf('detail') === -1,
            // )
            return view.isCache !== false && view.path.indexOf('detail') === -1 ? (
              <CacheRoute path={view.path} component={view.component} key={index} />
            ) : (
                <Route path={view.path} component={view.component} key={index} />
              )
          })}
          <Redirect to={'/error'}></Redirect>
          {/* </HashRouter> */}
          {
            // // 利用render 渲染子路由
            // menus.map((route, index) => (
            //   <CacheRoute
            //     key={index}
            //     path={route.pageRouteUrl}
            //     // cache
            //     // exact
            //     render={props => {
            //       // 利用render 方法处理
            //       if (route.children) {
            //         return (
            //           <div>
            //             <CacheSwitch>
            //               {route.children.map((child: any, i: any) => (
            //                 <CacheRoute
            //                   // cache
            //                   key={i}
            //                   path={child.pageRouteUrl}
            //                   // component={() => require(`@/views/${child.assemblyUrl}`)}
            //                   component={React.lazy(() => import('@/views/' + child.assemblyUrl))}
            //                 // component={VipmemberList}
            //                 />
            //               ))}
            //               <Redirect to={'/error'}></Redirect>
            //             </CacheSwitch>
            //           </div>
            //         )
            //       } else {
            //         console.log(route)
            //         return <route.assemblyUrl props={props}></route.assemblyUrl>
            //       }
            //     }}
            //   />
            // ))
          }
        </CacheSwitch>
      </Suspense>
    </BasicLayout>
  ) : (
      <Redirect to="/register/login" />
    )
}
// module.exports = memo(Layout,DataSurvey2)
export default memo(Layout)
