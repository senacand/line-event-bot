# LINE Event Bot
### What is it?
LINE Event Bot is a simple LINE Bot that is designed to help organize events in group chat.

### How does it work?
User can create an event in group chat and other members can join to the event, therefore making it easier to track who are the participants of the event.

### That's it?
Yes. That's it. I told you it's simple bot.


# Setup
## Prerequisites
1. LINE Bot Account.
2. Generate a **Channel Access Token** from the **Developer Console**.
3. A server with domain that support HTTPS.
4. MongoDB Server.

## Webhook URL
The webhook URL is located at https://example.com/linebot/webhook. As straightforward as that!

## Installation
1. Clone this repository.
2. `cd` into the directory.
3. Install all the dependencies with `npm install`.
4. Create a `.env` file that contains:
```
MONGO_URL = "mongodb://<MONGODB DATABASE URL>"
CHANNEL_ACCESS_TOKEN = "<YOUR CHANNEL ACCESS TOKEN>"
```
5. Start with `npm start`

## Local Debugging
If you want to debug the code locally, you can use [kenakamu's LINE Simulator](https://github.com/kenakamu/LINESimulator). However, there are some environment variables you'll need to add (you can add these to `.env` file):
```
API_BASE_URL = "http://localhost:8080/bot"
DEV_GROUP_ID = "<any random string>"
```
The `API_BASE_URL` is to make sure that LINE SDK will send messages to LINE Simulator instead and `DEV_GROUP_ID` is to fake a `groupId` (which LINE Simulator has not yet have feature for).

# Commands
All these commands will only work when used in a group chat.
## Creating an event
```
/create [eventId] [event description]
```
- `[eventId]`: A unique identification for the event. May not contain whitespace.
- `[event description]`: Description of the event.

## Joining an event
```
/join [eventId]
```

## Modify event description
Only the creator of the event is allowed to modify the event.
```
/modify [eventId] [new event description]
```
- `[new event description]`: New description of the event.

## Delete an event
Only the creator of the event is allowed to delete the event.
```
/delete [eventId]
```
