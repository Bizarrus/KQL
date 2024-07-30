import KQL from '../../Source/KQL.class.js';

let knuddels	= new KQL();
let nickname	= '<Knuddels.de Nickname>';
let password	= '<Knuddels.de Password>';


console.warn('+++++ Try to get all Smileys from "Tauschbörse" +++++');
console.log('Nickname: ', nickname);
console.log('Password: ', password);

knuddels.login(nickname, password).then(() => {
	console.warn('SUCCESS:', 'Login OKAY!');
	knuddels.getSmileys().then((list) => {
		console.log('SMILEYS', list);
	});
}).catch(error => {
	console.error('ERROR:', 'Cant login:', error);
})