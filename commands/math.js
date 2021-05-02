const math = require("mathjs");

exports.run = async (client, message, args) => {
	if (args[0]) {
		try {
			const r = (
				await client.db.query("select scope from scopes where id = ?", [
					message.author.id,
				])
			)[0]?.scope;
			var scope = JSON.parse(r ?? "{}") ?? {};
			const results = math.evaluate(args.join(" "), scope);
			await client.db.query(
				"insert into scopes (scope, id) values (?, ?) on duplicate key update scope = ?",
				[
					JSON.stringify(scope),
					message.author.id,
					{ scope: JSON.stringify(scope) },
				]
			);
			if (results?.entries)
				message.reply(
					`result${
						results.entries.length > 1 ? "s" : ""
					}: ${results.entries.join(", ")}`
				);
			else message.reply("result: " + results);
		} catch (e) {
			// console.error(e);
			message.reply(e.toString() + e.lineNumber);
		}
	} else message.reply("please provide something arg or something");
};