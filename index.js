// Roland-xs62s

var tcp = require('../../tcp');
var instance_skel = require('../../instance_skel');
var debug;
var log;

function instance(system, id, config) {
	var self = this;

	// super-constructor
	instance_skel.apply(this, arguments);

	self.actions(); // export actions

	return self;
}

instance.prototype.CHOICES_INPUTS = [
	{ id: '0', label: 'SDI IN 1' },
	{ id: '1', label: 'SDI IN 2' },
	{ id: '2', label: 'SDI IN 3' },
	{ id: '3', label: 'SDI IN 4' },
	{ id: '4', label: 'HDMI IN 5' },
	{ id: '5', label: 'HDMI/Analog In 6' },
	{ id: '6', label: 'Still/BKG In 7' },
	{ id: '7', label: 'Still/BKG In 8' }
]

instance.prototype.CHOICES_BUSES = [
	{ id: '0', label: 'Program' },
	{ id: '1', label: 'Preset/Preview' },
	{ id: '2', label: 'Aux' }
]

instance.prototype.updateConfig = function(config) {
	var self = this;

	self.config = config;
	self.init_tcp();
}

instance.prototype.init = function() {
	var self = this;

	debug = self.debug;
	log = self.log;

	self.init_tcp();
}

instance.prototype.init_tcp = function() {
	var self = this;
	var receivebuffer = '';

	if (self.socket !== undefined) {
		self.socket.destroy();
		delete self.socket;
	}

	if (self.config.port === undefined) {
		self.config.port = 8023;
	}

	if (self.config.host) {
		self.socket = new tcp(self.config.host, self.config.port);

		self.socket.on('status_change', function (status, message) {
			self.status(status, message);
		});

		self.socket.on('error', function (err) {
			debug('Network error', err);
			self.log('error','Network error: ' + err.message);
		});

		self.socket.on('connect', function () {
			debug('Connected');
		});

		// if we get any data, display it to stdout
		self.socket.on('data', function(buffer) {
			var indata = buffer.toString('utf8');
			//future feedback can be added here
		});

	}
};

// Return config fields for web config
instance.prototype.config_fields = function () {
	var self = this;

	return [
		{
			type: 'text',
			id: 'info',
			width: 12,
			label: 'Information',
			value: 'This module will connect to a Roland Pro AV XS-62S Video Switcher.'
		},
		{
			type: 'textinput',
			id: 'host',
			label: 'IP Address',
			width: 6,
			default: '192.168.0.1',
			regex: self.REGEX_IP
		}
	]
};

// When module gets deleted
instance.prototype.destroy = function() {
	var self = this;

	if (self.socket !== undefined) {
		self.socket.destroy();
	}

	debug('destroy', self.id);
}

