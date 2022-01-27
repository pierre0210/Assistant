function getRandomNum(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function getUserFromMention(mention) {
	if (!mention) return;

	if (mention.startsWith('<@') && mention.endsWith('>')) {
		mention = mention.slice(2, -1);

		if (mention.startsWith('!')) {
			mention = mention.slice(1);
		}

		return client.users.cache.get(mention);
	}
}

module.exports.getRandomNum = getRandomNum;
module.exports.getUserFromMention = getUserFromMention;