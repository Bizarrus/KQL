'use strict';

import Device from './Device.class.js';
import Scheme from './Scheme.class.js';
import GraphQL from './GraphQL.class.js';
import Channel from './Channel.class.js';

class Channels {
	constructor() {
		this._channels = {};
	}
	
	getChannels() {
		return new Promise(async (success, error) => {
			GraphQL.callAuth(Scheme.getQuery('GetChannelListOverview', [
				'ChannelAd',
				'ChannelGroupInfo',
				'Color',
				'ChannelCategory',
				'ChannelGroup',
				'ChannelPreviewMembers',
				'Channel',
				'ChannelListContact'
			]), {
				groupAmount:	1000,
				pixelDensity:	Device.getPixelDensity()
			}).then((response) => {
				let channels = [];
				
				response.channel.categories.forEach((category) => {
					category.channelGroups.forEach((channel) => {
						channel.id							= channel.id + ':1';
						let instance						= new Channel(channel);
						this._channels[instance.getID()]	= instance;
						channels.push(instance);
					});
				});
				
				success(channels);				
			});
		});
	}
	
	getChannel(id, channel) {
		return new Promise(async (success, error) => {
			GraphQL.callAuth(Scheme.getQuery('GetChannel', [
				'ActiveChannel',
				'ChannelUser',
				'Color'
			]), {
				channelId: 		id + ':' + channel
			}).then((response) => {
				let instance	= null;
				let channel		= response.channel.channel;
				
				if(typeof(this._channels[channel.id]) !== 'undefined') {
					instance = this._channels[channel.id];
				} else {
					instance = new Channel(channel);
				}
				
				success(instance);				
			});
		});
	}
}

export default new Channels();