"use strict";

var React = require('react'),
	styles = {
		wrapper: {
			position: 'absolute',
			top: 0,
			bottom: 0,
			left: 0,
			right: 0,
			height: '100%',
			width: '100%',
			zIndex: 1,
			overflow: 'hidden',
			textAlign: 'center'
		},
		modal: {
			display: 'inline-block',
			textAlign: 'center',
			borderRadius: 5,
			padding: '0 150px',
			paddingBottom: 50,
			margin: '10% auto',
			backgroundColor: '#FFF',
			color: '#040F1A'
		},
		banner: {
			fontSize: 210,
			textShadow: '5px 5px 10px #CCC',
			height: 220
		},
		text: {
			fontSize: 70,
			textShadow: '5px 5px 10px #CCC'
		}
	};

var NotFound = React.createClass({
	displayName : 'NotFound',
	//
	render: function () {
		//
		return (
			<div style={styles.wrapper}>
				<div style={styles.modal}>
					<div style={styles.banner}>?</div>
					<div style={styles.text}>404</div>
				</div>
			</div>
		);
	}
});

module.exports = NotFound;
