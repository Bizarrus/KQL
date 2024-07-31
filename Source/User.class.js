'use strict';

import GraphQL from './GraphQL.class.js';
import Scheme from './Scheme.class.js';

export default class User {
	constructor(json) {
		//console.warn(json);
		
		this._id		= json.id;
		this._nick		= json.nick;
		this._gender	= json.gender;
		this._age		= json.age;
		this._email		= json.email;
		this._phone		= json.verifiedPhoneNumber;
		this._status	= json.status;
		this._minutes	= json.onlineMinutes;
	}
	
	getID() {
		return this._id;
	}
	
	getNickname() {
		return this._nick;
	}
	
	getGender() {
		return this._gender;
	}
	
	getAge() {
		return this._age;
	}
	
	getMail() {
		return this._email;
	}
	
	getPhoneNumber() {
		return this._phone;
	}
	
	getStatus() {
		return this._status;
	}
	
	getOnlineMinutes() {
		return this._minutes;
	}
	
	getSmileysIDs() {
		return new Promise(async (success, error) => {
			GraphQL.callAuth(Scheme.getQuery('AllSmileyIds')).then((response) => {
				success(response.smileybox.smileyList);
			});			
		});
	}
	
	getRecentSmileys(limit) {
		return new Promise(async (success, error) => {
			GraphQL.callAuth(Scheme.getQuery('RecentSmileys', [
				'Smiley'
			]), {
				limit: limit
			}).then((response) => {
				success(response.smileybox.smileyList);
			});			
		});
	}
}