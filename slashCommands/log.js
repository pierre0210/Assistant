const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { joinVoiceChannel, VoiceReceiver, entersState, VoiceConnectionStatus } = require('@discordjs/voice');
const Voice = require('@discordjs/voice');
const { createListeningStream } = require('./../modules/audio/createStream.js');
const fs = require('fs');

async function run(client, interaction) {
    var configFile = JSON.parse(fs.readFileSync('./config.json', 'utf-8'));
    if(interaction.user.id === configFile.botOwner || interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
        if(interaction.options.getSubcommand() === 'audio') {
            await interaction.deferReply();
            const channel = interaction.options.getString('channel');
            const user = interaction.options.getUser('user');
            const connection = joinVoiceChannel({
                channelId: channel,
                guildId: interaction.guild.id,
                selfDeaf: false,
                selfMute: false,
                adapterCreator: interaction.member.voice.channel.guild.voiceAdapterCreator,
            });
            await entersState(connection, VoiceConnectionStatus.Ready, 20e3);
            //console.log(new Voice.SpeakingMap().users);
            /*
            if (connection.receiver.speaking.users.has(user.id)) {
                createListeningStream(connection.receiver, user.id);
            }
            */
            //new VoiceReceiver().subscribe()
            connection.receiver.speaking.on('start', (userid) => {
                createListeningStream(connection.receiver, user);
            });
            
            await interaction.followUp({ content: `Listening to ${channel}`, ephemeral: true });
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
        .addStringOption(option => option.setName('channel').setDescription('target channel').setRequired(true))
        .addUserOption(option => option.setName('user').setDescription('target user').setRequired(true)));

module.exports.run = run;