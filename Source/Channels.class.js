'use strict';

import Device from './Device.class.js';
import Scheme from './Scheme.class.js';
import GraphQL from './GraphQL.class.js';
import Channel from './Channel.class.js';

class Channels {
	constructor() {
	
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
						channels.push(new Channel(channel));
					});
				});
				
				success(channels);				
			});
		});
	}
}

export default new Channels();