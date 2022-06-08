const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const fs = require('fs');

async function run(client, msg, userAvatar, userNickname) {
	const configFile = require('./../../config.json');
	const tarChannel = configFile.translationList[msg.channel.id];
	const translation = msg.content;
	const embed = new MessageEmbed().setColor('#1000ff').setTitle('即時翻譯')
		.setAuthor({ name: userNickname, iconURL: userAvatar, url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' })
		.setDescription(translation)
		.setTimestamp();

	await client.channels.cache.get(tarChannel).send({ embeds: [embed] });
	//await msg.reply({ content: '完成', ephemeral: true });
}

module.exports.run = run;