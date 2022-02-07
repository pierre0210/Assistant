const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
//const request = require('request');
const axios = require('axios');
require('dotenv').config();

async function run(interaction) {
    const countyName = interaction.options.getString('county');
    const apiUrl = `https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=${process.env.WEATHER_KEY}`;
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
        const obj = data;
        const list = obj.records.location;
        //console.log(list);
        let targetRegion = {};
        for(let place of list) {
            //console.log(place);
            if(place.locationName === countyName) {
                targetRegion = place;
                break;
            }
        }
        //console.log(regionList);
        if(targetRegion === {}) {
            interaction.reply('請檢查城市名稱是否正確(正體簡體亦會有影響)');
        }
        else if(!targetRegion.weatherElement) {
            interaction.reply('無法預期之錯誤');
        }
        else {
            const infoEmbed = new MessageEmbed().setColor('#198964')
                .setTitle(`${countyName} 36小時天氣預報`)
            for(let i=0; i<3; i++) { //36hr/12hr = 3
                let info = "";
                for(let j=0; j<targetRegion.weatherElement.length; j++) {
                    if(targetRegion.weatherElement[j].elementName === 'PoP') {
                        info += "降雨機率："+targetRegion.weatherElement[j].time[i].parameter.parameterName+" %\n";
                    }
                    else if(targetRegion.weatherElement[j].elementName === 'MinT') {
                        info += "最低溫度："+targetRegion.weatherElement[j].time[i].parameter.parameterName+" °C\n";
                    }
                    else if(targetRegion.weatherElement[j].elementName === 'MaxT') {
                        info += "最高溫度："+targetRegion.weatherElement[j].time[i].parameter.parameterName+" °C\n";
                    }
                    else {
                        info += targetRegion.weatherElement[j].time[i].parameter.parameterName+"\n";
                    }
                }
                infoEmbed.addField(
                    `${targetRegion.weatherElement[0].time[i].startTime}~${targetRegion.weatherElement[0].time[i].endTime}`,
                    info,
                    true
                );
            }
            //infoEmbed.setFooter(`資料發布時間：${regionList[0].PublishTime}`);
            interaction.reply({ embeds:[infoEmbed] });
        }
    });
}

module.exports.data = new SlashCommandBuilder()
    .setName('weather')
    .setDescription('Weather forecast')
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