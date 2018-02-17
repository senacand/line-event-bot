var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var event = mongoose.model('Event').schema;

var GroupSchema = new Schema({
	groupId: {
		type: String,
		index: true
	},
	events: [ Schema.Types.ObjectId ]
});

mongoose.model('Group', GroupSchema)