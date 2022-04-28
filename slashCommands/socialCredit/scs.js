const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const SC = require('../../modules/socialCreditScore/socialCredit.js');
const util = require('../../modules/utility.js');
const fs = require('fs');

async function run(client, interaction) {
    const configFile = await JSON.parse(fs.readFileSync("./config.json", "utf8"));
    if(!configFile.nationList.includes(interaction.guild.id)) {
        await interaction.reply("此處並非共和國領土");
    }
    else if(interaction.options.getSubcommand() === 'stats') {
        const userID = interaction.user.id;
        const userName = interaction.user.username;
        if(!await SC.isUserExists(userID)) {
            await SC.addNewUser(userID);
        }
        const info = await SC.getUser(userID);
        //console.log(info);
        const infoEmbed = new MessageEmbed().setColor("#198964")
            .setDescription(`**公民姓名：** ${userName}\n**公民身分字號：** ${info.user_id}\n**社會信用積分：** ${info.score}`);
        await interaction.reply({ embeds:[infoEmbed] });
    }
    else if(interaction.options.getSubcommand() === 'user') {
        const user = interaction.options.getUser('target');
        if(!await SC.isUserExists(user.id)) {
            await interaction.reply(`404此人可能為境外勢力或國內一小搓分裂份子`);
        }
        else {
            const info = await SC.getUser(user.id);
            const infoEmbed = new MessageEmbed().setColor("#198964")
                .setDescription(`**公民姓名：** ${user.username}\n**公民身分字號：** ${info.user_id}\n**社會信用積分：** ${info.score}`);
            await interaction.reply({ embeds:[infoEmbed] });
        }
    }
    else if(interaction.options.getSubcommand() === 'add') {
        if(interaction.user.id === configFile.botOwner) {
            const user = interaction.options.getUser('target');
            const score = interaction.options.getInteger('score');
            if(await SC.isUserExists(user.id)) {
                const info = await SC.getUser(user.id);
                await SC.editUserScore(user.id, info.score+score);
                await interaction.reply(`<@${user.id}> **+${score} social credit!**`);
            }
            else {
                await interaction.reply({ content: "不存在此公民", ephemeral: true });
            }
        }
        else {
            await interaction.reply({ content: "你沒有權限使用此指令", ephemeral: true });
        }
    }
    else if(interaction.options.getSubcommand() === 'minus') {
        if(interaction.user.id === configFile.botOwner) {
            const user = interaction.options.getUser('target');
            const score = interaction.options.getInteger('score');
            if(await SC.isUserExists(user.id)) {
                const info = await SC.getUser(user.id);
                await SC.editUserScore(user.id, info.score-score);
                await interaction.reply(`<@${user.id}> **-${score} social credit!**`);
            }
            else {
                await interaction.reply({ content: "不存在此公民", ephemeral: true });
            }
        }
        else {
            await interaction.reply({ content: "你沒有權限使用此指令", ephemeral: true });
        }
    }
}

module.exports.data = new SlashCommandBuilder()
    .setName('scs')
    .setDescription('Social credit score system')
    .addSubcommand(sub => sub
        .setName('stats')
        .setDescription('check your current social credit score'))
    .addSubcommand(sub => sub
        .setName('user')
        .setDescription('social credit score of a user')
        .addUserOption(option => option.setName('target').setDescription('target user').setRequired(true)))
    .addSubcommand(sub => sub
        .setName('add')
        .setDescription('add social credit score (admin only)')
        .addUserOption(option => option.setName('target').setDescription('target user').setRequired(true))
        .addIntegerOption(option => option.setName('score').setDescription('social credit score').setRequired(true)))
    .addSubcommand(sub => sub
        .setName('minus')
        .setDescription('minus social credit score (admin only)')
        .addUserOption(option => option.setName('target').setDescription('target user').setRequired(true))
        .addIntegerOption(option => option.setName('score').setDescription('social credit score').setRequired(true)));

module.exports.run = run;