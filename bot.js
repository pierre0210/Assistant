const Discord = require('discord.js');
const { Client, Collection, Intents } = require('discord.js');
const fs = require('fs');
const { start } = require('repl');
const util = require('./modules/utility.js');
const SC = require('./modules/socialCreditScore/socialCredit.js');
require('dotenv').config();
const token = process.env.TOKEN;
const userPrefix = "->";

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
client.commands = new Collection();
client.slashCommands = new Collection();

function hasAdminPermission(msg) {
    if(msg.member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR)) {
        //console.log("true");
        return true;
    }
    else {
        //console.log("false");
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
    var wordsFile = await JSON.parse(fs.readFileSync("./modules/socialCreditScore/words.json", "utf-8"));
    var blackListFile = await JSON.parse(fs.readFileSync("./blackList.json", "utf8"));
    const userTag = msg.author.tag;
	const userID = msg.author.id;
    const userNickname = msg.guild.members.cache.get(userID).nickname ? msg.guild.members.cache.get(userID).nickname : msg.author.username; 
	const userAvatar = `https://cdn.discordapp.com/avatars/${userID}/${msg.author.avatar}.png?size=256`;
    const userLargeAvatar = `https://cdn.discordapp.com/avatars/${userID}/${msg.author.avatar}.png?size=1024`;
    var now = new Date();

    //const adminRole = msg.guild.roles.cache.find(role => role.name === configFile.adminRole);
    const muteRole = msg.guild.roles.cache.find(role => role.name === configFile.muteRole);
    const curchannel = msg.channel.id;
    const hasMuteRole = muteRole.id ? msg.member.roles.cache.has(muteRole.id) : false;

    if(msg.content.startsWith(userPrefix) && (userID === configFile.botOwner || hasAdminPermission(msg))) {
        const args = msg.content.slice(userPrefix.length).split(' ');
		const cmd = args.shift().toLowerCase();

        let command = client.commands.get(cmd);
        if(command) {
            command.run(client, msg, userTag, userID, args);
        }
    }

    else if((hasMuteRole || blackListFile.members.includes(userID)) && userID != configFile.botOwner) {
        msg.delete();
    }

    else if(msg.content.endsWith("機率") && configFile.probChannels.includes(curchannel)) {
        await msg.channel.send(`${util.getRandomNum(0, 100)}%`);
    }

    else if(msg.content.startsWith(":") && msg.content.endsWith(":")) { 
        //console.log(msg.content);
        let emoji = msg.content;
        let picList = [];
        if(configFile.emojiChannels.includes(curchannel)) {
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
            await msg.delete();
            let webhookch = client.channels.cache.get(curchannel);
            const webhooks = await webhookch.fetchWebhooks();
            const webhook = webhooks.first();
            if(!webhook) console.log("No webhook was found!");
            else {
                await webhook.send({
                    content: picMsg,
                    username: userNickname,
                    avatarURL: userAvatar
                });
            }
        }
    }

    else if(configFile.nationList.includes(msg.guild.id)) {
        let count = 0;
        const scorePerCount = 100;
        for(const word of wordsFile.badWords) {
            if(msg.content.includes(word)) {
                count++;
            }
        }
        if(!SC.isInCooldown(userID)) {
            for(const word of wordsFile.goodWords) {
                if(msg.content.includes(word)) {
                    count--;
                    SC.cooldown(userID);
                    break;
                }
            }
        }
        let user = await SC.getUser(userID);
        if(user) {
            let score = user.score;
            let newScore = score-count*scorePerCount;
            if(newScore <= 0) {
                newScore = 0;
                await msg.reply("**此人為共和國劣等公民!\n處決日期：明天早上**");
            }
            await SC.editUserScore(userID, newScore);
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
                await cmd.run(client, interaction);
            } catch(error) {
                console.log(error);
            }
        }
    }
});

client.login(token);