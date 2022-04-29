const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, Client, Intents } = require('discord.js');
const RT = require('../../modules/reminder/reminderTimer.js');

/*
function timer(msg, userid, event, time) {
	setTimeout(() => {
		const infoEmbed = new MessageEmbed().setColor("#198964")
			.setTitle(`${event}`);
		//console.log(msg);
		msg.channel.send({ content: "<@"+userid+">", embeds: [infoEmbed]});
	}, time*1000);
}
*/
async function run(client, interaction) {
	const userName = interaction.user.username;
	const userID = interaction.user.id;

	const timeStr = interaction.options.getString('time');
	const eventMsg = interaction.options.getString('event');
	let hour = 0;
	let min = 0;
	let sec = 0;

	let tmp1 = timeStr.split('h');
	let tmp2 = [];
	let tmp3 = [];
	if(tmp1.length === 2) {
		hour = parseInt(tmp1[0]);
		tmp2 = tmp1[1].split('m');
	}
	else if(tmp1.length === 1) {
		tmp2 = tmp1[0].split('m');
	}
	if(tmp2.length === 2) {
		min = parseInt(tmp2[0]);
		tmp3 = tmp2[1].split('s');
	}
	else if(tmp2.length === 1) {
		tmp3 = tmp2[0].split('s');
	}
	if(tmp3.length === 2) {
		sec = parseInt(tmp3[0]);
	}
	//console.log(hour+":"+min+":"+sec);
	const total = hour*60*60+min*60+sec;
	if(total != 0) {
		const infoEmbed = new MessageEmbed().setColor("#198964")
			.setDescription(`Remind **${userName}** about **${eventMsg}** in **${timeStr}**`);
		await interaction.reply({ embeds:[infoEmbed] });
		const message = await interaction.fetchReply();
		RT.timer(client, interaction.channel.id, userID, eventMsg, total);
	}
	else {
		const infoEmbed = new MessageEmbed().setColor("#198964")
			.setDescription("Something went wrong please check your command!");
		await interaction.reply({ embeds:[infoEmbed] });
	}
}

module.exports.data = new SlashCommandBuilder()
	.setName('reminder')
	.setDescription('It will remind you about something')
	.addStringOption(option => option.setName('time').setDescription('formate: 00h00m00s').setRequired(true))
	.addStringOption(option => option.setName('event').setDescription('things you are too stupid to remember').setRequired(true));

module.exports.run = run;