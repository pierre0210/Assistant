const Discord = require('discord.js');
const fs = require('fs');
const { start } = require('repl');
require('dotenv').config();
const token = process.env.TOKEN;
const prefix = "ma/";

const client = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES] });

client.once('ready', () => {
    console.log('Logged in as %s !', client.user.tag);
});

client.on('messageCreate', async msg => {
    if(msg.author.bot) return;
	if(msg.channel.type === 'dm') return;
	if(msg.webhookID) return;

    var configFile = await JSON.parse(fs.readFileSync("./config.json", "utf8"));
    const userTag = msg.author.tag;
	const userID = msg.author.id;
	const userAvatar = `https://cdn.discordapp.com/avatars/${userID}/${msg.author.avatar}.png?size=256`;

    const adminRole = msg.guild.roles.cache.find(role => role.name === configFile.adminRole);
    const curchannel = msg.channel.id;

    if(msg.content.startsWith(prefix) && msg.member.roles.cache.has(adminRole.id)) {
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
                    console.log("::1");
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

client.login(token);