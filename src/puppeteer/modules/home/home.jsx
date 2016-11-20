"use strict";

var React = require('react'),
	NSA = require('../../../no-strings-attached/index.js'),
	qmark = require('qmark'),
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
			height: '70%',
			width: '70%',
			margin: '5% auto',
			backgroundColor: '#FFF',
			border: '1px solid #040F1A'
		},
		spinner: {
			image: {
				height: 25
			},
			wrapper: {
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				height: '90%'
			}
		},
		error: {
			wrapper: {
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				height: '90%'
			},
			text: {
				padding: '0 20px'
			}
		},
		gyro: {
			height: '100%',
			width: '100%',
			backgroundImage: 'url(./modules/home/img/compass.svg)',
			backgroundRepeat: 'no-repeat',
			backgroundSize: '50%',
			backgroundPosition: 'center center'
		}
	},
	gyro = require('./gyro.min.js');

var Gyroscope = React.createClass({
	displayName: 'Gyroscope',
	//
	componentDidMount: function () {
		gyro.frequency = 10;
		gyro.startTracking(function (o) {
			NSA.send({
				orientation: {
					alpha: o.alpha,
					beta: o.beta,
					gamma: o.gamma
				}
			});
		});
	},
	componentWillUnmount: function () {
		gyro.stopTracking();
	},
	//
	render: function () {
		return (
			<div style={styles.gyro}></div>
		);
	}
});

var Home = React.createClass({
	displayName : 'Home',
	//
	componentDidMount: function () {
		var that = this,
			id = qmark('t');
		if (id) {
			NSA.connect(id).then(function () {
				console.log('Puppet connected.');
				//
				that.setState({
					theater: true,
					error: null
				});
			})
			.catch(function (err) {
				console.warn('Puppet connect error: ', err);
				that.setState({
					error: 1
				});
			});
		} else {
			that.setState({
				error: 2
			});
		}
	},
	getInitialState: function () {
		return {
			theater: null,
			error: null
		};
	},
	//
	render: function () {
		var content = (
			<div style={styles.spinner.wrapper}>
				<img style={styles.spinner.image} src="./modules/home/img/spinner.gif" />
			</div>
		);
		//
		if (this.state.theater) {
			content = <Gyroscope />;
		}
		//
		if (this.state.error) {
			switch (this.state.error) {
				case 1:
					content = (
						<div style={styles.error.wrapper}>
							<div style={styles.error.text}>Connection error</div>
						</div>
					);
					break;
				case 2:
					content = (
						<div style={styles.error.wrapper}>
							<div style={styles.error.text}>A Theater Id is required. Please try again.</div>
						</div>
					);
					break;
			}
		}
		//
		return (
			<div style={styles.wrapper}>
				<div style={styles.modal}>
					{content}
				</div>
			</div>
		);
	}
});

module.exports = Home;
