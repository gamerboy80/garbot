exports.run = (client, message, args) => {
	if (args[0]) {
		const cmd = client.commands.get(args[0]);
		if (cmd)
			if (cmd.help) message.reply({ embed: cmd.help });
			else message.reply("help for that command doesn't exist");
		else message.reply("that command doesn't exist");
	} else {
		var commands = client.commands.keyArray();
		const fields = [];
		if (client.config.owner === message.author.id) {
			var ownerCommands = commands.filter((a) => client.commands.get(a).owner);
			fields.push({
				name: "Owner Commands",
				value: `\`${ownerCommands.join("` `")}\``,
			});
		}
		commands = commands.filter((a) => !client.commands.get(a).owner);
		message.reply({
			embed: {
				description: `\`${commands.join("` `")}\``,
				color: client.randomColor(),
				title: "Commands",
				fields,
			},
		});
	}
};