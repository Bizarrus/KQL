import KQL from '../../Source/KQL.class.js';
import Config from '../Config.json' with { type: 'json' };

let knuddels	= new KQL();

console.warn('+++++ Try to get all Smileys from "Tauschbörse" +++++');
console.log('Nickname: ', Config.nickname);
console.log('Password: ', Config.password);

knuddels.Auth.login(Config.nickname, Config.password).then(() => {
	console.warn('SUCCESS:', 'Login OKAY!');
	
	setTimeout(() => {
		knuddels.initSmileys().then(() => {
			knuddels.getSmileys().then((list) => {
				console.log('SMILEYS', list);
			});
		});
	}, 2500);
}).catch(error => {
	console.error('ERROR:', 'Cant login:', error);
})