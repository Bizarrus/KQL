'use strict';

import { gql, request, GraphQLClient } from 'graphql-request';
import Device from './Device.class.js';

class GraphQL {
	constructor() {
		this._graph_url		= 'https://api-de.knuddels.de/api-gateway/graphql';
		this._graph_token	= null;
	}
	
	setToken(token) {
		this._graph_token = token;
	}
	
	call(scheme, variables) {
		return new Promise(async (success, error) => {
			const response = await request(this._graph_url, scheme, variables);
			success(response);
		});
	}
	
	callAuth(scheme, variables) {
		return new Promise(async (success, error) => {
			const response = await new GraphQLClient(this._graph_url, {
				headers: {
					authorization: 'Bearer ' + this._graph_token,
					'user-agent':	Device.getUserAgent()
				}
			}).request(scheme, variables);
			
			success(response);
		});
	}
}

export default new GraphQL();