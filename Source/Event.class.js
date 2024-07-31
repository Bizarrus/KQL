'use strict';

import WebSocket from 'ws';
import Scheme from './Scheme.class.js';
import Device from './Device.class.js';
import Client from './Client.class.js';
import GraphQL from './GraphQL.class.js';

class Event {
	constructor() {
		this._socket		= null;
		this._id			= 1;
		this._events		= {};		
	}
	
	createID() {
		return '0.' + (process.hrtime()[0] * 1000000000 + process.hrtime()[1]);
	}
	
	subscribe(name, fragments, variables) {
		return new Promise(async (success, error) => {
			let callback 			= this._id++;
			this._events[callback]	= success;
			
			this.send({
				id: 		'' + callback,
				type:		'start',
				payload:	{
					variables:		(typeof(variables) === 'undefined' ? {} : variables),
					extensions:		{},
					operationName:	name,
					query:			Scheme.getSubscription(name, fragments)
				}
			});
		});
	}
	
	connect() {
		return new Promise(async (success, error) => {
			this._socket	= new WebSocket('wss://api-de.knuddels.de/api-gateway/subscriptions', {
				headers: {
					'origin':		'https://app.knuddels.de',
					'user-agent':	Device.getUserAgent()
				}
			});
			
			this._socket.on('error', console.error);
			this._socket.on('open', () => {
				console.log('[WebSocket]', 'Connected!');
				success();
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
							pixelDensity: Device.getPixelDensity()
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
								pixelDensity:	Device.getPixelDensity(),
								filter:			{
									type: type
								}
							});
						});
						
						this.subscribe('fotoMeetEvents');
						
						this.subscribe('FriendRecommendationSubscription');
						
						this.subscribe('CanSendImagesChanged');
						
						this.subscribe('MessengerSubscription', null, {
							pixelDensity: Device.getPixelDensity()
						});
						
						this.subscribe('ChannelEvents', [
							'ChannelMessage',
							'ChannelUser',
							'NicklistIcon',
							'ProfilePictureUser',
							'ProfilePictureOverlays',
							'ChannelMsgUser'
						], {
							pixelDensity: Device.getPixelDensity()
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
							pixelDensity: Device.getPixelDensity()
						});
						
						this.getFeatureFlags();
					break;
					case 'data':
						console.warn('ERROR', JSON.stringify(packet.payload, 0, 1));
					break;
					case 'error':
						console.error('ERROR', JSON.stringify(packet.payload.errors, 0, 1));
					break;
				}
			});
		});
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
	}
	
	sendEvent(scheme, appId, key, value) {
		return new Promise(async (success, error) => {
			GraphQL.callAuth(scheme, {
				event: {
					appId:			appId,
					channelName:	'',
					eventKey:		'__fetchEventRequest',
					eventValue:		JSON.stringify({
						id:		this.createID(),
						key:	key,
						data:	value
					})
				}
			}).then((response) => {
				success(response);
			});
		});
	}
	
	getFeatureFlags() {
		GraphQL.callAuth(Scheme.getQuery('GetFeatureFlags')).then((response) => {
			response.featureFlags.enabledFlags.forEach((flag) => {
				Client.setFlag(flag.id);
			});
			
			//console.warn(Client.getFlags());
		});
	}
}

export default new Event();