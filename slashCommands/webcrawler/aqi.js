const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
//const request = require('request');
const axios = require('axios');
require('dotenv').config();

async function run(client, interaction) {
    const countyName = interaction.options.getString('county');
    const apiUrl = `https://data.epa.gov.tw/api/v1/aqx_p_432?limit=1000&api_key=${process.env.AQI_KEY}&sort=ImportDate%20desc&format=json`;
    /*
    const options = {
        method: 'GET',
        url: apiUrl
    };
    */
    axios.get(apiUrl).then(({ data }) => {
        if(!data) {
            interaction.reply('unexpected error! please try again later!');
            return;
        }
        //console.log(data);
        const obj = data;
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
			infoEmbed.setFooter({ text: `資料發布時間：${regionList[0].PublishTime}` });
            //infoEmbed.setFooter(`資料發布時間：${regionList[0].PublishTime}`);
            interaction.reply({ embeds:[infoEmbed] });
        }
    });
}

module.exports.data = new SlashCommandBuilder()
    .setName('aqi')
    .setDescription('Air quality')
    .addStringOption(option => option.setName('county').setDescription('e.g. OO市 or XX縣').setRequired(true)
        .addChoice("臺北市", "臺北市")
        .addChoice("新北市", "新北市")
        .addChoice("桃園市", "桃園市")
        .addChoice("臺中市", "臺中市")
        .addChoice("臺南市", "臺南市")
        .addChoice("高雄市", "高雄市")
        .addChoice("新竹縣", "新竹縣")
        .addChoice("苗栗縣", "苗栗縣")
        .addChoice("彰化縣", "彰化縣")
        .addChoice("南投縣", "南投縣")
        .addChoice("雲林縣", "雲林縣")
        .addChoice("嘉義縣", "嘉義縣")
        .addChoice("屏東縣", "屏東縣")
        .addChoice("宜蘭縣", "宜蘭縣")
        .addChoice("花蓮縣", "花蓮縣")
        .addChoice("臺東縣", "臺東縣")
        .addChoice("澎湖縣", "澎湖縣")
        .addChoice("金門縣", "金門縣")
        .addChoice("連江縣", "連江縣")
        .addChoice("基隆市", "基隆市")
        .addChoice("新竹市", "新竹市")
        .addChoice("嘉義市", "嘉義市"));

module.exports.run = run;