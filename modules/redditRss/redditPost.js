const Parser = require('rss-parser');
const { MessageEmbed } = require('discord.js');
const fs = require('fs');
const cheerio = require('cheerio');
const parser = new Parser();

class redditPost {
    constructor(client) {
        this.client = client;
        this.url = 'https://www.reddit.com';
    }

    getSubreddit(id) {
        return this.url+'/r/'+id+'/.rss';
    }

    async run() {
        let logFile = JSON.parse(fs.readFileSync('./log.json', 'utf-8'));
        for(let [key, item] of Object.entries(logFile.reddit)) {
            const temp = item.temp;
            let newPostList = [];
            let feed = await parser.parseURL(this.getSubreddit(key));
            if(!temp.items) {
                for(let item of feed.items) {
                    newPostList.push(item);
                }
            }
            else {
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
                    for(let post of newPostList) {
                        const $ = cheerio.load(post.content);
                        const imageUrl = $('span')[0].children[0].attribs.href;
                        //console.log(imageUrl);
                        let timestamp = new Date(post.pubDate);
                        let message = new MessageEmbed().setColor('#00FF00')
                            .setTitle(post.title)
                            .addField('Subreddit:', `[/r/${key}](${this.url}/r/${key})`, true)
                            .addField('作者:', `[${post.author}](${this.url+post.author})`, true)
                            .addField('貼文:', `[貼文連結](${post.link})`, true)
                            .addField('發布時間:', timestamp.toString())
                        if(imageUrl.indexOf('.jpg') != -1 || imageUrl.indexOf('.png') != -1) {
                            message.setImage(imageUrl);
                        } 
                        await this.client.channels.cache.get(channel).send({ embeds: [message] });
                    }
                }
            }
            
            logFile.reddit[key].temp = feed;
            fs.writeFileSync('./log.json', JSON.stringify(logFile, null, 4), (err) => {
                if(err) console.log(err);
            });
        }
    }
}

module.exports.redditPost = redditPost;