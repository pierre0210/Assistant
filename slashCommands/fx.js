const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const request = require('request');
const cheerio = require('cheerio');

async function run(interaction) {
    const url = "https://rate.bot.com.tw/xrt?Lang=zh-TW";
    const amount = interaction.options.getNumber("amount");
    const currencyOption = interaction.options.getString("currency");
    const mode = interaction.options.getString("mode");
    const options = {
        method: 'GET',
        url: url
    };

    request(options, (err, response, body) => {
        if(err) return;
        else if(!body) {
            interaction.reply('網路錯誤，請稍後再試!');
            return;
        }
        const $ = cheerio.load(body);
        const currencyName = $(".hidden-phone.print_show");
        const cash = $(".rate-content-cash.text-right.print_hide");
        const sight = $(".rate-content-sight.text-right.print_hide");
        
        for(var i=0; i<currencyName.length; i++) {
            if(currencyName[i].children[0].data.indexOf(currencyOption) != -1) {
                break;
            }
        }
        let buy = Number(sight[i*2].children[0].data);
        let sell = Number(sight[i*2+1].children[0].data);
        if(isNaN(buy)) buy = Number(cash[i*2].children[0].data);
        if(isNaN(sell)) sell = Number(cash[i*2+1].children[0].data);
        //console.log(buy+" "+sell);
        if(mode === "from") {
            let result = (amount*buy).toFixed(2);
            interaction.reply(`**${currencyOption} ${amount} = NTD ${result}**`);
        }
        else if(mode === "to") {
            let result = (amount/sell).toFixed(2);
            interaction.reply(`**NTD ${amount} = ${currencyOption} ${result}**`);
        }
    });
}

module.exports.data = new SlashCommandBuilder()
    .setName('fx')
    .setDescription('foreign exchange')
    .addNumberOption(option => option.setName("amount").setDescription("amount of money").setRequired(true))
    .addStringOption(option => option.setName("mode").setDescription("from or to").setRequired(true)
        .addChoice("FROM", "from")
        .addChoice("TO", "to"))
    .addStringOption(option => option.setName("currency").setDescription("type of currency").setRequired(true)
        .addChoice("USD", "USD")
        .addChoice("HKD", "HKD")
        .addChoice("GBP", "GBP")
        .addChoice("AUD", "AUD")
        .addChoice("CAD", "CAD")
        .addChoice("SGD", "SGD")
        .addChoice("CHF", "CHF")
        .addChoice("JPY", "JPY")
        .addChoice("ZAR", "ZAR")
        .addChoice("SEK", "SEK")
        .addChoice("NZD", "NZD")
        .addChoice("THB", "THB")
        .addChoice("PHP", "PHP")
        .addChoice("IDR", "IDR")
        .addChoice("EUR", "EUR")
        .addChoice("KRW", "KRW")
        .addChoice("VND", "VND")
        .addChoice("MYR", "MYR")
        .addChoice("CNY", "CNY"));
        

module.exports.run = run;