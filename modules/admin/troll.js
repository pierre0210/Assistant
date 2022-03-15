class troll {
    constructor(msg, target, times) {
        this.msg = msg;
        this.target = target;
        this.times = times;
    }

    async pingbonk() {
        let bonk = "";
        for(let i=0; i<this.times; i++) {
            //bonk += this.target+"\n";
            await this.msg.channel.send(this.target);
        }
        //this.msg.channel.send(bonk);
    }
}

module.exports.troll = troll;