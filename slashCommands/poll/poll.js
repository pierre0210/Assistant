const { SlashCommandBuilder } = require('@discordjs/builders');
//const { MessageActionRow, MessageSelectMenu } = require('discord.js');
const fs = require('fs');
const configFile = JSON.parse(fs.readFileSync('./config.json', 'utf-8'));
var logFile = JSON.parse(fs.readFileSync('./log.json', 'utf-8'));

async function run(client, interaction) {
	if(interaction.user.id === configFile.botOwner) {
		if(interaction.options.getSubcommand() === 'start') {
			const title = interaction.options.getString('title');
			const minNum = interaction.options.getInteger('min');
			const maxNum = interaction.options.getInteger('max');
			const options = interaction.options.getString('options').split(" ");
			
			var obj = {
				title: title,
				min: minNum,
				max: maxNum,
				voterList: []
			};
			for(let op of options) {
				obj[op] = {
					score: 0,
					memberList: []
				};
			}
			logFile.poll[interaction.guild.id] = obj
			fs.writeFileSync('./log.json', JSON.stringify(logFile, null, 4), (err) => {
				if(err) console.log(err);
			});
			await interaction.reply({ content: "設定完成", ephemeral: true });
		}
		else if(interaction.options.getSubcommand() === 'stop') {
			if(!logFile.poll[interaction.guild.id]) {
				await interaction.reply({ content: "投票不存在", ephemeral: true });
			}
			else {
				delete logFile.poll[interaction.guild.id];
				fs.writeFileSync('./log.json', JSON.stringify(logFile, null, 4), (err) => {
					if(err) console.log(err);
				});
				await interaction.reply({ content: "已刪除", ephemeral: true });
			}
		}
	}
	else {
		await interaction.reply({ content: "你沒有權限使用此指令", ephemeral: true });
	}
}

module.exports.data = new SlashCommandBuilder()
	.setName('poll')
	.setDescription('Create & end a poll (admin only')
	.addSubcommand(sub => sub.setName('start').setDescription('start a poll')
		.addStringOption(option => option.setName('title').setDescription('title of the poll').setRequired(true))
		.addIntegerOption(option => option.setName('min').setDescription('min selected number').setRequired(true))
		.addIntegerOption(option => option.setName('max').setDescription('mac selected number').setRequired(true))
		.addStringOption(option => option.setName('options').setDescription('format: option1 option2 ...').setRequired(true)))
	.addSubcommand(sub => sub.setName('stop').setDescription('stop the poll'));

module.exports.run = run;