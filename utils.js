const chokidar = require("chokidar");

function getMentionFromId(str) {
	// maybe use a regex for this in the future?
	// or maybe add a new function to resolve from username/id/mention?
	if (str.startsWith("<@")) str = str.slice(2);
	if (str.endsWith(">")) str = str.slice(0, -1);
	if (str.startsWith("!")) str = str.slice(1);
	return str;
}

function randomNumberInRange(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createWatchedFile(file, obj, key, special) {
	const fileWatcher = chokidar.watch(file, { ignoreInitial: true });
	fileWatcher.on("add", reloadFile);
	fileWatcher.on("unlink", reloadFile);
	fileWatcher.on("change", reloadFile);
	fileWatcher.on("error", console.error);
	function reloadFile() {
		delete require.cache[require.resolve(file)];
		obj[key] = require(file);
		if (special) eval(special);
	}
}

function splitStringInto2000LengthSegments(str) {
	var strarr = [];
	while (str.length) {
		strarr.push(str.slice(0, 2000));
		str = str.slice(2000);
	}
	return strarr;
}

module.exports = {
	getMentionFromId,
	randomNumberInRange,
	createWatchedFile,
	splitStringInto2000LengthSegments,
};
