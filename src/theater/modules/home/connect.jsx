"use strict";

var React = require('react'),
	qr = require('qr-encode'),
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
			margin: '10% auto',
			backgroundColor: '#FFF',
			color: '#040F1A',
			height: 400,
			width: 400
		},
		preps: {
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			width: '100%',
			height: '90%'
		},
		spinner: {
			height: 25
		},
		qr: {
			wrapper: {
				height: 300,
				margin: 20
			},
			image: {
				padding: 10,
				border: '2px solid #040F1A',
				height: 280
			}
		},
		url: {
			padding: '10px 20px'
		}
	},
	config = require('../../../../config.js'),
  HOST = config.theater.host;

var Connect = React.createClass({
	displayName: 'Connect',
	//
	render: function () {
		var url = HOST + '?t=' + this.props.theater,
			dataURI = qr(url, { type: 6, size: 6, level: 'Q' });
		//
		return (
			<div style={styles.wrapper}>
				<div style={styles.modal}>
					<div style={styles.qr.wrapper}>
						<img style={styles.qr.image} src={dataURI} />
					</div>
					<div>Follow the QR Code or this link with your Android phone (Chrome App):</div>
					<div style={styles.url}>
						{url}
					</div>
				</div>
			</div>
		);
	}
});

module.exports = Connect;
