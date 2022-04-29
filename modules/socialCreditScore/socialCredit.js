const Sequelize = require('sequelize');
const fs = require('fs');
const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});
const user = require('./user.js')(sequelize, Sequelize.DataTypes);
const cooldownMember = [];
var wordsFile = JSON.parse(fs.readFileSync("./modules/socialCreditScore/words.json", "utf-8"));

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

async function editUserScore(id, newScore) {
	await user.update({ score: newScore }, { where: { user_id: id } });
}

function cooldown(id) {
	cooldownMember.push(id)
	setTimeout(() => {
		for(let i=0; i<cooldownMember.length; i++) {
			if(cooldownMember[i] === id) {
				cooldownMember.splice(i, 1);
			}
		}
	}, 60*1000);
}

function isInCooldown(id) {
	return cooldownMember.indexOf(id) != -1 ? true : false;
}

function addCensor(word) {
	if(wordsFile.badWords.indexOf(word) === -1) {
		wordsFile.badWords.push(word);
		fs.writeFileSync("./modules/socialCreditScore/words.json", JSON.stringify(wordsFile, null, 4), (err) => {
			if(err) console.log(err);
		});
	}
}

function addGoodWord(word) {
	if(wordsFile.goodWords.indexOf(word) === -1) {
		wordsFile.goodWords.push(word);
		fs.writeFileSync("./modules/socialCreditScore/words.json", JSON.stringify(wordsFile, null, 4), (err) => {
			if(err) console.log(err);
		});
	}
}

function delCensor(word) {
	if(wordsFile.badWords.indexOf(word) != -1) {
		for(let i=0; i<wordsFile.badWords.length; i++) {
			if(wordsFile.badWords[i] === word) {
				wordsFile.badWords.splice(i, 1);
			}
		}
		fs.writeFileSync("./modules/socialCreditScore/words.json", JSON.stringify(wordsFile, null, 4), (err) => {
			if(err) console.log(err);
		});
	}
}

function delGoodWord(word) {
	if(wordsFile.goodWords.indexOf(word) != -1) {
		for(let i=0; i<wordsFile.goodWords.length; i++) {
			if(wordsFile.goodWords[i] === word) {
				wordsFile.goodWords.splice(i, 1);
			}
		}
		fs.writeFileSync("./modules/socialCreditScore/words.json", JSON.stringify(wordsFile, null, 4), (err) => {
			if(err) console.log(err);
		});
	}
}

module.exports.isUserExists = isUserExists;
module.exports.addNewUser = addNewUser;
module.exports.getUser = getUser;
module.exports.editUserScore = editUserScore;
module.exports.cooldown = cooldown;
module.exports.isInCooldown = isInCooldown;
module.exports.addCensor = addCensor;
module.exports.addGoodWord = addGoodWord;
module.exports.delCensor = delCensor;
module.exports.delGoodWord = delGoodWord;