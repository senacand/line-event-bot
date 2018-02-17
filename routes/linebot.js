var express = require('express');
var router = express.Router();
var client = require('../utils/linebot');

var mongoose = require('mongoose');
var Event = mongoose.model('Event');

/* GET home page. */
router.post('/webhook', function(req, res, next) {
	const { events } = req.body;
	console.log(events);
	events.forEach(async (e) => {
		switch (e.type) {
			case 'message': {
				const { message, replyToken, source } = e;
				if (message.type == 'text') {
					const { text } = message;
					const { userId } = source;
					const groupId = process.env.GROUP_ID || source.groupId;
					if (text.charAt(0) == '/') {
						const cmd = text.split(' ');
						switch (cmd[0].toLowerCase()) {
							case '/join': {
								if (!userId) {
									client.replyMessage(replyToken, {
										type: 'text',
										text:
											"Unfortunately, you have not accepted LINE's Official Accounts Terms of Use, therefore I can't recognize you. Try adding me and accept to the terms of use that shows up."
									});
								}
								else if (!groupId) {
									client.replyMessage(replyToken, {
										type: 'text',
										text: 'This feature will only work in group chat.'
									});
								}
								else if (cmd.length <= 1) {
									client.replyMessage(replyToken, [
										{
											type: 'text',
											text: 'Invalid command. Please type in the event id'
										},
										{
											type: 'text',
											text: '/join [eventid]'
										}
									]);
								}
								else {
									const eventId = cmd[1].toLowerCase();
									try {
										const event = await Event.findOne({
											$and: [
												{
													groupId: groupId
												},
												{
													eventId: eventId
												}
											]
										});
										if (!event) {
											client.replyMessage(replyToken, {
												type: 'text',
												text: 'Cannot find event id'
											});
										}
										else {
											const participant = event.participants.find((val) => {
												return val.userId == userId;
											});
											if (participant) {
												client.replyMessage(replyToken, {
													type: 'text',
													text: "You're already a participant of this event"
												});
											}
											else {
												const user = await client.getProfile(userId);
												const { displayName } = user;
												event.participants.push({
													userId,
													displayName
												});
												await event.save();
												const message = await this.getStatus(groupId, eventId);
												if (message) {
													client.replyMessage(replyToken, {
														type: 'text',
														text: message
													});
												}
											}
										}
									} catch (err) {
										console.log(err);
									}
								}
								break;
							}
							case '/create': {
								if (!userId) {
									client.replyMessage(replyToken, {
										type: 'text',
										text:
											"Unfortunately, you have not accepted LINE's Official Accounts Terms of Use, therefore I can't recognize you. Try adding me and accept to the terms of use that shows up."
									});
								}
								else if (!groupId) {
									client.replyMessage(replyToken, {
										type: 'text',
										text: 'This feature will only work in group chat.'
									});
								}
								else if (cmd.length <= 2) {
									client.replyMessage(replyToken, [
										{
											type: 'text',
											text: 'Invalid command. Please type in an event id'
										},
										{
											type: 'text',
											text: '/create [eventid] [event description]'
										}
									]);
								}
								else {
                                    var command = cmd.slice(0, 2);
                                    command.push(cmd.slice(2).join(" "));
									const eventId = command[1].toLowerCase();
									const eventDescription = command[2];
									var event = await Event.findOne({
										$and: [
											{
												groupId: groupId
											},
											{
												eventId: eventId
											}
										]
									});
									if (event) {
										client.replyMessage(replyToken, {
											type: 'text',
											text: 'Event ID already in use. Please choose a different ID.'
										});
									}
									else {
										await Event.create({
											eventId,
											groupId,
											eventDescription,
											userId,
											participants: []
										});
										client.replyMessage(replyToken, [
											{
												type: 'text',
												text: `Event ${eventId} has been created`
											},
											{
												type: 'text',
												text: `Type '/join ${eventId}' to join.`
											}
										]);
									}
								}
								break;
							}
							case '/status': {
								if (cmd.length <= 1) {
									const message = await this.getEvents(groupId);
									client.replyMessage(replyToken, {
										type: 'text',
										text: message
									});
								}
								else {
									const message = await this.getStatus(groupId, cmd[1]);
									client.replyMessage(replyToken, {
										type: 'text',
										text: message
									});
								}
								break;
							}
						}
					}
				}
				break;
			}
		}
	});
	res.sendStatus(200);
});

getStatus = async (groupId, eventId) => {
	const event = await Event.findOne({
		$and: [
			{
				eventId: eventId.toLowerCase()
			},
			{
				groupId: groupId
			}
		]
	});
	if (!event) {
		return 'Event ID not found.';
	}
	else {
		var message = '';
		message += `[Event ID: ${event.eventId}]\n`;
		message += event.eventDescription + '\n\n';
		message += 'Participants:\n';
		var count = 1;
		event.participants.forEach((e) => {
			message += `${count++}. ${e.displayName}\n`;
        });
        message += `\nType '/join ${event.eventId}' to join.`;
		return message;
	}
};

getEvents = async (groupId) => {
	const events = await Event.find({
		groupId: groupId
	});
	var message = '';
	var count = 1;
	message += 'Events in this group:\n';
	events.forEach((e) => {
		message += `${count++}. ${e.eventId}`;
	});
	return message;
};

module.exports = router;
