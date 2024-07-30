import HTTPS from 'https';
import FS from 'fs';

class FetchScheme {
	constructor() {
		/*this.get('{__schema{types{name,fields{name}}}}').then(data => {
			console.warn(data.data.__schema.types);
		});*/
		
		this.get('query IntrospectionQuery{__schema{queryType{name}mutationType{name}subscriptionType{name}types{...FullType}directives{name description locations args{...InputValue}}}}fragment FullType on __Type{kind name description fields(includeDeprecated:true){name description args{...InputValue}type{...TypeRef}isDeprecated deprecationReason}inputFields{...InputValue}interfaces{...TypeRef}enumValues(includeDeprecated:true){name description isDeprecated deprecationReason}possibleTypes{...TypeRef}}fragment InputValue on __InputValue{name description type{...TypeRef}defaultValue}fragment TypeRef on __Type{kind name ofType{kind name ofType{kind name ofType{kind name ofType{kind name ofType{kind name ofType{kind name ofType{kind name}}}}}}}}').then(data => {
			let enums = 0;
			
			data.data.__schema.types.forEach(entry => {
				switch(entry.kind) {
					case 'ENUM':
						this.createEnum(entry);
						++enums;
					break;
					case 'INTERFACE':
						console.log(JSON.stringify(entry, 0, 1));
					break;
					default:
						console.warn('Unknown Type: ', entry.kind);
					break;
				}
			});
			
			console.log('Created ' + enums + ' enums.');
		});
	}
	
	async get(query) {
		return new Promise((resolve, reject) => {
			let data = '';
			
			HTTPS.get('https://api-de.knuddels.de/api-gateway/graphql?query=' + query, res => {
				res.on('data', chunk => { data += chunk }) 
				res.on('end', () => {
					resolve(JSON.parse(data));
				})
			}) 
		});
	}
	
	createEnum(data) {
		let values	= [];
		let content	= 'enum ' + data.name + ' {';
		
		data.enumValues.forEach(value => {
			let empty = value.description.trim().length == 0;
			
			values.push((empty ? (value.isDeprecated ? '\n\n\t# [DEPRECATED] ' : '\n') : '\n\n\t# ' + (value.isDeprecated ? ' [DEPRECATED] ' : '') + value.description) +  '\n\t' + value.name);
		});
		
		content += values.join(',');
		content += '\n}';
		FS.writeFile('../Scheme/' + data.name + '.enum', content, () => {});
	}
}

new FetchScheme();