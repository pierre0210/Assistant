const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const fs = require('fs');
var configFile = JSON.parse(fs.readFileSync('./config.json', 'utf-8'));

function isInList(list, element) {
    for(let i=0; i<list.length; i++) {
        if(list[i] === element) {
            return true;
        }
    }
    return false;
}

async function run(client, interaction) {
    if(interaction.options.getSubcommand() === 'aec') {
        const channelID = interaction.options.getString('channel');
        if(!isInList(configFile.emojiChannels, channelID)) {
            configFile.emojiChannels.push(channelID);
            fs.writeFileSync('./../config.json', JSON.stringify(configFile), (err) => {
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
            fs.writeFileSync('./../config.json', JSON.stringify(configFile), (err) => {
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
            fs.writeFileSync('./../config.json', JSON.stringify(configFile), (err) => {
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
            fs.writeFileSync('./../config.json', JSON.stringify(configFile), (err) => {
                if(err) console.log(err);
            });
            await interaction.reply({ content: "刪除頻道", ephemeral: true });
        }
        else {
            await interaction.reply({ content: "頻道未設定", ephemeral: true });
        }
    }
}

module.exports.data = new SlashCommandBuilder()
    .setName('set')
    .setDescription('Server settings')
    .addSubcommand(sub => sub
        .setName('aec')
        .setDescription('add emoji channel')
        .addStringOption(option => option.setName('channel').setDescription('target channel id').setRequired(true)))
    .addSubcommand(sub => sub
        .setName('rec')
        .setDescription('remove emoji channel')
        .addStringOption(option => option.setName('channel').setDescription('target channel id').setRequired(true)))
    .addSubcommand(sub => sub
        .setName('acc')
        .setDescription('add chance keyword channel')
        .addStringOption(option => option.setName('channel').setDescription('target channel id').setRequired(true)))
    .addSubcommand(sub => sub
        .setName('rcc')
        .setDescription('remove chance keyword channel')
        .addStringOption(option => option.setName('channel').setDescription('target channel id').setRequired(true)));

module.exports.run = run;