# Assistent discord bot

## Features
### Custom prefix
* using animated emojis even without nitro
* mute command
* ping bonk command

### Slash command
* info user & server
* reminder command
* air quality index command
* weather forecast command

## Setup
1. npm install
2. run dbInit.js and jsonInit.js
3. setup mute role and put role name in config.json
4. create .env as follows
```
TOKEN=your-bot-token
AQI_KEY=air-quality-index-token-here
WEATHER_KEY=open-weather-data-api-key
CLIENT_ID=bot-client-id
GUILD_ID=discord-server-id
```
5. run bot.js