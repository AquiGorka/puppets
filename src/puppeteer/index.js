"use strict";

//
var React = require('react'),
    Router = require('react-router'),
    { Route, NotFoundRoute, DefaultRoute } = Router;

//
var App = require('./app.jsx'),
    Home = require('./modules/home/home.jsx'),
    NotFound = require('./modules/not-found/not-found.jsx');
//

var NSA = require('../no-strings-attached/index.js');
window.onunload = function () {
    NSA.destroy();
};

//
var routes = (
    <Route handler={App} path="/">
        <DefaultRoute handler={Home} />
        //
        <NotFoundRoute handler={NotFound} />
    </Route>
);

//
document.addEventListener('DOMContentLoaded', function () {
    Router.run(routes, function (Handler, state) {
        React.render(<Handler />, document.body);
    });
});
