'use strict';

import { gql, request, GraphQLClient } from 'graphql-request';
import Scheme from './Scheme.class.js';
import WebSocket from 'ws';

export default class KQL {
	constructor() {
		this._graph_url	= 'https://api-de.knuddels.de/api-gateway/graphql';
		this._session	= null;
		this._socket	= new WebSocket('wss://api-de.knuddels.de/api-gateway/subscriptions', {
			headers: {
				'origin':		'https://app.knuddels.de',
				'user-agent':	'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36 OPR/112.0.0.0'
			}
		});
		this._id		= 1;
		this._events	= {};
		
		this._socket.on('error', console.error);
		this._socket.on('open', () => {
			console.log('[WebSocket]', 'Connected!');
		});

		this._socket.on('close', () => {
			console.log('[WebSocket]', 'Disconnected!');
		});

		this._socket.on('message', (data) => {
			let packet = JSON.parse(data.toString());
			
			console.log('[WebSocket]', '\x1b[2m\x1b[100m\x1b[32mIN\x1b[0m', packet);
			
			switch(packet.type) {
				case 'ka':
					// Ping
				break;
				case 'connection_ack':
					/* Create Subscriptions */
					this.subscribe('MentorEvents', [
						'PotentialMenteeAddedEvent', 'MentorStatus', 'MentorStatusActive'
					]);
					
					this.subscribe('Notifications', [
						'Notification',
						'Color'
					]);
					
					this.subscribe('HasKnuddelsPlusChanged');
					
					this.subscribe('TanSystemSubscription', [
						'TanSystemStatus'
					]);
					
					this.subscribe('SmileyboxChanged');
					
					this.subscribe('PromotionEvents', [
						'HappyHour'
					]);
					
					this.subscribe('ClientSettingsSubscription', [
						'ClientSettingsChanged',
						'AllClientSettings',
						'MacroBoxSettingsEntry'
					]);
					
					this.subscribe('FriendRequestEvents', [
						'FriendRequestUser',
						'ProfilePictureOverlays'
					], {
						pixelDensity: 1
					});
					
					this.subscribe('FriendStateChangedEvent');
					
					[
						'Friends',
						'Watchlist',
						'Fotomeet'
					].forEach((type) => {
						this.subscribe('ContactListChanged', [
							'ContactsUser',
							'ProfilePictureOverlays'
						], {
							pixelDensity:	1,
							filter:			{
								type: type
							}
						});
					});
					
					this.subscribe('fotoMeetEvents');
					
					this.subscribe('FriendRecommendationSubscription');
					
					this.subscribe('CanSendImagesChanged');
					
					this.subscribe('MessengerSubscription', null, {
						pixelDensity: 1
					});
					
					this.subscribe('ChannelEvents', [
						'ChannelMessage',
						'ChannelUser',
						'NicklistIcon',
						'ProfilePictureUser',
						'ProfilePictureOverlays',
						'ChannelMsgUser'
					], {
						pixelDensity: 1
					});
					
					this.subscribe('PaymentSubscription');
					
					this.subscribe('AppEvents');
					
					this.subscribe('SystemEvents');
					
					this.subscribe('happyMomentEvents', [
						'LongConversationOccurred',
						'DailyLoginUsed',
						'FriendRequestAccepted'
					]);
					
					this.subscribe('profileVisitorsEvents', [
						'ProfileVisitorsUser',
						'ProfilePictureOverlays'
					], {
						pixelDensity: 1
					});
				break;
				case 'error':
					console.error('ERROR', JSON.stringify(packet.payload.errors, 0, 1));
				break;
			}
		});
	}
	
	subscribe(name, fragments, variables) {
		return new Promise(async (success, error) => {
			let callback 			= this._id++;
			this._events[callback]	= success;
			
			this.send({
				id: 		'' + callback,
				type:		'start',
				payload:	{
					variable:		(typeof(variables) === 'undefined' ? {} : variables),
					extensions:		{},
					operationName:	name,
					query:			Scheme.getSubscription(name, fragments)
				}
			});
		});
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
			
			/* Connect with WebSocket */
			this.send({
				type: 		'connection_init',
				payload:	{
					authToken:	reqsponse.login.refreshSession.token
				}
			});
			
			success({
				expire: reqsponse.login.refreshSession.expiry,
				token:	reqsponse.login.refreshSession.token
			});
		});
	}
	
	initialJoin() {
		return new Promise(async (success, error) => {
			await new GraphQLClient(this._graph_url, {
				headers: {
					authorization: 'Bearer ' + this._session,
				}
			}).request(Scheme.getMutation('InitialJoin', [
				'ActiveChannel', 'ChannelUser', 'ProfilePictureOverlays',
				'Color', 'ChannelMessage', 'ChannelMsgUser', 'ChannelJoinError', 
			]), {
				force:			false,
				pixelDensity:	1.0
			});
			success();
		});
	}
	
	login(username, password) {
		return new Promise(async (success, error) => {
			this.getDeviceToken(username, password).then((token) => {
				this.getRefreshSessionToken(token).then((session) => {
					this._session = session.token;
					this.initialJoin();
					success();
				}).catch(error);
				
			}).catch(error);
		});
	}
	
	getSmileys() {		
		return new Promise(async (success, error) => {
			let callback			= this.createID();
			this._events[callback]	= success;
			
			const reqsponse = await new GraphQLClient(this._graph_url, {
				headers: {
					authorization: 'Bearer ' + this._session,
				}
			}).request(Scheme.getMutation('SendAppDataEvent'), {
				event: {
					appId:			'SmileyAuctionApp',
					channelName:	'',
					eventKey:		'__fetchEventRequest',
					eventValue:		JSON.stringify({
						id:		callback,
						key:	'search',
						data:	{
							query:		'demo',
							filters:	[]
						}
					})
				}
			});
			
			console.log('SMILEYS', reqsponse);
		});
	}
	
	createID() {
		return '0.' + (process.hrtime()[0] * 1000000000 + process.hrtime()[1]);
	}
	
	send(packet) {
		console.log('[WebSocket]', '\x1b[2m\x1b[100m\x1b[31mOUT\x1b[0m', JSON.parse(JSON.stringify(packet, (key, value) => {
			if(typeof(value) === 'string') {
				if(value.length >= 50) {
					return value.substr(0, 50) + ' [...]';
				}
			}
			
			return value;
		})));
		
		this._socket.send(JSON.stringify(packet));
		console.error(this.createID());
	}
}