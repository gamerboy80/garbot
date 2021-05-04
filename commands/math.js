const math = require("mathjs");

exports.run = async (client, message, args) => {
	if (args[0]) {
		try {
			const r = (
				await client.db.query("SELECT `scope` FROM `scopes` WHERE `id` = ?", [
					message.author.id,
				])
			)[0]?.scope;
			var scope = JSON.parse(r ?? "{}") ?? {};
			const results = math.evaluate(args.join(" "), scope);
			await client.db.query(
				"INSERT INTO `scopes` (scope, id) VALUES (?, ?) ON DUPLICATE KEY UPDATE ?",
				[
					JSON.stringify(scope),
					message.author.id,
					{ scope: JSON.stringify(scope) },
				]
			);
			if (results?.entries)
				message.reply({
					embed: {
						fields: [
							{
								name: `Result${results.entries.length > 1 ? "s" : ""}`,
								value: results.entries.join(", "),
							},
						],
						color: 0x00ff00,
					},
				});
			else
				message.reply({
					embed: {
						fields: [{ name: "Result", value: results }],
						color: 0x00ff00,
					},
				});
		} catch (e) {
			// console.error(e);
			message.reply(e.toString() + e.lineNumber);
		}
	} else
		message.reply({
			embed: {
				description: "Please provide a math equation",
				color: 0xff0000,
			},
		});
};

exports.help = {
	description: "Evaluates math expression",
	usage: "[prefix]math [math expression]",
	example: "[prefix]math 1+1",
};