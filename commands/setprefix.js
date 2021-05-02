exports.run = async (client, message, args) => {
	if (message.member.permissions.has("MANAGE_GUILD")) {
		if (args[0]) {
			var newPrefix = args[0].toLowerCase();
			client.prefixes[message.guild.id] = newPrefix;
			await client.db.query(
				"insert into server_settings (id, prefix) values (?, ?) on duplicate key update ?",
				[
					message.guild.id,
					newPrefix,
					{ id: message.guild.id, prefix: newPrefix },
				]
			);
			message.reply({
				embed: {
					description: "Set prefix to " + args[0],
					color: 0x00ff00,
				},
			});
		} else
			message.reply({
				embed: {
					description: "Please provide a new prefix for this guild",
					color: 0x00ff00,
				},
			});
	} else {
		message.reply({
			embed: {
				description: "You don't have the `Manage Guild` permission",
				color: 0xff0000,
			},
		});
	}
};

exports.help = {
	description: "Sets the guild's prefix",
	usage: "[prefix]setprefix [new prefix]",
	example: "[prefix]setprefix somethingnew!",
};