const { Client, Intents, MessageButton, MessageActionRow, MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const wait = require('util').promisify(setTimeout);

async function run(interaction) {
    const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId("dontclick")
                .setLabel("BUTTON")
                .setStyle("PRIMARY")
        );
    await interaction.reply({ content: "**DON'T CLICK THE BUTTON**", components: [row] });
    //await wait(2000);
    //await interaction.deleteReply();
}

module.exports.data = new SlashCommandBuilder()
    .setName('button')
    .setDescription("DON'T CLICK THE BUTTON");

module.exports.run = run;