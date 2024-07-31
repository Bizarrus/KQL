import KQL from '../../Source/KQL.class.js';
import Config from '../Config.json' with { type: 'json' };

let knuddels	= new KQL();
let channel		= 2069;

console.warn('+++++ Get all Channels +++++');
console.log('Nickname: ', Config.nickname);
console.log('Password: ', Config.password);

knuddels.Auth.login(Config.nickname, Config.password).then((user) => {
	console.warn('SUCCESS:', 'Login OKAY!', user);
	
	knuddels.Channels.getChannel(channel, 1).then((channel) => {
		console.log("CHANNEL", channel);
		
		channel.join().then(() => {
			channel.sendMessage('Hallo.°' + Date.now() + '°');
			
			console.log('USERS', channel.getUsers());
			
			channel.leave();
		});
	});
	
	
}).catch(error => {
	console.error('ERROR:', 'Cant login:', error);
})