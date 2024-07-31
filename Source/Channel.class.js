'use strict';

import GraphQL from './GraphQL.class.js';
import Scheme from './Scheme.class.js';

export default class Channel {
	constructor(json) {
		//console.warn(json);
		
		this._id		= json.id;
		this._name		= json.name;
	}
	
	getID() {
		return this._id;
	}
	
	getName() {
		return this._name;
	}
}