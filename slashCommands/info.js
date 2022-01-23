const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

async function run(interaction) {
    if(interaction.options.getSubcommand() === 'user') {
        const user = interaction.options.getUser('target');
        const infoEmbed = new MessageEmbed().setColor("#198964")
            .setDescription(`**User name:** ${user.username}\n**User id:** ${user.id}`);
        await interaction.reply({ embeds:[infoEmbed] });
    }
    else if(interaction.options.getSubcommand() === 'server') {
        const infoEmbed = new MessageEmbed().setColor("#198964")
            .setDescription(`**Server name:** ${interaction.guild.name}\n**Total members:** ${interaction.guild.memberCount}`);
        await interaction.reply({ embeds:[infoEmbed] });
    }
}

module.exports.data = new SlashCommandBuilder()
    .setName('info')
    .setDescription('Server & user information')
    .addSubcommand(sub => sub
        .setName('user')
        .setDescription('info about a user')
        .addUserOption(option => option.setName('target').setDescription('target user')))
    .addSubcommand(sub => sub
        .setName('server')
        .setDescription('info about the server'));

module.exports.run = run;