# Assistent discord bot

## Features
### Custom prefix
* mute command
* ping bonk command
* add censor words

### Slash command
* info user & server
* reminder command (switching to database system)
* air quality index command
* weather forecast command
* social credit score system (meme)
* foreign exchange command
* embed message command
* vote & poll command (user friendly)
* setting command for emoji, reddit post channel and keyword triggers
* voice chat logging

### Other features
* for no-nitro user to use animated emojis (format: :emoji-name:)
* reddit top post notification

## Setup
1. npm install (linux user may need to run `sudo apt-get install build-essential`)
2. run dbInit.js and jsonInit.js
3. setup mute role and put role name in config.json
4. add bot owner id to config.json
5. create .env as follows
```
TOKEN=your-bot-token
AQI_KEY=air-quality-index-token-here
WEATHER_KEY=open-weather-data-api-key
CLIENT_ID=bot-client-id
GUILD_ID=discord-server-id
```
6. run bot.js