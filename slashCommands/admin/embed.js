const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

async function run(client, interaction) {
    if(interaction.options.getSubcommand() === 'option') {
        const color = interaction.options.getString('color');
        const title = interaction.options.getString('title');
        const url = interaction.options.getString('url');
        const author = interaction.options.getString('author');
        const description = interaction.options.getString('description');
        const thumbnail = interaction.options.getString('thumbnail');
        const fields = interaction.options.getString('fields');
        const image = interaction.options.getString('image');
        const timestamp = interaction.options.getString('timestamp');
        const footer = interaction.options.getString('footer');
        const msgEmbed = new MessageEmbed();
        
        try {
            if(color) {
                msgEmbed.setColor(color);
            }
            if(title) {
                msgEmbed.setTitle(title);
            }
            if(url) {
                msgEmbed.setURL(url);
            }
            if(author) {
                msgEmbed.setAuthor(JSON.parse(author));
            }
            if(description) {
                msgEmbed.setDescription(description);
            }
            if(thumbnail) {
                msgEmbed.setThumbnail(thumbnail);
            }
            if(fields) {
                let obj = JSON.parse(fields);
                for(let i=0; i<obj.length; i++) {
                    msgEmbed.addField(obj[i].name, obj[i].value, obj[i].inline);
                }
            }
            if(image) {
                msgEmbed.setImage(image);
            }
            if(timestamp === 'true') {
                msgEmbed.setTimestamp();
            }
            if(footer) {
                msgEmbed.setFooter(JSON.parse(footer));
            }
            await interaction.reply({ content: "DONE" });
            const msg = await interaction.fetchReply();
            await interaction.deleteReply();
            await msg.channel.send({ embeds:[msgEmbed] })
        }
        catch(err) {
            await interaction.reply({ content: "格式錯誤請檢查後再試", ephemeral: true });
            console.log(err);
        }
    }
    else if(interaction.options.getSubcommand() === 'json') {
        try{
            const msgEmbed = JSON.parse(interaction.options.getString('format'));
            await interaction.reply({ content: "DONE" });
            const msg = await interaction.fetchReply();
            await interaction.deleteReply();
            await msg.channel.send({ embeds:[msgEmbed] })
        }
        catch(err) {
            await interaction.reply({ content: "格式錯誤請檢查後再試", ephemeral: true });
            console.log(err);
        }
    }
}

module.exports.data = new SlashCommandBuilder()
    .setName('embed')
    .setDescription('send embed message')
    .addSubcommand(sub => sub
        .setName('option')
        .setDescription('use option to create embed message')
        .addStringOption(option => option.setName('color').setDescription('format: #RRBBGG'))
        .addStringOption(option => option.setName('title').setDescription('embed title'))
        .addStringOption(option => option.setName('url').setDescription('set url'))
        .addStringOption(option => option.setName('author').setDescription(`format: { "name": "yourname", "iconURL": "iconurl", "url": "url" }`))
        .addStringOption(option => option.setName('description').setDescription('set description'))
        .addStringOption(option => option.setName('thumbnail').setDescription('thumbnail image url'))
        .addStringOption(option => option.setName('fields').setDescription(`format: [{ "name": "field1", "value": "some value", "inline": true or false }, ...]`))
        .addStringOption(option => option.setName('image').setDescription('image url'))
        .addStringOption(option => option.setName('timestamp').setDescription('type true to enable'))
        .addStringOption(option => option.setName('footer').setDescription(`format: { "text": "some text", "iconURL": "imageurl" }`)))
    .addSubcommand(sub => sub
        .setName('json')
        .setDescription('use json format to create embed message')
        .addStringOption(option => option.setName('format').setDescription('json format').setRequired(true)));

module.exports.run = run;