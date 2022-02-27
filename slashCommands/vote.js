const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const fs = require('fs');
var logFile = JSON.parse(fs.readFileSync('./log.json', 'utf-8'));

async function run(client, interaction) {
    const optionList = interaction.options.getString('options').split(" ");
    //console.log(optionList);
    if(!logFile.poll[interaction.guild.id]) {
        await interaction.reply({ content: "此伺服器沒有投票正在進行", ephemeral: true });
    }
    else if(optionList.length > logFile.poll[interaction.guild.id].max || optionList.length < logFile.poll[interaction.guild.id].min) {
        await interaction.reply({ content: "選項數目錯誤", ephemeral: true });
    }
    else {
        const findSameElement = arr => arr.filter((element, index) => arr.indexOf(element) != index);
        const sameList = findSameElement(optionList);
        //console.log(sameList);
        for(let option of sameList) {
            //console.log(":1");
            if(logFile.poll[interaction.guild.id][option]) {
                logFile.poll[interaction.guild.id][option].score++;
                logFile.poll[interaction.guild.id][option].memberList.push(interaction.user.tag);
            }
        }
        for(let option of optionList) {
            //console.log(option);
            //console.log(logFile.poll[interaction.guild.id][option]);
            if(!sameList.includes(option)) {
                logFile.poll[interaction.guild.id][option].score++;
                logFile.poll[interaction.guild.id][option].memberList.push(interaction.user.tag);
            }
        }
        fs.writeFileSync('./log.json', JSON.stringify(logFile, null, 4), (err) => {
            if(err) console.log(err);
        });
        await interaction.reply({ content: "完成", ephemeral: true });
    }
}

module.exports.data = new SlashCommandBuilder()
    .setName('vote')
    .setDescription('Vote command')
    .addStringOption(option => option.setName('options').setDescription('格式：投票選項以空格隔開').setRequired(true));

module.exports.run = run;