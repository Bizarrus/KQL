import KQL from '../../Source/KQL.class.js';
import Config from '../Config.json' with { type: 'json' };

let knuddels	= new KQL();

console.warn('+++++ Get all Channels +++++');
console.log('Nickname: ', Config.nickname);
console.log('Password: ', Config.password);

knuddels.Auth.login(Config.nickname, Config.password).then((user) => {
	console.warn('SUCCESS:', 'Login OKAY!', user);
	knuddels.Channels.getChannels().then((channels) => {
		console.log("CHANNELS", channels);
	});
}).catch(error => {
	console.error('ERROR:', 'Cant login:', error);
})