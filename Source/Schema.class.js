'use strict';

class Schema {
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
		// Load all structs internally
	}
	
	getFragment(name) {
		if(typeof(this.cache.fragments[name]) == 'undefined') {
			throw Error('[Schema] Cant find fragment "' + name + '".');
		}
		
		return this.cache.fragments[name];
	}
	
	getQuery(name, fragments) {
		if(typeof(this.cache.querys[name]) == 'undefined') {
			throw Error('[Schema] Cant find query "' + name + '".');
		}
		
		return this.cache.querys[name]; // + Fragments
	}
	
	getMutation(name) {
		if(typeof(this.cache.mutations[name]) == 'undefined') {
			throw Error('[Schema] Cant find mutation "' + name + '".');
		}
		
		return this.cache.mutations[name];
	}
	
	getSubscription(name) {
		if(typeof(this.cache.subscriptions[name]) == 'undefined') {
			throw Error('[Schema] Cant find subscription "' + name + '".');
		}
		
		return this.cache.subscriptions[name];
	}
}

export default new Schema();