const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const fs = require('fs');

function isInList(list, element) {
    for(let i=0; i<list.length; i++) {
        if(list[i] === element) {
            return true;
        }
    }
    return false;
}

async function run(client, interaction) {
    var configFile = JSON.parse(fs.readFileSync('./config.json', 'utf-8'));
    var logFile = JSON.parse(fs.readFileSync('./log.json', 'utf-8'));
    if(interaction.user.id === configFile.botOwner) {
        if(interaction.options.getSubcommand() === 'aec') {
            const channelID = interaction.options.getString('channel');
            if(!isInList(configFile.emojiChannels, channelID)) {
                configFile.emojiChannels.push(channelID);
                fs.writeFileSync('./config.json', JSON.stringify(configFile, null, 4), (err) => {
                    if(err) console.log(err);
                });
                await interaction.reply({ content: "加入頻道", ephemeral: true });
            }
            else {
                await interaction.reply({ content: "頻道已設定", ephemeral: true });
            }
        }
        else if(interaction.options.getSubcommand() === 'rec') {
            const channelID = interaction.options.getString('channel');
            if(isInList(configFile.emojiChannels, channelID)) {
                for(let i=0; i<configFile.emojiChannels.length; i++) {
                    if(configFile.emojiChannels[i] === channelID) {
                        configFile.emojiChannels.splice(i, 1);
                    }
                }
                fs.writeFileSync('./config.json', JSON.stringify(configFile, null, 4), (err) => {
                    if(err) console.log(err);
                });
                await interaction.reply({ content: "刪除頻道", ephemeral: true });
            }
            else {
                await interaction.reply({ content: "頻道未設定", ephemeral: true });
            }
        }
        else if(interaction.options.getSubcommand() === 'acc') {
            const channelID = interaction.options.getString('channel');
            if(!isInList(configFile.probChannels, channelID)) {
                configFile.probChannels.push(channelID);
                fs.writeFileSync('./config.json', JSON.stringify(configFile, null, 4), (err) => {
                    if(err) console.log(err);
                });
                await interaction.reply({ content: "加入頻道", ephemeral: true });
            }
            else {
                await interaction.reply({ content: "頻道已設定", ephemeral: true });
            }
        }
        else if(interaction.options.getSubcommand() === 'rcc') {
            const channelID = interaction.options.getString('channel');
            if(isInList(configFile.probChannels, channelID)) {
                for(let i=0; i<configFile.probChannels.length; i++) {
                    if(configFile.probChannels[i] === channelID) {
                        configFile.probChannels.splice(i, 1);
                    }
                }
                fs.writeFileSync('./config.json', JSON.stringify(configFile, null, 4), (err) => {
                    if(err) console.log(err);
                });
                await interaction.reply({ content: "刪除頻道", ephemeral: true });
            }
            else {
                await interaction.reply({ content: "頻道未設定", ephemeral: true });
            }
        }
        else if(interaction.options.getSubcommand() === 'asn') {
            const subreddit  = interaction.options.getString('subreddit');
            if(logFile.reddit[subreddit]) {
                await interaction.reply({ content: "Subreddit已存在", ephemeral: true });
            }
            else {
                logFile.reddit[subreddit] = {
                    channels: [],
                    temp: {}
                };
                fs.writeFileSync('./log.json', JSON.stringify(logFile, null, 4), (err) => {
                    if(err) console.log(err);
                });
                await interaction.reply({ content: `${subreddit}已加入`, ephemeral: true });
            }
        }
        else if(interaction.options.getSubcommand() === 'dsn') {
            const subreddit  = interaction.options.getString('subreddit');
            if(!logFile.reddit[subreddit]) {
                await interaction.reply({ content: "Subreddit不存在", ephemeral: true });
            }
            else {
                delete logFile.reddit[subreddit];
                fs.writeFileSync('./log.json', JSON.stringify(logFile, null, 4), (err) => {
                    if(err) console.log(err);
                });
                await interaction.reply({ content: `${subreddit}已刪除`, ephemeral: true });
            }
        }
        else if(interaction.options.getSubcommand() === 'arc') {
            const subreddit  = interaction.options.getString('subreddit');
            if(!logFile.reddit[subreddit]) {
                await interaction.reply({ content: "Subreddit不存在", ephemeral: true });
            }
            else {
                if(logFile.reddit[subreddit].channels.includes(interaction.channel.id)) {
                    logFile.reddit[subreddit].channels.push(interaction.channel.id);
                }
                fs.writeFileSync('./log.json', JSON.stringify(logFile, null, 4), (err) => {
                    if(err) console.log(err);
                });
                await interaction.reply({ content: `${subreddit}已加入`, ephemeral: true });
            }
        }
        else if(interaction.options.getSubcommand() === 'drc') {
            const subreddit  = interaction.options.getString('subreddit');
            if(!logFile.reddit[subreddit]) {
                await interaction.reply({ content: "Subreddit不存在", ephemeral: true });
            }
            else {
                for(let i=0; i<logFile.reddit[subreddit].channels.length; i++) {
                    if(logFile.reddit[subreddit].channel[i] === interaction.channel.id) {
                        logFile.reddit[subreddit].channel.splice(i, 1);
                    }
                }
                fs.writeFileSync('./log.json', JSON.stringify(logFile, null, 4), (err) => {
                    if(err) console.log(err);
                });
                await interaction.reply({ content: `${subreddit}已刪除`, ephemeral: true });
            }
        }
    }
    else {
        await interaction.reply({ content: "你沒有權限使用此指令", ephemeral: true });
    }
}

module.exports.data = new SlashCommandBuilder()
    .setName('set')
    .setDescription('Server settings')
    .addSubcommand(sub => sub
        .setName('aec')
        .setDescription('add emoji channel (admin only)')
        .addStringOption(option => option.setName('channel').setDescription('target channel id').setRequired(true)))
    .addSubcommand(sub => sub
        .setName('rec')
        .setDescription('remove emoji channel (admin only)')
        .addStringOption(option => option.setName('channel').setDescription('target channel id').setRequired(true)))
    .addSubcommand(sub => sub
        .setName('acc')
        .setDescription('add chance keyword channel (admin only)')
        .addStringOption(option => option.setName('channel').setDescription('target channel id').setRequired(true)))
    .addSubcommand(sub => sub
        .setName('rcc')
        .setDescription('remove chance keyword channel (admin only)')
        .addStringOption(option => option.setName('channel').setDescription('target channel id').setRequired(true)))
    .addSubcommand(sub => sub
        .setName('asn')
        .setDescription('add subreddit notification')
        .addStringOption(option => option.setName('subreddit').setDescription('subreddit name').setRequired(true)))
    .addSubcommand(sub => sub
        .setName('dsn')
        .setDescription('delete subreddit notification')
        .addStringOption(option => option.setName('subreddit').setDescription('subreddit name').setRequired(true)))
    .addSubcommand(sub => sub
        .setName('arc')
        .setDescription('add reddit channel')
        .addStringOption(option => option.setName('subreddit').setDescription('subreddit name').setRequired(true)))
    .addSubcommand(sub => sub
        .setName('drc')
        .setDescription('delete reddit channel')
        .addStringOption(option => option.setName('subreddit').setDescription('subreddit name').setRequired(true)));

module.exports.run = run;