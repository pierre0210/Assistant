async function detect(msg, configFile, client, userNickname, userAvatar, curchannel) {
    //console.log(msg.content);
    let emoji = msg.content;
    let picList = [];
    if(configFile.emojiChannels.includes(curchannel)) {
        let startIndex = emoji.indexOf(":")+1
        let tmp = emoji.slice(startIndex);
        //console.log(emoji);
        while(tmp.indexOf(":") != -1) {
            let endIndex = tmp.indexOf(":");
            emoji = tmp.slice(0, endIndex);
            tmp = tmp.slice(endIndex+1);
            let pic = client.emojis.cache.find(e => e.name === emoji);
            if(pic) {
                picList.push({ "id": pic.id, "name": pic.name, "animated": pic.animated });
            }
        }
        let picMsg = "";
        for(let i=0; i<picList.length; i++) {
            if(picList[i].animated) {
                picMsg += "<a:"+picList[i].name+":"+picList[i].id+">";
            }
            else {
                picMsg += "<:"+picList[i].name+":"+picList[i].id+">";
            }
        }
        if(!picMsg) return;
        await msg.delete();
        let webhookch = client.channels.cache.get(curchannel);
        const webhooks = await webhookch.fetchWebhooks();
        const webhook = webhooks.first();
        if(!webhook) console.log("No webhook was found!");
        else {
            await webhook.send({
                content: picMsg,
                username: userNickname,
                avatarURL: userAvatar
            });
        }
    }
}

module.exports.detect = detect;