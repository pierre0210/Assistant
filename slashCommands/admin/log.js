const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { joinVoiceChannel, VoiceReceiver, entersState, VoiceConnectionStatus } = require('@discordjs/voice');
const Voice = require('@discordjs/voice');
const { createListeningStream } = require('../../modules/audio/createStream.js');
const fs = require('fs');

async function run(client, interaction) {
	var configFile = JSON.parse(fs.readFileSync('./config.json', 'utf-8'));
	if(interaction.user.id === configFile.botOwner || interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
		if(interaction.options.getSubcommand() === 'audio') {
			if(client.voiceConn) {
				await interaction.reply('已有監聽進行中');
				return;
			}
			await interaction.deferReply();
			const channel = interaction.options.getChannel('channel').id;
			const user = interaction.options.getUser('user');
			const connection = joinVoiceChannel({
				channelId: channel,
				guildId: interaction.guild.id,
				selfDeaf: false,
				selfMute: false,
				adapterCreator: interaction.member.voice.channel.guild.voiceAdapterCreator,
			});
			client.voiceConn = connection;
			client.logChannel = channel;
			await entersState(connection, VoiceConnectionStatus.Ready, 20e3);
			//console.log(new Voice.SpeakingMap().users);
			/*
			if (connection.receiver.speaking.users.has(user.id)) {
				createListeningStream(connection.receiver, user.id);
			}
			*/
			//new VoiceReceiver().subscribe()
			connection.receiver.speaking.once('start', (userid) => {
				createListeningStream(connection.receiver, user);
			});
			
			await interaction.followUp({ content: `監聽 <#${channel}> 中` });
		}
		else if(interaction.options.getSubcommand() === 'leave') {
			if(client.voiceConn) {
				await interaction.deferReply();
				await client.voiceConn.destroy();
				//client.voiceConn.on('error', () => {});
				await interaction.followUp(`停止監聽 <#${client.logChannel}>`);
				delete client.voiceConn;
				delete client.logChannel;
			}
			else {
				await interaction.reply("沒有監聽進行中");
			}
		}
	}
	else {
		await interaction.reply({ content: "你沒有權限使用此指令", ephemeral: true });
	}
}

module.exports.data = new SlashCommandBuilder()
	.setName('log')
	.setDescription('Logging system')
	.addSubcommand(sub => sub
		.setName('audio')
		.setDescription('save conversation (admin only)')
		.addChannelOption(option => option.setName('channel').setDescription('target channel').setRequired(true))
		.addUserOption(option => option.setName('user').setDescription('target user').setRequired(true)))
	.addSubcommand(sub => sub
		.setName('leave')
		.setDescription('disconnect from voice channel'));

module.exports.run = run;