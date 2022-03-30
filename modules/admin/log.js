function log(tag, msg) {
    const logStr = `${Date()} [${tag}] ${msg}`;
    console.log(logStr);
}

module.exports.log = log;