instance.prototype.actions = function() {
	var self = this;

	self.system.emit('instance_actions', self.id, {

		'select_pgm': {
			label: 'Select channel for PGM / 1',
			options: [
				{
					type: 'dropdown',
					label: 'Source',
					id: 'source',
					default: '0',
					choices: self.CHOICES_INPUTS
				}
			]
		},
		'select_pvw': {
			label: 'Select channel for PVW / 2',
			options: [
				{
					type: 'dropdown',
					label: 'Source',
					id: 'source',
					default: '0',
					choices: self.CHOICES_INPUTS
				}
			]
		},
		'select_aux': {
			label: 'Select channel for AUX / 3',
			options: [
				{
					type: 'dropdown',
					label: 'Source',
					id: 'source',
					default: '0',
					choices: self.CHOICES_INPUTS
				}
			]
		},
		'select_transition_effect': {
			label: 'Select transition effect',
			options: [
				{
					type: 'dropdown',
					label: 'Transition Effect',
					id: 'transitioneffect',
					default: '0',
					choices: [
						{ id: '0', label: 'Mix'},
						{ id: '1', label: 'Mix'},
						{ id: '2', label: 'Wipe'}
					]
				}
			]
		},
		'set_transition_time': {
			label: 'Set Video Transition Time',
			options: [
				{
					type: 'textinput',
					label: 'Time between 0 (0.0 sec) and 40 (4.0 sec)',
					id: 'transitiontime',
					default: '1'
				}
			]
		},
		'cut': {
			label: 'Press the [CUT] button'
		},
		'take': {
			label: 'Press the [TAKE] button'
		},
		'pinp_onoff': {
			label: 'Set the [PinP] button on/off',
			options: [
				{
					type: 'dropdown',
					label: 'Value',
					id: 'value',
					default: '0',
					choices: [
						{ id: '0', label: 'Off'},
						{ id: '1', label: 'PVW On'},
						{ id: '2', label: 'PGM On'}
					]
				}
			]
		},
		'split_onoff': {
			label: 'Set [Split] on/off',
			options: [
				{
					type: 'dropdown',
					label: 'Value',
					id: 'value',
					default: '0',
					choices: [
						{ id: '0', label: 'Off'},
						{ id: '1', label: 'PVW On'},
						{ id: '2', label: 'PGM On'}
					]
				}
			]
		},
		'dsk_onoff': {
			label: 'Set DSK on/off',
			options: [
				{
					type: 'dropdown',
					label: 'Value',
					id: 'value',
					default: '0',
					choices: [
						{ id: '0', label: 'Off'},
						{ id: '1', label: 'On'}
					]
				}
			]
		},
		'dsk_composited_onoff': {
			label: 'Preview the DSK composited result in the multi-view monitor',
			options: [
				{
					type: 'dropdown',
					label: 'Value',
					id: 'value',
					default: '0',
					choices: [
						{ id: '0', label: 'Off'},
						{ id: '1', label: 'On'}
					]
				}
			]
		},
		'automixing_onoff': {
			label: 'Set the [AUTO MIXING] button on/off',
			options: [
				{
					type: 'dropdown',
					label: 'Value',
					id: 'value',
					default: '0',
					choices: [
						{ id: '0', label: 'Off'},
						{ id: '1', label: 'On'}
					]
				}
			]
		},
		'freeze_onoff': {
			label: 'Set the [FREEZE] button on/off',
			options: [
				{
					type: 'dropdown',
					label: 'Value',
					id: 'value',
					default: '0',
					choices: [
						{ id: '0', label: 'Off'},
						{ id: '1', label: 'On'}
					]
				}
			]
		},
		'set_edid_hdmi': {
			label: 'Set the EDID for HDMI Inputs',
			options: [
				{
					type: 'dropdown',
					label: 'Input',
					id: 'input',
					default: '0',
					choices: [
						{ id: '0', label: 'HDMI IN 5' },
						{ id: '1', label: 'HDMI IN 6' }
					]
				},
				{
					type: 'dropdown',
					label: 'Resolution',
					id: 'resolution',
					default: '0',
					choices: [
						{ id: '0', label: 'Internal' },
						{ id: '1', label: 'SVGA' },
						{ id: '2', label: 'XGA' },
						{ id: '3', label: 'WXGA' },
						{ id: '4', label: 'FWXGA' },
						{ id: '5', label: 'SXGA' },
						{ id: '6', label: 'SXGA+' },
						{ id: '7', label: 'UXGA' },
						{ id: '8', label: 'WUXGA' },
						{ id: '9', label: '720p' },
						{ id: '10', label: '1080i' },
						{ id: '11', label: '1080p' }
					]
				},
			]
		},
		'set_edid_rgb': {
			label: 'Set the EDID for RGB Input',
			options: [
				{
					type: 'dropdown',
					label: 'Input',
					id: 'input',
					default: '2',
					choices: [
						{ id: '2', label: 'RGB IN 6' }
					]
				},
				{
					type: 'dropdown',
					label: 'Resolution',
					id: 'resolution',
					default: '0',
					choices: [
						{ id: '0', label: 'Internal' },
						{ id: '1', label: 'SVGA' },
						{ id: '2', label: 'XGA' },
						{ id: '3', label: 'WXGA' },
						{ id: '4', label: 'FWXGA' },
						{ id: '5', label: 'SXGA' },
						{ id: '6', label: 'SXGA+' },
						{ id: '7', label: 'UXGA' },
						{ id: '8', label: 'WUXGA' }
					]
				},
			]
		},
		'inputscaletype': {
			label: 'Set the input scaling type',
			options: [
				{
					type: 'dropdown',
					label: 'Input',
					id: 'input',
					default: '0',
					choices: [
						{ id: '0', label: 'HDMI IN 5' },
						{ id: '1', label: 'HDMI IN 6' },
						{ id: '1', label: 'RGB IN 6' }
					]
				},
				{
					type: 'dropdown',
					label: 'Type',
					id: 'type',
					default: '0',
					choices: [
						{ id: '0', label: 'Full' },
						{ id: '1', label: 'Letterbox' },
						{ id: '2', label: 'Crop' },
						{ id: '3', label: 'Dot by Dot' },
						{ id: '4', label: 'Manual' }
					]
				},
			]
		},
		'scalarout_resolution': {
			label: 'Set the Scalar Output Resolution',
			options: [
				{
					type: 'dropdown',
					label: 'Value',
					id: 'value',
					default: '0',
					choices: [
						{ id: '0', label: '480p, 576p'},
						{ id: '1', label: '720p'},
						{ id: '2', label: '1080p'},
						{ id: '3', label: 'SVGA'},
						{ id: '4', label: 'XGA'},
						{ id: '5', label: 'WXGA'},
						{ id: '6', label: 'SXGA'},
						{ id: '7', label: 'FWXGA'},
						{ id: '8', label: 'SXGA+'},
						{ id: '9', label: 'UXGA'},
						{ id: '10', label: 'WUXGA'}
					]
				}
			]
		},
		'scalarout_type': {
			label: 'Set the Scalar Output Type',
			options: [
				{
					type: 'dropdown',
					label: 'Value',
					id: 'value',
					default: '0',
					choices: [
						{ id: '0', label: 'Full' },
						{ id: '1', label: 'Letterbox' },
						{ id: '2', label: 'Crop' },
						{ id: '3', label: 'Dot by Dot' },
						{ id: '4', label: 'Manual' }
					]
				}
			]
		},
		'hdmioutput_colorspace': {
			label: 'Set the HDMI Output color space',
			options: [
				{
					type: 'dropdown',
					label: 'Input',
					id: 'output',
					default: '0',
					choices: [
						{ id: '0', label: 'HDMI Out 1' },
						{ id: '1', label: 'HDMI Out 2' },
						{ id: '1', label: 'HDMI Out 3' }
					]
				},
				{
					type: 'dropdown',
					label: 'Type',
					id: 'colorspace',
					default: '0',
					choices: [
						{ id: '0', label: 'YCC' },
						{ id: '1', label: 'RGB LMT' },
						{ id: '2', label: 'RGB Full' }
					]
				},
			]
		},
		'hdmioutput_signaltype': {
			label: 'Set the HDMI Output signal type',
			options: [
				{
					type: 'dropdown',
					label: 'Input',
					id: 'output',
					default: '0',
					choices: [
						{ id: '0', label: 'HDMI Out 1' },
						{ id: '1', label: 'HDMI Out 2' },
						{ id: '1', label: 'HDMI Out 3' }
					]
				},
				{
					type: 'dropdown',
					label: 'Type',
					id: 'type',
					default: '0',
					choices: [
						{ id: '0', label: 'DVI-D' },
						{ id: '1', label: 'HDMI' }
					]
				},
			]
		},
		'pinp_position': {
			label: 'Adjust display position of inset screen assigned to the [PinP]',
			options: [
				{
					type: 'textinput',
					label: 'Horizontal Position (-450 to 450)',
					id: 'horizontal',
					default: '0'
				},
				{
					type: 'textinput',
					label: 'Vertical Position (-400 to 400)',
					id: 'vertical',
					default: '0'
				}
			]
		},
		'split_position': {
			label: 'During split composition, adjust the display position of the video',
			options: [
				{
					type: 'textinput',
					label: 'Position 1 (-250 to 250)',
					id: 'value1',
					default: '0'
				},
				{
					type: 'textinput',
					label: 'Position 2 (-250 to 250)',
					id: 'value2',
					default: '0'
				}
			]
		},
		'dsk_selectsource': {
			label: 'During DSK composition, set the channel of the overlaid logo or image',
			options: [
				{
					type: 'dropdown',
					label: 'Source',
					id: 'source',
					default: '0',
					choices: self.CHOICES_INPUTS
				}
			]
		},
		'dsk_keylevel': {
			label: 'Adjust the key level (amount of extraction) for DSK composition',
			options: [
				{
					type: 'textinput',
					label: '0 - 255',
					id: 'level',
					default: '255'
				}
			]
		},
		'dsk_keygain': {
			label: 'Adjust the key gain (semi-transmissive region) for DSK composition',
			options: [
				{
					type: 'textinput',
					label: '0 - 255',
					id: 'level',
					default: '255'
				}
			]
		},
		'select_channel6input': {
			label: 'Select input connector for Channel 6',
			options: [
				{
					type: 'dropdown',
					label: 'Input Connector',
					id: 'inputconnector',
					default: '0',
					choices: [
						{ id: '0', label: 'HDMI'},
						{ id: '1', label: 'RGB/Component'}
					]
				}
			]
		},
		'select_output_video': {
			label: 'Assign the bus for the video output connector',
			options: [
				{
					type: 'dropdown',
					label: 'Bus',
					id: 'bus',
					default: '0',
					choices: self.CHOICES_BUSES
				}
			]
		},

		'select_output_audio': {
			label: 'Assign the bus for an audio output connector',
			options: [
				{
					type: 'dropdown',
					label: 'Audio Output Connector',
					id: 'audiooutputconnector',
					default: '0',
					choices: [
						{ id: '0', label: 'Audio Out XLR'},
						{ id: '1', label: 'Audio Out RCA'},
						{ id: '2', label: 'Phones'}
					]
				},
				{
					type: 'dropdown',
					label: 'Bus',
					id: 'bus',
					default: '0',
					choices: self.CHOICES_BUSES
				}
			]
		},
		'hdcp': {
			label: 'Set HDCP On/Off',
			options: [
				{
					type: 'dropdown',
					label: 'HDCP Setting',
					id: 'hdcpsetting',
					default: '0',
					choices: [
						{ id: '0', label: 'Off'},
						{ id: '1', label: 'On'}
					]
				}
			]
		},
		'preset': {
			label: 'Call up Preset Memory',
			options: [
				{
					type: 'dropdown',
					label: 'Preset',
					id: 'preset',
					default: '0',
					choices: [
						{ id: '0', label: 'Preset 1'},
						{ id: '1', label: 'Preset 2'},
						{ id: '2', label: 'Preset 3'},
						{ id: '3', label: 'Preset 4'},
						{ id: '4', label: 'Preset 5'},
						{ id: '5', label: 'Preset 6'},
						{ id: '6', label: 'Preset 7'},
						{ id: '7', label: 'Preset 8'}
					]
				}
			]
		},
		'gpo_output': {
			label: 'Set GPO Output On/Off',
			options: [
				{
					type: 'dropdown',
					label: 'GPO Number',
					id: 'gponumber',
					default: '0',
					choices: [
						{ id: '0', label: 'GPO 1'},
						{ id: '1', label: 'GPO 2'},
						{ id: '2', label: 'GPO 3'},
						{ id: '3', label: 'GPO 4'}
					]
				},
				{
					type: 'dropdown',
					label: 'On/Off',
					id: 'value',
					default: '0',
					choices: [
						{ id: '0', label: 'Off'},
						{ id: '1', label: 'On'}
					]
				}
			]
		},
		'video_operationmode': {
			label: 'Set Video Transition Operation Mode',
			options: [
				{
					type: 'dropdown',
					label: 'Mode',
					id: 'mode',
					default: '0',
					choices: [
						{ id: '0', label: 'PGM-PST'},
						{ id: '1', label: 'Dissolve'},
						{ id: '2', label: 'Matrix'}
					]
				}
			]
		},
		'cameracontrol': {
			label: 'Camera Control',
			options: [
				{
					type: 'dropdown',
					label: 'Camera ID',
					id: 'camera',
					default: '0',
					choices: [
						{ id: '0', label: 'Camera 1'},
						{ id: '1', label: 'Camera 2'},
						{ id: '2', label: 'Camera 3'},
						{ id: '3', label: 'Camera 4'},
						{ id: '4', label: 'Camera 5'},
						{ id: '5', label: 'Camera 6'},
						{ id: '6', label: 'Camera 7'}
					]
				},
				{
					type: 'dropdown',
					label: 'Memory',
					id: 'memory',
					default: '0',
					choices: [
						{ id: '0', label: 'Memory 1'},
						{ id: '1', label: 'Memory 2'},
						{ id: '2', label: 'Memory 3'},
						{ id: '3', label: 'Memory 4'},
						{ id: '4', label: 'Memory 5'},
						{ id: '5', label: 'Memory 6'},
						{ id: '6', label: 'Memory 7'},
						{ id: '7', label: 'Memory 8'}
					]
				}
			]
		}
		
	});
}

