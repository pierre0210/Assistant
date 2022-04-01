const Discord = require('discord.js');
const { Client, Collection, Intents } = require('discord.js');
const fs = require('fs');
const { start } = require('repl');
const util = require('./modules/utility.js');
const WD = require('./modules/socialCreditScore/wordsDectect.js');
const RP = require('./modules/redditRss/redditPost.js');
const emoji = require('./modules/emoji/emoji.js');
const LOG = require('./modules/admin/log.js');
require('dotenv').config();
const token = process.env.TOKEN;
const userPrefix = "->";

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES] });
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
        //console.log(cmd + " is loaded.");
    }
    //console.log("[ " + commandFiles.length + " ] commands are loaded.");
    LOG.log('START', "[ " + commandFiles.length + " ] commands are loaded.");

    //console.log("\n");
    const slashCommandFiles = fs.readdirSync("./slashCommands/").filter(f => f.endsWith(".js"));
    for(const slash of slashCommandFiles) {
        let tmp = require(`./slashCommands/${slash}`);
        client.slashCommands.set(tmp.data.name, tmp);
        //console.log(slash + " is loaded.");
    }
    //console.log("[ " + slashCommandFiles.length + " ] slash commands are loaded.");
    LOG.log('START', "[ " + slashCommandFiles.length + " ] slash commands are loaded.");

    var blackListFile = JSON.parse(fs.readFileSync("./blackList.json", "utf8"));
    blackListFile.members = [];
    fs.writeFileSync("./blackList.json", JSON.stringify(blackListFile), (err) => {
        if(err) console.log(err);
    });

    const redditPost = new RP.redditPost(client);
    redditPost.run();
    setInterval(() => {
        redditPost.run();
    }, 5*60*1000);

    //console.log('\nLogged in as %s !', client.user.tag);
    LOG.log('START', `Logged in as ${client.user.tag} !`);
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
        await emoji.detect(msg, configFile, client, userNickname, userAvatar, curchannel);
    }

    else if(configFile.nationList.includes(msg.guild.id)) {
        WD.detect(msg, userID, wordsFile);
    }
});

client.on("interactionCreate", async interaction => {
    if (interaction.user.bot) return;
    if (interaction.isCommand()) {
        const cmd = client.slashCommands.get(interaction.commandName);

        if(cmd) {
            //console.log(cmd);
            try {
                LOG.log('RUN', `${interaction.user.username} used ${interaction.commandName}`);
                await cmd.run(client, interaction);
            } catch(error) {
                console.log(error);
            }
        }
    }
});

client.login(token);