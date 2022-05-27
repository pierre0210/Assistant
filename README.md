# Assistent discord bot

## Features
This bot is designed to help every members in your discord server, with multiple useful features range from information command such as showing weather forecast and air quality index to voice chat logging command for server admin. 
It is still under developping some features might change from time to time, current commands are shown as follows.
### Custom prefix
* mute command
* ping bonk command
* add censor words

### Slash command
* user & server info
* reminder command `(switching to database system)`
* air quality index command
* weather forecast command
* social credit score system `(meme)`
* foreign exchange command
* embed message command `useful for important post`
* vote & poll command `(user friendly)`
* setting commands for emoji, reddit post channel and keyword triggers
* voice chat logging
* urban dictionary webcrawler command

### Other features
* for non-nitro user to use animated emojis (format: `:emoji-name:`)
* reddit top post notification

## Setup
1. `npm install` (linux user may need to run `sudo apt-get install build-essential` first)
2. run `dbInit.js` and `jsonInit.js`
3. setup mute role and put role name in `config.json`
4. add bot owner id to `config.json`
5. create `.env` as follows
```
TOKEN=your-bot-token
AQI_KEY=air-quality-index-token-here
WEATHER_KEY=open-weather-data-api-key
CLIENT_ID=bot-client-id
GUILD_ID=discord-server-id
```
6. run `bot.js`

### Author: Pierre#9505