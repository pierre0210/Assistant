const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

async function run(client, interaction) {
    try {
        const wsEmbed = new MessageEmbed().setColor("#198964")
            .setDescription(`**Interaction latency:** ${Date.now() - interaction.createdTimestamp} ms\n**Websocket latency:** ${client.ws.ping} ms`);
        await interaction.reply({ embeds: [wsEmbed] });
    } catch(err) {
        console.log(err);
    }

}

module.exports.data = new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Interaction latency & websocket latency')

module.exports.run = run;