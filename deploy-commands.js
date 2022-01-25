const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
require('dotenv').config();
const clientID = process.env.CLIENT_ID;
const guildID = process.env.GUILD_ID;
const token = process.env.TOKEN;

const commands = [];

const slashCommandFiles = fs.readdirSync("./slashCommands/").filter(f => f.endsWith(".js"));
for(const slash of slashCommandFiles) {
    let tmp = require(`./slashCommands/${slash}`);
    commands.push(tmp.data.toJSON());
}

const rest = new REST({ version: '9' }).setToken(token);


rest.put(Routes.applicationGuildCommands(clientID, guildID), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);

/*
rest.put(Routes.applicationCommands(clientID), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);
*/