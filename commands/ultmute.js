const mute = require('./../modules/admin/mute.js');

module.exports.run = async (client, msg, userTag, userID, args) => {
    if(args.length === 2 && !isNaN(parseInt(args[1]))) {
        let Mute = new mute.mute(client, msg, args[0], args[1]);
        Mute.addMuteMember(true);
    }
};