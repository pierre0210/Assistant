const prism = require('prism-media');
const { EndBehaviorType, VoiceReceiver } = require('@discordjs/voice');
const { pipeline } = require('node:stream');
const { createWriteStream } = require('node:fs');

function createListeningStream(receiver, user) {
	//console.log(user.id);
    const opusStream = receiver.subscribe(user.id, {
		end: {
			behavior: EndBehaviorType.AfterInactivity,
			duration: 1000,
		}
	});

	//console.log(opusStream);

    const oggStream = new prism.opus.OggLogicalBitstream({
		opusHead: new prism.opus.OpusHead({
			channelCount: 1,
			sampleRate: 48000,
		}),
		pageSizeControl: {
			maxPackets: 1000,
		}
	});

    const filename = `./recordings/${Date.now()}-${user.username}.ogg`;
    const out = createWriteStream(filename);
	
    pipeline(opusStream, oggStream, out, (err) => {
		//console.log(':in');
		if (err) {
			console.log(err);
		} else {
			console.log(`Recorded ${filename}`);
		}
	});
	
	//opusStream.pipe(oggStream).pipe(out);
}

module.exports.createListeningStream = createListeningStream;