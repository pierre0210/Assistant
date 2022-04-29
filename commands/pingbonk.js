const troll = require('./../modules/admin/troll.js');

module.exports.run = async (client, msg, userTag, userID, args) => {
	if(args.length >= 2 && !isNaN(parseInt(args[args.length-1]))) {
		let pack = "";
		for(let i=0; i<args.length-1; i++) {
			pack += args[i] + " ";
		}
		let Troll = new troll.troll(msg, pack, parseInt(args[args.length-1]));
		Troll.pingbonk();
	}
};