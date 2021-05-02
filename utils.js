function getMentionFromId(str) {
	// maybe use a regex for this in the future?
	if (str.startsWith("<@")) str = str.slice(2);
	if (str.endsWith(">")) str = str.slice(0, -1);
	if (str.startsWith("!")) str = str.slice(1);
	return str;
}

module.exports = {
	getMentionFromId,
};