'use strict';

import { gql, request, GraphQLClient } from 'graphql-request';
import Scheme from './Scheme.class.js';

export default class KQL {
	constructor() {
		this._graph_url	= 'https://api-de.knuddels.de/api-gateway/graphql';
		this._session	= null;
	}
	
	call() {
		
	}
	
	getDeviceHash() {
		// @ToDo generate session based deice hash
		return 'E696701F-2098-4266-A040-B84FD740A6CF';
	}
	
	getDeviceToken(username, password) {
		return new Promise(async (success, error) => {
			const reqsponse = await request(this._graph_url, Scheme.getQuery('CreateDeviceToken'), {
				username: username,
				password: password
			});
			
			switch(reqsponse.login.createDeviceToken.result) {
				case 'UNKNOWN_USER':
					error('Unknown User "' + username + '"!');
				break;
				case 'INVALID_CREDENTIALS':
					error('Username or Password not correct!');
				break;
				case 'SUCCESS':
					success(reqsponse.login.createDeviceToken.token);
				break;
			}
		});
	}
	
	getRefreshSessionToken(token) {
		return new Promise(async (success, error) => {
			const reqsponse = await new GraphQLClient(this._graph_url, {
				headers: {
					authorization: 'Bearer ' + token,
				}
			}).request(Scheme.getQuery('RefreshSessionToken', [
				'RefreshSessionError',
				'UserWithLockInfo'
			]), {
				sessionInfo: {
					type:			'K3GraphQl',
					platform:		'Native',
					clientVersion:	{
						major:		4,
						minor:		22,
						patch:		8,
						buildInfo:	'dd34485a181477347adee04f166323c39d6db397'
					},
					osInfo: {
						type:		'Ios',
						version:	'14.6'
					},
					deviceIdentifiers:	this.getDeviceHash()
				}
			});
			
			success({
				expire: reqsponse.login.refreshSession.expiry,
				token:	reqsponse.login.refreshSession.token
			});
		});
	}
	
	login(username, password) {
		return new Promise(async (success, error) => {
			this.getDeviceToken(username, password).then((token) => {
				this.getRefreshSessionToken(token).then((session) => {
					this._session = session.token;
					success();
				}).catch(error);
				
			}).catch(error);
		});
	}
}