'use strict'

//
const React = require('react')
const Router = require('react-router')
const { Route, NotFoundRoute, DefaultRoute } = Router

//
const App = require('./app.jsx')
const Home = require('./modules/home/home.jsx')
const ControlBar = require('./modules/control-bar/index.jsx')
const NotFound = require('./modules/not-found/not-found.jsx')

//
const routes = (
  <Route handler={App} path='/'>
    <DefaultRoute handler={Home} />
    <Route path='control-bar' handler={ControlBar} />
    //
    <NotFoundRoute handler={NotFound} />
  </Route>
)

//
document.addEventListener('DOMContentLoaded', function () {
  Router.run(routes, function (Handler, state) {
    React.render(<Handler />, document.body)
  })
})
