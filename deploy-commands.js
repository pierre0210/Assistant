const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
require('dotenv').config();
const clientID = process.env.CLIENT_ID;
const guildID = process.env.GUILD_ID;
const token = process.env.TOKEN;

const commands = [];
//const configFile = JSON.parse(fs.readFileSync("./config.json", "utf8"));
const commandFolders = fs.readdirSync('./slashCommands');
for (const folder of commandFolders) {
	const commandFiles = fs.readdirSync(`./slashCommands/${folder}`).filter((file) => file.endsWith('.js'));
	for (const file of commandFiles) {
		const command = require(`./slashCommands/${folder}/${file}`);
		commands.push(command.data);
	}
}

const rest = new REST({ version: '9' }).setToken(token);
/*
for(let i=0; i<configFile.guildList.length; i++) {
	rest.put(Routes.applicationGuildCommands(clientID, configFile.guildList[i]), { body: commands })
		.then(() => console.log('Successfully registered application commands.'))
		.catch(console.error);
}
*/

rest.put(Routes.applicationGuildCommands(clientID, guildID), { body: commands })
		.then(() => console.log('Successfully registered application commands.'))
		.catch(console.error);
/*
rest.put(Routes.applicationCommands(clientID), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);
*/