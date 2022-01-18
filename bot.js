const Discord = require('discord.js');
const { Client, Collection, Intents } = require('discord.js');
const fs = require('fs');
const { start } = require('repl');
require('dotenv').config();
const token = process.env.TOKEN;
const prefix = "ma/";
const userPrefix = "->";

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
client.commands = new Collection();
client.slashCommands = new Collection();

function hasAdminPermission(msg) {
    var configFile = JSON.parse(fs.readFileSync("./config.json", "utf8"));
    /*
    for(let i=0; i<configFile.adminRoles.length; i++) {
        var adminRole = msg.guild.roles.cache.find(role => role.name === configFile.adminRoles[i]);
        if(adminRole) {
            if(msg.member.roles.cache.has(adminRole.id)) {
                return true;
            }
        }
    }
    */
    if(msg.member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR)) {
        console.log("true");
        return true;
    }
    else {
        console.log("false");
        return false;
    }
}

client.once('ready', () => {
    const commandFiles = fs.readdirSync("./commands/").filter(f => f.endsWith(".js"));
    for(const cmd of commandFiles) {
        let tmp = require(`./commands/${cmd}`);
        client.commands.set(cmd.split(".")[0], tmp);
        console.log(cmd + " is loaded.");
    }
    console.log("[ " + commandFiles.length + " ] commands are loaded.");

    console.log("\n");
    const slashCommandFiles = fs.readdirSync("./slashCommands/").filter(f => f.endsWith(".js"));
    for(const slash of slashCommandFiles) {
        let tmp = require(`./slashCommands/${slash}`);
        client.slashCommands.set(tmp.data.name, tmp);
        console.log(slash + " is loaded.");
    }
    console.log("[ " + slashCommandFiles.length + " ] slash commands are loaded.");

    var blackListFile = JSON.parse(fs.readFileSync("./blackList.json", "utf8"));
    blackListFile.members = [];
    fs.writeFileSync("./blackList.json", JSON.stringify(blackListFile), (err) => {
        if(err) console.log(err);
    });
    console.log('\nLogged in as %s !', client.user.tag);
});

client.on('messageCreate', async msg => {
    if(msg.author.bot) return;
	if(msg.channel.type === 'dm') return;
	if(msg.webhookID) return;
    //if(hasAdminPermission(msg)) console.log("true");
    //else console.log("false");

    var configFile = await JSON.parse(fs.readFileSync("./config.json", "utf8"));
    var blackListFile = await JSON.parse(fs.readFileSync("./blackList.json", "utf8"));
    const userTag = msg.author.tag;
	const userID = msg.author.id;
	const userAvatar = `https://cdn.discordapp.com/avatars/${userID}/${msg.author.avatar}.png?size=256`;
    var now = new Date();

    //const adminRole = msg.guild.roles.cache.find(role => role.name === configFile.adminRole);
    const muteRole = msg.guild.roles.cache.find(role => role.name === configFile.muteRole);
    const curchannel = msg.channel.id;

    if(msg.content.startsWith(prefix) && (userID === "818815468349030420" || hasAdminPermission(msg))) {
        const args = msg.content.slice(prefix.length).split(' ');
		const cmd = args.shift().toLowerCase();
		if(cmd === "connect") {
			let channel = ""
			if(args.length > 0) {
				channel = args[0];
			}
			else {
				channel = msg.channel.id;
			}
			
			configFile.channels.push(channel);
			fs.writeFileSync("./config.json", JSON.stringify(configFile), (err) => {
				if(err) console.log(err);
			});
			await msg.channel.send({embeds:[new Discord.MessageEmbed().setColor("#198964").setDescription("**Connected!** to "+client.user.tag)]});
		}
		else if(cmd === "disconnect") {
			let channel = ""
			if(args.length > 0) {
				channel = args[0];
			}
			else {
				channel = msg.channel.id;
			}

			for(let i=0; i<configFile.channels.length; i++) {
				if(configFile.channels[i] === channel) {
					configFile.channels.splice(i, 1);
				}
			}
			fs.writeFileSync("./config.json", JSON.stringify(configFile), (err) => {
				if(err) console.log(err);
			});
			await msg.channel.send({embeds:[new Discord.MessageEmbed().setColor("#198964").setDescription("**Disconnected!**")]});
		}
    }

    else if(msg.content.startsWith(userPrefix) && (userID === "818815468349030420" || hasAdminPermission(msg))) {
        const args = msg.content.slice(userPrefix.length).split(' ');
		const cmd = args.shift().toLowerCase();

        let command = client.commands.get(cmd);
        if(command) {
            command.run(client, msg, userTag, userID, args);
        }
    }

    else if((msg.member.roles.cache.has(muteRole.id) || blackListFile.members.includes(userID)) && userTag != "Pierre#9505") {
        msg.delete();
    }

    else if(configFile.channels.includes(curchannel)) {
        //console.log(msg.content);
        let emoji = msg.content;
        let picList = [];
        if(emoji.startsWith(":") && emoji.endsWith(":")) {
            let startIndex = emoji.indexOf(":")+1
            let tmp = emoji.slice(startIndex);
            //console.log(emoji);
            while(tmp.indexOf(":") != -1) {
                let endIndex = tmp.indexOf(":");
                emoji = tmp.slice(0, endIndex);
                tmp = tmp.slice(endIndex+1);
                let pic = client.emojis.cache.find(e => e.name === emoji);
                if(pic) {
                    picList.push({ "id": pic.id, "name": pic.name, "animated": pic.animated });
                }
            }
            let picMsg = "";
            for(let i=0; i<picList.length; i++) {
                if(picList[i].animated) {
                    picMsg += "<a:"+picList[i].name+":"+picList[i].id+">";
                }
                else {
                    picMsg += "<:"+picList[i].name+":"+picList[i].id+">";
                }
            }
            if(!picMsg) return;
            let webhookch = client.channels.cache.get(curchannel);
            const webhooks = await webhookch.fetchWebhooks();
            const webhook = webhooks.first();
            await webhook.send({
                content: picMsg,
                username: userTag,
                avatarURL: userAvatar
            });
            await msg.delete();
        }
    }
});

client.on("interactionCreate", async interaction => {
    if (interaction.user.bot) return;
    if (interaction.isCommand()) {
        const cmd = client.slashCommands.get(interaction.commandName);

        if(cmd) {
            //console.log(cmd);
            try {
                await cmd.run(interaction);
            } catch(error) {
                console.log(error);
            }
        }
    }
    
    else if(interaction.isButton()) {
        //onsole.log(interaction.user.id);
        if(interaction.customId === "dontclick") {
            client.users.cache.get(interaction.user.id).send("Told u don't click that!");
            interaction.deferUpdate();
        }
    }
});

client.login(token);