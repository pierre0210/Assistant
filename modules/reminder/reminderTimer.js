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

async function checkTask(userID) {
	return await task.findOne({ where: { user_id: userID } }) ? true : false;
}

async function addTask(userID, time, event, channelID) {
	let isUserExist = await checkTask(userID);
	if(!isUserExist) return false;
	await task.create({
		user_id: userID,
		time: time + Date.now(),
		event: event,
		channel_id: channelID
	});
	return true;
}

async function dropTask(userID) {
	let isUserExist = await checkTask(userID);
	if(!isUserExist) return false;
	await task.destroy({ where: { user_id: userID } });
	return true;
}

async function setTimerForAll() {
	const taskList = await task.findAll({ attributes: ['user_id', 'time', 'event', 'channel_id'] });

}

module.exports.timer = timer;
module.exports.addTask = addTask;
module.exports.dropTask = dropTask;