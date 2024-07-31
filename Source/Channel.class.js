'use strict';

import GraphQL from './GraphQL.class.js';
import Scheme from './Scheme.class.js';

export default class Channel {
	constructor(json) {
		//console.warn(json);
		
		this._id		= json.id;
		this._name		= json.name;
		this._users		= json.users;
	}
	
	getID() {
		return this._id;
	}
	
	getName() {
		return this._name;
	}
	
	join() {
		return new Promise(async (success, error) => {
			GraphQL.callAuth(Scheme.getMutation('JoinChannelById', [
				'ActiveChannel',
				'ChannelJoinError',
				'ChannelUser',
				'Color'
			]), {
				channelId:	this.getID()
			}).then((response) => {
				success(response);				
			});			
		});
	}
	
	leave() {
		return new Promise(async (success, error) => {
			GraphQL.callAuth(Scheme.getMutation('LeaveChannel')).then((response) => {
				success(response);				
			});			
		});
	}
	
	getUsers() {
		return this._users;	
	}
	
	sendMessage(text) {
		return new Promise(async (success, error) => {
			GraphQL.callAuth(Scheme.getMutation('SendMessage'), {
				channelId:	this.getID(),
				text:		text
			}).then((response) => {
				success(response);				
			});			
		});
	}
}