const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

async function run(interaction) {
    const infoEmbed = new MessageEmbed().setColor("#198964")
        .setDescription(`**Server name:** ${interaction.guild.name}\n**Total members:** ${interaction.guild.memberCount}`);
    if(interaction.user.id === "818815468349030420") {
        interaction.reply({ embeds:[infoEmbed] });
    }
    else {
        interaction.reply({ content: "lol there's nothing for u", ephemeral: true });
    }
}

module.exports.data = new SlashCommandBuilder()
    .setName('info')
    .setDescription('Server information');

module.exports.run = run;