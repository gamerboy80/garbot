function getMentionFromId(str) {
	// maybe use a regex for this in the future?
	// or maybe add a new function to resolve from username/id/mention?
	if (str.startsWith("<@")) str = str.slice(2);
	if (str.endsWith(">")) str = str.slice(0, -1);
	if (str.startsWith("!")) str = str.slice(1);
	return str;
}

function randomNumberInRange(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}

module.exports = {
	getMentionFromId,
	randomNumberInRange,
};
