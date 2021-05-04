exports.run = async (client, message, args) => {
	const aliases = await client.db.query("SELECT * FROM `aliases` WHERE `id` = ?", [
		message.author.id,
	]);
	if (args[0]) {
		const a = aliases.find((a) => a.alias === args[0].toLowerCase());
		if (a) {
			await client.db.query("DELETE FROM `aliases` WHERE `alias` = ?", [
				args[0].toLowerCase(),
			]);
			message.reply({
				embed: {
					description: "Removed alias",
					color: 0x00ff00,
				},
			});
		} else
			message.reply({
				embed: {
					description: "That alias doesn't exist",
					color: 0xff0000,
				},
			});
	} else
		message.reply({
			embed: {
				description: "Please put an alias to remove",
				color: 0xff0000,
			},
		});
};

exports.help = {
	description: "Removes an alias",
	usage: "[prefix]removealias [alias]",
	example: "[prefix]removealias createalias",
};