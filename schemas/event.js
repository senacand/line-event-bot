var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EventSchema = new Schema({
	eventId: {
		type: String,
		required: true,
		index: true
	},
	groupId: {
		type: String,
		required: true,
		index: true
	},
	eventDescription: {
		type: String,
		required: true
	},
	userId: {
		type: String,
		required: true
	},
	participants: [
		{
			userId: {
				type: String,
				required: true,
				index: true
			},
			displayName: {
				type: String,
				required: false
			}
		}
	]
});

mongoose.model('Event', EventSchema);
