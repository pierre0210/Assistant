const Discord = require('discord.js');
const fs = require('fs');

class mute {
	constructor(client, msg, tag, time) {
		this.client = client;
		this.msg = msg;
		this.tag = tag;
		this.time = time;
	}

	getUser(mention){
		if (!mention) return;
		
		if (mention.startsWith('<@') && mention.endsWith('>')) {
			mention = mention.slice(2, -1);
			if (mention.startsWith('!')) {
				mention = mention.slice(1);
			}
			return this.client.users.cache.get(mention);
		}
	}

	getUserID(mention){
		if (!mention) return;
		
		if (mention.startsWith('<@') && mention.endsWith('>')) {
			mention = mention.slice(2, -1);
			if (mention.startsWith('!')) {
				mention = mention.slice(1);
			}
			return mention;
		}
	}

	async addMuteMember(isUlt) {
		if(isUlt) {
			const muteEmbed = new Discord.MessageEmbed().setColor("#ff0000")
				.setDescription(this.tag+" 哈哈，去新疆");
			const unmuteEmbed = new Discord.MessageEmbed().setColor("#00ff00")
				.setDescription(this.tag+" 出關");
			//var configFile = await JSON.parse(fs.readFileSync("./config.json", "utf8"));
			var blackListFile = await JSON.parse(fs.readFileSync("./blackList.json", "utf8"));
			//const muteRole = this.msg.guild.roles.cache.find(role => role.name === configFile.muteRole);
			//const member = this.msg.mentions.members.first();
			//await member.roles.add(muteRole).catch(console.error);
			blackListFile.members.push(this.getUserID(this.tag));
			fs.writeFileSync("./blackList.json", JSON.stringify(blackListFile), (err) => {
				if(err) console.log(err);
			});
			await this.msg.channel.send({embeds:[muteEmbed]});
			setTimeout(() => {
				//member.roles.remove(muteRole).catch(console.error);
				blackListFile = JSON.parse(fs.readFileSync("./blackList.json", "utf8"));
				for(let i=0; i<blackListFile.members.length; i++) {
					if(blackListFile.members[i] === this.getUserID(this.tag)) {
						blackListFile.members.splice(i, 1);
					}
				}
				fs.writeFileSync("./blackList.json", JSON.stringify(blackListFile), (err) => {
					if(err) console.log(err);
				});
				this.msg.channel.send({embeds:[unmuteEmbed]});
			}, parseInt(this.time)*60*1000);
		}
		else {
			const muteEmbed = new Discord.MessageEmbed().setColor("#ff0000")
				.setDescription(this.tag+" 去勞改");
			const unmuteEmbed = new Discord.MessageEmbed().setColor("#00ff00")
				.setDescription(this.tag+" 出關");
			var configFile = await JSON.parse(fs.readFileSync("./config.json", "utf8"));
			//var blackListFile = await JSON.parse(fs.readFileSync("./blackList.json", "utf8"));
			const muteRole = this.msg.guild.roles.cache.find(role => role.name === configFile.muteRole);
			const member = this.msg.mentions.members.first();
			await member.roles.add(muteRole).catch(console.error);
			await this.msg.channel.send({embeds:[muteEmbed]});
			setTimeout(() => {
				member.roles.remove(muteRole).catch(console.error);
				this.msg.channel.send({embeds:[unmuteEmbed]});
			}, parseInt(this.time)*60*1000);
		}
	}
}

module.exports.mute = mute;