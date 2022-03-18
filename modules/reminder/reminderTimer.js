const Sequelize = require('sequelize');
const { MessageEmbed } = require('discord.js');
const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});
const task = require('./task.js')(sequelize, Sequelize.DataTypes);

function timer(client, channelID, userid, event, time) {
    setTimeout(() => {
        const infoEmbed = new MessageEmbed().setColor("#198964")
            .setTitle(`${event}`);
        //console.log(msg);
        client.channels.cache.get(channelID).send({ content: "<@"+userid+">", embeds: [infoEmbed]});
    }, time*1000);
}

function addTask(userID) {
    
}

function dropTask(userID) {

}

module.exports.timer = timer;