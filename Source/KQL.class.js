'use strict';

import Scheme from './Scheme.class.js';
import GraphQL from './GraphQL.class.js';
import Auth from './Auth.class.js';
import Event from './Event.class.js';
import Client from './Client.class.js';

export default class KQL {
	constructor() {
		this.Auth			= Auth;
		this.Event			= Event;
		this.Client			= Client;
		
		this.getCurrentServerTime().then((time) => {
			this._server_time	= time;
		});
	}
	
	getCurrentServerTime() {
		return new Promise(async (success, error) => {
			GraphQL.call(Scheme.getQuery('CurrentServerTime')).then((response) => {
				success(response.currentTime);
			});
		});
	}
	
	initSmileys() {
		return new Promise(async (success, error) => {
			Event.sendEvent(
				Scheme.getMutation('SendAppDataEvent'),
				'SmileyAuctionApp',
				'requestSmileyDataByTime',
				{
					smileysTimestamp:		1722412436444,
					mySmileysTimestamp:		1722319601368
				}
			).then((response) => {
				console.warn("smiley init", response);
				success();
			});
		});
	}
	
	getSmileys() {
		return new Promise(async (success, error) => {
			Event.sendEvent(
				Scheme.getMutation('SendAppDataEvent'),
				'SmileyAuctionApp',
				'search',
				{
					query:		'demo',
					filters:	[]
				}
			).then((response) => {
				success(response);
			});
		});
	}
}