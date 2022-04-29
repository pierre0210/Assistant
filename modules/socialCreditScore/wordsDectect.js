const SC = require('./socialCredit.js');

async function detect(msg, userID, wordsFile) {
	let count = 0;
	const scorePerCount = 100;
	for(const word of wordsFile.badWords) {
		if(msg.content.includes(word)) {
			count++;
		}
	}
	if(!SC.isInCooldown(userID)) {
		for(const word of wordsFile.goodWords) {
			if(msg.content.includes(word)) {
				count--;
				SC.cooldown(userID);
				break;
			}
		}
	}
	let user = await SC.getUser(userID);
	if(user) {
		let score = user.score;
		let newScore = score-count*scorePerCount;
		if(newScore <= 0) {
			newScore = 0;
			await msg.reply("**此人為共和國劣等公民!\n處決日期：明天黎明**");
		}
		await SC.editUserScore(userID, newScore);
	}
}

module.exports.detect = detect;