exports.run = async (client, message, args) => {
	const aliases = await client.db.query("select * from ?? where id = ?", [
		"aliases",
		message.author.id,
	]);
	if (args[1]) {
		const a = aliases.find((a) => a.alias === args[0].toLowerCase());
		const cmd = client.commands.get(args[1].toLowerCase());
		const thisShouldntExist = client.commands.get(args[0].toLowerCase());
		if (a) message.reply("that alias already exists");
		else {
			if (cmd) {
				if (!thisShouldntExist) {
					await client.db.query(
						"insert into ?? (id, alias, command) values (?, ?, ?)",
						[
							"aliases",
							message.author.id,
							args[0].toLowerCase(),
							args[1].toLowerCase(),
						]
					);
					message.reply("done");
				} else message.reply("you can't alias a command that already exists");
			} else message.reply("that command doesn't exist :(");
		}
	} else
		message.reply(
			"the styanxtax is ;addalias [the alias] [the command to alias the]"
		);
};