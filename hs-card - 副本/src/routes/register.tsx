/** @format */

import React, { Suspense } from 'react'
import BlankLayout from '@/layouts/blank-layout'
import { Switch, Route, Redirect, useRouteMatch } from 'react-router-dom'
import PageLoading from '@/components/PageLoading'

const Layout: React.FC = () => {
  const match = useRouteMatch()
  return (
    <BlankLayout>
      <Suspense fallback={<PageLoading />}>
        <Switch>
          <Route
            key="Login"
            path={`${match.path}/login`}
            component={React.lazy(() => import('../views/Register/Login'))}
          />
          <Redirect from={match.path} to={`${match.path}/login`} />
        </Switch>
      </Suspense>
    </BlankLayout>
  )
}

export default Layout
