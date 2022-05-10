const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
//const request = require('request');
const axios = require('axios');
const cheerio = require('cheerio');

async function run(client, interaction) {
	const keyword = interaction.options.getString('keyword').split(' ').join('%20');
	const url = `https://www.urbandictionary.com/define.php?term=${keyword}`;
	const embed = new MessageEmbed().setColor('#03fcdb');

	await interaction.deferReply();

	axios.get(url).then(async ({ data }) => {
		const $ = cheerio.load(data);
		const title = $(".definition.bg-white.mb-4.shadow-light > .p-5 > .mb-8.flex > h1 > a");
		const definition = $(".definition.bg-white.mb-4.shadow-light > .p-5 > .meaning.mb-4");
		const example = $(".definition.bg-white.mb-4.shadow-light > .p-5 > .example.italic.mb-4");
		const author = $(".definition.bg-white.mb-4.shadow-light > .p-5 > .contributor.font-bold > a");

		definition.find('br').replaceWith('\n');
		example.find('br').replaceWith('\n');

		embed.setTitle(title.first().text())
			.setURL(url)
			.setAuthor({ name: author.first().text(), url: `https://www.urbandictionary.com${author.first().attr("href")}` })
			.setDescription(definition.first().text().length > 4096 ? definition.first().text().substring(0, 4093)+'...' : definition.first().text())
			.addField('Example: ', example.first().text().length > 1024 ? example.first().text().substring(0, 1021)+'...' : example.first().text());
		
		await interaction.followUp({ embeds: [embed] });
	})
	.catch(async (err) => {
		await interaction.followUp('錯誤! 無此單字\n或請稍後再試');
		return;
	});
}

module.exports.data = new SlashCommandBuilder()
	.setName('urban')
	.setDescription('Urban dictionary')
	.addStringOption(option => option.setName('keyword').setDescription('關鍵詞').setRequired(true));

module.exports.run = run;