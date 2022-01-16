
function getRandomNum(min, max) {
    return Math.random() * (max - min) + min;
}

module.exports.getRandomNum = getRandomNum;