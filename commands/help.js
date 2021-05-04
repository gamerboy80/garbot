const prefixPrefixRegex = /^\[prefix\]/g;

exports.run = (client, message, args) => {
	if (args[0]) {
		const cmd = client.commands.get(args[0]);
		if (cmd)
			if (cmd.help) {
				if (cmd.owner && message.author.id !== client.config.owner) {
					const prefix = message.content
						.toLowerCase()
						.replace(new RegExp("^(.+)help .+$"), "$1");
					console.log(prefix);
					message.reply({
						embed: {
							fields: [
								{
									name: "Description",
									value: cmd.help.description.replace(
										prefixPrefixRegex,
										prefix
									),
								},
								{
									name: "Usage",
									value: cmd.help.usage.replace(prefixPrefixRegex, prefix),
								},
								{
									name: "Example",
									value: cmd.help.example.replace(prefixPrefixRegex, prefix),
								},
							],
						},
					});
				}
			} else message.reply("help for that command doesn't exist");
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

exports.help = {
	description: "Lists commands, or gets info of a command",
	usage: "[prefix]help [command (optional)]",
	example: "[prefix]help help",
};
