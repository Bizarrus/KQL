'use strict';

import FS from 'fs';

class Scheme {
	constructor() {
		this.cache = {
			enums: 			{},
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
				'enum',
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
	
	get(type, name, fragments) {
		if(typeof(this.cache[type + 's'][name]) === 'undefined') {
			throw Error('[Scheme] Cant find ' + type + ' "' + name + '".');
		}
		
		let content = this.cache[type + 's'][name];
		
		if(typeof(fragments) !== 'undefined' && fragments !== null) {
			content += '\n';
			
			fragments.map(fragment => {
				content += '\n' + this.getFragment(fragment);
			});
		}
		
		return content;
	}
	
	getEnum(name) {
		return this.get('enum', name);
	}
	
	getFragment(name) {
		return this.get('fragment', name);
	}
	
	getQuery(name, fragments) {
		return this.get('query', name, fragments);
	}
	
	getMutation(name, fragments) {
		return this.get('mutation', name, fragments);
	}
	
	getSubscription(name, fragments) {
		return this.get('subscription', name, fragments);
	}
}

export default new Scheme();