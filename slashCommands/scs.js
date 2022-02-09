const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const SC = require('./../modules/socialCreditScore/socialCredit.js');
const util = require('./../modules/utility.js');

async function run(client, interaction) {
    if(interaction.options.getSubcommand() === 'stats') {
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
}

module.exports.data = new SlashCommandBuilder()
    .setName('scs')
    .setDescription('Social credit score system')
    .addSubcommand(sub => sub
        .setName('stats')
        .setDescription('check your current social credit score (蒼主席的點子不甘我的事)'))
    .addSubcommand(sub => sub
        .setName('user')
        .setDescription('social credit score of a user (蒼主席的點子不甘我的事)')
        .addUserOption(option => option.setName('target').setDescription('target user').setRequired(true)));

module.exports.run = run;