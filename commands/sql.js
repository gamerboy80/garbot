const mysql = require("promise-mysql");

exports.run = async (client, message, args) => {
	var str = "";
	for (const x of args) {
		if (x.match(/(?<!\\)\[.*(?<!\\)\]/)) {
			var nstr = x.replace(/\[(.*)\]/, "$1");
			str += " " + mysql.escape(nstr);
		} else str += " " + x;
	}
	var result;
	try {
		result = await client.db.query(str.slice(1));
		// console.log(result);
		if (isIterable(result)) {
			message.reply({
				embed: {
					description: suffixwithlimitof2000chars(
						result.map((a) => JSON.stringify(a)).join(",") || "No results",
						" ..truncated"
					),
					color: 0x00ff00,
				},
			});
		} else
			message.reply(
				`**Query OK** (*maybe*), **${result.affectedRows} row${
					result.affectedRows === 1 ? "" : "s"
				} affected (Infinity sec)**`
			);
		// message.reply("look at console for result");
	} catch (e) {
		// console.log(result ?? "error, no result :(");
		message.reply(e.message);
	}
};

exports.owner = true;

function suffixwithlimitof2000chars(str, suffix) {
	if (str.length >= 2048) {
		var nstr = str.slice(0, 2048).split("");
		nstr.splice(2048 - suffix.length, suffix.length, suffix);
		return nstr.join("");
	} else return str;
}

function isIterable(obj) {
	// checks for null and undefined
	if (obj == null) {
		return false;
	}
	return typeof obj[Symbol.iterator] === "function";
}

exports.help = {
	description: "Executes SQL commands",
	usage: "[prefix]sql [sql query]",
	example: "[prefix]sql select * from sometable where somecolumn = 'something'",
};