import React from 'react'
import { Route, IndexRoute, Redirect } from 'react-router'

import App from './containers/app'
import Table from './containers/page-table'
import Login from './containers/page-login'
import Dashboard from './containers/page-dashboard'
import NotFound from './containers/page-not-found'

export default (
  <Route path="/" component={App}>
    <IndexRoute component={Dashboard}/>
    <Route path="/login" component={Login} />
    <Route path="/table" component={Table} />
    <Route path="*" component={NotFound} />
  </Route>
)
