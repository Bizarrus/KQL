'use strict';

import FS from 'fs';

class Scheme {
	constructor() {
		this.cache = {
			fragments: 		{},
			querys:			{},
			mutations:		{},
			subscriptions:	{}
		};
		
		this.reload();
	}
	
	reload() {
		if(FS.existsSync('../Scheme/')) {
			console.error('ERROR:', 'Scheme directory not exists.');
			return;
		}
		
		let count = 0;
		
		FS.readdirSync('./Scheme/').map(file => {
			[
				'fragment',
				'query',
				'mutation',
				'subscription'
			].map((type) => {
				if(file.endsWith('.' + type)) {
					let name						= file.replace('.' + type, '');
					let content						= FS.readFileSync('./Scheme/' + file, 'utf8');
					this.cache[type + 's'][name]	= content;
				}
				
				++count;
			});
		});
		
		console.info('[Scheme] Loaded ' + count + ' Scheme-Files.');
	}
	
	getFragment(name) {
		if(typeof(this.cache.fragments[name]) == 'undefined') {
			throw Error('[Scheme] Cant find fragment "' + name + '".');
		}
		
		return this.cache.fragments[name];
	}
	
	getQuery(name, fragments) {
		if(typeof(this.cache.querys[name]) == 'undefined') {
			throw Error('[Scheme] Cant find query "' + name + '".');
		}
		
		let content = this.cache.querys[name];
		
		if(typeof(fragments) !== 'undefined') {
			content += '\n';
			
			fragments.map(fragment => {
				content += '\n' + this.getFragment(fragment);
			});
		}
		
		return content;
	}
	
	getMutation(name) {
		if(typeof(this.cache.mutations[name]) == 'undefined') {
			throw Error('[Scheme] Cant find mutation "' + name + '".');
		}
		
		return this.cache.mutations[name];
	}
	
	getSubscription(name) {
		if(typeof(this.cache.subscriptions[name]) == 'undefined') {
			throw Error('[Scheme] Cant find subscription "' + name + '".');
		}
		
		return this.cache.subscriptions[name];
	}
}

export default new Scheme();