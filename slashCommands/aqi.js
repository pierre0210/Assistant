const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const request = require('request');
require('dotenv').config();

async function run(interaction) {
    const countyName = interaction.options.getString('county');
    const apiUrl = `https://data.epa.gov.tw/api/v1/aqx_p_432?limit=1000&api_key=${process.env.AQI_KEY}&sort=ImportDate%20desc&format=json`
    const options = {
        method: 'GET',
        url: apiUrl
    };
    if(countyName === null) {
        await interaction.reply('Wrong format!');
        return;
    }
    request(options, (err, response, body) => {
        if(err) return;
        else if(!body) {
            interaction.reply('unexpected error! please try again later!');
            return;
        }
        const obj = JSON.parse(body);
        const list = obj.records;
        //console.log(list);
        let regionList = [];
        for(let place of list) {
            //console.log(place);
            if(place.County === countyName) {
                regionList.push(place);
            }
        }
        //console.log(regionList);
        if(regionList.length === 0) {
            interaction.reply('請檢查城市名稱是否正確(正體簡體亦會有影響)');
        }
        else {
            const infoEmbed = new MessageEmbed().setColor('#198964')
                .setTitle(`${countyName} 空氣品質概況`)
            for(let i=0; i<regionList.length; i++) {
                infoEmbed.addField(
                    regionList[i].SiteName,
                    `AQI: ${regionList[i].AQI}\n狀態: ${regionList[i].Status}\nPM2.5: ${regionList[i]["PM2.5"]} (μg/m3)`,
                    true
                );
            }
            infoEmbed.setFooter(`資料發布時間：${regionList[0].PublishTime}`);
            interaction.reply({ embeds:[infoEmbed] });
        }
    });
}

module.exports.data = new SlashCommandBuilder()
    .setName('aqi')
    .setDescription('Air quality')
    .addStringOption(option => option.setName('county').setDescription('e.g. OO市 or XX縣'));

module.exports.run = run;