exports.run = (client, message) => {
	if (message.member.permissions.has("MANAGE_GUILD")) {
		client.prefixes[message.guild.id] = client.config.prefix;
		client.db.query(
			"INSERT INTO `server_settings` (id, prefix) VALUES (?, ?) ON DUPLICATE KEY UPDATE ?",
			[
				message.guild.id,
				client.config.prefix,
				{ id: message.guild.id, prefix: client.config.prefix },
			]
		);
		message.reply({
			embed: {
				description: `Reset prefix to ` + client.config.prefix,
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
	description: "Resets the guild's prefix",
	usage: "[prefix]resetprefix",
	example: "[prefix]resetprefix",
};