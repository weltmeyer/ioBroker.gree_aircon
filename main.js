'use strict';

/*
 * Created with @iobroker/create-adapter v1.16.0
 */
//all gree properties {'power':'off','mode':'auto','temperatureUnit':'celsius','temperature':20,'fanSpeed':'auto','air':'off','blow':'off','health':'on','sleep':'off','lights':'on','swingHor':'full','swingVert':'full','quiet':'off','turbo':'off','powerSave':'off'}
// The adapter-core module gives you access to the core ioBroker functions
// you need to create an adapter
const utils = require('@iobroker/adapter-core');
const Gree = require('gree-hvac-client');

// Load your modules here, e.g.:
// const fs = require("fs");

class GreeAircon extends utils.Adapter {


	/**
	 * @param {Partial<ioBroker.AdapterOptions>} [options={}]
	 */
	constructor(options) {
		super({
			...options,
			name: 'gree_aircon',
		});
		this.on('ready', this.onReady.bind(this));
		//this.on('objectChange', this.onObjectChange.bind(this));
		this.on('stateChange', this.onStateChange.bind(this));
		// this.on('message', this.onMessage.bind(this));
		this.on('unload', this.onUnload.bind(this));
		this.currentProperties = {};
		this.Greeclient = null;
	}

	/**
	 * Is called when databases are connected and adapter received configuration.
	 */
	async onReady() {
		// Initialize your adapter here

		// Reset the connection indicator during startup
		this.setState('info.connection', false, true);

		// The adapters config (in the instance object everything under the attribute "native") is accessible via
		// this.config:
		this.log.info('config ipAddress: ' + this.config.ipAddress);


		// in this template all states changes inside the adapters namespace are subscribed
		this.subscribeStates('*');


		this.Greeclient = new Gree.Client({ host: this.config.ipAddress });

		this.Greeclient.on('connect', (client) => {

			this.log.info('Client connected:' + client.getDeviceId());
			this.setState('info.connection', true, true);
		});
		this.Greeclient.on('no_response', () => {
			this.log.warn('Client no response');
		});
		this.Greeclient.on('update', this.onGreeUpdate.bind(this));
	}


	/**
	 * Is called when gree client polling updated
	 * 
	 */
	onGreeUpdate(updatedProperties, properties) {
		const updateJson = JSON.stringify(updatedProperties);
		const propJson = JSON.stringify(properties);
		this.log.info('ClientPollUpdate: updatesProperties:' + updateJson);
		this.log.info('ClientPollUpdate: nowProperties:' + propJson);
		this.currentProperties = properties;
		if ('lights' in updatedProperties)
			this.setStateAsync('lights', updatedProperties.lights == 'on' ? true : false, true);
		if ('temperature' in updatedProperties)
			this.setStateAsync('temperature', updatedProperties.temperature, true);
		if ('power' in updatedProperties)
			this.setStateAsync('power', updatedProperties.power == 'on', true);
		if ('mode' in updatedProperties)
			this.setStateAsync('mode', updatedProperties.mode, true);
		if ('fanSpeed' in updatedProperties)
			this.setStateAsync('fanSpeed', updatedProperties.fanSpeed, true);
		if ('air' in updatedProperties)
			this.setStateAsync('air', updatedProperties.air, true);
		if ('blow' in updatedProperties)
			this.setStateAsync('blow', updatedProperties.blow == 'on', true);
		if ('health' in updatedProperties)
			this.setStateAsync('health', updatedProperties.health == 'on', true);
		if ('sleep' in updatedProperties)
			this.setStateAsync('sleep', updatedProperties.sleep == 'on', true);
		if ('quiet' in updatedProperties)
			this.setStateAsync('quiet', updatedProperties.quiet, true);
		if ('turbo' in updatedProperties)
			this.setStateAsync('turbo', updatedProperties.turbo == 'on', true);
		if ('powerSave' in updatedProperties)
			this.setStateAsync('powerSave', updatedProperties.powerSave == 'on', true);


	}


	/**
	 * Is called when adapter shuts down - callback has to be called under any circumstances!
	 * @param {() => void} callback
	 */
	onUnload(callback) {
		try {
			this.Greeclient.disconnect();
			//this.log.info('cleaned everything up...');
			callback();
		} catch (e) {
			callback();
		}
	}

	/**
	 * Is called if a subscribed object changes
	 * @param {string} id
	 * @param {ioBroker.Object | null | undefined} obj
	 */
	onObjectChange(id, obj) {

		if (obj) {
			// The object was changed
			this.log.info(`object ${id} changed: ${JSON.stringify(obj)}`);
		} else {
			// The object was deleted
			this.log.info(`object ${id} deleted`);
		}
	}

