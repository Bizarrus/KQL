'use strict';

import GraphQL from './GraphQL.class.js';
import Scheme from './Scheme.class.js';
import Device from './Device.class.js';

class Client {
	constructor() {
		this._flags = [];
	}
	
	setFlag(flag) {
		switch(flag) {
			case 580:
				flag = 'engagementSystemChatGroupFlag';
			break;
			case 585:
				flag = 'tanSystemEnabledFlag';
			break;
			case 594:
				flag = 'nickSwitchFlag';			
			break;
			case 599:
				flag = 'authenticityFlag';			
			break;
			case 610:
				flag = 'smileyTradeFlag';			
			break;
			case 649:
				flag = 'disablePeriodicChannelSelectionUpdatesFlag';			
			break;
			case 657:
				flag = 'miniChatTestFlag';			
			break;
			case 658:
				flag = 'miniChatControlFlag';			
			break;
			case 656:
				flag = 'newAppKnuddelTransferFlag';			
			break;
		}
		
		this._flags.push(flag);
	}
	
	getFlags() {
		return this._flags;
	}
	
	KeepOnlineV2() {
		return new Promise(async (success, error) => {
			GraphQL.callAuth(Scheme.getMutation('KeepOnlineV2'), {
				clientState:	'Active'
			}).then((response) => {
				success();				
			});			
		});
	}
	
	initialJoin() {
		return new Promise(async (success, error) => {
			GraphQL.callAuth(Scheme.getMutation('InitialJoin', [
				'ActiveChannel',
				'ChannelUser',
				'Color',
				'ChannelJoinError'
			]), {
				force:			false
			}).then((response) => {
				success();
			});
		});
	}
}

export default new Client();