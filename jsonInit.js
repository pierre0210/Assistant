const fs = require('fs');

const configjson = {
    "muteRole":"",
    "channels":[]
}
const wordsjson = {
    "badWords": [],
    "goodWords": []
}

fs.writeFileSync('config.json', JSON.stringify(configjson), function(err) {
    if(err) console.log(err);
    console.log("config.json created!");
});

fs.writeFileSync('./modules/socialCreditScore/words.json', JSON.stringify(wordsjson), function(err) {
    if(err) console.log(err);
    console.log("word.json created!");
});