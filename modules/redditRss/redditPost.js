const Parser = require('rss-parser');
const fs = require('fs');
const parser = new Parser();

class redditPost {
    constructor(client) {
        this.client = client;
        this.url = 'https://www.reddit.com/';
    }

    getSubreddit(id) {
        return this.url+'r/'+id+'/.rss';
    }

    async run() {
        let logFile = JSON.parse(fs.readFileSync('./log.json', 'utf-8'));
        for(let [key, item] of Object.entries(logFile.reddit)) {
            const temp = item.temp;
            let newPostList = [];
            let feed = await parser.parseURL(this.getSubreddit(key));
            for(let item of feed.items) {
                let isNewItem = true;
                for(let tmp of temp.items) {
                    if(item.id === tmp.id) {
                        isNewItem = false;
                    }
                }
                if(isNewItem) {
                    newPostList.push(item);
                }
            }
            for(let channel of logFile.reddit[key].channels) {
                await this.client.channels.cache.get(channel).send()
            }
            logFile.reddit[key].temp = feed;
            fs.writeFileSync('./log.json', JSON.stringify(logFile, null, 4), (err) => {
                if(err) console.log(err);
            });
            console.log(feed);
        }
    }
}

module.exports.redditPost = redditPost;