instance.prototype.action = function(action) {

	var self = this;
	var cmd;
	var options = action.options;
	
	switch(action.action) {
		case 'select_pgm':
			cmd = '\u0002PGM:' + options.source + ';';
			break;
		case 'select_pvw':
			cmd = '\u0002PST:' + options.source + ';';
			break;
		case 'select_aux':
			cmd = '\u0002AUX:' + options.source + ';';
			break;
		case 'select_transition_effect':
			cmd = '\u0002TRS:' + options.transitioneffect + ';';
			break;
		case 'set_transition_time':
			cmd = '\u0002TIM:' + options.transitiontime + ';';
			break;
		case 'cut':
			cmd = '\u0002CUT;';
			break;
		case 'take':
			cmd = '\u0002TAK;';
			break;
		case 'pinp_onoff':
			cmd = '\u0002PPS:' + options.value + ';';
			break;
		case 'split_onoff':
			cmd = '\u0002SPS:' + options.value + ';';
			break;
		case 'dsk_onoff':
			cmd = '\u0002DSK' + options.value + ';';
			break;
		case 'dsk_composited_onoff':
			cmd = '\u0002DVW' + options.value + ';';
			break;
		case 'automixing_onoff':
			cmd = '\u0002ATM' + options.value + ';';
			break;
		case 'freeze_onoff':
			cmd = '\u0002FRZ' + options.value + ';';
			break;
		case 'set_edid_hdmi':
			cmd = '\u0002EDD:' + options.input + ',' + options.resolution + ';';
			break;
		case 'set_edid_rgb':
			cmd = '\u0002EDD:' + options.input + ',' + options.resolution + ';';
			break;
		case 'inputscaletype':
			cmd = '\u0002VIA:' + options.input + ',' + options.type + ';';
			break;
		case 'scalarout_resolution':
			cmd = '\u0002VOR:' + options.value + ';';
			break;
		case 'scalarout_type':
			cmd = '\u0002VOA:' + options.value + ';';
			break;
		case 'hdmioutput_colorspace':
			cmd = '\u0002VOC:' + options.output + ',' + options.colorspace + ';';
			break;
		case 'hdmioutput_colorspace':
			cmd = '\u0002VOD:' + options.output + ',' + options.type + ';';
			break;
		case 'pinp_position':
			cmd = '\u0002PIP:' + options.horizontal + ',' + options.vertical + ';';
			break;
		case 'split_position':
			cmd = '\u0002SPT:' + options.value1 + ',' + options.value2 + ';';
			break;
		case 'dsk_selectsource':
			cmd = '\u0002DSS:' + options.source + ';';
			break;
		case 'dsk_keylevel':
			cmd = '\u0002KYL:' + options.level + ';';
			break;
		case 'dsk_keygain':
			cmd = '\u0002KYG:' + options.level + ';';
			break;
		case 'select_channel6input':
			cmd = '\u0002IPS:' + options.inputconnector + ';';
			break;
		case 'select_output_video':
			cmd = '\u0002VOS:' + options.bus + ';';
			break;
		case 'select_output_audio':
			cmd = '\u0002AOS:' + options.audiooutputconnector + ',' + options.bus + ';';
			break;
		case 'hdcp':
			cmd = '\u0002HCP:' + options.hdcpsetting + ';';
			break;
		case 'preset':
			cmd = '\u0002MEM:' + options.preset + ';';
			break;
		case 'gpo_output':
			cmd = '\u0002GPO:' + options.gponumber + ',' + options.value + ';';
			break;
		case 'video_operationmode':
			cmd = '\u0002MOD:' + options.mode + ';';
			break;
		case 'cameracontrol':
			cmd = '\u0002CAM:' + options.camera + ',' + options.memory + ';';
			break;
	}

	if (cmd !== undefined) {
		if (self.socket !== undefined && self.socket.connected) {
			self.socket.send(cmd);
		} else {
			debug('Socket not connected :(');
		}

	}
};

instance_skel.extendedBy(instance);
exports = module.exports = instance;