const Sequelize = require('sequelize');
const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});
const user = require('./user.js')(sequelize, Sequelize.DataTypes);

async function isUserExists(id) {
	const mem = await user.findOne({ where: { user_id: id } });
	return mem ? true : false;
}

async function addNewUser(id) {
    return await user.create({
		user_id: id,
		score: 1000
	});
}

async function getUser(id) {
	return await user.findOne({ where: { user_id: id } });
}

module.exports.isUserExists = isUserExists;
module.exports.addNewUser = addNewUser;
module.exports.getUser = getUser;