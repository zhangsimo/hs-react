/** @format */

import React from 'react'
import {HashRouter as Router, Route, Switch} from 'react-router-dom'
import Page404 from '@/views/NotFound/404'
import PrivateRouter from '@/routes/private'
import RegisterRouter from '@/routes/register'

class App extends React.Component {
  render() {
    return (
      <Router basename="/">
        <Switch>
          <Route path="/register" component={RegisterRouter} />
          <Route path="/" component={PrivateRouter} />
          <Route component={Page404} />
        </Switch>
      </Router>
    )
  }
}

export default App
