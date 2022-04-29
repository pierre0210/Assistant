const Discord = require('discord.js');

module.exports.run = async (client, msg, userTag, userID, args) => {
	const embed = new Discord.MessageEmbed().setColor("#198964").setDescription("**Hewwo "+userTag+"**");
	await msg.channel.send({embeds:[embed]});
};