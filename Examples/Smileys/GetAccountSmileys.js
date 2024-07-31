import KQL from '../../Source/KQL.class.js';
import Config from '../Config.json' with { type: 'json' };

let knuddels	= new KQL();

console.warn('+++++ Try to get available Smileys from current Account +++++');
console.log('Nickname: ', Config.nickname);
console.log('Password: ', Config.password);

knuddels.Auth.login(Config.nickname, Config.password).then((user) => {
	user.getSmileys(500).then((smileys) => {
		console.warn('Smiley from Account:', smileys);
	});
}).catch(error => {
	console.error('ERROR:', 'Cant login:', error);
})