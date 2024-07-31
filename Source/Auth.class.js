'use strict';

import GraphQL from './GraphQL.class.js';
import Scheme from './Scheme.class.js';
import Client from './Client.class.js';
import Device from './Device.class.js';
import Event from './Event.class.js';
import User from './User.class.js';

class Auth {
	constructor() {
		this._session	= null;
	}
	
	getSession() {
		return this._session;
	}
	
	login(username, password) {
		return new Promise(async (success, error) => {
			this.getDeviceToken(username, password).then((token) => {
				this._session = token;
				GraphQL.setToken(this._session);
				
				this.getRefreshSessionToken().then((session) => {
					this._session = session.token;
					GraphQL.setToken(this._session);
					
					Client.KeepOnlineV2();
					
					/* Connect with WebSocket */
					Event.connect().then(() => {
						Event.send({
							type: 		'connection_init',
							payload:	{
								authToken:	this._session
							}
						});
						
						Client.initialJoin().then(() => {
							this.getCurrentNick().then((user) => {
								success(new User(user));						
							});
						});
					});
				}).catch(error);
			}).catch(error);
		});
	}
	
	getCurrentNick() {
		return new Promise(async (success, error) => {
			GraphQL.callAuth(Scheme.getQuery('GetCurrentUserNick', [
				'ProfilePictureOverlays'
			])).then((response) => {
				success(response.user.currentUser);
			});
		});
	}
	
	getDeviceToken(username, password) {
		return new Promise(async (success, error) => {
			GraphQL.call(Scheme.getQuery('CreateDeviceToken'), {
				username: username,
				password: password
			}).then((response) => {
				switch(response.login.createDeviceToken.result) {
					case 'UNKNOWN_USER':
						error('Unknown User "' + username + '"!');
					break;
					case 'INVALID_CREDENTIALS':
						error('Username or Password not correct!');
					break;
					case 'SUCCESS':
						success(response.login.createDeviceToken.token);
					break;
					case 'NICK_SWITCH_IN_PROGRESS':
					case 'INTERNAL_ERROR':
						error('An unknown internal error occurred. (e.g. downstream service are not available)');
					break;
				}
			});
		});
	}
	
	getRefreshSessionToken() {
		return new Promise(async (success, error) => {
			GraphQL.callAuth(Scheme.getQuery('RefreshSessionToken', [
				'RefreshSessionError',
				'UserWithLockInfo'
			]), {
				sessionInfo: Device.getVersion()
			}).then((response) => {
				success({
					expire: response.login.refreshSession.expiry,
					token:	response.login.refreshSession.token
				});
			});
		});
	}
}

export default new Auth();