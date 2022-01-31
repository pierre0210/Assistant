const fs = require('fs');

const configjson = {
    "muteRole": "",
    "channels": []
}
const wordsjson = {
    "badWords": [],
    "goodWords": []
}
const blacklistjson = {
    "members": []
}

fs.writeFileSync('config.json', JSON.stringify(configjson, null, 4), function(err) {
    if(err) console.log(err);
    console.log("config.json created!");
});

fs.writeFileSync('./modules/socialCreditScore/words.json', JSON.stringify(wordsjson, null, 4), function(err) {
    if(err) console.log(err);
    console.log("word.json created!");
});

fs.writeFileSync('blackList.json', JSON.stringify(blacklistjson, null, 4), function(err) {
    if(err) console.log(err);
    console.log("blackList.json created!");
});