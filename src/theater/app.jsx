"use strict";

var React = require('react'),
	Router = require('react-router'),
	{ RouteHandler } = Router,
	styles = {
		app: {
			position: 'absolute',
			top: 0,
			bottom: 0,
			left: 0,
			right: 0,
			minHeight: 600,
			minWidth: 800
		},
		section: {
			position: 'absolute',
			top: 0,
			bottom: 0,
			left: 0,
			right: 0,
			height: '100%',
			width: '100%',
			zIndex: 1,
			overflow: 'hidden'
		}
	};

var App = React.createClass({
	displayName : 'App',
	//
	contextTypes: {
		router: React.PropTypes.func
	},
	//
	render: function () {
		var module = this.context.router.getCurrentPath();
		//
		return (
			<div style={styles.app}>
				<RouteHandler key={module} />
			</div>
		);
	}
});

module.exports = App;