	/**
	 * Is called if a subscribed state changes
	 * @param {string} id
	 * @param {ioBroker.State | null | undefined} state
	 */
	onStateChange(id, state) {
		if (state) {
			// The state was changed
			if (!state.ack) {
				//ack is true when state was updated by device status... in this case, we dont need to send it again :)
				const arrayOfStrings = id.split('.');
				const propName = arrayOfStrings[arrayOfStrings.length - 1];

				switch (propName) {
					case 'lights': {
						const newVal = state.val ? Gree.VALUE.lights.on : Gree.VALUE.lights.off;
						this.Greeclient.setProperty(Gree.PROPERTY.lights, newVal);
						this.setStateAsync('lights', state.val, true);//ack...
						break;
					}
					case 'power': {
						const newVal = state.val ? Gree.VALUE.power.on : Gree.VALUE.power.off;
						this.Greeclient.setProperty(Gree.PROPERTY.power, newVal);
						this.setStateAsync('power', state.val, true);//ack...
						break;
					}
					case 'temperature': {
						const properties = {};
						properties[Gree.PROPERTY.temperature] = state.val;
						properties[Gree.PROPERTY.temperatureUnit] = Gree.VALUE.temperatureUnit.celsius;
						this.Greeclient.setProperties(properties);
						this.setStateAsync('temperature', state.val, true);//ack 
						break;
					}
					case 'mode': {
						if (!['auto', 'cool', 'heat', 'dry', 'fan_only'].includes(state.val)) {
							this.log.error(`tried to set bad value for ${propName}:"${state.val}". Source:${state.from}`);
							this.setStateAsync('mode', this.currentProperties.mode, true);//ack...
							break;
						}
						this.Greeclient.setProperty(Gree.PROPERTY.mode, state.val);
						this.setStateAsync('mode', state.val, true);//ack...
						break;
					}
					case 'fanSpeed': {
						if (!['auto', 'low', 'mediumLow', 'medium', 'mediumHigh', 'high'].includes(state.val)) {
							this.log.error(`tried to set bad value for ${propName}:"${state.val}". Source:${state.from}`);
							this.setStateAsync('fanSpeed', this.currentProperties.fanSpeed, true);//ack...
							break;
						}
						this.Greeclient.setProperty(Gree.PROPERTY.fanSpeed, state.val);
						this.setStateAsync('fanSpeed', state.val, true);//ack...
						break;
					}
					case 'air': {
						if (!['off', 'inside', 'outside', 'mode3'].includes(state.val)) {
							this.log.error(`tried to set bad value for ${propName}:"${state.val}". Source:${state.from}`);
							this.setStateAsync('air', this.currentProperties.air, true);//ack...
							break;
						}
						this.Greeclient.setProperty(Gree.PROPERTY.air, state.val);
						this.setStateAsync('air', state.val, true);//ack...
						break;
					}
					case 'blow': {
						const newVal = state.val ? Gree.VALUE.blow.on : Gree.VALUE.blow.off;
						this.Greeclient.setProperty(Gree.PROPERTY.blow, newVal);
						this.setStateAsync('blow', state.val, true);//ack...
						break;
					}
					case 'health': {
						const newVal = state.val ? Gree.VALUE.health.on : Gree.VALUE.health.off;
						this.Greeclient.setProperty(Gree.PROPERTY.health, newVal);
						this.setStateAsync('health', state.val, true);//ack...
						break;
					}
					case 'sleep': {
						const newVal = state.val ? Gree.VALUE.sleep.on : Gree.VALUE.sleep.off;
						this.Greeclient.setProperty(Gree.PROPERTY.sleep, newVal);
						this.setStateAsync('sleep', state.val, true);//ack...
						break;
					}
					case 'quiet': {
						if (!['off', 'mode1', 'mode2', 'mode3'].includes(state.val)) {
							this.log.error(`tried to set bad value for ${propName}:"${state.val}". Source:${state.from}`);
							this.setStateAsync('air', this.currentProperties.quiet, true);//ack...
							break;
						}
						this.Greeclient.setProperty(Gree.PROPERTY.quiet, state.val);
						this.setStateAsync('quiet', state.val, true);//ack...
						break;
					}
					case 'turbo': {
						const newVal = state.val ? Gree.VALUE.turbo.on : Gree.VALUE.turbo.off;
						this.Greeclient.setProperty(Gree.PROPERTY.turbo, newVal);
						this.setStateAsync('turbo', state.val, true);//ack...
						break;
					}
					case 'powerSave': {
						const newVal = state.val ? Gree.VALUE.powerSave.on : Gree.VALUE.powerSave.off;
						this.Greeclient.setProperty(Gree.PROPERTY.powerSave, newVal);
						this.setStateAsync('powerSave', state.val, true);//ack...
						break;
					}
				}

			}
			//this.log.info(`state ${id} changed: ${state.val} (ack = ${state.ack}) (state=${JSON.stringify(state)})`);
		} else {
			// The state was deleted
			//this.log.info(`state ${id} deleted`);
		}
	}

	// /**
	//  * Some message was sent to this instance over message box. Used by email, pushover, text2speech, ...
	//  * Using this method requires "common.message" property to be set to true in io-package.json
	//  * @param {ioBroker.Message} obj
	//  */
	// onMessage(obj) {
	// 	if (typeof obj === 'object' && obj.message) {
	// 		if (obj.command === 'send') {
	// 			// e.g. send email or pushover or whatever
	// 			this.log.info('send command');

	// 			// Send response in callback if required
	// 			if (obj.callback) this.sendTo(obj.from, obj.command, 'Message received', obj.callback);
	// 		}
	// 	}
	// }

}

// @ts-ignore parent is a valid property on module
if (module.parent) {
	// Export the constructor in compact mode
	/**
	 * @param {Partial<ioBroker.AdapterOptions>} [options={}]
	 */
	module.exports = (options) => new GreeAircon(options);
} else {
	// otherwise start the instance directly
	new GreeAircon();
}