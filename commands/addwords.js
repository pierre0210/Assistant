const SC = require('./../modules/socialCreditScore/socialCredit.js');

module.exports.run = async (client, msg, userTag, userID, args) => {
	if(args[0] === "good") {
		for(let i=1; i<args.length; i++) {
			SC.addGoodWord(args[i]);
		}
	}
	else if(args[0] === "bad") {
		for(let i=1; i<args.length; i++) {
			SC.addCensor(args[i]);
		}
	}
	await msg.delete();
}