import {createStore} from 'reflux';
import {List,Map,Record} from 'immutable';

const FALSE_DATA = {};

const StoreMixins = {
	initialData: FALSE_DATA,
	mixins: [],

	init: function() {
		if (this.initialData === FALSE_DATA) {
			throw new Error('Sane stores must specifi an initialData static property');
		}
		this.data = this.initialData;
	},
	
	setData: function(newData) {
		this.data = newData;
		this.emit();
	},

	get: function() {
		return this.data;
	},

	emit: function() {
		this.trigger(this.get());
	},

	getInitialState: function() {
		return this.get();
	},


}


export {StoreMixins};