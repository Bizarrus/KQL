'use strict';

class Device {
	constructor() {
	
	}
	
	getDeviceHash() {
		// @ToDo generate session based deice hash
		return '812ce18b-c657-4533-b083-0bc5d60d95cb';
	}
	
	getVersion() {
		return {
			type:			'K3GraphQl',
			platform:		'Web',
			clientState:	'Active',
			clientVersion:	{
				major:		7,
				minor:		6,
				patch:		1,
				buildInfo:	'973c88f6a18124e810f7ce96d7a470cb9ec0f997'
			},
			deviceInfo: {
				manufacturer:	'Firefox',
				model:			'128'
			},
			osInfo: {
				type:		'Windows',
				version:	'Windows 10 64-bit'
			},
			deviceIdentifiers:	this.getDeviceHash()
		};
	}
	
	getUserAgent() {
		return 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36 OPR/112.0.0.0';
	}
	
	getPixelDensity() {
		return parseFloat(2.0);
	}
}

export default new Device();