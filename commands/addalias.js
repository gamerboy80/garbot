exports.run = async (client, message, args) => {
	const aliases = await client.db.query("select * from ?? where id = ?", [
		"aliases",
		message.author.id,
	]);
	if (args[1]) {
		const aliasLowerCase = args[0].toLowerCase();
		const commandLowerCase = args[1].toLowerCase();
		const a = aliases.find((a) => a.alias === aliasLowerCase);
		const cmd = client.commands.get(commandLowerCase);
		const thisShouldntExist = client.commands.get(aliasLowerCase);
		if (a)
			message.reply({
				embed: {
					description: "That alias already exists",
				},
			});
		else {
			if (cmd) {
				if (!thisShouldntExist) {
					await client.db.query(
						"insert into ?? (id, alias, command) values (?, ?, ?)",
						["aliases", message.author.id, aliasLowerCase, commandLowerCase]
					);
					message.reply({
						embed: {
							description: "Added alias",
							color: 0x00ff00,
						},
					});
				} else
					message.reply({
						embed: {
							description:
								"You can't add an alias with the same name as a command",
							color: 0xff0000,
						},
					});
			} else
				message.reply({
					embed: {
						description: "The command you're trying to alias doesn't exist",
						color: 0xff0000,
					},
				});
		}
	} else
		message.reply({
			embed: {
				description: `Invalid Usage, valid: ${client.config.prefix}addalias [alias] [command]`,
			},
		});
};

exports.help = {
	description: "Adds alias for commands",
	usage: "[prefix]addalias [alias] [command]",
	example: "[prefix]addalias createalias addalias",
};