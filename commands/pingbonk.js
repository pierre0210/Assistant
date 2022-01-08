const troll = require('./../modules/troll.js');

module.exports.run = async (client, msg, userTag, userID, args) => {
    if(args.length === 2 && !isNaN(parseInt(args[1]))) {
        let Troll = new troll.troll(msg, args[0], parseInt(args[1]));
        Troll.pingbonk();
    }
};